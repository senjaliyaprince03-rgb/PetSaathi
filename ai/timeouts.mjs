/**
 * Timeout budgets and retry utilities for all AI pipeline stages.
 * Phase 6C: Reliability & Resilience
 */

// Timeout budgets in milliseconds (configurable via env)
export const TIMEOUTS = {
  SECURITY: parseInt(process.env.AI_TIMEOUT_SECURITY || '5000', 10),
  ANALYZER: parseInt(process.env.AI_TIMEOUT_ANALYZER || '10000', 10),
  INFERENCE: parseInt(process.env.AI_TIMEOUT_INFERENCE || '30000', 10),
  EMBEDDINGS: parseInt(process.env.AI_TIMEOUT_EMBEDDINGS || '5000', 10),
  RERANKER: parseInt(process.env.AI_TIMEOUT_RERANKER || '5000', 10),
  TOOL: parseInt(process.env.AI_TIMEOUT_TOOL || '10000', 10),
  AGENT_TOTAL_TOOL_BUDGET: parseInt(process.env.AI_TIMEOUT_AGENT_TOOL_BUDGET || '60000', 10)
};

/**
 * Wraps an async operation with a hard timeout.
 * @param {Function} fn - async function that may receive an AbortSignal
 * @param {number} timeoutMs - max milliseconds
 * @param {string} label - human-readable label for error messages
 * @returns {Promise} resolves with fn result or rejects with TimeoutError
 */
export async function withTimeout(fn, timeoutMs, label = 'operation') {
  return new Promise((resolve, reject) => {
    let settled = false;
    const controller = new AbortController();

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        // Cancel compatible I/O so a timed-out request cannot keep Node alive.
        controller.abort();
        reject(new Error(`TIMEOUT: ${label} exceeded ${timeoutMs}ms limit`));
      }
    }, timeoutMs);

    Promise.resolve()
      .then(() => fn(controller.signal))
      .then(result => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(result);
        }
      })
      .catch(error => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          reject(error);
        }
      });
  });
}

/**
 * Exponential backoff with jitter.
 * @param {number} attempt - the current attempt number (0-indexed)
 * @param {number} baseMs - base delay in ms (default 500)
 * @param {number} maxMs - maximum delay in ms (default 10000)
 * @returns {number} delay in ms
 */
export function backoffDelay(attempt, baseMs = 500, maxMs = 10000) {
  const exponential = baseMs * Math.pow(2, attempt);
  const capped = Math.min(exponential, maxMs);
  // Add jitter: random value between 50% and 100% of capped
  return Math.floor(capped * (0.5 + Math.random() * 0.5));
}

/**
 * Returns true if the HTTP status code should trigger an immediate terminal failure (no retry).
 */
export function isTerminalError(status) {
  return [400, 401, 403, 404].includes(status);
}

/**
 * Sleep utility for backoff delays.
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getHealthSnapshot() {
  return {};
}
