/**
 * Task Profiles for Phase 3
 * Define explicit capability and quality minimums for tasks.
 */

export const taskProfiles = {
  coding: {
    preferredCapability: "coding",
    minimumCodingLevel: 7,
    minimumContextSize: 8192
  },
  debugging: {
    preferredCapability: "coding",
    minimumCodingLevel: 8,
    minimumContextSize: 32000
  },
  architecture: {
    preferredCapability: "reasoning",
    minimumReasoningLevel: 8,
    minimumContextSize: 32000
  },
  reasoning: {
    preferredCapability: "reasoning",
    minimumReasoningLevel: 7,
    minimumContextSize: 8192
  },
  summarization: {
    preferredCapability: "general",
    minimumReasoningLevel: 5,
    minimumContextSize: 32000
  },
  extraction: {
    preferredCapability: "general",
    minimumReasoningLevel: 5,
    minimumContextSize: 16000
  },
  fast: {
    preferredCapability: "fast",
    minimumSpeedLevel: 8,
    minimumContextSize: 4096
  },
  vision: {
    preferredCapability: "vision",
    minimumVisionLevel: 7,
    minimumContextSize: 4096
  },
  multimodal: {
    preferredCapability: "multimodal",
    minimumVisionLevel: 8,
    minimumReasoningLevel: 7,
    minimumContextSize: 16000
  },
  agent: {
    preferredCapability: "reasoning",
    minimumReasoningLevel: 8,
    minimumContextSize: 32000,
    requiresTools: true
  },
  RAG: {
    preferredCapability: "general",
    minimumReasoningLevel: 6,
    minimumContextSize: 64000
  },
  embeddings: {
    preferredCapability: "embeddings",
    minimumContextSize: 8192
  },
  reranking: {
    preferredCapability: "reranking",
    minimumContextSize: 4096
  },
  "test-fallback": {
    preferredCapability: "test-fallback",
    minimumContextSize: 4096
  },
  security: {
    preferredCapability: "security",
    minimumContextSize: 4096
  }
};

export function getTaskProfile(taskName) {
  return taskProfiles[taskName] || {
    preferredCapability: "general",
    minimumContextSize: 4096
  };
}
