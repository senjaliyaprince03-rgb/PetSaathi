import { RateLimiter, CONFIG } from './rate-limit.mjs';
import { getRedisClient } from './redis-client.mjs';

/**
 * Atomic token bucket rate limiter using Redis Lua scripts.
 */
const TOKEN_BUCKET_LUA = `
  local key = KEYS[1]
  local max_tokens = tonumber(ARGV[1])
  local refill_ms = tonumber(ARGV[2])
  local now = tonumber(ARGV[3])
  
  local bucket = redis.call('HMGET', key, 'tokens', 'lastRefill')
  local tokens = tonumber(bucket[1])
  local lastRefill = tonumber(bucket[2])
  
  if not tokens or not lastRefill then
    tokens = max_tokens
    lastRefill = now
  else
    local timePassed = now - lastRefill
    if timePassed >= refill_ms then
      tokens = max_tokens
      lastRefill = now
    end
  end
  
  if tokens >= 1 then
    tokens = tokens - 1
    redis.call('HMSET', key, 'tokens', tokens, 'lastRefill', lastRefill)
    redis.call('PEXPIRE', key, refill_ms)
    return { 1, refill_ms - (now - lastRefill) }
  else
    return { 0, refill_ms - (now - lastRefill) }
  end
`;

export class RedisRateLimiter extends RateLimiter {
  constructor() {
    super();
    this.client = getRedisClient();
    // Define the custom command so we don't send the script every time
    this.client.defineCommand('tokenBucket', {
      numberOfKeys: 1,
      lua: TOKEN_BUCKET_LUA,
    });
  }

  async checkRateLimit(userId) {
    const now = Date.now();
    try {
      // 1. Check Global Limit
      const [globalAllowed, globalWait] = await this.client.tokenBucket(
        'ratelimit:global',
        CONFIG.GLOBAL_LIMIT,
        CONFIG.WINDOW_MS,
        now
      );
      
      if (globalAllowed === 0) {
        return { allowed: false, retryAfterMs: globalWait > 0 ? globalWait : 1000, reason: "GLOBAL_RATE_LIMIT" };
      }

      // 2. Check User Limit
      const [userAllowed, userWait] = await this.client.tokenBucket(
        `ratelimit:user:${userId}`,
        CONFIG.PER_USER_LIMIT,
        CONFIG.WINDOW_MS,
        now
      );

      if (userAllowed === 0) {
        // We consumed a global token but failed user token. In a strict system we might rollback,
        // but for rate limiting it's acceptable to just lose the global token.
        return { allowed: false, retryAfterMs: userWait > 0 ? userWait : 1000, reason: "USER_RATE_LIMIT" };
      }

      return { allowed: true };
    } catch (error) {
      console.error("[RedisRateLimiter] Error:", error.message);
      // Fail open if Redis is down, to maintain availability
      return { allowed: true };
    }
  }
}
