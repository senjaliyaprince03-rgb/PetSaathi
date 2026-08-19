import { askNvidia } from "./ai/router.mjs";

async function run() {
  console.log("Asking NVIDIA...");
  const answer = await askNvidia("fast", "What is the capital of France? Answer in one word.");
  console.log("Response:", answer);
}

run();
