import { AbuseStore, CONFIG, VIOLATION_WEIGHTS } from './abuse.mjs';
import { getRedisClient } from './redis-client.mjs';
import crypto from 'crypto';

export class RedisAbuseStore extends AbuseStore {
  constructor() {
    super();
    this.client = getRedisClient();
  }

  async checkAbuse(userId, prompt) {
    const now = Date.now();
    const cooldownKey = `abuse:cooldown:${userId}`;
    const scoreKey = `abuse:score:${userId}`;
    const promptsKey = `abuse:prompts:${userId}`;

    try {
      // 1. Check cooldown
      const cooldownUntil = await this.client.get(cooldownKey);
      if (cooldownUntil && parseInt(cooldownUntil) > now) {
        return { blocked: true, reason: "ABUSE_COOLDOWN", cooldownRemainingMs: parseInt(cooldownUntil) - now };
      }

      // 2. Hash normalized prompt
      const normalizedPrompt = prompt.toLowerCase().replace(/\s+/g, ' ').trim();
      const hash = crypto.createHash('sha256').update(normalizedPrompt).digest('hex');

      // 3. Detect rapid repeats
      const pipeline = this.client.pipeline();
      
      // Add current prompt
      pipeline.zadd(promptsKey, now, hash);
      // Remove old prompts
      pipeline.zremrangebyscore(promptsKey, '-inf', now - CONFIG.REPEAT_PROMPT_WINDOW);
      // Get all recent prompts
      pipeline.zrange(promptsKey, 0, -1);
      // Expire the key if user goes inactive
      pipeline.expire(promptsKey, Math.ceil(CONFIG.REPEAT_PROMPT_WINDOW / 1000) * 2);

      const results = await pipeline.exec();
      const recentPrompts = results[2][1]; // The array of hashes returned by zrange

      const repeatCount = recentPrompts.filter(h => h === hash).length;
      if (repeatCount >= CONFIG.MAX_REPEATS) {
        await this.recordViolation(userId, 'RATE_LIMIT_HIT');
        return { blocked: true, reason: "RAPID_REPEAT_PROMPT" };
      }

      return { blocked: false };
    } catch (err) {
      console.error("[RedisAbuse] Error:", err.message);
      return { blocked: false }; // fail open
    }
  }

  async recordViolation(userId, type) {
    const weight = VIOLATION_WEIGHTS[type] || 10;
    const scoreKey = `abuse:score:${userId}`;
    const cooldownKey = `abuse:cooldown:${userId}`;
    const now = Date.now();

    try {
      const newScore = await this.client.incrby(scoreKey, weight);
      await this.client.expire(scoreKey, 60 * 60 * 24); // Keep score for a day

      if (newScore >= CONFIG.MAX_SCORE) {
        const cooldownUntil = now + CONFIG.COOLDOWN_MS;
        const pipeline = this.client.pipeline();
        pipeline.set(cooldownKey, cooldownUntil, 'PX', CONFIG.COOLDOWN_MS);
        pipeline.del(scoreKey); // reset score on ban
        await pipeline.exec();
        return true; // Cooldown triggered
      }
      return false; // Still allowed
    } catch (err) {
      console.error("[RedisAbuse] recordViolation error:", err.message);
      return false;
    }
  }
}
