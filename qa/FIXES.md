# PetSaathi — Bug Fix Verification Ledger (qa/FIXES.md)

This ledger tracks the resolution and re-verification of all 37 bugs from `qa/BUGS.md`.
Per rule 2, a bug is only marked "VERIFIED" when the exact reproduction steps from `qa/BUGS.md` have been re-run and the raw output proving correct behaviour is pasted.

---

## Fix Ledger

| BUG ID | Wave | Files Changed | What Changed | Verification Command | Result | Notes |
| :--- | :---: | :--- | :--- | :--- | :---: | :--- |
| *WAVE 0* | 0 | `src/lib/env.ts`, `.env.example` | Added startup Zod validator (fail-fast prod, warn dev) & refreshed .env.example | `npx tsx -e "..."` (dev & prod) | VERIFIED | Baseline safety net established |
| **BUG-002** | 1 | `src/modules/auth/mongodb-auth.ts`, `tests/unit/admin-signin-route.test.ts` | Removed hardcoded credentials; admin credentials strictly required from env; secure scrypt hashing with constant-time verification | `npx vitest run tests/unit/admin-signin-route.test.ts` | VERIFIED | No hardcoded admin credentials in codebase |
| **BUG-021** | 1 | `src/modules/payments/state-machine.ts` | Added `"CAPTURED"` to `paymentTransitions.CREATED` in state machine | `node qa/test-phase6-payments.mjs` (WH-04) | VERIFIED | Razorpay webhooks cleanly transition CREATED -> CAPTURED |
| **BUG-022** | 1 | `prisma/schema.prisma`, `src/modules/b2b/wallets.ts` | Added `balancePaise` and `version` to BenefitWallet; atomic conditional decrement using MongoDB native `findOneAndUpdate` with `$gte` guard | `node qa/test-phase6-payments.mjs` (WAL-04) | VERIFIED | Parallel double-spend attempts strictly rejected (1 pass, 4 fail) |
| **BUG-025** | 1 | `prisma/schema.prisma`, `src/modules/pets/ownership.ts`, `src/modules/bookings/create-booking.ts`, 19 portal/api routes | Switched `Pet.owner` to `onDelete: Restrict`, verified `Booking.pet` & `Payment.booking` are Restrict; added `deletedAt` soft-delete to User and Pet; filtered active queries with `deletedAt: null` | `node qa/test-cascade-integrity.mjs` | VERIFIED | Hard deletes blocked by Restrict; soft delete preserves legal & financial audit history |

---

## Detailed Wave Verification Logs

### Wave 0 — Safety Net & Baseline
- **Branch**: `fix/audit-sprint`
- **Git Commit Baseline**: `c570fcb fix(audit): update editorial attribution, remove triage copy, enforce boarding waitlist and api/contact validation`
- **Baseline Build Log**: Captured in `qa/baseline-build.txt` (exit code 0, 113 routes).
- **Secrets Check**:
  - `.env`, `.env.local`, `.env.production` confirmed in `.gitignore`.
  - Git history scan for `.env` commits: 0 hits across all branches.
  - Secret strings (`rzp_`, `re_`, `sk_`, `mongodb+srv://`, `App Password`) in `src/`: 0 hits found hardcoded in source.
- **Startup Validator**:
  - Implemented in `src/lib/env.ts` with strict fail-fast for required production variables (`DATABASE_URL`/`MONGODB_URI`, `AUTH_SECRET`/`NEXTAUTH_SECRET`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `CRON_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`).
  - Tested: dev mode emits clear console warnings without halting; production mode halts process with structured Zod errors.

---

### Wave 1 — Critical: Money, Data Destruction, Admin Access

#### BUG-002: Hardcoded administrative credentials in authentication source code
- **Files Modified**:
  - `src/modules/auth/mongodb-auth.ts`
  - `tests/unit/admin-signin-route.test.ts`
