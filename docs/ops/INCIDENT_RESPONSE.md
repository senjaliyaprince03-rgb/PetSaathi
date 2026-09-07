# PetSaathi Incident Response Playbook

## Severity Levels

| Severity | Definition | Target Resolution | Escalation Contact |
|---|---|---|---|
| **P1 - CRITICAL** | Full outage, database down, payment failures platform-wide | < 15 minutes | Lead DevOps, Engineering Head |
| **P2 - HIGH** | Sitter search degraded, high AI error rate, SMS delivery down | < 45 minutes | Backend Lead |
| **P3 - MEDIUM** | Single service area sync delay, non-critical webhook retries | < 4 hours | Duty Engineer |
| **P4 - LOW** | Minor UI styling glitch, non-blocking telemetry delay | Next release | Product Engineering |

## Triage Procedure
1. Confirm health status via `/api/health` and Sentry dashboard.
2. If database connection failure: verify MongoDB Atlas IP access list and network peering.
3. If payment webhook failure: check Razorpay webhook event log in dashboard.
4. If bad deployment: execute zero-downtime rollback following `docs/ops/ROLLBACK.md`.
