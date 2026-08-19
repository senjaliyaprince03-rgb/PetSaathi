import { getAuditMetrics } from '../../ai/audit.mjs';
import { rateLimiter, concurrencyController, budgetStore } from '../../ai/governance/index.mjs';
import { getHealthSnapshot } from '../../ai/timeouts.mjs';

/**
 * GET /api/ai/health
 * Overall system liveness and circuit breaker states.
 */
export async function healthHandler(req, res) {
  try {
    const snapshot = getHealthSnapshot();
    return res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      circuitBreakers: snapshot
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}

/**
 * GET /api/ai/metrics
 * Aggregate success/error/latency metrics from audit trail.
 * Query param: windowMs (default 3600000 = 1 hour)
 */
export async function metricsHandler(req, res) {
  try {
    const windowMs = parseInt(req.query.windowMs) || 60 * 60 * 1000;
    const metrics = await getAuditMetrics({ windowMs });
    return res.json(metrics);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

/**
 * GET /api/ai/governance
 * Current governance state: rate limit, concurrency, budget status.
 */
export async function governanceHandler(req, res) {
  try {
    const userId = req.query.userId || 'dashboard';

    const [rlCheck, ccCheck, budgetCheck] = await Promise.all([
      rateLimiter.checkRateLimit(userId),
      concurrencyController.tryAcquire(userId),
      budgetStore.checkBudget(userId, 0)
    ]);

    // Release the slot we just acquired for the check
    if (ccCheck.acquired) {
      await concurrencyController.release(userId);
    }

    return res.json({
      timestamp: new Date().toISOString(),
      rateLimit: {
        allowed: rlCheck.allowed,
        retryAfterMs: rlCheck.retryAfterMs || null
      },
      concurrency: {
        available: ccCheck.acquired,
        reason: ccCheck.reason || null
      },
      budget: {
        allowed: budgetCheck.allowed,
        remaining: budgetCheck.remaining || null,
        reason: budgetCheck.reason || null
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

/**
 * GET /api/ai/rag
 * RAG subsystem status — hit rate, degradation mode.
 */
export async function ragHandler(req, res) {
  try {
    const windowMs = parseInt(req.query.windowMs) || 60 * 60 * 1000;
    const metrics = await getAuditMetrics({ windowMs });

    return res.json({
      timestamp: new Date().toISOString(),
      windowMs,
      ragHitRate: metrics.ragHitRate || 0,
      totalRequests: metrics.totalRequests || 0
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
