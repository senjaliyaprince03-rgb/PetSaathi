# PetSaathi observability and incident runbook

## Runtime signals

- `/api/health` is the process liveness probe. Alert after 3 consecutive failures over 5 minutes.
- `/api/ready` is the bounded database-readiness probe. Remove an instance from traffic after 2 consecutive failures and escalate after 5 minutes.
- Sentry server, edge and browser SDKs remain disabled unless a DSN is configured.
- Default PII capture is disabled. Request bodies, cookies and headers are removed before events leave the app.
- Production trace sampling is 5% on server, client, and edge; session replay is intentionally disabled on sensitive care surfaces.

## Required Sentry alerts

1. Critical: payment webhook `processing_failed` rate above 1 event in 5 minutes.
2. Critical: any cross-user or authorization exception tagged by security tests.
3. High: incident API 5xx rate above 2% for 10 minutes.
4. High: OTP delivery or verification 5xx rate above 5% for 10 minutes.
5. High: notification outbox final failures above 5 in 15 minutes.
6. High: any notification, tracking-retention, or upload-retention job misses two expected runs.
7. Medium: p95 server transaction duration above 2 seconds for 15 minutes.

## First response

1. Confirm the release SHA, environment and first failing route; do not copy PII into the incident channel.
2. For payment or identity incidents, disable the affected server-side feature flag or provider integration before investigating retries.
3. Check webhook/outbox idempotency records and Sentry breadcrumbs; never replay an event until its provider state is reconciled.
4. If customer or sitter data could be exposed, restrict the route, preserve audit evidence and start the breach assessment process.

## Recovery and closure

1. Roll back the Vercel deployment to the last known-good release when a code regression is confirmed.
2. Re-run health, lint, typecheck, unit, isolated Playwright and provider sandbox smoke paths.
3. Document impact window, affected record IDs only, corrective action and alert improvement in the incident record.
