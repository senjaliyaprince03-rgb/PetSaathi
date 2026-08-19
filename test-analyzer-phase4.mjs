import { analyzeTask } from "./ai/analyzer.mjs";

console.log("=== Phase 4A Task Analyzer Tests ===\n");

let passed = 0;
let total = 0;

async function runTest(name, input, expectedConstraints) {
  total++;
  const result = await analyzeTask(input);
  
  let success = true;
  for (const [key, expectedValue] of Object.entries(expectedConstraints)) {
    if (result[key] !== expectedValue) {
      success = false;
      console.error(`❌ [${name}] Failed constraint ${key}. Expected ${expectedValue}, got ${result[key]}`);
    }
  }

  if (success) {
    passed++;
    console.log(`✅ [${name}] Passed. (Task: ${result.task}, Confidence: ${result.confidence.toFixed(2)})`);
  }
}

async function runAll() {
  // 1. Next.js coding request
  await runTest("Next.js coding request", "Build a Next.js login system", { task: "coding" });

  // 2. Python coding request
  await runTest("Python coding request", "Write a python script to parse CSV", { task: "coding" });

  // 3. Debugging request
  await runTest("Debugging request", "Why is my code failing with a null pointer exception?", { task: "debugging" });

  // 4. Architecture request
  await runTest("Architecture request", "System design for a high scale messaging app", { task: "architecture" });

  // 5. Reasoning request
  await runTest("Reasoning request", "Compare PostgreSQL and MongoDB for PetSaathi", { task: "reasoning", difficulty: "hard" });

  // 6. Summarization request
  await runTest("Summarization request", "Summarize this long document about dogs.", { task: "summarization" });

  // 7. Image request
  await runTest("Image request", "Analyze this photo.", { task: "vision", requiresVision: true });

  // 8. Multimodal request
  await runTest("Multimodal request", [
    { type: "text", text: "What breed is this dog?" },
    { type: "image_url", url: "data:..." }
  ], { task: "multimodal", requiresVision: true });

  // 9. Tool-required request
  await runTest("Tool-required request", "Run tests and call the api.", { requiresTools: true });

  // 10. Simple request
  await runTest("Simple request", "Yes or no?", { task: "fast", difficulty: "easy" });

  // 11. Ambiguous request
  await runTest("Ambiguous request", "Tell me something", { task: "fast" }); // Should fallback to fast due to low confidence

  // 12. Hard architecture request
  await runTest("Hard architecture request", "Complex planning for an architecture decision involving microservices and database sharding.", { difficulty: "expert" });

  // 13. Security-sensitive coding request
  await runTest("Security-sensitive request", "Write a secure login system avoiding sql vulnerability", { minimumQuality: 8 });

  // 14. Explicit constraints MUST win over inferred constraints
  await runTest("Explicit constraint (Vision)", {
    prompt: "Tell me something simple",
    requiresVision: true
  }, { requiresVision: true });

  // 15. Explicit constraint (Tools)
  await runTest("Explicit constraint (Tools)", {
    prompt: "Explain this",
    requiresTools: true
  }, { requiresTools: true });

  console.log(`\n=== Results: ${passed}/${total} Tests Passed ===\n`);
}

runAll();
