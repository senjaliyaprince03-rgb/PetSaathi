/**
 * Governance: Token Budgets
 * Abstract interface and in-memory provider for token budgeting.
 * Tracks per-request, hourly, and daily limits for users and globally.
 */

export const CONFIG = {
  PER_REQUEST_MAX: parseInt(process.env.BUDGET_REQUEST_MAX) || 8000,
  PER_USER_HOURLY: parseInt(process.env.BUDGET_USER_HOURLY) || 50000,
  PER_USER_DAILY: parseInt(process.env.BUDGET_USER_DAILY) || 200000,
  GLOBAL_DAILY: parseInt(process.env.BUDGET_GLOBAL_DAILY) || 2000000,
  EMERGENCY_BUDGET: 500 // Reserved tokens for error handling/security
};

export class BudgetStore {
  async checkBudget(userId, estimatedTokens) {
    throw new Error("Not implemented");
  }
  
  async recordUsage(userId, actualTokens) {
    throw new Error("Not implemented");
  }
}

class InMemoryBudgetStore extends BudgetStore {
  constructor() {
    super();
    this.users = new Map(); // userId -> { hourlyTokens, dailyTokens, currentHour, currentDay }
    this.global = { dailyTokens: 0, currentDay: this._getDayKey() };
  }

  _getHourKey() {
    return Math.floor(Date.now() / (60 * 60 * 1000));
  }

  _getDayKey() {
    return Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  }

  _getUserRecord(userId) {
    const currentHour = this._getHourKey();
    const currentDay = this._getDayKey();
    
    let record = this.users.get(userId);
    if (!record) {
      record = { hourlyTokens: 0, dailyTokens: 0, currentHour, currentDay };
      this.users.set(userId, record);
    } else {
      if (record.currentHour !== currentHour) {
        record.hourlyTokens = 0;
        record.currentHour = currentHour;
      }
      if (record.currentDay !== currentDay) {
        record.dailyTokens = 0;
        record.currentDay = currentDay;
      }
    }
    return record;
  }

  async checkBudget(userId, estimatedTokens = 0) {
    // 1. Check per-request max
    if (estimatedTokens > CONFIG.PER_REQUEST_MAX) {
      return { allowed: false, reason: "REQUEST_BUDGET_EXCEEDED" };
    }

    const currentDay = this._getDayKey();
    if (this.global.currentDay !== currentDay) {
      this.global.dailyTokens = 0;
      this.global.currentDay = currentDay;
    }

    // 2. Check global daily
    if (this.global.dailyTokens + estimatedTokens > CONFIG.GLOBAL_DAILY - CONFIG.EMERGENCY_BUDGET) {
      return { allowed: false, reason: "GLOBAL_BUDGET_EXCEEDED" };
    }

    // 3. Check user hourly/daily
    const record = this._getUserRecord(userId);
    
    if (record.hourlyTokens + estimatedTokens > CONFIG.PER_USER_HOURLY - CONFIG.EMERGENCY_BUDGET) {
      return { allowed: false, reason: "USER_HOURLY_BUDGET_EXCEEDED" };
    }
    
    if (record.dailyTokens + estimatedTokens > CONFIG.PER_USER_DAILY - CONFIG.EMERGENCY_BUDGET) {
      return { allowed: false, reason: "USER_DAILY_BUDGET_EXCEEDED" };
    }

    return { allowed: true, remaining: CONFIG.PER_USER_HOURLY - record.hourlyTokens };
  }

  async recordUsage(userId, actualTokens) {
    if (typeof actualTokens !== 'number' || actualTokens < 0 || actualTokens > 128000) {
      // Validate model-reported usage to prevent overflow / invalid data
      console.warn("[Budget] Invalid token count reported:", actualTokens);
      return;
    }

    const record = this._getUserRecord(userId);
    record.hourlyTokens += actualTokens;
    record.dailyTokens += actualTokens;
    
    const currentDay = this._getDayKey();
    if (this.global.currentDay !== currentDay) {
      this.global.dailyTokens = 0;
      this.global.currentDay = currentDay;
    }
    this.global.dailyTokens += actualTokens;
  }
}

// Export singleton
export const budgetStore = new InMemoryBudgetStore();
