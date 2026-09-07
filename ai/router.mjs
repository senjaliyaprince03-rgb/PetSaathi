import "dotenv/config";
import OpenAI from "openai";
import { capabilityRegistry } from "./models.mjs";
import { getTaskProfile } from "./tasks.mjs";
import { scoreModels } from "./scoring.mjs";
import { isHealthy, recordFailure, recordSuccess, isRetryableError, getCircuitState } from "./health.mjs";
import { recordTelemetry } from "./telemetry.mjs";
import { analyzeTask } from "./analyzer.mjs";
import { backoffDelay, isTerminalError, withTimeout, sleep, TIMEOUTS } from "./timeouts.mjs";
import { retrieveRelevantChunks } from "../src/lib/ai/retriever.ts";

if (!process.env.NVIDIA_API_KEY) {
  throw new Error("[NVIDIA Router] Configuration Error: NVIDIA_API_KEY is missing from environment variables.");
}

export const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1",
});

const MAX_RETRIES = process.env.NVIDIA_MAX_RETRIES ? parseInt(process.env.NVIDIA_MAX_RETRIES, 10) : 2;

// Cache for discovered models
let availableModelsCache = null;
let lastDiscoveryTime = 0;
const CACHE_TTL_MS = process.env.NVIDIA_MODEL_CACHE_TTL_MS 
  ? parseInt(process.env.NVIDIA_MODEL_CACHE_TTL_MS, 10) 
  : 1000 * 60 * 60; // 1 hour default

/**
 * Discovers available models from NVIDIA API
 */
export async function getAvailableModels() {
  const now = Date.now();
  if (availableModelsCache && (now - lastDiscoveryTime < CACHE_TTL_MS)) {
    return availableModelsCache;
  }

  try {
    const response = await client.models.list();
    availableModelsCache = new Set(response.data.map(m => m.id));
    lastDiscoveryTime = now;
    return availableModelsCache;
  } catch (error) {
    console.error("[NVIDIA Router] Error discovering models:", error.message);
    return new Set();
  }
}

/**
 * Resets the model availability cache.
 * For use by test harnesses only — forces a fresh discovery on next selectModels() call.
 */
export function resetModelCache() {
  availableModelsCache = null;
  lastDiscoveryTime = 0;
}

/**
 * Selects and scores appropriate models based on task constraints and availability
 */
export async function selectModels(taskOptions) {
  const { task } = taskOptions;
  const availableModels = await getAvailableModels();
  
  // 1. Filter out known models that are unavailable in the API
  const availableMatching = capabilityRegistry.filter(m => availableModels.has(m.id) && isHealthy(m.id));

  // 2. Score models
  const scored = scoreModels(availableMatching, taskOptions);

  if (scored.length === 0) {
    throw new Error(`[NVIDIA Router] No available or healthy models found satisfying constraints for task '${task}'.`);
  }

  return scored.map(s => s.model);
}

/**
 * Low-level primitive to execute raw inference with tool support.
 * Does not fallback, only retries transient errors.
 */
