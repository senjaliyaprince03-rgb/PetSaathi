/**
 * Model Scoring System
 */
import { getTaskProfile } from "./tasks.mjs";

export function scoreModels(models, taskOptions) {
  const { 
    task, 
    difficulty = "normal", 
    requiresVision = false, 
    requiresTools = false, 
    requiresStreaming = false, 
    minimumQuality = 0 
  } = taskOptions;

  const profile = getTaskProfile(task);
  
  return models.map(model => {
    let score = 0;
    
    // Hard constraints
    if (!model.enabled) return { model, score: -1000 };
    if (requiresVision && !model.modalities.includes("image")) return { model, score: -1000 };
    if (requiresTools && !model.supportsTools) return { model, score: -1000 };
    if (requiresStreaming && !model.supportsStreaming) return { model, score: -1000 };
    
    // Profile constraints
    if (profile.minimumCodingLevel && model.codingLevel < profile.minimumCodingLevel) return { model, score: -1000 };
    if (profile.minimumReasoningLevel && model.reasoningLevel < profile.minimumReasoningLevel) return { model, score: -1000 };
    if (profile.minimumVisionLevel && model.visionLevel < profile.minimumVisionLevel) return { model, score: -1000 };
    
    // Base Capability Match
    if (model.capabilities.includes(profile.preferredCapability)) {
      score += 50;
    }

    // Quality metrics
    score += model.reliabilityScore * 2;
    score += model.reasoningLevel;
    score += model.codingLevel;
    score += model.visionLevel;
    
    // Speed vs Difficulty tradeoff
    if (difficulty === "hard") {
      score += (model.reasoningLevel * 2);
    } else if (difficulty === "easy" || task === "fast") {
      score += (model.speedLevel * 2);
      // Penalize high cost for easy tasks
      score -= (model.costTier * 5); 
    }

    // Explicit minimum quality override
    if (minimumQuality > 0) {
      if ((model.reasoningLevel + model.codingLevel) / 2 < minimumQuality) {
        score -= 50;
      }
    }

    // Priority bonus (lower priority number = higher bonus)
    score += (10 - model.priority) * 5;

    return { model, score };
  })
  .filter(item => item.score > -500) // Filter out hard failures
  .sort((a, b) => b.score - a.score); // Highest score first
}
