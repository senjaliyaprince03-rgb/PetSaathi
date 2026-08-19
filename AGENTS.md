# NVIDIA AI Instructions

This project has an NVIDIA AI integration.

When an AI task requires an external model:

1. **Always use the NVIDIA AI router (`ai/router.mjs`).**
2. **Never hard-code a model directly in application code.**
3. **Prefer capability-based selection**: Select the model according to task requirements (e.g. `coding`, `reasoning`, `fast`, `vision`) rather than assuming a specific model.
   Example: `askNvidia({ task: "coding", difficulty: "hard", requiresVision: false }, prompt)`
4. **Preserve constraints**: If a task requires tools or streaming, you must set `requiresTools: true` or `requiresStreaming: true`. The router will automatically exclude models that do not support these features.
5. **Preserve modalities**: If a task requires vision, set `requiresVision: true`. The router understands both text prompts and array structures containing image URLs or base64 data.
6. **Respect fallback constraints**: Do not attempt to bypass the router's automatic fallbacks. It is designed to automatically degrade gracefully while preserving your hard constraints (vision, tools, streaming).
7. **Never expose secrets**: Never expose NVIDIA API keys in source code, logs, or telemetry. Never commit `.env`.
8. When NVIDIA releases a newer suitable model, update the model registry (`ai/models.mjs`) rather than changing application code. The router will automatically query `/v1/models` and evaluate it using the scoring system.
9. **Do not bypass the router**: The router tracks token telemetry, performance, and circuit-breaker health natively. Do not call the OpenAI SDK directly.
10. **Use askNvidiaAuto when task is unknown**: When an AI request does not explicitly specify a task, use `askNvidiaAuto()`. The router handles both deterministic classification and NVIDIA-powered LLM fallback natively. Never manually select a model or try to manually classify a task with an LLM. Use explicit task requirements when the application already knows them.
