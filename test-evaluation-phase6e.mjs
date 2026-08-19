import 'dotenv/config';
import { EvaluationRunner } from './ai/evaluation/runner.mjs';

async function runEvaluations() {
  console.log("Starting Phase 6E Production AI Evaluations...\n");
  
  const runner = new EvaluationRunner();
  const result = await runner.run();
  
  console.log("\n=== Evaluation Results ===");
  console.log(JSON.stringify(result.summary, null, 2));
  
  if (!result.passed) {
    console.error("\n❌ CI FAILURE: Evaluation metrics dropped below regression thresholds.");
    console.error("See details above.");
    process.exit(1);
  } else {
    console.log("\n✅ CI SUCCESS: All evaluation metrics passed.");
    process.exit(0);
  }
}

runEvaluations().catch(err => {
  console.error("Evaluation framework error:", err);
  process.exit(1);
});
