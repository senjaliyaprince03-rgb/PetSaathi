import { analyzeTask } from "./ai/analyzer.mjs";

console.log("=== Phase 4B Task Classifier Tests ===\n");

let passed = 0;
let total = 0;

async function runTest(name, mockResponse, input, expectedConstraints) {
  total++;
  
  // Inject mock via explicitOptions if input is an object, or wrap it
  let testInput = input;
  if (typeof input === 'string' || Array.isArray(input)) {
    testInput = { prompt: input, _mockClassifyWithNvidia: async () => mockResponse };
  } else {
    testInput = { ...input, _mockClassifyWithNvidia: async () => mockResponse };
  }

  try {
    const result = await analyzeTask(testInput);
    let success = true;

    for (const [key, expectedValue] of Object.entries(expectedConstraints)) {
      if (result[key] !== expectedValue) {
        success = false;
        console.error(`❌ [${name}] Failed constraint ${key}. Expected ${expectedValue}, got ${result[key]}`);
      }
    }

    if (success) {
      passed++;
      console.log(`✅ [${name}] Passed. (Task: ${result.task}, classifierUsed: ${result.classifierUsed})`);
    }
  } catch (err) {
    console.error(`❌ [${name}] Error: ${err.message}`);
  }
}

async function runAll() {
  const highConfInput = "Build a Next.js React frontend with database auth";
  const lowConfInput = "This is a sentence that is long enough to exceed the fifty character minimum length but has absolutely no matching keywords at all so it scores zero."; 
  
  const mockClassifierSuccess = {
    task: "debugging",
    difficulty: "normal",
    requiresVision: false,
    requiresTools: false,
    requiresStreaming: false,
    minimumQuality: 0,
    minimumContextSize: 0,
    confidence: 0.8,
    reasons: ["Test mock"]
  };

  // 1. high-confidence request → classifier NOT called
  await runTest("High confidence skip", null, highConfInput, { task: "coding", classifierUsed: false });

  // 2. low-confidence request → classifier called
  await runTest("Low confidence uses classifier", mockClassifierSuccess, lowConfInput, { task: "debugging", classifierUsed: true });

  // 3. classifier returns valid JSON (tested above)
  
  // 4. classifier returns malformed JSON / unknown task / timeout (mocking null returned by catch block)
  await runTest("Classifier failure fallback", null, lowConfInput, { task: "fast", classifierUsed: false });

  // 5. explicit vision override
  await runTest("Explicit vision override", mockClassifierSuccess, { prompt: lowConfInput, requiresVision: true }, { requiresVision: true });

  // 6. explicit tools override
  await runTest("Explicit tools override", mockClassifierSuccess, { prompt: lowConfInput, requiresTools: true }, { requiresTools: true });

  // 7. Test from prompt: Explain this simply + constraints
  await runTest("Explicit constraints win", mockClassifierSuccess, {
    prompt: "Explain this simply",
    requiresVision: true,
    requiresTools: true
  }, { requiresVision: true, requiresTools: true });

  console.log(`\n=== Results: ${passed}/${total} Tests Passed ===\n`);
}

runAll();
