/**
 * Rate Limiting
 * Protects against brute force, DDoS, and API abuse
 * Supports both Redis (production) and in-memory (development) backends
 */

import "server-only";

import { NextRequest } from "next/server";

// Rate limit configuration per endpoint
export type RateLimitConfig = {
  /**
   * Maximum number of requests allowed
   */
  max: number;

  /**
   * Time window in milliseconds
   */
  windowMs: number;

  /**
   * Identifier type (IP, user, or custom)
   */
  keyType: "ip" | "user" | "custom";

  /**
   * Custom key generator (for keyType: "custom")
   */
  keyGenerator?: (request: NextRequest) => string | Promise<string>;

  /**
   * Skip rate limit check (e.g., for admins)
   */
  skip?: (request: NextRequest) => boolean | Promise<boolean>;
};

// In-memory store for development (single-instance only)
const memoryStore = new Map<string, { count: number; resetAt: number }>();

// Cleanup expired entries every minute
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of memoryStore.entries()) {
      if (value.resetAt < now) {
        memoryStore.delete(key);
      }
    }
  }, 60_000);
}

/**
 * Check rate limit using Upstash Redis (production) or memory (development)
 */
export async function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  // Check if rate limit should be skipped
  if (config.skip && await config.skip(request)) {
    return {
      success: true,
      limit: config.max,
      remaining: config.max,
      reset: Date.now() + config.windowMs
    };
  }

  // Generate rate limit key
  const key = await generateKey(request, config);

  // Use Upstash Redis if configured (production)
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return await checkRateLimitRedis(key, config);
  }

  // Fallback to in-memory store (development/single-instance)
  return checkRateLimitMemory(key, config);
}

/**
 * Generate rate limit key based on config
 */
async function generateKey(request: NextRequest, config: RateLimitConfig): Promise<string> {
  if (config.keyType === "custom" && config.keyGenerator) {
    return await config.keyGenerator(request);
  }

  if (config.keyType === "ip") {
    const ip = getClientIp(request);
    return `ratelimit:ip:${ip}`;
  }

  if (config.keyType === "user") {
    // Extract user ID from session (implementation depends on auth system)
    const userId = await getUserIdFromRequest(request);
    return `ratelimit:user:${userId}`;
  }

  throw new Error("Invalid rate limit key type");
}

/**
 * Check rate limit using Upstash Redis
 */
async function checkRateLimitRedis(
  key: string,
  config: RateLimitConfig
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;

  // Use Redis INCR with EXPIRE for atomic rate limiting
  const pipeline = [
    ["INCR", key],
    ["EXPIRE", key, Math.ceil(config.windowMs / 1000)],
    ["TTL", key]
  ];

  try {
    const response = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(pipeline),
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      console.warn("[RateLimit] Redis request failed, allowing request");
      return {
        success: true,
        limit: config.max,
        remaining: config.max,
        reset: Date.now() + config.windowMs
      };
    }

    const results = await response.json() as Array<{ result: number }>;
    const count = results[0]?.result ?? 0;
    const ttl = results[2]?.result ?? Math.ceil(config.windowMs / 1000);

    const success = count <= config.max;
    const remaining = Math.max(0, config.max - count);
    const reset = Date.now() + (ttl * 1000);

    return { success, limit: config.max, remaining, reset };
  } catch (error) {
    console.warn("[RateLimit] Redis error, allowing request:", error);
    // Fail open - allow request if Redis is unavailable
    return {
      success: true,
      limit: config.max,
      remaining: config.max,
      reset: Date.now() + config.windowMs
    };
  }
}

/**
 * Check rate limit using in-memory store (development only)
 */
function checkRateLimitMemory(
  key: string,
  config: RateLimitConfig
): {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || entry.resetAt < now) {
    // New window
    const resetAt = now + config.windowMs;
    memoryStore.set(key, { count: 1, resetAt });
    return {
      success: true,
      limit: config.max,
      remaining: config.max - 1,
      reset: resetAt
    };
  }

  // Increment counter
  entry.count++;
  const success = entry.count <= config.max;
  const remaining = Math.max(0, config.max - entry.count);

  return {
    success,
    limit: config.max,
    remaining,
    reset: entry.resetAt
  };
}

/**
 * Get client IP address from request
 */
function getClientIp(request: NextRequest): string {
  // Check common headers in order of reliability
  const headers = [
    "x-real-ip",
    "x-forwarded-for",
    "cf-connecting-ip", // Cloudflare
    "x-vercel-forwarded-for" // Vercel
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for may contain multiple IPs, take the first
      return value.split(",")[0]?.trim() ?? "unknown";
    }
  }

  return "unknown";
}

/**
 * Extract user ID from request (placeholder - implement based on auth system)
 */
async function getUserIdFromRequest(request: NextRequest): Promise<string> {
  // This should integrate with your auth system
  // For now, fallback to IP-based limiting
  return getClientIp(request);
}

/**
 * Pre-configured rate limit configs for common endpoints
 */
export const RateLimits = {
  /**
   * Login attempts: 5 per minute per IP
   */
  login: {
    max: 5,
    windowMs: 60_000,
    keyType: "ip" as const
  },

  /**
   * OTP generation: 3 per 5 minutes per IP
   */
  otpGeneration: {
    max: 3,
    windowMs: 5 * 60_000,
    keyType: "ip" as const
  },

  /**
   * OTP verification: 10 attempts per hour per IP
   */
  otpVerification: {
    max: 10,
    windowMs: 60 * 60_000,
    keyType: "ip" as const
  },

  /**
   * Payment creation: 10 per hour per user
   */
  paymentCreation: {
    max: 10,
    windowMs: 60 * 60_000,
    keyType: "user" as const
  },

  /**
   * File upload signing: 50 per hour per user
   */
  uploadSigning: {
    max: 50,
    windowMs: 60 * 60_000,
    keyType: "user" as const
  },

  /**
   * GPS tracking ingestion: 120 per minute per user (1 point every 500ms)
   */
  gpsTracking: {
    max: 120,
    windowMs: 60_000,
    keyType: "user" as const
  },

  /**
   * AI requests: 20 per minute per user
   */
  aiRequests: {
    max: 20,
    windowMs: 60_000,
    keyType: "user" as const
  },

  /**
   * Public lead forms: 5 per hour per IP
   */
  leadForms: {
    max: 5,
    windowMs: 60 * 60_000,
    keyType: "ip" as const
  },

  /**
   * Webhook endpoints: 1000 per minute per IP (generous for legitimate providers)
   */
  webhooks: {
    max: 1000,
    windowMs: 60_000,
    keyType: "ip" as const
  }
};
