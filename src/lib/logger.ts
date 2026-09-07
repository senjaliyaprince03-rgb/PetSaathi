/**
 * Structured Logging with Request ID Correlation
 * 
 * Features:
 * - Request ID propagation for distributed tracing
 * - Secret filtering to prevent credential leakage
 * - Structured JSON output for log aggregation
 * - Environment-based log levels
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  requestId?: string;
  userId?: string;
  tenantId?: string;
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const LOG_LEVEL = (process.env.LOG_LEVEL || "info") as LogLevel;

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Filters secrets from log context
 * 
 * Removes:
 * - API keys
 * - Passwords
 * - Tokens
 * - Session IDs
 * - Credit card numbers
 */
function filterSecrets(context: Record<string, unknown>): Record<string, unknown> {
  const filtered: Record<string, unknown> = {};

  const secretKeys = [
    "password",
    "apiKey",
    "api_key",
    "token",
    "secret",
    "authorization",
    "sessionId",
    "session_id",
    "creditCard",
    "cvv",
    "pin",
  ];

  for (const [key, value] of Object.entries(context)) {
    const lowerKey = key.toLowerCase();

    // Check if key matches secret patterns
    if (secretKeys.some(secretKey => lowerKey.includes(secretKey))) {
      filtered[key] = "[REDACTED]";
      continue;
    }

    // Recursively filter nested objects
    if (value && typeof value === "object" && !Array.isArray(value)) {
      filtered[key] = filterSecrets(value as Record<string, unknown>);
      continue;
    }

    // Filter arrays of objects
    if (Array.isArray(value)) {
      filtered[key] = value.map(item =>
        item && typeof item === "object" ? filterSecrets(item as Record<string, unknown>) : item
      );
      continue;
    }

    filtered[key] = value;
  }

  return filtered;
}

/**
 * Core logging function
 */
function log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
  if (LOG_LEVELS[level] < LOG_LEVELS[LOG_LEVEL]) {
    return; // Skip logs below configured level
  }

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context: context ? filterSecrets(context) : undefined,
    error: error
      ? {
          name: error.name,
          message: error.message,
          stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
        }
      : undefined,
  };

  const output = JSON.stringify(entry);

  if (level === "error") {
    console.error(output);
  } else if (level === "warn") {
    console.warn(output);
  } else {
    console.log(output);
  }
}

/**
 * Logger interface
 */
export const logger = {
  debug(message: string, context?: LogContext): void {
    log("debug", message, context);
  },

  info(message: string, context?: LogContext): void {
    log("info", message, context);
  },

  warn(message: string, context?: LogContext): void {
    log("warn", message, context);
  },

  error(messageOrError: string | Error, contextOrError?: LogContext | Error, maybeContext?: LogContext): void {
    if (messageOrError instanceof Error) {
      log("error", messageOrError.message, contextOrError as LogContext, messageOrError);
    } else if (contextOrError instanceof Error) {
      log("error", messageOrError, maybeContext, contextOrError);
    } else {
      log("error", messageOrError, contextOrError);
    }
  },

  exception(event: string, error: unknown, context?: LogContext): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    log("error", event, context, errorObj);
  },
};

/**
 * Request ID middleware (for Express/Next.js API routes)
 */
export function withRequestId<T>(
  requestId: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  // In a real implementation, use AsyncLocalStorage for automatic propagation
  // For now, callers must manually pass requestId in log context
  return fn();
}

/**
 * Generate unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Extract request ID from headers
 */
export function extractRequestId(headers: Headers | Record<string, string | string[] | undefined>): string | null {
  if (headers instanceof Headers) {
    return headers.get("x-request-id");
  }

  const value = headers["x-request-id"];
  if (Array.isArray(value)) return value[0] || null;
  return value || null;
}
