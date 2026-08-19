# Provider activation runbook

Use this runbook to close the remaining account-side release gates after local code verification has passed. Do not commit provider secrets. Set them only in Vercel, GitHub Secrets, or the local operator shell used for verification.

## One-command verification

```powershell
npm run doctor:providers
```

The command verifies live read access without creating transactions or sending emails:

| Provider | What the doctor checks |
| --- | --- |
| Resend | `RESEND_API_KEY` can read domains, and `RESEND_FROM_EMAIL` belongs to a verified custom domain. |
| Sentry | `SENTRY_AUTH_TOKEN` can read unresolved production issues for `SENTRY_ORG` and `SENTRY_PROJECT`. |
| Razorpay | `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` can read Orders API; `RAZORPAY_WEBHOOK_SECRET` is present. |
| NVIDIA | `NVIDIA_API_KEY` can list available models from `NVIDIA_BASE_URL`. |

## Current blockers observed on 2026-08-12

| Provider | Current result | Required fix |
| --- | --- | --- |
| NVIDIA | Passed; model discovery returned 102 models. | None for text/streaming router. Keep vision/tool-required tasks feature-gated until model fallbacks are selected. |
| Resend | Failed with `API key is invalid`. | Create or rotate a Resend API key, verify a custom sender domain, set `RESEND_API_KEY` and `RESEND_FROM_EMAIL`, then rerun `npm run doctor:providers`. |
| Sentry | Failed with HTTP 403 permission error. | Create a Sentry token with read access to the configured org/project, set `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT`, then rerun the doctor. |
| Razorpay | Failed because configured values are placeholders or missing. | Set Razorpay test or production key ID, key secret, and webhook secret, then rerun the doctor. |

## Production activation order

1. Set MongoDB Atlas, auth, upload, and app URL secrets; run `npm run doctor:production`.
2. Set NVIDIA, Resend, Sentry, and Razorpay secrets; run `npm run doctor:providers`.
3. Deploy a Vercel preview and run `npm run test:e2e` against that preview with provider sandbox keys.
4. Only promote production after both doctor commands, build, integration tests, and E2E are green.

## Secret handling

- Never place real secrets in `.env.example`, docs, screenshots, or logs.
- Rotate any provider key that was pasted into chat, committed, or printed in CI.
- Use separate test, preview, and production credentials for Razorpay, Resend, Sentry, MongoDB Atlas, and NVIDIA.
