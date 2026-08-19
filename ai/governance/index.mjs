import { checkRedisHealth } from './redis-client.mjs';

// Import Memory Providers
import { rateLimiter as memoryRateLimiter } from './rate-limit.mjs';
import { concurrencyController as memoryConcurrency } from './concurrency.mjs';
import { budgetStore as memoryBudget } from './budget.mjs';
import { abuseStore as memoryAbuse } from './abuse.mjs';

// Import Redis Providers
import { RedisRateLimiter } from './redis-rate-limit.mjs';
import { RedisConcurrencyController } from './redis-concurrency.mjs';
import { RedisBudgetStore } from './redis-budget.mjs';
import { RedisAbuseStore } from './redis-abuse.mjs';

let rateLimiter = memoryRateLimiter;
let concurrencyController = memoryConcurrency;
let budgetStore = memoryBudget;
let abuseStore = memoryAbuse;

/**
 * Initializes distributed governance if configured.
 * Validates connection before enabling.
 */
export async function initializeGovernance() {
  const storeType = process.env.GOVERNANCE_STORE || 'memory';
  
  if (storeType === 'redis') {
    console.log("[Governance] Initializing distributed Redis governance...");
    
    const isHealthy = await checkRedisHealth();
    if (!isHealthy) {
      console.error("[Governance] ❌ Failed to connect to Redis. Falling back to memory governance.");
      // We could throw here for strict startup failure, but fallback might be safer for dev
      // "The application should report a clear configuration error rather than discovering a missing production dependency"
      throw new Error("GOVERNANCE_STORE=redis is configured but Redis is unreachable on startup.");
    }

    rateLimiter = new RedisRateLimiter();
    concurrencyController = new RedisConcurrencyController();
    budgetStore = new RedisBudgetStore();
    abuseStore = new RedisAbuseStore();
    
    console.log("[Governance] ✅ Redis distributed governance enabled.");
  } else {
    console.log("[Governance] Using in-memory single-node governance.");
  }
}

export { rateLimiter, concurrencyController, budgetStore, abuseStore };
