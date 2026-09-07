# PetSaathi — Production Deployment Guide

**Target Environment:** Vercel (Next.js 15 Serverless) + MongoDB Atlas (Replica Set M10+)  
**Domain:** `petsaathi.com` (with `*.petsaathi.com` wildcard for city portals)

---

## 1. Pre-Deployment Verification Checklist

```bash
# 1. Verify TypeScript types compile cleanly
npx tsc --noEmit

# 2. Run automated test suite
npm test -- --run

# 3. Check MongoDB indexes
npm run mongodb:indexes
```

---

## 2. Environment Variables Setup (Vercel Production Dashboard)

Copy the variables from `.env.production.example` into your Vercel Project Settings:
- `DATABASE_URL`: MongoDB Atlas SRV connection string with replica set parameters.
- `NEXTAUTH_URL`: `https://petsaathi.com`
- `NEXTAUTH_SECRET`: Strong 32-character random key generated via `openssl rand -base64 32`.
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Live Razorpay API keys (`rzp_live_*`).
- `RAZORPAY_WEBHOOK_SECRET`: Webhook secret set in Razorpay Dashboard.
- `RESEND_API_KEY`: Live Resend API key for transactional emails.
- `NVIDIA_API_KEY`: NVIDIA NIM API key for the AI Router.
- `SENTRY_DSN`: Sentry project DSN for server and client observability.
- `CRON_SECRET`: Random 32-character token for securing `/api/jobs/*` endpoints.

---

## 3. Webhook Configuration in Razorpay Dashboard

1. Navigate to **Razorpay Dashboard → Settings → Webhooks**.
2. Add Webhook URL: `https://petsaathi.com/api/webhooks/razorpay`.
3. Secret: Enter the exact value set in `RAZORPAY_WEBHOOK_SECRET`.
4. Enable the following events:
   - `payment.captured`
   - `payment.failed`
   - `refund.created`
   - `subscription.charged`
   - `subscription.cancelled`
   - `subscription.completed`

---

## 4. Cron Job Triggers Setup (Vercel Cron or GitHub Actions)

Configure daily/periodic GET triggers with header `Authorization: Bearer <CRON_SECRET>`:
- `/api/jobs/notifications`: Every 1–5 minutes (processes queued outbox notifications).
- `/api/jobs/tracking-retention`: Daily at 02:00 UTC (purges expired GPS breadcrumbs).
- `/api/jobs/upload-retention`: Daily at 03:00 UTC (purges rejected quarantine uploads).

---

## 5. Post-Deployment Smoke Tests

1. **Readiness Probe:** `curl -i https://petsaathi.com/api/health` — must return HTTP 200 with status `"healthy"`.
2. **Unauthorized Job Guard:** `curl -i https://petsaathi.com/api/jobs/notifications` — must return HTTP 401.
3. **Security Headers:** `curl -I https://petsaathi.com` — verify `x-frame-options: DENY` and CSP headers are present.
