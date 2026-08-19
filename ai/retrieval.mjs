import { generateEmbedding } from './embeddings.mjs';
import { vectorStore } from './vector-store.mjs';
import { rerankDocuments } from './reranking.mjs';
import { recordRagTelemetry } from './telemetry.mjs';
import { withTimeout, TIMEOUTS } from './timeouts.mjs';
import { isHealthy, recordFailure, recordSuccess } from './health.mjs';

/**
 * Knowledge Retrieval Pipeline with Graceful Degradation
 * Phase 6C: Embedding/Reranker/VectorStore failures are handled gracefully.
 *
 * Returns { documents: [...], degradationMode: null|string }
 *   degradationMode values:
 *     null                              - full pipeline succeeded
 *     'RAG_UNAVAILABLE_EMBEDDING_FAILURE' - embedding unavailable
 *     'RAG_UNAVAILABLE_DB_OUTAGE'         - vector store unavailable
 *     'RERANKER_SKIPPED'                  - reranker failed, raw results returned
 */
export async function retrieveDocuments(query, options = {}) {
  const { topK = 50, topN = 5, requiresVision = false, telemetryContext = {} } = options;
  const startedAt = Date.now();
  let embeddingDurationMs = 0;
  let rerankingDurationMs = 0;
  let tokens = null;
  let degradationMode = null;

  try {
    // ── 1. Embedding ────────────────────────────────────────────────
    if (!isHealthy('embeddings')) {
      degradationMode = 'RAG_UNAVAILABLE_EMBEDDING_FAILURE';
      recordRagTelemetry({
        telemetryContext,
        embeddingDurationMs: 0,
        rerankingDurationMs: 0,
        totalDurationMs: Date.now() - startedAt,
        success: false,
        resultsCount: 0,
        degradationMode
      });
      return { documents: [], degradationMode };
    }

    let queryVector;
    let embedUsage;
    const embedStart = Date.now();

    try {
      const result = await withTimeout(
        () => generateEmbedding(query, { inputType: "query", requiresVision }),
        TIMEOUTS.EMBEDDINGS,
        'embedding'
      );
      queryVector = result.embedding;
      embedUsage = result.usage;
      embeddingDurationMs = Date.now() - embedStart;
      recordSuccess('embeddings');
    } catch (embedError) {
      recordFailure('embeddings');
      degradationMode = 'RAG_UNAVAILABLE_EMBEDDING_FAILURE';
      recordRagTelemetry({
        telemetryContext,
        embeddingDurationMs: Date.now() - embedStart,
        rerankingDurationMs: 0,
        totalDurationMs: Date.now() - startedAt,
        success: false,
        resultsCount: 0,
        degradationMode
      });
      return { documents: [], degradationMode };
    }

    if (embedUsage) {
      tokens = { ...embedUsage };
    }

    // ── 2. Hybrid Search (Vector + Lexical) ─────────────────────────
    if (!isHealthy('vectorstore')) {
      degradationMode = 'RAG_UNAVAILABLE_DB_OUTAGE';
      recordRagTelemetry({ telemetryContext, embeddingDurationMs, rerankingDurationMs: 0, totalDurationMs: Date.now() - startedAt, success: false, resultsCount: 0, tokens, degradationMode });
      return { documents: [], degradationMode };
    }

    let searchResults = [];
    try {
      const ragSearchMode = process.env.RAG_SEARCH_MODE || 'vector';
      
      const vectorResultsP = vectorStore.search(queryVector, { topK });
      let lexicalResultsP = Promise.resolve([]);
      
      if (ragSearchMode === 'hybrid') {
        lexicalResultsP = vectorStore.lexicalSearch(query, { topK }).catch(err => {
          console.error('[RAG] Lexical search failed, falling back to vector only', err);
          degradationMode = 'RAG_LEXICAL_SEARCH_UNAVAILABLE';
          return [];
        });
      }

      const [vectorResults, lexicalResults] = await Promise.all([vectorResultsP, lexicalResultsP]);
      
      // Rank Fusion
      const merged = new Map(); // documentId -> combined doc
      
      const vectorWeight = parseFloat(process.env.RAG_VECTOR_WEIGHT || '0.7');
      const lexicalWeight = parseFloat(process.env.RAG_LEXICAL_WEIGHT || '0.3');
      
      // Helper to normalize scores (assumes scores are roughly 0-1)
      const addScore = (doc, score, type) => {
        const id = doc.metadata?.documentId || doc.text;
        if (!merged.has(id)) {
          merged.set(id, { ...doc, vectorScore: 0, lexicalScore: 0, retrievalMethod: [] });
        }
        const mDoc = merged.get(id);
        if (type === 'vector') {
          mDoc.vectorScore = score;
          mDoc.retrievalMethod.push('vector');
        } else {
          mDoc.lexicalScore = score;
          mDoc.retrievalMethod.push('lexical');
        }
      };

      vectorResults.forEach(doc => addScore(doc, doc.score || 0, 'vector'));
      lexicalResults.forEach(doc => addScore(doc, doc.score || 0, 'lexical'));
      
      searchResults = Array.from(merged.values()).map(doc => {
        doc.score = (doc.vectorScore * vectorWeight) + (doc.lexicalScore * lexicalWeight);
        return doc;
      }).sort((a, b) => b.score - a.score);

      recordSuccess('vectorstore');
    } catch (dbError) {
      recordFailure('vectorstore');
      degradationMode = 'RAG_UNAVAILABLE_DB_OUTAGE';
      recordRagTelemetry({ telemetryContext, embeddingDurationMs, rerankingDurationMs: 0, totalDurationMs: Date.now() - startedAt, success: false, resultsCount: 0, tokens, degradationMode });
      return { documents: [], degradationMode };
    }

    if (searchResults.length === 0) {
      recordRagTelemetry({ telemetryContext, embeddingDurationMs, rerankingDurationMs: 0, totalDurationMs: Date.now() - startedAt, success: true, resultsCount: 0, tokens });
      return { documents: [], degradationMode: null };
    }

    // ── 3. Reranking (gracefully skippable) ──────────────────────────
    let finalResults;

    if (!isHealthy('reranker')) {
      // Skip reranking, return raw hybrid results
      finalResults = searchResults.slice(0, topN);
      if (!degradationMode) degradationMode = 'RERANKER_SKIPPED';
    } else {
      const rerankStart = Date.now();
      try {
        const { results: rankedResults, usage: rerankUsage } = await withTimeout(
          () => rerankDocuments(query, searchResults, { topN, requiresVision }),
          TIMEOUTS.RERANKER,
          'reranker'
        );
        rerankingDurationMs = Date.now() - rerankStart;
        recordSuccess('reranker');
        finalResults = rankedResults;

        if (rerankUsage) {
          if (tokens) {
            tokens.prompt_tokens = (tokens.prompt_tokens || 0) + (rerankUsage.prompt_tokens || 0);
            tokens.total_tokens = (tokens.total_tokens || 0) + (rerankUsage.total_tokens || 0);
          } else {
            tokens = { ...rerankUsage };
          }
        }
      } catch (rerankError) {
        recordFailure('reranker');
        rerankingDurationMs = Date.now() - rerankStart;
        // Graceful degradation: return raw search results
        finalResults = searchResults.slice(0, topN);
        if (!degradationMode) degradationMode = 'RERANKER_SKIPPED';
      }
    }

    // ── 4. Confidence Threshold & Citation Provenance ───────────────
    const minScore = parseFloat(process.env.RAG_MIN_SCORE || '0.0');
    const minRerankScore = parseFloat(process.env.RAG_MIN_RERANK_SCORE || '0.0');

    let validDocuments = finalResults.filter(doc => {
      if (doc.rerankScore !== undefined && doc.rerankScore < minRerankScore) return false;
      if (doc.score !== undefined && doc.score < minScore) return false;
      return true;
    });

    if (validDocuments.length === 0 && finalResults.length > 0) {
       degradationMode = 'INSUFFICIENT_RETRIEVAL_CONFIDENCE';
    }

    const documents = validDocuments.map((doc, index) => {
      const citationId = `cit_${Math.random().toString(36).substr(2, 9)}`;
      return {
        citationId,
        text: doc.text,
        documentId: doc.metadata?.documentId || 'unknown',
        chunkId: doc.metadata?.chunkId || 'unknown',
        chunkIndex: doc.metadata?.chunkIndex || index,
        source: doc.metadata?.source || 'unknown',
        retrievalMethod: doc.retrievalMethod || ['vector'],
        vectorScore: doc.vectorScore || 0,
        lexicalScore: doc.lexicalScore || 0,
        rerankScore: doc.rerankScore,
        score: doc.score,
        metadata: doc.metadata
      };
    });

    recordRagTelemetry({
      telemetryContext,
      embeddingDurationMs,
      rerankingDurationMs,
      totalDurationMs: Date.now() - startedAt,
      success: true,
      resultsCount: documents.length,
      tokens,
      degradationMode
    });

    return { documents, degradationMode };

  } catch (error) {
    recordRagTelemetry({
      telemetryContext,
      embeddingDurationMs,
      rerankingDurationMs,
      totalDurationMs: Date.now() - startedAt,
      success: false,
      resultsCount: 0,
      tokens,
      degradationMode: degradationMode || 'UNKNOWN_FAILURE'
    });
    throw error;
  }
}