export async function completeNvidia({ model, messages, tools, toolChoice, stream, task = "unknown", fallbackUsed = false, fallbackCount = 0, telemetryContext = {} }) {
  let retryCount = 0;
  let lastError = null;
  
  while (retryCount <= MAX_RETRIES) {
    const attemptStart = Date.now();
    try {
      const requestParams = {
        model,
        messages,
        stream,
        max_tokens: 512
      };
      
      if (tools && tools.length > 0) requestParams.tools = tools;
      if (toolChoice) requestParams.tool_choice = toolChoice;

      // Wrap inference with hard timeout
      const response = await withTimeout(
        (signal) => client.chat.completions.create(requestParams, { signal }),
        TIMEOUTS.INFERENCE,
        `inference:${model}`
      );
      
      if (stream) {
        recordSuccess(model);
        recordTelemetry({
          telemetryContext,
          model,
          task,
          duration: Date.now() - attemptStart,
          success: true,
          fallbackUsed,
          fallbackCount,
          retryCount,
          circuitState: getCircuitState(model),
          tokens: null
        });
        return response; 
      }

      // Response validation
      if (!response || !response.choices || response.choices.length === 0 || !response.choices[0].message) {
         throw new Error("Malformed or empty response from NVIDIA API.");
      }

      recordSuccess(model);
      recordTelemetry({
        telemetryContext,
        model,
        task,
        duration: Date.now() - attemptStart,
        success: true,
        fallbackUsed,
        fallbackCount,
        retryCount,
        circuitState: getCircuitState(model),
        tokens: response.usage ?? null
      });

      return response.choices[0].message;
      
    } catch (error) {
      lastError = error;
      const duration = Date.now() - attemptStart;
      recordFailure(model);
      
      const httpStatus = error.status;
      const errorCategory = httpStatus ? `HTTP_${httpStatus}` : (error.message?.startsWith('TIMEOUT') ? 'Timeout' : 'NetworkError');
      
      recordTelemetry({
        telemetryContext,
        model,
        task,
        duration,
        success: false,
        errorCategory,
        httpStatus,
        fallbackUsed,
        fallbackCount,
        retryCount,
        circuitState: getCircuitState(model)
      });

      // Terminal errors: never retry
      if (httpStatus && isTerminalError(httpStatus)) {
        throw error;
      }
      
      if (isRetryableError(error) && retryCount < MAX_RETRIES) {
        const delay = backoffDelay(retryCount);
        console.warn(`[NVIDIA Router] Transient error on ${model}. Retrying in ${delay}ms... (${retryCount + 1}/${MAX_RETRIES})`);
        await sleep(delay);
        retryCount++;
      } else {
        throw error;
      }
    }
  }
}

/**
 * Validates request options and format
 */
export function prepareMessages(prompt, options) {
  let content = prompt;
  
  if (options && options.requiresVision && Array.isArray(prompt)) {
    content = prompt; // Assume it's an array of multimodal parts
  } else if (options && options.requiresVision && typeof prompt === "string") {
    // If it's a simple string but vision is required, we still pass it, though ideally it should contain images
    content = prompt;
  }
  
  return [{ role: "user", content }];
}

/**
 * Main routing function
 */
