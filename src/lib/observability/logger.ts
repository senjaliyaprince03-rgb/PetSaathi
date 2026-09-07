/**
 * PetSaathi Structured JSON Logger (Task 4.4)
 * High-performance, standardized JSON logging output compliant with CloudWatch / Datadog.
 */

export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  requestId?: string;
  userId?: string;
  action: string;
  durationMs?: number;
  message?: string;
  error?:
    | Error
    | {
        name: string;
        message: string;
        stack?: string;
      };
  metadata?: Record<string, any>;
}

class StructuredLogger {
  private serviceName: string;

  constructor(serviceName = "petsaathi-api") {
    this.serviceName = serviceName;
  }

  private emit(
    level: LogLevel,
    action: string,
    payload?: Partial<Omit<LogEntry, "timestamp" | "level" | "service" | "action">>
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: this.serviceName,
      action,
      ...payload,
    };

    if (payload?.error instanceof Error) {
      entry.error = {
        name: payload.error.name,
        message: payload.error.message,
        stack: process.env.NODE_ENV === "development" ? payload.error.stack : undefined,
      };
    }

    const formattedJson = JSON.stringify(entry);
    if (level === "ERROR") {
      console.error(formattedJson);
    } else if (level === "WARN") {
      console.warn(formattedJson);
    } else {
      console.log(formattedJson);
    }

    return entry;
  }

  debug(action: string, payload?: Partial<Omit<LogEntry, "timestamp" | "level" | "service" | "action">>): LogEntry {
    if (process.env.NODE_ENV === "production" && !process.env.DEBUG_LOGS) {
      return {} as LogEntry;
    }
    return this.emit("DEBUG", action, payload);
  }

  info(action: string, payload?: Partial<Omit<LogEntry, "timestamp" | "level" | "service" | "action">>): LogEntry {
    return this.emit("INFO", action, payload);
  }

  warn(action: string, payload?: Partial<Omit<LogEntry, "timestamp" | "level" | "service" | "action">>): LogEntry {
    return this.emit("WARN", action, payload);
  }

  error(action: string, payload?: Partial<Omit<LogEntry, "timestamp" | "level" | "service" | "action">>): LogEntry {
    return this.emit("ERROR", action, payload);
  }
}

export const logger = new StructuredLogger();
