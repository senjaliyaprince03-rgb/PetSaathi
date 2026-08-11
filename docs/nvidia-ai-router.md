# NVIDIA AI Router

This document details the NVIDIA AI integration (Phase 3) within PetSaathi. 

## Architecture

The AI subsystem sits strictly within the `ai/` directory. It uses an autonomous, capability-aware orchestration model. Instead of hardcoding model names like `meta/llama-3.1-70b-instruct`, the application requests capabilities like `coding` or `vision`. 

The architecture consists of:
- **Task Analyzer (`analyzer.mjs`, `intent.mjs` & `classifier.mjs`)**: A hybrid deterministic/LLM analyzer that infers AI task requirements from raw prompts. It primarily uses fast, local deterministic heuristics. For low-confidence requests, it falls back to a strict, structured NVIDIA LLM call to deduce requirements without selecting a model.
- **Router Engine (`router.mjs`)**: Central interface that executes inference, manages fallbacks, and triggers retries.
- **Model Discovery**: Dynamically fetches `GET /v1/models` and caches it (`NVIDIA_MODEL_CACHE_TTL_MS`).
- **Capability Registry (`models.mjs`)**: Manually curated list of NVIDIA models, detailing their context sizes, reasoning/coding/vision scores, and feature flags (tools, streaming).
- **Task Profiles (`tasks.mjs`)**: The constraints required by specific types of requests (e.g. `agent` requires a minimum reasoning level of 8 and `requiresTools: true`).
- **Scoring Engine (`scoring.mjs`)**: Evaluates all currently available models against task constraints. Ranks them intelligently using quality metrics and availability.
- **Health & Circuit Breaker (`health.mjs`)**: Temporarily disables failing models (3 failures = 5-minute cooldown).
- **Telemetry (`telemetry.mjs`)**: Secure structured logging. Never logs prompt contents or API keys.

## Configuration

Required environment variables in `.env`:
```
NVIDIA_API_KEY=nvapi-...
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
```

Optional overrides:
- `NVIDIA_MAX_RETRIES` (default: 2)
- `NVIDIA_MODEL_CACHE_TTL_MS` (default: 3600000 / 1 hr)
- `NVIDIA_CLASSIFIER_ENABLED` (default: true)
- `NVIDIA_CLASSIFIER_MODEL` (default: meta/llama-3.1-8b-instruct)
- `NVIDIA_CLASSIFIER_CONFIDENCE_THRESHOLD` (default: 0.50)
- `NVIDIA_CLASSIFIER_TIMEOUT_MS` (default: 5000)

## Routing and Usage

The `askNvidia(options, prompt)` method and `askNvidiaAuto(input)` method are the two entry points. 

**Automatic Routing (Recommended):**
```javascript
const response = await askNvidiaAuto("Build a React login page.");
// response.content contains the string output
// response.routing contains metadata: { task, confidence, classifierUsed, executionModel, fallbackUsed }
```

**Explicit Routing:**
```javascript
const response = await askNvidia({ 
  task: "coding", 
  difficulty: "hard", 
  requiresTools: false 
}, "Write a function...");
// You can also mix explicit constraints with askNvidiaAuto:
// await askNvidiaAuto({ prompt: "Tell me a joke", requiresTools: true })
```

### Fallbacks & Retries
The router utilizes a robust fallback hierarchy. If the top-scoring model fails, it automatically retries if the error is transient (e.g., HTTP 429, 502, 503). If the error is terminal or max retries are exceeded, it moves to the next highest-scoring model in the capability chain. 

## Benchmarking

A benchmarking tool is included to evaluate currently available models against standard test prompts.
Run: `npm run ai:benchmark`

To simply list currently available models dynamically:
Run: `npm run ai:models`

## Future Model Integration

Because routing is dynamic, new models added to NVIDIA's catalog can be leveraged simply by adding a metadata entry in `ai/models.mjs`. The application code itself requires zero changes.
