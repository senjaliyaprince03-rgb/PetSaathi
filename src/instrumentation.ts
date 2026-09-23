import * as Sentry from "@sentry/nextjs";
import { readServerEnv } from "@/lib/env";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      readServerEnv();
    } catch (err) {
      console.warn("[instrumentation] Server env validation warning:", err instanceof Error ? err.message : err);
    }
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") await import("./sentry.edge.config");
}

export const onRequestError = Sentry.captureRequestError;
