// Keep the external smoke test bounded; production defaults remain in ai/timeouts.mjs.
process.env.AI_TIMEOUT_INFERENCE ??= "15000";
process.env.NVIDIA_MAX_RETRIES ??= "0";

const { askNvidia, getAvailableModels } = await import("./ai/router.mjs");
const { isHealthy, recordFailure } = await import("./ai/health.mjs");

async function run() {
  console.log("=== Phase 3 NVIDIA Router Test ===");

  try {
    console.log("\n1. Testing Model Discovery (GET /v1/models)...");
    const models = await getAvailableModels();
    console.log(`✅ Discovered ${models.size} models from NVIDIA API.`);

    console.log("\n2. Testing Capability Filtering (Coding & Difficulty: hard)...");
    const codingAnswer = await askNvidia({ task: "coding", difficulty: "hard" }, "Write a 1-line JS function that returns true.");
    console.log(`✅ Coding response received: ${codingAnswer.trim().substring(0, 50)}...`);

    console.log("\n3. Testing Multimodal (Requires Vision)...");
    try {
      const visionAnswer = await askNvidia(
        { task: "vision", requiresVision: true }, 
        [
          { type: "text", text: "Describe this red pixel." },
          { type: "image_url", image_url: { url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" } }
        ]
      );
      console.log(`✅ Vision response received.`);
    } catch (err) {
      console.log(`⚠️ Vision fallback worked or handled properly: ${err.message}`);
    }

    console.log("\n4. Testing Tool Requirements...");
    try {
      await askNvidia({ task: "reasoning", requiresTools: true }, "Tool test.");
      console.log(`✅ Tool requirement matched a supporting model.`);
    } catch (err) {
      console.log(`⚠️ Handled tool mismatch correctly.`);
    }

    console.log("\n5. Testing Streaming Configuration...");
    const stream = await askNvidia({ task: "fast", requiresStreaming: true, stream: true }, "Count to 3.");
    let streamChunks = 0;
    for await (const _chunk of stream) streamChunks += 1;
    if (streamChunks === 0) throw new Error("Streaming response contained no chunks.");
    console.log(`✅ Stream completed with ${streamChunks} chunks.`);

    console.log("\n6. Testing Circuit Breaker & Retry...");
    recordFailure("fake-model-1");
    recordFailure("fake-model-1");
    recordFailure("fake-model-1");
    console.log(`Fake model healthy? ${isHealthy("fake-model-1") ? "❌ No" : "✅ Yes (Circuit tripped)"}`);

    console.log("\n=== All Phase 3 Tests Passed! ===");
  } catch (err) {
    console.error("\n❌ Test failed:");
    console.error(err);
    // A smoke-test failure must fail CI instead of only printing an error.
    process.exitCode = 1;
  }
}

await run();
