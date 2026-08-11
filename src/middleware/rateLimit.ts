import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// Fallback if Redis is not configured
const mockRatelimit = {
  limit: async () => ({ success: true, pending: Promise.resolve(), limit: 100, remaining: 99, reset: Date.now() + 60000 }),
};

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Auth Routes: 20 requests per minute
export const authRateLimit = redis 
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "1 m"),
      analytics: true,
      prefix: "@upstash/ratelimit/auth",
    })
  : mockRatelimit;

// General API Routes: 100 requests per minute
export const apiRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      analytics: true,
      prefix: "@upstash/ratelimit/api",
    })
  : mockRatelimit;

export async function checkRateLimit(
  limiter: typeof authRateLimit | typeof apiRateLimit,
  identifier: string
) {
  const { success, limit, reset, remaining } = await limiter.limit(identifier);
  
  if (!success) {
    return NextResponse.json(
      { success: false, error: "Too many requests", code: "rate_limited", statusCode: 429 },
      { 
        status: 429, 
        headers: { 
          "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString()
        } 
      }
    );
  }
  
  return null; // Null means allowed
}
