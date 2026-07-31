import "server-only";

import { isDatabaseConfigured, prisma } from "@/lib/db";
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

export async function probeReadiness(timeoutMs = 1_500): Promise<ReadinessSnapshot> {
  let database: DependencyState = "not_configured";
  if (isDatabaseConfigured()) {
    try {
      await withTimeout(prisma.$queryRaw`SELECT 1`, timeoutMs);
      database = "connected";
    } catch {
      database = "unreachable";
    }
  }

  return {
    database,
    auth:
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
        ? "configured"
        : "not_configured",
    payments:
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID &&
      process.env.RAZORPAY_KEY_SECRET &&
      process.env.RAZORPAY_WEBHOOK_SECRET
        ? "configured"
        : "not_configured",
  };
}
