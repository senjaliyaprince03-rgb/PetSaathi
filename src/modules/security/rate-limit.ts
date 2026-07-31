import "server-only";

import { createHash } from "node:crypto";
import { isIP } from "node:net";

import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

type CounterRow = { count: number };

export async function consumeRateLimit(scope: string, identifier: string, limit: number, windowMs: number) {
  const now = new Date();
  const windowStart = new Date(Math.floor(now.getTime() / windowMs) * windowMs);
  const expiresAt = new Date(windowStart.getTime() + windowMs * 2);
  const key = createHash("sha256").update(`${scope}:${identifier}`).digest("hex");
  const rows = await prisma.$queryRaw<CounterRow[]>(Prisma.sql`
    INSERT INTO "rate_limit_buckets" ("key", "window_start", "count", "expires_at")
    VALUES (${key}, ${windowStart}, 1, ${expiresAt})
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "rate_limit_buckets"."window_start" < ${windowStart} THEN 1 ELSE "rate_limit_buckets"."count" + 1 END,
      "window_start" = CASE WHEN "rate_limit_buckets"."window_start" < ${windowStart} THEN ${windowStart} ELSE "rate_limit_buckets"."window_start" END,
      "expires_at" = ${expiresAt}
    RETURNING "count"
  `);
  const count = rows[0]?.count ?? limit + 1;
  return { allowed: count <= limit, remaining: Math.max(0, limit - count), retryAfterSeconds: Math.max(1, Math.ceil((windowStart.getTime() + windowMs - now.getTime()) / 1000)) };
}

export function requestIp(request: Request) {
  const candidates = [
    ...(request.headers.get("x-forwarded-for")?.split(",") ?? []),
    request.headers.get("x-real-ip"),
  ];

  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (value && isIP(value)) return value;
  }

  return "unknown";
}
