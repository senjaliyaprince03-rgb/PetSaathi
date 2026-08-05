# PetSaathi environment and deployment contract

Secrets belong in Vercel Environment Variables and GitHub Secrets. They must never be committed or copied into sample files.

## Required for the authenticated core

| Variable | Scope | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | server | MongoDB Atlas connection string including the application database path |
| `MONGODB_DATABASE` | server | Explicit database name; required when the URI does not include one |
| `AUTH_SECRET` | server | At least 32 random characters used to protect OTP challenges and sessions |
| `UPLOAD_SIGNING_SECRET` | server | At least 32 random characters used for short-lived GridFS upload tokens |
| `NEXT_PUBLIC_APP_URL` | public | Canonical HTTPS origin |

Use a dedicated Atlas database user with `readWrite` access to only the PetSaathi database. Store the password only in deployment secret stores, enable Atlas backups, and restrict network access to approved deployment egress addresses wherever the hosting plan supports fixed egress.

## Required when a capability is enabled

| Variable | Capability |
| --- | --- |
| `AUTH_SESSION_DAYS` | Session lifetime from 1 to 90 days; defaults to 30 |
| `AUTH_DEV_FIXED_OTP` | Development-only six-digit OTP; ignored in production and never set in deployed environments |
| `SMS_OTP_WEBHOOK_URL`, `SMS_OTP_WEBHOOK_SECRET` | Server-to-server SMS delivery adapter for phone OTP |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | Orders, capture and signed webhook intake |
| `REQUIRED_SITTER_VERIFICATIONS` | Comma-separated verification type identifiers required for approval |
| `REQUIRED_SITTER_TRAINING_MODULES` | Comma-separated training module slugs required for approval |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Transactional email and email OTP delivery |
| `RESEND_REQUEST_TIMEOUT_MS` | Bounded Resend request timeout from 1,000 to 30,000 ms; defaults to 8,000 ms |
| `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_BUSINESS_ACCOUNT_ID` | WhatsApp notifications |
| `CRON_SECRET` | Authenticates notification and retention jobs; Vercel sends it as `Authorization: Bearer <secret>` |
| `SCANNER_CALLBACK_SECRET` | Authenticates malware-scanner verdict callbacks |
| `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` | Error reporting and release source maps; DSNs may be public but auth token remains secret |
| `TRACKING_RETENTION_DAYS` | Location-point retention window; defaults to 30 days |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Consent-aware analytics |
| `NEXT_PUBLIC_MAP_PROVIDER` | `mappls`, `google`, `openstreetmap`, `mapbox`, or `disabled` |

## Release sequence

1. Run `npm run doctor` locally and `npm run doctor:production` against deployment secrets.
2. Create or update Atlas indexes with `npm run prisma:push` from a reviewed CI job.
3. Run `npm run check`; deploy a Vercel preview and execute Playwright smoke tests.
4. Promote the immutable build to production, verify `/api/health` and `/api/ready`, then enable feature flags gradually.

MongoDB Atlas supplies the replica set required by Prisma transactions. Local and CI integration tests use the disposable replica-set service in `docker-compose.test.yml`.

## Scheduled jobs

| UTC schedule | Route | Responsibility |
| --- | --- | --- |
| Every 5 minutes | `/api/jobs/notifications` | Claims and delivers retryable outbox records |
| 02:15 daily | `/api/jobs/tracking-retention` | Removes location points beyond the configured retention window |
| 03:15 daily | `/api/jobs/upload-retention` | Removes expired GridFS quarantine objects |

Each job fails closed when `CRON_SECRET` is absent or incorrect; never put the secret in the URL.

## Rollback

Re-promote the last known-good Vercel deployment and restore an Atlas point-in-time snapshot into a new database. Validate the restored database with `/api/ready` and smoke tests before changing `MONGODB_URI`. Never overwrite the current production database during rollback. Rotate any secret exposed in logs and invalidate active sessions.
