import { chunkText } from './chunking.mjs';
import { generateEmbedding } from './embeddings.mjs';
import { vectorStore } from './vector-store.mjs';

/**
 * Knowledge Ingestion Pipeline
 * Raw Data -> Chunking -> NVIDIA Embedding (passage) -> Vector Store
 */
export async function ingestDocument(document, options = {}) {
  const { overwrite = false, ...chunkOptions } = options;

  if (overwrite && document.metadata?.documentId) {
    await vectorStore.deleteDocuments({ documentId: document.metadata.documentId });
  }

  const chunks = chunkText(document, chunkOptions);
  
  if (chunks.length === 0) return 0;

  const chunkTexts = chunks.map(c => c.text);
  
  // Critical: NVIDIA recommends inputType="passage" for indexing documents
  const { embedding } = await generateEmbedding(chunkTexts, { inputType: "passage" });
  
  // Combine embeddings with chunks
  // embedding will be an array of vectors since chunkTexts is an array
  for (let i = 0; i < chunks.length; i++) {
    chunks[i].embedding = embedding[i];
  }
  
  return await vectorStore.addDocuments(chunks);
}
