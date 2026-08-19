// This test mocks AI and vector calls; it must not open a real audit database connection.
process.env.AI_AUDIT_ENABLED = 'false';

import { chunkText } from './ai/chunking.mjs';
import { generateEmbedding } from './ai/embeddings.mjs';
import { rerankDocuments } from './ai/reranking.mjs';
import { vectorStore } from './ai/vector-store.mjs';
import { ingestDocument } from './ai/ingestion.mjs';
import { retrieveDocuments } from './ai/retrieval.mjs';
import { runAgent } from './ai/agent.mjs';
import { client, getAvailableModels, resetModelCache } from './ai/router.mjs';
import assert from 'assert';

console.log("=== Phase 5B RAG Pipeline Tests ===");

// We mock fetch for embeddings and reranking to avoid hitting live endpoints unnecessarily
const originalFetch = global.fetch;
const originalCreate = client.chat.completions.create;
const originalModelsList = client.models.list.bind(client.models);

global.fetch = async (url, options) => {
  if (url.includes('/embeddings')) {
    const body = JSON.parse(options.body);
    const numInputs = Array.isArray(body.input) ? body.input.length : 1;
    // return fake vector [0.1, 0.2]
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
    // Reverse the order for reranking to prove it works
    const rankings = body.passages.map((_, i) => ({
      index: i,
      logit: (body.passages.length - i) * 1.5 // higher score for earlier items
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

// Security-model IDs used by inspectPrompt — these should always respond "safe" in unit tests
const SECURITY_MODEL_IDS = new Set([
  'nvidia/llama-3.1-nemoguard-8b-content-safety',
  'meta/llama-guard-4-12b'
]);

// Full set of model IDs this test file needs available (for selectModels)
const MOCK_AVAILABLE_MODEL_IDS = [
  'nvidia/llama-3.1-nemoguard-8b-content-safety',
  'meta/llama-guard-4-12b',
  'meta/llama-3.1-8b-instruct',
  'meta/llama-3.1-70b-instruct',
  'nvidia/llama-nemotron-embed-1b-v2',
  'nvidia/llama-nemotron-rerank-1b-v2'
];

// Mock client.models.list so selectModels() always resolves, even without a live NVIDIA API
client.models.list = async () => ({
  data: MOCK_AVAILABLE_MODEL_IDS.map(id => ({ id }))
});
// Flush any previously cached model list so our mock takes effect immediately
resetModelCache();

// Keep track of what we mock for agent
let mockResponses = [];

client.chat.completions.create = async (params) => {
  // If the caller is the security layer, return a deterministic "safe" response
  // so it never consumes the agent's queued mock responses.
  if (params.model && SECURITY_MODEL_IDS.has(params.model)) {
    return {
      usage: { prompt_tokens: 5, total_tokens: 10, completion_tokens: 5 },
      choices: [{ message: { role: 'assistant', content: 'safe', tool_calls: undefined } }]
    };
  }
  if (mockResponses.length > 0) {
    return mockResponses.shift()(params);
  }
  throw new Error("No mock response configured");
};

function createMockResponse(content, tool_calls = undefined) {
  return () => ({
    usage: { prompt_tokens: 10, total_tokens: 20, completion_tokens: 10 },
    choices: [{
      message: {
        role: "assistant",
        content,
        tool_calls
      }
    }]
  });
}

async function runTests() {
  try {
    // 1. Chunking logic
    const doc = {
      text: "This is sentence one. This is sentence two. This is sentence three.",
      metadata: { documentId: "test-123" }
    };
    const chunks = chunkText(doc, { chunkSize: 25, overlap: 5 });
    assert.strictEqual(chunks.length > 1, true, "Text should be chunked");
    assert.strictEqual(chunks[0].metadata.documentId, "test-123");
    console.log("✅ Chunking logic preserves metadata and splits text.");

    // 2. Embeddings (query vs passage)
    const queryEmb = await generateEmbedding("hello", { inputType: "query" });
    assert.strictEqual(queryEmb.embedding.length, 3);
    const passageEmb = await generateEmbedding(["hello", "world"], { inputType: "passage" });
    assert.strictEqual(passageEmb.embedding.length, 2);
    console.log("✅ Embeddings wrapper supports query and passage modes.");

    // 3. Vector Store
    await vectorStore.deleteDocuments();
    await vectorStore.addDocuments([
      { id: "1", text: "A", embedding: [0.1, 0.2, 0.3], metadata: { documentId: "docA" } },
      { id: "2", text: "B", embedding: [0.1, 0.2, -0.3], metadata: { documentId: "docB" } }
    ]);
    assert.strictEqual(await vectorStore.count(), 2);
    
    const searchRes = await vectorStore.search([0.1, 0.2, 0.3], { topK: 1 });
    assert.strictEqual(searchRes[0].id, "1"); // Highest cosine sim
    console.log("✅ InMemoryVectorStore adds, searches, counts, and deletes correctly.");

    // 4. Ingestion Pipeline
    await vectorStore.deleteDocuments();
    await ingestDocument({
      text: "Pet grooming is essential. Start by brushing the fur. Then trim the nails.",
      metadata: { documentId: "groom-101", title: "Grooming 101" }
    });
    assert.strictEqual(await vectorStore.count() > 0, true);
    console.log("✅ Ingestion pipeline (chunk -> embed -> store) works.");

    // 5. Retrieval Pipeline
    const retrieved = await retrieveDocuments("How to groom?");
    const docs = retrieved.documents || retrieved; // handle both object and array format
    assert.strictEqual(docs.length > 0, true);
    assert.strictEqual(docs[0].metadata.documentId, "groom-101");
    // Assert reranker added the score
    assert.strictEqual(docs[0].rerankScore !== undefined, true);
    console.log("✅ Retrieval pipeline (embed -> search -> rerank) works and retains citations.");

    // 6. Agent Tool Execution
    mockResponses.push(
      createMockResponse(null, [{ id: "call_1", type: "function", function: { name: "retrieve_documents", arguments: '{"query":"grooming"}' } }]),
      createMockResponse("According to Grooming 101, it is essential.")
    );
    const res = await runAgent("How do I groom my dog?");
    assert.strictEqual(res.content, "According to Grooming 101, it is essential.");
    console.log("✅ Agent can proactively call retrieve_documents tool.");

    console.log("\n=== All Phase 5B RAG Tests Passed! ===");
  } finally {
    global.fetch = originalFetch;
    client.chat.completions.create = originalCreate;
    client.models.list = originalModelsList;
    resetModelCache(); // clear the mock cache so live tests after this use real discovery
  }
}

await runTests().catch(err => {
  console.error("❌ Test Failed:", err);
  process.exitCode = 1;
});
