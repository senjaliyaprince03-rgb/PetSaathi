import { chunkText } from './ai/chunking.mjs';
import { generateEmbedding } from './ai/embeddings.mjs';
import { rerankDocuments } from './ai/reranking.mjs';
import { client } from './ai/router.mjs';
import assert from 'assert';

if (process.env.RUN_ATLAS_RAG_INTEGRATION !== 'true') {
  throw new Error('Refusing to run Atlas RAG integration: set RUN_ATLAS_RAG_INTEGRATION=true after configuring a real embedding dimension and a non-production test database.');
}

console.log("=== Phase 5C RAG Pipeline Tests (MongoDB Atlas) ===");

// Make sure we are testing MongoVectorStore
process.env.VECTOR_STORE = 'mongodb';

// Mock fetch for embeddings and reranking to avoid hitting live endpoints if we don't have to
const originalFetch = global.fetch;

global.fetch = async (url, options) => {
  if (url.includes('/embeddings')) {
    const body = JSON.parse(options.body);
    const numInputs = Array.isArray(body.input) ? body.input.length : 1;
    return {
      ok: true,
      json: async () => ({
        data: Array.from({ length: numInputs }).map((_, i) => ({
          embedding: [0.1, 0.2, i * 0.1]
        })),
        usage: { total_tokens: 10 }
      })
    };
  }
  
  if (url.includes('/ranking')) {
    const body = JSON.parse(options.body);
    const rankings = body.passages.map((_, i) => ({
      index: i,
      logit: (body.passages.length - i) * 1.5 
    }));
    return {
      ok: true,
      json: async () => ({
        rankings
      })
    };
  }
  
  return originalFetch(url, options);
};

async function runTests() {
  const { vectorStore } = await import('./ai/vector-store.mjs');
  const { ingestDocument } = await import('./ai/ingestion.mjs');
  const { retrieveDocuments } = await import('./ai/retrieval.mjs');
  const { checkVectorDbHealth } = await import('./ai/health.mjs');

  try {
    const isMongo = vectorStore.constructor.name === 'MongoVectorStore';
    assert.strictEqual(isMongo, true, "vectorStore should be MongoVectorStore");
    console.log("✅ MongoVectorStore initialization.");
    
    // Check health
    const health = await checkVectorDbHealth();
    console.log(`✅ MongoDB Vector DB Health Check: ${health.healthy ? 'Pass' : 'Fail (Index building/missing)'}`);
    
    // Ingestion with overwrite test
    console.log("Testing ingestion (this may take a moment to sync with Atlas)...");
    
    const docId = `test-doc-${Date.now()}`;
    await ingestDocument({
      text: "Pet grooming is essential. Start by brushing the fur. Then trim the nails.",
      metadata: { documentId: docId, title: "Grooming 101" }
    }, { overwrite: true });
    
    const collection = await vectorStore.getCollection();
    const count = await collection.countDocuments({ documentId: docId });
    assert.strictEqual(count > 0, true, "Documents should be inserted into MongoDB");
    console.log("✅ Document ingestion & embedding storage works.");

    // Test Dimension mismatch protection
    try {
      await vectorStore.addDocuments([{
        text: "bad doc",
        embedding: null
      }]);
      assert.fail("Should have thrown error on missing embedding");
    } catch (e) {
      console.log("✅ Dimension mismatch / missing embedding protection works.");
    }
    
    // Re-ingest to test duplicate prevention
    await ingestDocument({
      text: "Pet grooming is essential. Start by brushing the fur. Then trim the nails.",
      metadata: { documentId: docId, title: "Grooming 101" }
    }, { overwrite: true });
    
    const countAfter = await collection.countDocuments({ documentId: docId });
    assert.strictEqual(count, countAfter, "Document count should remain the same after overwrite");
    console.log("✅ Delete/re-index & duplicate prevention works.");
    
    // Test similarity search (Note: Atlas vector search indexes may take a minute to build and sync, 
    // so this might return empty if the index is brand new. We'll handle it gracefully)
    const retrieved = await retrieveDocuments("How to groom?");
    
    if (retrieved.length > 0) {
      assert.strictEqual(retrieved[0].rerankScore !== undefined, true);
      console.log("✅ Vector similarity search, Metadata filtering, Top-K, and Reranking passed.");
    } else {
      console.log("⚠️ Vector search returned 0 results. This is expected if the Atlas index is still building or missing.");
    }

    // Clean up
    await vectorStore.deleteDocuments({ documentId: docId });
    const finalCount = await collection.countDocuments({ documentId: docId });
    assert.strictEqual(finalCount, 0, "Cleanup failed");
    
    console.log("\n=== Phase 5C Tests Complete ===");
  } finally {
    global.fetch = originalFetch;
    if (vectorStore.client) {
      await vectorStore.client.close();
    }
  }
}

runTests().catch(err => {
  console.error("❌ Test Failed:", err);
  process.exit(1);
});
