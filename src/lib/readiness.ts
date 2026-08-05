import "server-only";

import { isDatabaseConfigured } from "@/lib/db";
import { getMongoDatabase } from "@/lib/mongodb";
import type {
  DependencyState,
  ReadinessSnapshot,
} from "@/lib/readiness-policy";

export { readinessIsAcceptable } from "@/lib/readiness-policy";
export type {
  DependencyState,
  ReadinessSnapshot,
} from "@/lib/readiness-policy";

async function withTimeout<T>(work: Promise<T>, timeoutMs: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      work,
      new Promise<never>((_, reject) => {
        timeout = setTimeout(
          () => reject(new Error("database_readiness_timeout")),
          timeoutMs,
        );
        timeout.unref?.();
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export async function probeReadiness(timeoutMs = 8_000): Promise<ReadinessSnapshot> {
  let database: DependencyState = "not_configured";
  if (isDatabaseConfigured()) {
    try {
      await withTimeout(getMongoDatabase().then((database) => database.command({ ping: 1 })), timeoutMs);
      database = "connected";
    } catch {
      database = "unreachable";
    }
  }

  return {
    database,
    auth: process.env.AUTH_SECRET && process.env.MONGODB_URI ? "configured" : "not_configured",
    payments:
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID &&
      process.env.RAZORPAY_KEY_SECRET &&
      process.env.RAZORPAY_WEBHOOK_SECRET
        ? "configured"
        : "not_configured",
  };
}
