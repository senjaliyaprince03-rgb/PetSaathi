import { selectModels } from './router.mjs';

/**
 * Generate embeddings for text using NVIDIA NeMo Retriever API.
 * Preserves strict separation between query and passage modes.
 */
export async function generateEmbedding(text, options = {}) {
  const { inputType = "query", requiresVision = false } = options;
  
  if (!["query", "passage"].includes(inputType)) {
    throw new Error("Invalid inputType. Must be 'query' or 'passage'.");
  }

  // Select the appropriate embedding model based on constraints
  const candidateModels = await selectModels({ 
    task: "embeddings", 
    requiresVision 
  });
  
  const executionModel = candidateModels[0].id;

  // Use fetch to ensure we can pass NVIDIA-specific parameters (input_type, truncate)
  const baseUrl = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
  
  // Format input (handle array of strings or single string)
  const input = Array.isArray(text) ? text : [text];

  const response = await fetch(`${baseUrl}/embeddings`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      input: input,
      model: executionModel,
      input_type: inputType,
      encoding_format: "float",
      truncate: "NONE" // Ensure we don't silently drop content without knowing
    })
  });

  if (!response.ok) {
    throw new Error(`[NVIDIA Embeddings] API Error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  
  // Return the first embedding if single input, else array
  return {
    embedding: Array.isArray(text) ? data.data.map(d => d.embedding) : data.data[0].embedding,
    model: executionModel,
    usage: data.usage
  };
}
