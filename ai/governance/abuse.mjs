/**
 * Governance: Abuse Protection
 * Abstract interface and in-memory provider for abuse protection.
 * Normalizes prompts, hashes them, detects rapid repeats, and tracks violations.
 */

import crypto from 'crypto';

export const CONFIG = {
  MAX_SCORE: 100, // Score at which a temporary ban is issued
  COOLDOWN_MS: 15 * 60 * 1000, // 15 minute ban
  REPEAT_PROMPT_WINDOW: 60000, // 1 min window for repeats
  MAX_REPEATS: 3 // Max identical prompts in the window
};

export const VIOLATION_WEIGHTS = {
  SECURITY_BLOCK: 50, // 2 strikes = ban
  RATE_LIMIT_HIT: 10, // 10 strikes = ban
  QUALITY_BLOCK: 25   // 4 strikes = ban
};

export class AbuseStore {
  async checkAbuse(userId, prompt) {
    throw new Error("Not implemented");
  }
  
  async recordViolation(userId, type) {
    throw new Error("Not implemented");
  }
}

class InMemoryAbuseStore extends AbuseStore {
  constructor() {
    super();
    this.userStates = new Map(); // userId -> { score, cooldownUntil, recentPrompts: [{hash, time}] }
    
    // Cleanup interval
    setInterval(() => this._cleanup(), 15 * 60 * 1000).unref();
  }

  _getUserState(userId) {
    if (!this.userStates.has(userId)) {
      this.userStates.set(userId, { score: 0, cooldownUntil: 0, recentPrompts: [] });
    }
    return this.userStates.get(userId);
  }

  async checkAbuse(userId, prompt) {
    const state = this._getUserState(userId);
    const now = Date.now();

    // 1. Check cooldown
    if (state.cooldownUntil > now) {
      return { blocked: true, reason: "ABUSE_COOLDOWN", cooldownRemainingMs: state.cooldownUntil - now };
    }

    // Reset score if cooldown expired
    if (state.cooldownUntil > 0 && state.cooldownUntil <= now) {
      state.score = 0;
      state.cooldownUntil = 0;
    }

    // 2. Hash normalized prompt
    const normalizedPrompt = prompt.toLowerCase().replace(/\s+/g, ' ').trim();
    const hash = crypto.createHash('sha256').update(normalizedPrompt).digest('hex');

    // 3. Detect rapid repeats
    // Remove old prompts
    state.recentPrompts = state.recentPrompts.filter(p => now - p.time < CONFIG.REPEAT_PROMPT_WINDOW);
    
    const repeatCount = state.recentPrompts.filter(p => p.hash === hash).length;
    if (repeatCount >= CONFIG.MAX_REPEATS) {
      // Escalate abuse score for spamming
      await this.recordViolation(userId, 'RATE_LIMIT_HIT'); 
      return { blocked: true, reason: "RAPID_REPEAT_PROMPT" };
    }

    state.recentPrompts.push({ hash, time: now });
    
    return { blocked: false };
  }

  async recordViolation(userId, type) {
    const state = this._getUserState(userId);
    const weight = VIOLATION_WEIGHTS[type] || 10;
    
    state.score += weight;
    
    if (state.score >= CONFIG.MAX_SCORE) {
      state.cooldownUntil = Date.now() + CONFIG.COOLDOWN_MS;
      return true; // Cooldown triggered
    }
    return false; // Still allowed
  }

  _cleanup() {
    const now = Date.now();
    for (const [userId, state] of this.userStates.entries()) {
      if (state.cooldownUntil < now && state.score === 0 && state.recentPrompts.length === 0) {
        this.userStates.delete(userId);
      }
    }
  }
}

// Export singleton
export const abuseStore = new InMemoryAbuseStore();
