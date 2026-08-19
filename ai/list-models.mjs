import { getAvailableModels } from "./router.mjs";

async function run() {
  console.log("Fetching NVIDIA models...");
  try {
    const models = await getAvailableModels();
    console.log(`Found ${models.size} models available in the API.`);
    
    const sorted = Array.from(models).sort();
    sorted.forEach(m => console.log(` - ${m}`));
    
  } catch (err) {
    console.error("Error fetching models:", err.message);
  }
}

run();
