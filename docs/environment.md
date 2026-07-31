# PetSaathi environment and deployment contract

Secrets belong in Vercel Environment Variables and GitHub Secrets. They must never be committed or copied into sample files.

## Required for the authenticated core

| Variable | Scope | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | server | Supabase pooled Postgres connection used at runtime |
| `DIRECT_URL` | build/migrations | Direct Postgres connection for Prisma migrations |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | RLS-constrained browser key; never grants service access |
| `SUPABASE_SERVICE_ROLE_KEY` | server | Admin provisioning only; never imported by client modules |
| `NEXT_PUBLIC_APP_URL` | public | Canonical HTTPS origin |

## Required when a capability is enabled

| Variable | Capability |
| --- | --- |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | Orders, capture and signed webhook intake |
| `REQUIRED_SITTER_VERIFICATIONS` | Comma-separated verification type identifiers required for approval |
| `REQUIRED_SITTER_TRAINING_MODULES` | Comma-separated training module slugs required for approval |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Transactional email and verified sender |
| `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_BUSINESS_ACCOUNT_ID` | WhatsApp notifications |
| `CRON_SECRET` | Authenticates notification and retention jobs; Vercel sends it as `Authorization: Bearer <secret>` |
| `SCANNER_CALLBACK_SECRET` | Authenticates malware-scanner verdict callbacks |
| `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` | Error reporting and release source maps; DSNs may be public but auth token remains secret |
| `TRACKING_RETENTION_DAYS` | Location-point retention window; defaults to 30 days |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Consent-aware analytics |
| `NEXT_PUBLIC_MAP_PROVIDER` | `mappls`, `google`, or `disabled` |

## Release sequence

1. Run Prisma migrations through a reviewed CI job using `DIRECT_URL`.
2. Run `npm run check`; deploy a Vercel preview and execute Playwright smoke tests.
3. Promote the immutable build to production, verify `/api/health` (liveness) and `/api/ready` (database readiness), then enable feature flags gradually.

## Scheduled jobs

`vercel.json` registers authenticated `GET` invocations:

| UTC schedule | Route | Responsibility |
| --- | --- | --- |
| Every 5 minutes | `/api/jobs/notifications` | Claims and delivers retryable outbox records |
| 02:15 daily | `/api/jobs/tracking-retention` | Removes location points beyond the configured retention window |
| 03:15 daily | `/api/jobs/upload-retention` | Removes expired private-upload records |

Confirm that the selected Vercel plan supports the required cron frequency before production promotion. Each job fails closed when `CRON_SECRET` is absent or incorrect; never put the secret in the URL.

## Rollback

Re-promote the last known-good Vercel deployment. Database changes must be backward-compatible for at least one release; roll forward with a corrective migration instead of deleting production data. Rotate any secret exposed in logs, invalidate active provider tokens, and open an incident record before service restoration.
