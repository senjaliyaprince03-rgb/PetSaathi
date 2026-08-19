import { ConcurrencyController, CONCURRENCY_CONFIG } from './concurrency.mjs';
import { getRedisClient } from './redis-client.mjs';
import crypto from 'crypto';

/**
 * Concurrency limits via Redis sets with TTL leases (heartbeats).
 * Ensures crashed processes automatically release their slots.
 */
const ACQUIRE_LUA = `
  local globalKey = KEYS[1]
  local userKey = KEYS[2]
  local maxGlobal = tonumber(ARGV[1])
  local maxUser = tonumber(ARGV[2])
  local leaseId = ARGV[3]
  local ttlMs = tonumber(ARGV[4])
  local now = tonumber(ARGV[5])

  -- Cleanup expired from global
  redis.call('ZREMRANGEBYSCORE', globalKey, '-inf', now)
  -- Cleanup expired from user
  redis.call('ZREMRANGEBYSCORE', userKey, '-inf', now)

  local currentGlobal = redis.call('ZCARD', globalKey)
  if currentGlobal >= maxGlobal then
    return { 0, "GLOBAL_CONCURRENCY_LIMIT" }
  end

  local currentUser = redis.call('ZCARD', userKey)
  if currentUser >= maxUser then
    return { 0, "USER_CONCURRENCY_LIMIT" }
  end

  local expiration = now + ttlMs
  redis.call('ZADD', globalKey, expiration, leaseId)
  redis.call('ZADD', userKey, expiration, leaseId)

  return { 1, leaseId }
`;

export class RedisConcurrencyController extends ConcurrencyController {
  constructor() {
    super();
    this.client = getRedisClient();
    this.client.defineCommand('acquireConcurrency', {
      numberOfKeys: 2,
      lua: ACQUIRE_LUA
    });
    this.userLeases = new Map(); // userId -> leaseId
  }

  async tryAcquire(userId) {
    const leaseId = crypto.randomUUID();
    const ttlMs = 60000; // 60s lease
    const now = Date.now();

    try {
      const [acquired, reasonOrLease] = await this.client.acquireConcurrency(
        'concurrency:global',
        `concurrency:user:${userId}`,
        CONCURRENCY_CONFIG.GLOBAL_CONCURRENCY,
        CONCURRENCY_CONFIG.PER_USER_CONCURRENCY,
        leaseId,
        ttlMs,
        now
      );

      if (acquired === 0) {
        return { acquired: false, reason: reasonOrLease };
      }

      this.userLeases.set(userId, leaseId);
      
      // In a full implementation we would start a heartbeat interval here to renew the lease
      // if the request takes longer than 60s. For now, 60s is longer than our inference timeouts.
      
      return { acquired: true };
    } catch (err) {
      console.error("[RedisConcurrency] Error:", err.message);
      return { acquired: false, reason: "INTERNAL_ERROR" };
    }
  }

  async release(userId) {
    const leaseId = this.userLeases.get(userId);
    if (!leaseId) return;

    try {
      await this.client.zrem('concurrency:global', leaseId);
      await this.client.zrem(`concurrency:user:${userId}`, leaseId);
      this.userLeases.delete(userId);
    } catch (err) {
      console.error("[RedisConcurrency] Release error:", err.message);
    }
  }
}
