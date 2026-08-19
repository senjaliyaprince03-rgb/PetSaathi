import { runGuardrails } from './guardrails.mjs';
import { recordToolTelemetry } from './telemetry.mjs';

/**
 * Safely executes a tool requested by the model.
 * Catches all errors and returns them as structured JSON for the model to recover.
 */
export async function executeTool(toolCall, taskContext = {}) {
  const startedAt = Date.now();
  const toolName = toolCall.function?.name || "unknown";

  try {
    // 1. Run through immutable execution pipeline
    const { tool, args } = runGuardrails(toolCall, taskContext);
    
    // 2. Execute handler (boundary & path checks are strictly inside handler)
    const result = await tool.handler(args, taskContext);
    
    // 3. Sanitize & Return
    recordToolTelemetry({
      telemetryContext: taskContext.telemetryContext,
      toolName,
      durationMs: Date.now() - startedAt,
      success: true
    });

    return result;
  } catch (error) {
    // Determine a semantic code for the model
    let code = "TOOL_EXECUTION_ERROR";
    let message = error.message;

    if (error.message.includes(":")) {
      const parts = error.message.split(":");
      code = parts[0].trim();
      message = parts.slice(1).join(":").trim();
    }

    recordToolTelemetry({
      telemetryContext: taskContext.telemetryContext,
      toolName,
      durationMs: Date.now() - startedAt,
      success: false,
      errorCategory: code
    });

    return {
      ok: false,
      error: {
        code,
        message
      }
    };
  }
}
