import { BudgetStore, CONFIG } from './budget.mjs';
import { getRedisClient } from './redis-client.mjs';

/**
 * Token budgets using Redis INCRBY and TTLs.
 */
export class RedisBudgetStore extends BudgetStore {
  constructor() {
    super();
    this.client = getRedisClient();
  }

  _getHourKey(userId) {
    const hour = Math.floor(Date.now() / (60 * 60 * 1000));
    return `budget:user:${userId}:hour:${hour}`;
  }

  _getDayKey(userId) {
    const day = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
    return userId ? `budget:user:${userId}:day:${day}` : `budget:global:day:${day}`;
  }

  async checkBudget(userId, estimatedTokens = 0) {
    if (estimatedTokens > CONFIG.PER_REQUEST_MAX) {
      return { allowed: false, reason: "REQUEST_BUDGET_EXCEEDED" };
    }

    try {
      const globalKey = this._getDayKey(null);
      const userHourKey = this._getHourKey(userId);
      const userDayKey = this._getDayKey(userId);

      const [globalUsed, userHourUsed, userDayUsed] = await this.client.mget(globalKey, userHourKey, userDayKey);

      if ((parseInt(globalUsed) || 0) + estimatedTokens > CONFIG.GLOBAL_DAILY - CONFIG.EMERGENCY_BUDGET) {
        return { allowed: false, reason: "GLOBAL_BUDGET_EXCEEDED" };
      }

      if ((parseInt(userHourUsed) || 0) + estimatedTokens > CONFIG.PER_USER_HOURLY - CONFIG.EMERGENCY_BUDGET) {
        return { allowed: false, reason: "USER_HOURLY_BUDGET_EXCEEDED" };
      }

      if ((parseInt(userDayUsed) || 0) + estimatedTokens > CONFIG.PER_USER_DAILY - CONFIG.EMERGENCY_BUDGET) {
        return { allowed: false, reason: "USER_DAILY_BUDGET_EXCEEDED" };
      }

      return { allowed: true, remaining: CONFIG.PER_USER_HOURLY - (parseInt(userHourUsed) || 0) };
    } catch (err) {
      console.error("[RedisBudget] Error:", err.message);
      return { allowed: true }; // fail open
    }
  }

  async recordUsage(userId, actualTokens) {
    if (typeof actualTokens !== 'number' || actualTokens < 0 || actualTokens > 128000) return;

    try {
      const globalKey = this._getDayKey(null);
      const userHourKey = this._getHourKey(userId);
      const userDayKey = this._getDayKey(userId);

      const pipeline = this.client.pipeline();
      
      pipeline.incrby(globalKey, actualTokens);
      pipeline.expire(globalKey, 48 * 60 * 60); // Keep for 2 days

      pipeline.incrby(userDayKey, actualTokens);
      pipeline.expire(userDayKey, 48 * 60 * 60); 

      pipeline.incrby(userHourKey, actualTokens);
      pipeline.expire(userHourKey, 2 * 60 * 60); // Keep for 2 hours

      await pipeline.exec();
    } catch (err) {
      console.error("[RedisBudget] Record usage error:", err.message);
    }
  }
}
