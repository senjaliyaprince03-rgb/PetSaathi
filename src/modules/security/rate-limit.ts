import "server-only";

import { createHash } from "node:crypto";
import { isIP } from "node:net";

import { getMongoDatabase } from "@/lib/mongodb";

type RateLimitDocument = {
  _id: string;
  windowStart: Date;
  count: number;
  expiresAt: Date;
};

let rateLimitIndexPromise: Promise<string> | undefined;

async function rateLimitCollection() {
  const database = await getMongoDatabase();
  const collection = database.collection<RateLimitDocument>("rate_limit_buckets");
  rateLimitIndexPromise ??= collection.createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0, name: "rate_limit_buckets_ttl" },
  );
  await rateLimitIndexPromise;
  return collection;
}

export async function consumeRateLimit(scope: string, identifier: string, limit: number, windowMs: number) {
  if (process.env.PLAYWRIGHT_TEST === "1") return { allowed: true, remaining: limit, retryAfterSeconds: 0 };
  const now = new Date();
  const windowStart = new Date(Math.floor(now.getTime() / windowMs) * windowMs);
  const expiresAt = new Date(windowStart.getTime() + windowMs * 2);
  const key = createHash("sha256").update(`${scope}:${identifier}`).digest("hex");
  try {
    const collection = await rateLimitCollection();
    const result = await collection.findOneAndUpdate(
      { _id: key },
      [
        {
          $set: {
            count: {
              $cond: [
                { $or: [{ $eq: [{ $type: "$windowStart" }, "missing"] }, { $lt: ["$windowStart", windowStart] }] },
                1,
                { $add: [{ $ifNull: ["$count", 0] }, 1] },
              ],
            },
            windowStart,
            expiresAt,
          },
        },
      ],
      { upsert: true, returnDocument: "after" },
    );
    const count = result?.count ?? limit + 1;
    return { allowed: count <= limit, remaining: Math.max(0, limit - count), retryAfterSeconds: Math.max(1, Math.ceil((windowStart.getTime() + windowMs - now.getTime()) / 1000)) };
  } catch (error) {
    // Fail open on infrastructure failures: an outage should degrade rate
    // limiting, not hard-block every auth/form endpoint. The middleware
    // limiter still applies, and the caller's own DB work will surface the
    // outage as a retryable 503.
    if (isInfrastructureError(error)) {
      if (!warnedFailOpen) {
        warnedFailOpen = true;
        console.warn(`[rate-limit] store unavailable (${scope}) — failing open until it recovers`);
      }
      return { allowed: true, remaining: limit, retryAfterSeconds: 0 };
    }
    throw error;
  }
}

let warnedFailOpen = false;

// Local import to avoid a cycle with the shared helper.
function isInfrastructureError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const named = error as { name?: string; code?: unknown; cause?: unknown; message?: string };
  if (named.name && /^(PrismaClientInitializationError|MongoServerSelectionError|MongoNetworkError|MongoNetworkTimeoutError|MongoTopologyClosedError)$/.test(named.name)) return true;
  if (named.code === "ECONNREFUSED" || named.code === "ENOTFOUND" || named.code === "ETIMEDOUT") return true;
  if (named.cause && isInfrastructureError(named.cause)) return true;
  return /querySrv|ECONNREFUSED|ENOTFOUND|server selection|topology closed/i.test(named.message ?? "");
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