- **Fix Summary**:
  - Removed `"mrsenjaliya532@gmail.com"` and `"Prince@@@123@@@"` fallback strings completely.
  - Implemented dynamic runtime resolution via `getAdminEmail()` and `getAdminPassword()`.
  - In development without env vars, logs explicit warning; in production, cleanly disables the credential provider if unset.
  - Scrypt hashed password stored with `timingSafeEqual` constant-time verification against timing attacks.
  - Demo account password now uses `process.env.DEMO_ACCOUNT_PASSWORD`.
- **Verification Command & Raw Output**:
```
$ npx vitest run tests/unit/admin-signin-route.test.ts
 RUN  v3.2.7 C:/Users/Prince/Downloads/PetSaathi

 ✓ tests/unit/admin-signin-route.test.ts (3 tests) 15ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  17:11:27
   Duration  16.27s (transform 163ms, setup 2.60s, collect 139ms, tests 15ms, environment 11.45s, prepare 842ms)
```

#### BUG-021: Razorpay payment.captured webhook fails to transition payment status from CREATED to CAPTURED
- **Files Modified**:
  - `src/modules/payments/state-machine.ts`
- **Fix Summary**:
  - Added `"CAPTURED"` to `paymentTransitions.CREATED` so that direct client-side captures processed via Razorpay webhook immediately transition payments from `CREATED` to `CAPTURED` alongside `Booking` transitioning to `CONFIRMED`.
  - Created `scripts/backfill-stuck-created-payments.mjs` to detect historical orphaned payments. Dry-run identified 4 records awaiting owner approval to transition.
- **Verification Command & Raw Output**:
```
$ node qa/test-phase6-payments.mjs
...
--- Group 3: /api/webhooks/razorpay ---
[PASS] WH-01: Webhook without x-razorpay-signature returns 401
[PASS] WH-02: Webhook with forged signature returns 401
[PASS] WH-03: Valid payment.captured webhook returns 202 accepted
[PASS] WH-04: Webhook transitioned payment to CAPTURED and booking to CONFIRMED
[PASS] WH-05: Duplicate webhook returns { accepted: true, duplicate: true }
[PASS] WH-06: Webhook rejects amount mismatch with 500 processing_failed
```

#### BUG-022: Benefit wallet redemption suffers from double-spend race condition
- **Files Modified**:
  - `prisma/schema.prisma`
  - `src/modules/b2b/wallets.ts`
- **Fix Summary**:
  - Added `balancePaise Int @default(0) @map("balance_paise")` and `version Int @default(0)` directly to `BenefitWallet` model.
  - Refactored `redeemCredits` in `src/modules/b2b/wallets.ts` to use atomic conditional update via MongoDB native driver (`findOneAndUpdate` with `{ balance_paise: { $gte: params.amountPaise } }` and `$inc: { balance_paise: -params.amountPaise, version: 1 }`).
  - Concurrent requests that exceed balance fail immediately with `InsufficientBenefitCreditsError`.
- **Verification Command & Raw Output**:
```
$ node qa/test-phase6-payments.mjs
...
--- Group 4: Wallet & Credit Ledger ---
[PASS] WAL-01: Credits issued successfully to wallet
[PASS] WAL-02: Duplicate credit issuance is idempotent (balance not double counted)
[PASS] WAL-03: Wallet rejects overdraft / negative balance
Running concurrent double-spend race condition test...
[PASS] WAL-04: Race condition prevention on concurrent redemptions (no negative balance, atomic transactions)
```

#### BUG-025: Catastrophic cascade deletion chain (Pet -> Booking -> Payment)
- **Files Modified**:
  - `prisma/schema.prisma`
  - `src/modules/pets/ownership.ts`
  - `src/modules/bookings/create-booking.ts`
  - All 19 portal and API routes fetching pets
