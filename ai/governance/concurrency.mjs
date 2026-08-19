/**
 * Governance: Concurrency Limits
 * Abstract interface and in-memory provider for concurrency limits.
 * Semaphores to prevent a single user or runaway process from monopolizing slots.
 */

const CONFIG = {
  PER_USER_CONCURRENCY: parseInt(process.env.CONCURRENCY_PER_USER) || 3,
  GLOBAL_CONCURRENCY: parseInt(process.env.CONCURRENCY_GLOBAL) || 20
};

export { CONFIG as CONCURRENCY_CONFIG };

export class ConcurrencyController {
  /**
   * @param {string} userId 
   * @returns {Promise<{ acquired: boolean, reason?: string }>}
   */
  async tryAcquire(userId) {
    throw new Error("Not implemented");
  }

  /**
   * @param {string} userId 
   */
  async release(userId) {
    throw new Error("Not implemented");
  }
}

class InMemoryConcurrencyController extends ConcurrencyController {
  constructor() {
    super();
    this.userInFlight = new Map(); // userId -> number
    this.globalInFlight = 0;
  }

  async tryAcquire(userId) {
    // Check global
    if (this.globalInFlight >= CONFIG.GLOBAL_CONCURRENCY) {
      return { acquired: false, reason: "GLOBAL_CONCURRENCY_LIMIT" };
    }

    // Check user
    const userCount = this.userInFlight.get(userId) || 0;
    if (userCount >= CONFIG.PER_USER_CONCURRENCY) {
      return { acquired: false, reason: "USER_CONCURRENCY_LIMIT" };
    }

    // Acquire
    this.globalInFlight++;
    this.userInFlight.set(userId, userCount + 1);
    
    return { acquired: true };
  }

  async release(userId) {
    if (this.globalInFlight > 0) {
      this.globalInFlight--;
    }
    
    const userCount = this.userInFlight.get(userId) || 0;
    if (userCount > 0) {
      this.userInFlight.set(userId, userCount - 1);
    }
  }
}

// Export singleton instance
export const concurrencyController = new InMemoryConcurrencyController();
