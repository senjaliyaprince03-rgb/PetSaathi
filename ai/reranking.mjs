import { selectModels } from './router.mjs';

/**
 * Reranks documents against a query using NVIDIA NeMo Retriever API.
 */
export async function rerankDocuments(query, documents, options = {}) {
  if (!documents || documents.length === 0) return [];

  const { requiresVision = false, topN = 5 } = options;
  
  const candidateModels = await selectModels({ 
    task: "reranking", 
    requiresVision 
  });
  
  const executionModel = candidateModels[0].id;
  const baseUrl = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";

  // Format passages for NVIDIA NIM ranking endpoint
  const passages = documents.map(doc => ({ text: doc.text }));

  const response = await fetch(`${baseUrl}/ranking`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: executionModel,
      query: { text: query },
      passages: passages
    })
  });

  if (!response.ok) {
    throw new Error(`[NVIDIA Reranking] API Error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  
  // NVIDIA NIM ranking returns { rankings: [{ index: 0, logit: 1.23 }, ...] }
  // We reconstruct the documents with their new scores.
  let rankedResults = data.rankings.map(ranking => {
    return {
      ...documents[ranking.index],
      rerankScore: ranking.logit
    };
  });
  
  // Ensure it's sorted by rerankScore descending just in case
  rankedResults.sort((a, b) => b.rerankScore - a.rerankScore);

  return {
    results: rankedResults.slice(0, topN),
    usage: data.usage
  };
}