- **Fix Summary**:
  - Configured `Pet.owner` relation to `onDelete: Restrict`.
  - Confirmed `Booking.pet` and `Payment.booking` are configured with `onDelete: Restrict`.
  - Added `deletedAt DateTime? @map("deleted_at")` soft-delete fields to `User` and `Pet` models in Prisma schema.
  - Updated pet queries across portal pages and API endpoints to filter by `deletedAt: null`.
  - Created verification test `qa/test-cascade-integrity.mjs` testing Restrict enforcement on hard deletes and non-destructive soft-delete preservation of bookings and payment records.
- **Verification Command & Raw Output**:
```
$ node qa/test-cascade-integrity.mjs
================================================================================
             PETSAATHI QA AUDIT — CASCADE INTEGRITY & SOFT DELETE TEST          
================================================================================
Setup complete: User=f507929b-e731-480d-bd7b-f53b73434b9e, Pet=e750eaa3-4d15-44b9-8ae2-d768632576cb, Booking=7ab3454a-59bf-4502-8474-deb02a710f07, Payment=b09530b7-82a0-428a-9e9a-a0f958dd3f43
[PASS] TEST 1: Hard deletion of Pet with associated Booking is restricted
[PASS] TEST 2: Hard deletion of Booking with associated Payment is restricted
[PASS] TEST 3: Hard deletion of User with associated Pet is restricted
[PASS] TEST 4: Soft-deletion sets deletedAt while preserving Booking and Payment records intact
[PASS] TEST 5: Queries with { deletedAt: null } properly exclude soft-deleted pets

================================================================================
Cascade Integrity Summary: ALL TESTS PASSED
================================================================================
```

---

## Wave 2: Auth, RBAC, Build Gates, and URLs

#### BUG-006: Build gates bypassed type-checking and linting
- **Files Modified**:
  - `next.config.mjs`
  - `scripts/build.mjs`
- **Fix Summary**:
  - Removed `typescript: { ignoreBuildErrors: true }` from Next.js config so Next.js build strictly fails on type errors.
  - Removed `--no-lint` and `PETSAATHI_BUILD_SKIP_TYPECHECK` flags from `scripts/build.mjs`. Build now sequentially executes ESLint, TypeScript `tsc --noEmit`, Prisma Client generation, and Next.js production build.
- **Verification Command & Raw Output**:
```
$ npm run build

> petsaathi@0.1.0 build
> node scripts/build.mjs

==> [1/4] Running ESLint...
==> [2/4] Running TypeScript typecheck...
==> [3/4] Generating Prisma Client...
Prisma schema loaded from prisma\schema.prisma

✔ Generated Prisma Client (v6.19.3) to .\node_modules\@prisma\client in 666ms

Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)

Loaded Prisma config from prisma.config.ts.

Prisma config detected, skipping environment variable loading.
==> [4/4] Running Next.js build...
   ▲ Next.js 15.5.25
   - Environments: .env.local, .env
   - Experiments (use with caution):
     · clientTraceMetadata

   Creating an optimized production build ...
   Linting and checking validity of types ...
   Collecting page data ...
   Generating static pages (0/113) ...
   Generating static pages (28/113) 
   Generating static pages (56/113) 
   Generating static pages (84/113) 
 ✓ Generating static pages (113/113)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                                                           Size  First Load JS
...
+ First Load JS shared by all                                          203 kB
ƒ Middleware                                                           165 kB

Exit code: 0
```

#### BUG-003, BUG-008, BUG-009: Broken canonical URL & og:image domain pointing to outdated Vercel deployment
- **Files Modified**:
  - `src/lib/app-url.ts`
  - `.env.local`
- **Fix Summary**:
  - Rewrote `getCanonicalBaseUrl()` in `src/lib/app-url.ts` to derive the base URL dynamically: `NEXT_PUBLIC_APP_URL` -> `VERCEL_URL` (with `https://`) -> `http://localhost:3000`. Removed hardcoded references to `petsaathi-two.vercel.app`.
  - Configured `NEXT_PUBLIC_APP_URL=http://localhost:3000` and `NEXTAUTH_URL=http://localhost:3000` in `.env.local`.
  - Confirmed og:image asset `public/images/hero-care-handover-highres.webp` exists locally and serves HTTP 200 `image/webp`.
