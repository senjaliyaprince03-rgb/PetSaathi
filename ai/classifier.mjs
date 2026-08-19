import { client } from "./router.mjs";
import { recordClassifierTelemetry } from "./telemetry.mjs";

const DEFAULT_MODEL = process.env.NVIDIA_CLASSIFIER_MODEL || "meta/llama-3.1-8b-instruct";
const TIMEOUT_MS = process.env.NVIDIA_CLASSIFIER_TIMEOUT_MS ? parseInt(process.env.NVIDIA_CLASSIFIER_TIMEOUT_MS, 10) : 5000;
const MAX_TOKENS = process.env.NVIDIA_CLASSIFIER_MAX_TOKENS ? parseInt(process.env.NVIDIA_CLASSIFIER_MAX_TOKENS, 10) : 300;

export async function classifyWithNvidia(promptText, options = {}) {
  const startTime = Date.now();
  if (process.env.NVIDIA_CLASSIFIER_ENABLED === "false") {
    return null;
  }

  const systemPrompt = `You are a strict task classifier for PetSaathi. 
Your ONLY job is to convert the user request into routing requirements.
You MUST output valid JSON only.

Do NOT answer the user's question.
Do NOT select a model.
Do NOT provide application code.
Do NOT call tools or execute actions.
Do NOT invent capabilities.

Allowed task values: "coding", "debugging", "architecture", "reasoning", "summarization", "extraction", "fast", "vision", "multimodal", "agent", "RAG", "embeddings", "reranking".
Allowed difficulty values: "easy", "normal", "hard", "expert".

Schema:
{
  "task": "...",
  "difficulty": "...",
  "requiresVision": false,
  "requiresTools": false,
  "requiresStreaming": false,
  "minimumQuality": 0,
  "minimumContextSize": 0,
  "confidence": 0.0 to 1.0,
  "reasons": ["..."]
}`;

  const requestOptions = {
    model: DEFAULT_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: promptText }
    ],
    max_tokens: MAX_TOKENS,
    response_format: { type: "json_object" }
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await client.chat.completions.create(requestOptions, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response?.choices?.[0]?.message?.content) {
      return null;
    }

    const content = response.choices[0].message.content;
    const json = JSON.parse(content);

    // Validate structure
    const validTasks = new Set(["coding", "debugging", "architecture", "reasoning", "summarization", "extraction", "fast", "vision", "multimodal", "agent", "RAG", "embeddings", "reranking"]);
    const validDiff = new Set(["easy", "normal", "hard", "expert"]);

    if (!validTasks.has(json.task)) throw new Error("Invalid task");
    if (!validDiff.has(json.difficulty)) throw new Error("Invalid difficulty");
    if (typeof json.confidence !== 'number' || json.confidence < 0 || json.confidence > 1) throw new Error("Invalid confidence");
    if (typeof json.requiresVision !== 'boolean') throw new Error("Invalid requiresVision");
    if (typeof json.requiresTools !== 'boolean') throw new Error("Invalid requiresTools");
    if (typeof json.requiresStreaming !== 'boolean') throw new Error("Invalid requiresStreaming");
    if (typeof json.minimumQuality !== 'number') throw new Error("Invalid minimumQuality");
    if (typeof json.minimumContextSize !== 'number' || json.minimumContextSize < 0) throw new Error("Invalid minimumContextSize");
    if (!Array.isArray(json.reasons)) throw new Error("Invalid reasons");

    recordClassifierTelemetry({
      telemetryContext: options.telemetryContext,
      classifierUsed: true,
      classifierModel: DEFAULT_MODEL,
      classifierDuration: Date.now() - startTime,
      classifierSuccess: true
    });

    return json;
  } catch (error) {
    // Safely fallback on API errors, malformed JSON, or timeouts
    recordClassifierTelemetry({
      telemetryContext: options.telemetryContext,
      classifierUsed: true,
      classifierModel: DEFAULT_MODEL,
      classifierDuration: Date.now() - startTime,
      classifierSuccess: false,
      classifierFailureReason: error.message
    });
    return null;
  }
}