export async function askNvidia(options, prompt) {
  const startTime = Date.now();
  
  // Normalize options
  const config = typeof options === 'string' ? { task: options } : options;
  const { 
    task, 
    difficulty = "normal", 
    requiresVision = false,
    requiresTools = false,
    requiresStreaming = false,
    minimumQuality = 0,
    stream = false,
    tools = undefined,
    tool_choice = undefined,
    telemetryContext = {}
  } = config;

  let candidateModels = [];

  try {
    candidateModels = await selectModels({ 
      task, 
      difficulty, 
      requiresVision, 
      requiresTools: requiresTools || !!tools, 
      requiresStreaming: requiresStreaming || stream, 
      minimumQuality 
    });
  } catch (error) {
    recordTelemetry({ telemetryContext, task, success: false, errorCategory: "SelectionError", duration: Date.now() - startTime });
    throw error;
  }

  let messages = prepareMessages(prompt, { requiresVision });
  let retrievedSources = [];

  // Phase 5: Knowledge Base Context Injection for Customer Portals
  const isCustomerPortal = config.isCustomerChat || config.portal === "customer" || config.kbAssisted === true;
  if (isCustomerPortal && typeof prompt === "string") {
    try {
      const chunks = await retrieveRelevantChunks(prompt, 3);
      if (chunks && chunks.length > 0) {
        retrievedSources = chunks.map(c => ({ id: c.fileId, title: c.title, category: c.category, score: c.score }));
        const kbContextString = chunks.map(c => 
          `---
[Source: ${c.fileId} | Category: ${c.category}]
${c.content}
---`
        ).join("\n\n");

        const systemPrompt = `You are PetSaathi AI, an expert veterinary and pet lifestyle assistant specialized in Indian pet parenting (Ahmedabad, Pune, Bangalore, Mumbai, Delhi-NCR, Hyderabad).
Always provide practical, compassionate, and climate-specific guidance for Indian pet parents.

INDIAN PET CARE CONTEXT:
${kbContextString}

STRICT GUIDELINES & GUARDRAILS:
1. ONLY answer from the provided Indian Pet Care Context where applicable. If the context does not contain enough information to answer safely, respond clearly: "I don't have specific info on that — please consult your vet."
2. Respond in the user's language (English, Hindi, or conversational Hinglish) matching the prompt style.
3. Never hallucinate veterinary prescription medicines or unverified clinical dosages.
4. Cite the source files you referenced when presenting specific facts (e.g. "[Source: summer-heatstroke-management]").
5. For acute emergencies (severe heatstroke, continuous vomiting/diarrhea, bloat, toxic ingestion, severe dog bites), immediately advise the pet parent to rush to an emergency clinic and contact PetSaathi 24/7 support.
6. Maintain a warm, encouraging tone tailored to Indian families, apartments, and gated societies.`;

        if (process.env.AI_DEBUG === "true") {
          console.log("[NVIDIA Router AI_DEBUG] Injected KB Chunks:", retrievedSources);
          console.log("[NVIDIA Router AI_DEBUG] System Prompt Length:", systemPrompt.length);
        }

        messages = [
          { role: "system", content: systemPrompt },
          ...messages
        ];
      }
    } catch (kbErr) {
      console.warn("[NVIDIA Router] Knowledge Base retrieval failed, falling back to base model:", kbErr.message);
    }
  }

  let lastError = null;

  // Attempt requests using fallback hierarchy
  let fallbackCount = 0;
  for (let modelIndex = 0; modelIndex < candidateModels.length; modelIndex++) {
    const modelConfig = candidateModels[modelIndex];
    const fallbackUsed = modelIndex > 0;
    if (fallbackUsed) fallbackCount++;
    
    try {
      const message = await completeNvidia({
        model: modelConfig.id,
        messages,
        tools,
        toolChoice: tool_choice,
        stream,
        task,
        fallbackUsed,
        fallbackCount,
        telemetryContext
      });

      if (stream) {
        if (options.returnMetadata) {
          return { content: message, executionModel: modelConfig.id, fallbackUsed, fallbackCount, sources: retrievedSources };
        }
        return message; 
      }

      if (options.returnMetadata) {
        return { content: message.content, executionModel: modelConfig.id, fallbackUsed, fallbackCount, sources: retrievedSources };
      }
      return message.content;
      
    } catch (error) {
      lastError = error;
      console.warn(`[NVIDIA Router] Model ${modelConfig.id} failed terminally. Attempting fallback if available...`, error.message);
      // Loop continues to the next fallback model
    }
  } // End Fallback Loop

  throw new Error(`[NVIDIA Router] All fallback models failed for task '${task}'. Last error: ${lastError.message}`);
}

/**
 * Autonomous routing function that infers requirements from the input before routing
 */
export async function askNvidiaAuto(input) {
  let prompt = input;
  
  if (input !== null && typeof input === 'object' && !Array.isArray(input) && (input.prompt || input.messages)) {
    prompt = input.prompt || input.messages;
  }
  
  const requirements = await analyzeTask(input);
  requirements.returnMetadata = true;
  
  const response = await askNvidia(requirements, prompt);
  
  return {
    content: response.content,
    routing: {
      task: requirements.task,
      confidence: requirements.confidence,
      classifierUsed: requirements.classifierUsed || false,
      executionModel: response.executionModel,
      fallbackUsed: response.fallbackUsed
    }
  };
}