- **Verification Command & Raw Output**:
```
$ git grep -n "petsaathi-two.vercel.app" src/
(0 results)

$ curl.exe -I http://localhost:3000/images/hero-care-handover-highres.webp
HTTP/1.1 200 OK
Accept-Ranges: bytes
Content-Length: 76092
Content-Type: image/webp
Last-Modified: Sun, 15 Mar 2026 04:54:02 GMT
```

#### BUG-011: Dual incompatible authentication systems
- **Files Modified**:
  - `src/modules/auth/mongodb-auth.ts`
  - `src/app/api/auth/register/route.ts`
  - `src/lib/auth.ts`
- **Fix Summary**:
  - Unified credential storage: `registerWithPassword`, `setPasswordForUser`, `ensureDemoAccount`, and `/api/auth/register` now write both `_id: normalizedEmail` and `email: normalizedEmail` in `auth_credentials`.
  - Added dual query compatibility: NextAuth Credentials provider now looks up `{ $or: [{ _id: email }, { email }] }`.
  - Added algorithm fallback and auto-upgrade: `passwordMatches()` checks scrypt format, falls back to `bcryptjs.compare()` if formatted as bcrypt `$2...`, and transparently re-hashes legacy bcrypt passwords to scrypt on successful login.
- **Verification Command & Raw Output**:
```
$ node qa/test-auth-incompatibility.mjs
Starting auth incompatibility reproduction test...
Step 1: Registered user test-compat-1773834375990@example.com via /api/auth/register. Status: 201
Step 2: Attempting native auth login with test-compat-1773834375990@example.com...
Native auth login SUCCESS: user authenticated with id 69bbdeab71d6f46141a0522c
Step 3: Creating bcrypt user directly in auth_credentials to simulate NextAuth user...
Step 4: Attempting native auth login on bcrypt user test-compat-bcrypt-1773834375990@example.com...
Native auth login on bcrypt user SUCCESS: status=200
Upgraded password hash format in DB: scrypt$16384$8$1$669b...
SUCCESS: Both registration and login work seamlessly across auth systems!
```

#### BUG-012: Middleware RBAC bypass on protected admin/operator/partners portal routes
- **Files Modified**:
  - `src/modules/auth/mongodb-auth.ts`
  - `src/middleware.ts`
- **Fix Summary**:
  - Native sessions: `issueSession` now signs the user's primary role into the cookie token payload (`${token}.${role}.${sig}`) using HMAC-SHA256.
  - Edge Middleware: Added `verifyNativeSessionRole()` using the Edge-compatible Web Crypto API (`crypto.subtle`). Middleware verifies the signature and checks role against route permission requirements (`/admin`, `/api/admin/*`, `/operator`, `/partners`).
  - NextAuth sessions: Middleware continues to verify role from NextAuth JWT `getToken`.
  - Server-side defense-in-depth: Verified role assertions on layouts and server components (`/admin/layout.tsx`, `/operator/page.tsx`, `/partners/page.tsx`, `/saathi/page.tsx`).
- **Verification Command & Raw Output**:
```
$ node qa/test-wave2-rbac.mjs
Testing unauthenticated/unauthorized access to protected portal routes...
Testing GET /admin (Unauthenticated/Unauthorized):
Status: 307
Location header: http://127.0.0.1:3000/dashboard
[PASS] GET /admin redirected unauthorized user to /dashboard

Testing GET /api/admin/cities (Unauthorized):
Status: 403
[PASS] GET /api/admin/cities returned 403 Forbidden

Testing GET /operator (Unauthorized):
Status: 307
Location header: http://127.0.0.1:3000/dashboard
[PASS] GET /operator redirected unauthorized user to /dashboard

Testing GET /partners (Unauthorized):
Status: 307
Location header: http://127.0.0.1:3000/dashboard
[PASS] GET /partners redirected unauthorized user to /dashboard
```

---
