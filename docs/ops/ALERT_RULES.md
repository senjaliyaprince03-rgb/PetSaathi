# PetSaathi Production Alert Rules & Notification Policies

> **Target Audience**: SRE / DevOps / On-Call Engineers  
> **Tools**: Datadog / Prometheus Alertmanager / Sentry / PagerDuty / Slack (`#prod-alerts`)  
> **Classification**: Operations Runbook (Task 4.3 & Task 8.2)

---

## 1. Alert Escalation Matrix

| Severity | Definition | Response SLA | Notification Channels | Escalation Path |
|----------|------------|--------------|-----------------------|-----------------|
| **P1 - Critical** | Core customer flow broken (server down, DB unreachable, payment loop failure) | < 5 minutes | PagerDuty Phone Call + SMS + `#prod-p1-critical` Slack | Primary On-Call → Secondary SRE → VP Eng |
| **P2 - High** | Degraded performance or partial service failure (chatbot down, 5xx > 1%) | < 15 minutes | PagerDuty Push + `#prod-alerts` Slack | Primary On-Call → Tech Lead |
| **P3 - Warning** | Approaching threshold (memory > 85%, disk > 80%, slow query spike) | < 1 hour | `#ops-warnings` Slack | SRE Queue |
| **P4 - Info** | Informational event (successful daily migration, backup snapshot completed) | N/A | `#ops-audit` Slack | No escalation |

---

## 2. Standard Production Alert Rules

### Alert 1: Service Down or Unreachable
- **Condition**: Synthetics probe `/api/health` returns non-200 or connection timeout for > 1 minute (2 consecutive checks from multiple geographic probes).
- **Severity**: **P1 - CRITICAL**
- **Action Playbook**:
  1. Check AWS ALB target health / NGINX upstream logs.
  2. Inspect container process restart loops (`pm2 status` or `kubectl get pods`).
  3. Verify cloud provider status page (AWS ap-south-1).

### Alert 2: API 5xx Error Rate Spike
- **Condition**: `sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100 > 1.0`
- **Severity**: **P2 - HIGH**
- **Action Playbook**:
  1. Check Sentry live issue stream for new unresolved exceptions.
  2. Identify specific failing route (e.g. `/api/bookings/create`).
  3. If tied to recent deployment, initiate immediate rollback (`docs/ops/ROLLBACK.md`).

### Alert 3: Database Connection Pool Failures
- **Condition**: MongoDB client connection error rate > 3 errors within 1 minute.
- **Severity**: **P1 - CRITICAL**
- **Action Playbook**:
  1. Check MongoDB Atlas cluster metrics (CPU, connection count vs max pool size 1500).
  2. Verify DNS resolution for Atlas SRV records (`8.8.8.8`).
  3. Check IP Access List whitelist hasn't expired.

### Alert 4: Payment Webhook Failures
- **Condition**: Razorpay webhook processing failures > 5 events within a 10-minute window.
- **Severity**: **P1 - CRITICAL**
- **Action Playbook**:
  1. Inspect `PaymentEvent` table in DB: `db.payment_events.find({ status: "FAILED" })`.
  2. Verify Razorpay webhook secret signature configuration in Doppler / AWS Secrets Manager.
  3. Check Razorpay Dashboard Webhook Logs for upstream HTTP response codes.

### Alert 5: Chatbot AI Timeout Rate
- **Condition**: Chatbot API response timeout (> 60s) or NVIDIA API error rate > 10% over 5 minutes.
- **Severity**: **P2 - HIGH**
- **Action Playbook**:
  1. Check circuit breaker state in `ai/router.mjs`.
  2. Verify NVIDIA API quota and token allowance.
  3. Ensure fallback in-memory response activates seamlessly.

### Alert 6: High Memory Usage
- **Condition**: Node.js process RSS or system memory usage > 85% sustained for 5 minutes.
- **Severity**: **P3 - WARNING**
- **Action Playbook**:
  1. Check for memory leak in `src/lib/cache.ts` TTL map.
  2. Trigger heap snapshot via DevTools / Sentry Profiler.
  3. Scale up or restart worker process.

### Alert 7: Disk Usage Exceeds Threshold
- **Condition**: Root volume disk space utilization > 80%.
- **Severity**: **P3 - WARNING**
- **Action Playbook**:
  1. Rotate and prune old local log files (`/var/log`).
  2. Clean Docker dangling images and build caches (`docker system prune -f`).

### Alert 8: Stale Bookings in 'PENDING' State
- **Condition**: Any booking remains in `REQUESTED` or `PAYMENT_PENDING` for > 30 minutes without assignment or payment confirmation.
- **Severity**: **P2 - HIGH**
- **Action Playbook**:
  1. Run automated reconciliation sweep script (`scripts/pricing-capacity-reconciliation.ts`).
  2. Notify Operations Admin to trigger manual assignment or customer follow-up.
