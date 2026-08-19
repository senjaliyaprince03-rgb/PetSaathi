import { askNvidia } from "./router.mjs";

const benchmarks = [
  {
    name: "Coding: Fibonacci",
    options: { task: "coding" },
    prompt: "Write a short JS function to compute the nth fibonacci number."
  },
  {
    name: "Reasoning: Logic Puzzle",
    options: { task: "reasoning" },
    prompt: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?"
  },
  {
    name: "Fast: Trivia",
    options: { task: "fast" },
    prompt: "What is the capital of Japan? One word."
  },
  {
    name: "Multimodal: Fake Image",
    options: { task: "vision", requiresVision: true },
    prompt: [
      { type: "text", text: "What is in this image?" },
      { type: "image_url", image_url: { url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" } }
    ]
  }
];

async function runBenchmark() {
  console.log("=== NVIDIA AI Benchmark Suite ===");
  console.log("Running benchmarks...\n");

  for (const b of benchmarks) {
    console.log(`[Running] ${b.name} (Task: ${b.options.task})`);
    const start = Date.now();
    try {
      const response = await askNvidia(b.options, b.prompt);
      const duration = Date.now() - start;
      console.log(`[Success] ${duration}ms`);
      console.log("-----------------------------------------");
    } catch (err) {
      console.error(`[Failed] ${err.message}`);
    }
  }
  console.log("=== Benchmarks Complete ===");
}

runBenchmark();
