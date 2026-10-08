# PetSaathi — Final Cloud Handoff & Deferred External Operations Checklist

> **Repository Status**: `LOCAL RELEASE READY` / `CLOUD HANDOFF READY`  
> **Scope**: This runbook contains **only** the external cloud, billing, DNS, and live post-deploy actions that cannot be executed locally without resolving cloud account limits or modifying third-party consoles.

---

## 1. Pre-Handoff Verified Local State

All engineering, security, database-index, RBAC, test, and local disaster-recovery gates have been completed and verified locally:

- **Static Gates**: `npm run lint`, `npm run typecheck`, `npx prisma validate`, and `npm run build` pass with zero errors.
- **Automated Test Suites**:
  - Unit & Invariant Suite: 67/67 files passed
  - Integration Suite: 20/20 files passed (71/71 tests, 0 skipped)
  - Concurrency Suite: 3/3 race-condition suites passed
  - Playwright E2E Suite: 48/48 browser tests passed (0 failed, 0 skipped, 0 flaky)
- **Email / OTP Application Flow**: Verified end-to-end against an isolated disposable database (`petsaathi_otp_rehearsal`) using real Gmail SMTP delivery (`smtp.gmail.com`) and automated IMAP (`imap.gmail.com:993`) 6-digit OTP read-back, including single-use enforcement, 6-attempt lockout, expiry, CRLF rejection, suspended-user rejection, password reset, and fail-closed HTTP `502` behavior when all email providers are disabled.
- **Google OAuth Local Hardening**: Verified signed state + HttpOnly nonce cookie generation (`src/modules/auth/oauth-state.ts`), `/api/auth/google/oauth`, `/api/auth/google/callback`, and `/api/auth/google/signin`, including strict role clamping (`CUSTOMER` | `SITTER` only; `SUPER_ADMIN` / `OPERATIONS_ADMIN` escalation attempts clamped to `CUSTOMER`) and open-redirect sanitization.
- **Local / Synthetic Disaster Recovery Rehearsal**: Verified via `npm run dr:rehearsal:local` (`scripts/verify-local-backup-restore.mjs`) across all 17 launch-critical collections, 5 critical unique/TTL indexes, and Prisma read queries (`status: "PASS"`, `rtoSeconds: 7.75`, `rpoSeconds: 0`, `duplicateIdempotencyGroups: 0`).
- **Production Database Read-Only Index Check**: Verified via `node scripts/verify-booking-indexes.mjs` (`duplicateGroups: 0`, `uniqueIdempotencyIndex: "bookings_idempotency_key_key"`).

---

## 2. Deferred Cloud Owner Actions (Execute in Order)

### Step 1: Clean Up Production Email Provider Environment Variables in Vercel
In the Vercel project settings (**Settings -> Environment Variables**):
- **Option A (Recommended if using Gmail SMTP)**: Set `RESEND_DISABLED=true` (or remove the invalid `RESEND_API_KEY`) and ensure `SMTP_USER` and `SMTP_PASS` are set for Production. `src/lib/email/client.ts` will immediately route OTP and transactional emails through Gmail SMTP without attempting Resend first.
- **Option B (If switching to Resend in production)**: Replace `RESEND_API_KEY` with a valid production key and set `RESEND_FROM_EMAIL` to an address on a verified custom Resend domain (not `@resend.dev`).

### Step 2: Resolve Vercel Fair-Use / Billing Hold & Deploy Final Release Commit
1. Resolve the Vercel deployment rate-limit / billing hold (`api-deployments-free-per-day`) on the Vercel team/account.
2. Deploy the verified `main` branch commit (`FINAL_LOCAL_RELEASE_SHA`) to production:
   ```bash
   npx vercel --prod
   ```
   Or trigger the GitHub Actions workflow `.github/workflows/deploy-production.yml`.

### Step 3: Verify Active Vercel Production SHA & Health Probes
Once the Vercel deployment finishes, verify that the live alias serves the new commit SHA and passes health/readiness probes:
```bash
curl -sS https://petsaathi-Care.vercel.app/api/health
curl -sS https://petsaathi-Care.vercel.app/api/readiness
npm run doctor:production
```

### Step 4: Verify Google Cloud Console OAuth Redirect URIs & Live Browser Round-Trip
1. Open **Google Cloud Console -> APIs & Services -> Credentials** and select the OAuth 2.0 Client ID matching `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
2. Verify **Authorized JavaScript origins** include:
   - `https://petsaathi-Care.vercel.app`
   - `https://petsaathi.in`
3. Verify **Authorized redirect URIs** include:
   - `https://petsaathi-Care.vercel.app/api/auth/google/callback`
   - `https://petsaathi.in/api/auth/google/callback`
4. Complete one live browser Google sign-in round-trip on the production URL and confirm session cookie creation and `/dashboard` redirect.

### Step 5: Execute Live Production Email / OTP Smoke Test
1. Trigger a signup or login OTP request on the deployed production URL.
2. Verify the 6-digit OTP arrives in the recipient inbox and completes `/api/auth/email/verify` -> `/dashboard`.

### Step 6: Upgrade MongoDB Atlas Tier & Execute Cloud Snapshot / PITR Restore Drill
1. Upgrade the production MongoDB Atlas cluster (`cluster0.on80adu.mongodb.net`) from M0/Shared to **M10+** (or enable Continuous Cloud Backups).
2. Follow Section B of `docs/ops/BACKUP_RESTORE.md` to restore a snapshot into an isolated staging cluster (`PetSaathi-Restored-Staging`) and run:
   ```bash
   MONGODB_URI="$STAGING_RESTORE_URI" node scripts/verify-booking-indexes.mjs
   ```

### Step 7: Custom Domain (`petsaathi.in`) DNS Cutover
1. At the domain registrar / DNS provider for `petsaathi.in`, replace the legacy LiteSpeed parking `A`/`CNAME` records with Vercel's domain records (`76.76.21.21` for apex `petsaathi.in`, `cname.vercel-dns.com` for `www.petsaathi.in`).
2. Once Vercel TLS provisioning completes for `https://petsaathi.in`, update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` in Vercel Production Environment Variables to `https://petsaathi.in` and redeploy.
