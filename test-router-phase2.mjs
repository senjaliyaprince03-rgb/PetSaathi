import { askNvidia, getAvailableModels } from "./ai/router.mjs";

async function run() {
  console.log("=== Phase 2 NVIDIA Router Test ===\n");

  try {
    console.log("1. Testing Model Discovery (GET /v1/models)...");
    const models = await getAvailableModels();
    console.log(`✅ Discovered ${models.size} models from NVIDIA API.`);
    console.log("Sample of discovered models:");
    console.log(Array.from(models).slice(0, 3));
    console.log("");

    console.log("2. Testing Model Selection and Successful Request...");
    const answer = await askNvidia({ task: "fast", difficulty: "normal" }, "What is the capital of France? One word.");
    console.log("✅ Response received:");
    console.log(answer);
    console.log("");

    console.log("3. Testing Automatic Fallback...");
    console.log("Requesting 'test-fallback' task. The primary model is fake and will fail, so it should fallback to the secondary model.");
    const fallbackAnswer = await askNvidia({ task: "test-fallback" }, "What is 2+2? One word.");
    console.log("✅ Fallback response received:");
    console.log(fallbackAnswer);
    console.log("");

    console.log("=== All tests passed! ===");
  } catch (err) {
    console.error("❌ Test failed:");
    console.error(err);
  }
}

run();
