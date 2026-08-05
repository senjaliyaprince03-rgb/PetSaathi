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
  const now = new Date();
  const windowStart = new Date(Math.floor(now.getTime() / windowMs) * windowMs);
  const expiresAt = new Date(windowStart.getTime() + windowMs * 2);
  const key = createHash("sha256").update(`${scope}:${identifier}`).digest("hex");
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
