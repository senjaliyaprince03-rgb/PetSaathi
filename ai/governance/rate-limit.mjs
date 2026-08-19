/**
 * Governance: Rate Limiting
 * Abstract interface and in-memory provider for rate limiting.
 * Token-bucket algorithm with per-user and global limits.
 */

// Default configuration
export const CONFIG = {
  PER_USER_LIMIT: parseInt(process.env.RATE_LIMIT_PER_USER) || 30, // requests per minute
  GLOBAL_LIMIT: parseInt(process.env.RATE_LIMIT_GLOBAL) || 200,    // requests per minute
  WINDOW_MS: 60000 // 1 minute
};

export class RateLimiter {
  /**
   * @param {string} userId - The user ID or API key, or 'anonymous'
   * @returns {{ allowed: boolean, retryAfterMs?: number }}
   */
  async checkRateLimit(userId) {
    throw new Error("Not implemented");
  }
}

class InMemoryRateLimiter extends RateLimiter {
  constructor() {
    super();
    this.userBuckets = new Map(); // userId -> { tokens, lastRefill }
    this.globalBucket = { tokens: CONFIG.GLOBAL_LIMIT, lastRefill: Date.now() };
    
    // Cleanup interval to prevent memory leaks
    setInterval(() => this._cleanup(), 5 * 60 * 1000).unref();
  }

  async checkRateLimit(userId) {
    const now = Date.now();

    // 1. Check global limit
    this._refillGlobal(now);
    if (this.globalBucket.tokens < 1) {
      const msUntilRefill = CONFIG.WINDOW_MS - (now - this.globalBucket.lastRefill);
      return { allowed: false, retryAfterMs: msUntilRefill > 0 ? msUntilRefill : 1000, reason: "GLOBAL_RATE_LIMIT" };
    }

    // 2. Check per-user limit
    let userBucket = this.userBuckets.get(userId);
    if (!userBucket) {
      userBucket = { tokens: CONFIG.PER_USER_LIMIT, lastRefill: now };
      this.userBuckets.set(userId, userBucket);
    } else {
      this._refillUser(userBucket, now);
    }

    if (userBucket.tokens < 1) {
      const msUntilRefill = CONFIG.WINDOW_MS - (now - userBucket.lastRefill);
      return { allowed: false, retryAfterMs: msUntilRefill > 0 ? msUntilRefill : 1000, reason: "USER_RATE_LIMIT" };
    }

    // 3. Consume tokens
    this.globalBucket.tokens -= 1;
    userBucket.tokens -= 1;

    return { allowed: true };
  }

  _refillGlobal(now) {
    const timePassed = now - this.globalBucket.lastRefill;
    if (timePassed >= CONFIG.WINDOW_MS) {
      this.globalBucket.tokens = CONFIG.GLOBAL_LIMIT;
      this.globalBucket.lastRefill = now;
    } else {
      // Smooth refill
      const refillAmount = Math.floor(timePassed * (CONFIG.GLOBAL_LIMIT / CONFIG.WINDOW_MS));
      if (refillAmount > 0) {
        this.globalBucket.tokens = Math.min(CONFIG.GLOBAL_LIMIT, this.globalBucket.tokens + refillAmount);
        this.globalBucket.lastRefill = now; // Only reset partially, but for simplicity here we just use strict window resets if we don't want partial.
        // Actually, let's do a strict window reset for simplicity of calculating retryAfterMs
      }
    }
    // Strict window refill for precise retryAfterMs:
    if (timePassed >= CONFIG.WINDOW_MS) {
      this.globalBucket.tokens = CONFIG.GLOBAL_LIMIT;
      this.globalBucket.lastRefill = now;
    }
  }

  _refillUser(bucket, now) {
    const timePassed = now - bucket.lastRefill;
    if (timePassed >= CONFIG.WINDOW_MS) {
      bucket.tokens = CONFIG.PER_USER_LIMIT;
      bucket.lastRefill = now;
    }
  }

  _cleanup() {
    const now = Date.now();
    for (const [userId, bucket] of this.userBuckets.entries()) {
      if (now - bucket.lastRefill > CONFIG.WINDOW_MS) {
        this.userBuckets.delete(userId);
      }
    }
  }
}

// Export singleton instance of the default provider
export const rateLimiter = new InMemoryRateLimiter();
