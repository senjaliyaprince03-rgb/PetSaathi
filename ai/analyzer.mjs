/**
 * Local Deterministic Task Analyzer
 */
import { patterns, difficultyHeuristics } from "./intent.mjs";
import { classifyWithNvidia } from "./classifier.mjs";
import { recordClassifierTelemetry } from "./telemetry.mjs";

const CLASSIFIER_THRESHOLD = process.env.NVIDIA_CLASSIFIER_CONFIDENCE_THRESHOLD ? parseFloat(process.env.NVIDIA_CLASSIFIER_CONFIDENCE_THRESHOLD) : 0.50;

function extractText(prompt) {
  if (typeof prompt === "string") return prompt;
  if (Array.isArray(prompt)) {
    return prompt
      .filter(p => p.type === "text")
      .map(p => p.text)
      .join(" ");
  }
  return "";
}

function hasImage(prompt) {
  if (Array.isArray(prompt)) {
    return prompt.some(p => p.type === "image_url");
  }
  return false;
}

export async function analyzeTask(input, options = {}) {
  // Input could be a simple string, a multimodal array, or an object containing options
  let prompt = input;
  let explicitOptions = { ...options };

  if (input !== null && typeof input === 'object' && !Array.isArray(input) && (input.prompt || input.messages)) {
    prompt = input.prompt || input.messages;
    explicitOptions = { ...input };
    delete explicitOptions.prompt;
    delete explicitOptions.messages;
    delete explicitOptions.inputType; // internal
  }

  const text = extractText(prompt);
  const imagePresent = hasImage(prompt);
  
  let scores = {
    coding: 0,
    debugging: 0,
    architecture: 0,
    reasoning: 0,
    summarization: 0,
    extraction: 0,
    fast: 0,
    vision: 0,
    tools: 0,
    security: 0
  };

  let reasons = [];

  // 1. Evaluate intent patterns
  for (const [intent, regexList] of Object.entries(patterns)) {
    for (const regex of regexList) {
      if (regex.test(text)) {
        scores[intent] += 1;
        reasons.push(`Matched pattern for ${intent}`);
      }
    }
  }

  // 2. Evaluate structural properties
  if (imagePresent) {
    scores.vision += 5; // Heavy weight for explicit image array parts
    reasons.push("Explicit image array content detected");
  }

  // Length heuristic
  if (text.length > 500) {
    scores.reasoning += 1;
    reasons.push("Long request length implies reasoning/context");
  } else if (text.length < 50) {
    scores.fast += 1;
    reasons.push("Short request length implies fast task");
  }

  // 3. Determine base task
  let highestScore = 0;
  let detectedTask = null;

  const taskCandidates = ["vision", "architecture", "debugging", "reasoning", "summarization", "extraction", "coding", "fast"];
  
  for (const candidate of taskCandidates) {
    if (scores[candidate] > highestScore) {
      highestScore = scores[candidate];
      detectedTask = candidate;
    }
  }

  // 4. Determine Multimodal
  if (imagePresent && text.length > 0) {
    detectedTask = "multimodal";
    reasons.push("Text and image detected. Upgrading to multimodal.");
  }

  // Calculate confidence based on score density
  let confidence = highestScore > 0 ? Math.min(0.5 + (highestScore * 0.15), 0.95) : 0.1;
  
  if (imagePresent) confidence = 0.99; // Highly confident if explicit images are attached

  // 5. Confidence fallback
  if (confidence < 0.50 && !imagePresent) {
    detectedTask = "fast";
    reasons.push("Low confidence, defaulting to safe 'fast' task");
  }

  if (!detectedTask) {
    detectedTask = "fast";
    confidence = 0.1;
  }

  // 6. Determine Difficulty
  let difficulty = "normal";
  for (const [diffLevel, regexList] of Object.entries(difficultyHeuristics)) {
    if (regexList.some(regex => regex.test(text))) {
      difficulty = diffLevel;
      reasons.push(`Difficulty heuristic matched: ${diffLevel}`);
      break;
    }
  }

  // Length modifier for difficulty
  if (text.length > 1000 && difficulty !== "expert") difficulty = "hard";
  if (text.length < 30 && difficulty === "normal") difficulty = "easy";

  // 7. Base constraints
  const requiresVision = imagePresent || scores.vision > 0;
  const requiresTools = scores.tools > 0;
  let minimumQuality = 0;
  
  if (difficulty === "hard") minimumQuality = 7;
  if (difficulty === "expert" || scores.security > 0) minimumQuality = 8;

  // 8. Conditionally call Classifier
  let finalResult = {
    task: detectedTask,
    difficulty,
    requiresVision,
    requiresTools,
    requiresStreaming: false,
    minimumQuality,
    minimumContextSize: 4096,
    confidence,
    reasons,
    classifierUsed: false
  };

  if (confidence < CLASSIFIER_THRESHOLD && !imagePresent) {
    const start = Date.now();
    let classifierJson = null;
    
    if (explicitOptions._mockClassifyWithNvidia) {
      classifierJson = await explicitOptions._mockClassifyWithNvidia(text);
    } else {
      classifierJson = await classifyWithNvidia(text, { telemetryContext: explicitOptions.telemetryContext });
    }

    if (classifierJson) {
      finalResult = {
        ...classifierJson,
        classifierUsed: true,
        classifierDuration: Date.now() - start
      };
    } else {
      // Classifier failed, falling back to deterministic but logging the deterministic confidence
      recordClassifierTelemetry({
        telemetryContext: explicitOptions.telemetryContext,
        deterministicConfidence: confidence,
        classifierUsed: false
      });
    }
  } else {
    // High confidence, didn't use classifier
    recordClassifierTelemetry({
      telemetryContext: explicitOptions.telemetryContext,
      deterministicConfidence: confidence,
      classifierUsed: false
    });
  }

  // 9. Merge with Explicit Options (EXPLICIT WINS)
  return {
    ...finalResult,
    task: explicitOptions.task !== undefined ? explicitOptions.task : finalResult.task,
    difficulty: explicitOptions.difficulty !== undefined ? explicitOptions.difficulty : finalResult.difficulty,
    requiresVision: explicitOptions.requiresVision !== undefined ? explicitOptions.requiresVision : finalResult.requiresVision,
    requiresTools: explicitOptions.requiresTools !== undefined ? explicitOptions.requiresTools : finalResult.requiresTools,
    requiresStreaming: explicitOptions.requiresStreaming !== undefined ? explicitOptions.requiresStreaming : finalResult.requiresStreaming,
    minimumQuality: explicitOptions.minimumQuality !== undefined ? explicitOptions.minimumQuality : finalResult.minimumQuality,
    minimumContextSize: explicitOptions.minimumContextSize !== undefined ? explicitOptions.minimumContextSize : finalResult.minimumContextSize
  };
}
