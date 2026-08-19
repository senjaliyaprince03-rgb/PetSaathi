/**
 * Circuit Breaker & Component Health System
 * Phase 6C: Per-component circuit breaker with CLOSED/OPEN/HALF_OPEN states.
 *
 * Components can be model IDs (e.g. "meta/llama-3.1-8b-instruct") or
 * logical names (e.g. "embeddings", "reranker", "vectorstore", "security").
 */

// Circuit breaker states
export const CircuitState = {
  CLOSED: 'CLOSED',       // Normal operation
  OPEN: 'OPEN',           // Failures exceeded threshold, rejecting calls
  HALF_OPEN: 'HALF_OPEN'  // Cooldown expired, allowing a single probe
};

const FAILURE_THRESHOLD = parseInt(process.env.CB_FAILURE_THRESHOLD || '3', 10);
const COOLDOWN_MS = parseInt(process.env.CB_COOLDOWN_MS || '300000', 10); // 5 minutes

// Per-component health tracking
const componentHealth = new Map();

function getOrCreate(componentId) {
  if (!componentHealth.has(componentId)) {
    componentHealth.set(componentId, {
      failures: 0,
      successes: 0,
      lastFailure: 0,
      lastSuccess: 0,
      state: CircuitState.CLOSED
    });
  }
  return componentHealth.get(componentId);
}

export function recordFailure(componentId) {
  const health = getOrCreate(componentId);
  health.failures += 1;
  health.lastFailure = Date.now();

  if (health.failures >= FAILURE_THRESHOLD) {
    health.state = CircuitState.OPEN;
  }

  componentHealth.set(componentId, health);
}

export function recordSuccess(componentId) {
  const health = getOrCreate(componentId);
  health.successes += 1;
  health.lastSuccess = Date.now();
  // Reset on success
  health.failures = 0;
  health.state = CircuitState.CLOSED;
  componentHealth.set(componentId, health);
}

export function getCircuitState(componentId) {
  const health = getOrCreate(componentId);

  if (health.state === CircuitState.OPEN) {
    const elapsed = Date.now() - health.lastFailure;
    if (elapsed >= COOLDOWN_MS) {
      // Transition to half-open: allow one probe
      health.state = CircuitState.HALF_OPEN;
      componentHealth.set(componentId, health);
      return CircuitState.HALF_OPEN;
    }
    return CircuitState.OPEN;
  }

  return health.state;
}

export function isHealthy(componentId) {
  const state = getCircuitState(componentId);
  // Allow calls when CLOSED or HALF_OPEN (probe)
  return state !== CircuitState.OPEN;
}

export function isRetryableError(error) {
  const status = error.status;
  if (!status) return true; // Network error / timeout
  // Retry transient errors only
  return [408, 429, 500, 502, 503, 504].includes(status);
}

/**
 * Returns a snapshot of all component health states (for telemetry/debugging).
 */
export function getHealthSnapshot() {
  const snapshot = {};
  for (const [id, health] of componentHealth) {
    snapshot[id] = {
      state: getCircuitState(id),
      failures: health.failures,
      lastFailure: health.lastFailure ? new Date(health.lastFailure).toISOString() : null
    };
  }
  return snapshot;
}

export async function checkVectorDbHealth() {
  if (process.env.VECTOR_STORE !== 'mongodb') {
    return { healthy: true, type: 'memory' };
  }

  try {
    const { vectorStore } = await import('./vector-store.mjs');
    const collection = await vectorStore.getCollection();
    const indexes = await collection.listSearchIndexes().toArray();
    const existing = indexes.find(i => i.name === vectorStore.indexName);

    if (!existing) {
      recordFailure('vectorstore');
      return { healthy: false, error: `MongoDB Atlas Vector Search index '${vectorStore.indexName}' not found.` };
    }

    recordSuccess('vectorstore');
    return { healthy: true, type: 'mongodb' };
  } catch (err) {
    recordFailure('vectorstore');
    return { healthy: false, error: err.message };
  }
}
