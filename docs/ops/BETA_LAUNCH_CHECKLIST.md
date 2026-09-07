# PetSaathi Soft Launch & Beta Checklist (Phase 6)

## 1. Beta Target Scope
- **Geographic Scope:** Bangalore (Koramangala, Indiranagar, HSR Layout, Whitefield) & Mumbai (Bandra, Powai, Andheri West).
- **Target Beta Cohort:** 50 trusted pet parents, 20 background-verified Saathis.
- **Duration:** 14 calendar days.

## 2. Pre-Launch Configuration Checks
- [ ] MongoDB Atlas cluster: Production M10+ running in AWS ap-south-1 (Mumbai).
- [ ] Connection string verification: scripts/test-db-connection.ts exits with code 0.
- [ ] Razorpay Live Key & Secret set in production environment variables.
- [ ] Razorpay Webhook configured to https://petsaathi.com/api/webhooks/razorpay with event subscriptions.
- [ ] Vercel region set to bom1 (Mumbai) for minimum roundtrip latency.
- [ ] NVIDIA AI Router API Key set in production environment.
- [ ] Sentry DSN verified with client-side & server-side PII scrubbing active.
- [ ] Legal pages accessible: /privacy-policy, /terms, /refund-policy.

## 3. Launch Day Verification Sequence
1. Run npm run doctor:production and verify all required envs are green.
2. Trigger live INR 1 payment test via Razorpay UPI and verify captured state + instant refund receipt.
3. Verify /api/health responds with status: ok and DB latency <50ms.
4. Verify /admin/metrics dashboard reflects real-time metrics.
5. Send welcome onboarding SMS and WhatsApp invites to the first 50 beta pet parents.

## 4. Post-Launch Incident Escalation Matrix
- **P1 (Showstopper):** Payment failure rate >5%, Live GPS tracking failure, Database unavailable. Immediate on-call escalation via Ops Lead (<15 min response).
- **P2 (Major):** AI Router fallback degraded, Sitter background document upload delay. Resolution within 2 hours.
- **P3 (Minor):** Non-blocking UI glitch, minor typography discrepancy. Resolution in next daily deployment.