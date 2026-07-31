import * as Sentry from "@sentry/nextjs";

type LogContext = Record<string, unknown>;
type LogLevel = "info" | "warn" | "error";

const sensitiveKey =
  /authorization|cookie|password|secret|token|api[-_]?key|email|phone|address|access[-_]?notes/i;

function sanitise(value: unknown, seen = new WeakSet<object>()): unknown {
  if (value === null || typeof value !== "object") return value;
  if (value instanceof Date) return value.toISOString();
  if (value instanceof Error) {
    return { name: value.name, message: value.message };
  }
  if (seen.has(value)) return "[circular]";
  seen.add(value);
  if (Array.isArray(value)) return value.map((item) => sanitise(item, seen));
  return Object.fromEntries(
    Object.entries(value).map(([key, nested]) => [
      key,
      sensitiveKey.test(key) ? "[redacted]" : sanitise(nested, seen),
    ]),
  );
}

function write(level: LogLevel, event: string, context: LogContext = {}) {
  const safeContext = sanitise(context) as LogContext;
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    ...safeContext,
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);
  return safeContext;
}

export const logger = {
  info(event: string, context?: LogContext) {
    const safeContext = write("info", event, context);
    Sentry.addBreadcrumb({ category: "application", level: "info", message: event, data: safeContext });
  },
  warn(event: string, context?: LogContext) {
    const safeContext = write("warn", event, context);
    Sentry.addBreadcrumb({ category: "application", level: "warning", message: event, data: safeContext });
  },
  error(error: Error | string, context?: LogContext) {
    const event = error instanceof Error ? error.name : error;
    const safeContext = write("error", event, {
      ...context,
      errorMessage: error instanceof Error ? error.message : error,
    });
    if (error instanceof Error) {
      Sentry.captureException(error, { extra: safeContext });
    } else {
      Sentry.captureMessage(error, { level: "error", extra: safeContext });
    }
  },
  exception(event: string, error: unknown, context?: LogContext) {
    const exception =
      error instanceof Error ? error : new Error("Unexpected application error");
    const safeContext = write("error", event, {
      ...context,
      error: exception,
    });
    Sentry.captureException(exception, {
      tags: { event },
      extra: safeContext,
    });
  },
};
