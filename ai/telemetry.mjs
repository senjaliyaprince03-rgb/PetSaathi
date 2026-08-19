import crypto from 'crypto';

/**
 * Telemetry Logger
 */

// Helper to inject standard contextual fields
function buildBaseEvent(telemetryContext = {}, eventName) {
  return {
    timestamp: new Date().toISOString(),
    eventId: crypto.randomUUID(),
    requestId: telemetryContext.requestId || crypto.randomUUID(),
    parentEventId: telemetryContext.parentEventId || null,
    event: eventName
  };
}

export function recordTelemetry(data) {
  const {
    telemetryContext,
    task,
    model,
    attemptNumber = 1,
    duration,
    success,
    errorCategory,
    httpStatus,
    tokens,
    fallbackUsed = false,
    fallbackCount = 0,
    retryCount = 0,
    circuitState,
    timeout
  } = data;

  const logEvent = {
    ...buildBaseEvent(telemetryContext, "nvidia_router_telemetry"),
    task,
    model,
    attemptNumber,
    durationMs: duration,
    success,
    fallbackUsed,
    fallbackCount,
    retryCount
  };

  if (circuitState) logEvent.circuitState = circuitState;
  if (timeout) logEvent.timeout = timeout;
  if (errorCategory) logEvent.errorCategory = errorCategory;
  if (httpStatus) logEvent.httpStatus = httpStatus;
  if (tokens) logEvent.tokens = tokens;

  console.log(JSON.stringify(logEvent));
}

export function recordClassifierTelemetry(data) {
  const {
    telemetryContext,
    deterministicConfidence,
    classifierUsed,
    classifierModel,
    classifierDuration,
    classifierSuccess,
    classifierFailureReason
  } = data;

  const logEvent = {
    ...buildBaseEvent(telemetryContext, "nvidia_classifier_telemetry"),
    deterministicConfidence,
    classifierUsed
  };

  if (classifierUsed) {
    logEvent.classifierModel = classifierModel;
    logEvent.classifierDurationMs = classifierDuration;
    logEvent.classifierSuccess = classifierSuccess;
    if (classifierFailureReason) {
      logEvent.classifierFailureReason = classifierFailureReason;
    }
  }

  console.log(JSON.stringify(logEvent));
}

export function recordAgentTelemetry(data) {
  const { telemetryContext, durationMs, success, task, executionModel, iterations, error, totalToolCalls, totalToolTimeMs } = data;
  
  const logEvent = {
    ...buildBaseEvent(telemetryContext, "nvidia_agent_telemetry"),
    durationMs,
    success,
    task,
    executionModel,
    iterations
  };

  if (totalToolCalls !== undefined) logEvent.totalToolCalls = totalToolCalls;
  if (totalToolTimeMs !== undefined) logEvent.totalToolTimeMs = totalToolTimeMs;
  if (error) logEvent.error = error;

  console.log(JSON.stringify(logEvent));
}

export function recordRagTelemetry(data) {
  const { telemetryContext, embeddingDurationMs, rerankingDurationMs, totalDurationMs, success, resultsCount, tokens, degradationMode } = data;
  
  const logEvent = {
    ...buildBaseEvent(telemetryContext, "nvidia_rag_telemetry"),
    embeddingDurationMs,
    rerankingDurationMs,
    durationMs: totalDurationMs,
    success,
    resultsCount
  };

  if (degradationMode) logEvent.degradationMode = degradationMode;
  if (tokens) logEvent.tokens = tokens;

  console.log(JSON.stringify(logEvent));
}

export function recordToolTelemetry(data) {
  const { telemetryContext, toolName, durationMs, success, errorCategory } = data;
  
  const logEvent = {
    ...buildBaseEvent(telemetryContext, "nvidia_tool_telemetry"),
    toolName,
    durationMs,
    success
  };
  
  if (errorCategory) logEvent.errorCategory = errorCategory;

  console.log(JSON.stringify(logEvent));
}
