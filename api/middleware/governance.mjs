import { rateLimiter, concurrencyController, abuseStore } from '../../ai/governance/index.mjs';

/**
 * Express middleware for AI Production Governance.
 * Enforces rate limits, concurrency limits, and abuse protection
 * before a request ever reaches the AI pipeline.
 */
export async function governanceMiddleware(req, res, next) {
  const userId = req.user?.id || req.headers['x-api-key'] || 'anonymous';
  
  try {
    // 1. Abuse Check
    // Note: We might not have the prompt yet if it's deeply nested, 
    // but assuming it's in req.body.prompt for AI endpoints
    if (req.body && req.body.prompt) {
      const abuseCheck = await abuseStore.checkAbuse(userId, req.body.prompt);
      if (abuseCheck.blocked) {
        return res.status(429).json({ 
          error: "Too Many Requests", 
          reason: abuseCheck.reason,
          retryAfterMs: abuseCheck.cooldownRemainingMs || 60000 
        });
      }
    }

    // 2. Rate Limit
    const rlCheck = await rateLimiter.checkRateLimit(userId);
    if (!rlCheck.allowed) {
      res.set('Retry-After', Math.ceil((rlCheck.retryAfterMs || 1000) / 1000));
      return res.status(429).json({ error: "Rate limit exceeded", retryAfterMs: rlCheck.retryAfterMs });
    }

    // 3. Concurrency
    const concCheck = await concurrencyController.tryAcquire(userId);
    if (!concCheck.acquired) {
      return res.status(503).json({ error: "Service Unavailable", reason: "Concurrency limit exceeded" });
    }

    // If acquired, we MUST release it when the request finishes
    res.on('finish', async () => {
      await concurrencyController.release(userId);
    });
    res.on('close', async () => {
      if (!res.writableEnded) {
        await concurrencyController.release(userId);
      }
    });

    next();
  } catch (err) {
    console.error("Governance middleware error:", err);
    // Fail-open for governance errors to avoid taking down the whole system if Redis dies
    // However, if we fail-open, we might get overwhelmed. For now, pass to next middleware.
    next(err);
  }
}
