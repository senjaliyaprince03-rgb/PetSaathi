# PetSaathi QA & Security Audit Bug Tracker

This file maintains the running ledger of all bugs identified during the multi-phase audit. Bugs are never deleted or renumbered.

---

## Executive Summary

| Severity | Count | Description |
| :--- | :--- | :--- |
| **CRITICAL** | **4** | Immediate security compromises, financial loss / double-spend, payment reconciliation breakdown, or catastrophic data destruction. |
| **HIGH** | **15** | Broken core workflows, exposed secrets, auth incompatibilities, severe performance degradations (50 unindexed queries), and legal non-compliance. |
| **MEDIUM** | **14** | Functional edge-case failures, unhandled exceptions, timezone day-boundary shifts, form state loss, and missing accessibility attributes. |
| **LOW** | **4** | Redundant SEO title suffixes, duplicate parameterized metadata, and CSP configuration hardening opportunities. |
| **TOTAL** | **37** | Total verified bugs backed by concrete test evidence. |

### Top 10 Worst Bugs

| Rank | ID | Severity | Area | Title | 1-Line Business Impact |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | **BUG-002** | **CRITICAL** | Auth | Hardcoded administrative credentials in authentication source code | Anyone with codebase access can log into staging/dev as root super admin. |
| **2** | **BUG-021** | **CRITICAL** | Payments | Razorpay `payment.captured` webhook fails to transition status to `CAPTURED` | All webhook-captured payments stick in `CREATED`; refunds and payouts fail. |
| **3** | **BUG-022** | **CRITICAL** | Wallet | Benefit wallet redemption suffers from double-spend race condition | Concurrent redemptions spend multiples of available credit, causing cash loss. |
| **4** | **BUG-025** | **CRITICAL** | Database | Catastrophic cascade deletion chain (`Pet` -> `Booking` -> `Payment`) | Deleting a pet permanently deletes historical financial and legal payment records. |
| **5** | **BUG-011** | **HIGH** | Auth | Incompatible dual authentication subsystems break login | Users registered via bcrypt cannot log in via password form, and NextAuth breaks. |
| **6** | **BUG-012** | **HIGH** | Security | Edge middleware RBAC bypassed for native `petsaathi_session` cookie | Non-admin users with native cookies bypass edge firewall to internal handlers. |
| **7** | **BUG-004** | **HIGH** | Security | Live production credentials stored unencrypted in local `.env` file | Workstation leak compromises live MongoDB, Gmail SMTP, Resend, and Upstash. |
| **8** | **BUG-024** | **HIGH** | Payments | Refund API executes 100% full refunds unconditionally | Customers can cancel 1 minute prior and get 100% refund; sitters are left unpaid. |
| **9** | **BUG-023** | **HIGH** | Wallet | Customer wallet UI renders fake mock balance of ₹2,450.00 for empty wallets | Misleads new customers into believing they have ₹2,450 in free care credits. |
| **10** | **BUG-036** | **HIGH** | Booking | Simultaneous double-click submissions create duplicate bookings | Double-clicking booking submission creates two distinct bookings and double charges. |

---

## Phase 0: Environment & Inventory Findings

ID: BUG-001
Title: Production dependencies contain 8 vulnerabilities (5 High, 3 Moderate) including nodemailer SMTP command injection and arbitrary SSRF
Severity: HIGH
Area: security
Location: package.json / package-lock.json
Steps to reproduce:
1. Run `npm audit --omit=dev` in project root.
Expected: Zero vulnerabilities in production dependency tree.
Actual: 8 vulnerabilities reported (5 high, 3 moderate) in nodemailer, deepmerge-ts, and uuid.
Evidence:
```
# npm audit report

deepmerge-ts  <8.0.0
Severity: high
DeepmergeTS has stack exhaustion when merging recursive object graphs - https://github.com/advisories/GHSA-ggr8-5vv4-36mx

nodemailer  <=9.1.0
Severity: high
Nodemailer has SMTP command injection due to unsanitized `envelope.size` parameter - https://github.com/advisories/GHSA-c7w3-x93f-qmm8
Nodemailer: Message-level raw option bypasses disableFileAccess/disableUrlAccess, enabling arbitrary file read and full-response SSRF in the delivered message - https://github.com/advisories/GHSA-p6gq-j5cr-w38f

8 vulnerabilities (3 moderate, 5 high)
```
Impact: An attacker interacting with email dispatch or deep object merging could potentially exploit known CVEs in nodemailer or trigger denial of service via deepmerge-ts.
Suggested fix: Upgrade nodemailer and resolve nested dependencies or run `npm audit fix` while locking compatible peer dependencies.

---

ID: BUG-002
Title: Hardcoded administrative credentials ("mrsenjaliya532@gmail.com" and "Prince@@@123@@@") in authentication source code
Severity: CRITICAL
Area: auth
Location: src/modules/auth/mongodb-auth.ts:402-403, 427, 494
Steps to reproduce:
1. Inspect `src/modules/auth/mongodb-auth.ts` lines 402-427.
2. In non-production environments (`NODE_ENV !== "production"`), authenticate against the admin auth provider using `mrsenjaliya532@gmail.com` and `Prince@@@123@@@`.
Expected: Administrative credentials must never be hardcoded in repository source files under any condition.
Actual: `ADMIN_EMAIL` defaults to `"mrsenjaliya532@gmail.com"` and `ADMIN_PASSWORD` defaults to `"Prince@@@123@@@"`.
Evidence:
```typescript
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "mrsenjaliya532@gmail.com").trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "Prince@@@123@@@");
...
const password = ADMIN_PASSWORD || "Prince@@@123@@@";
```
Impact: Anyone reading the source code can identify the administrator email and obtain default administrative credentials in staging/development deployments.
Suggested fix: Require `ADMIN_EMAIL` and `ADMIN_PASSWORD` to be explicitly loaded from secure runtime secrets with no hardcoded fallback strings.

---

ID: BUG-003
Title: Conflicting and incorrect NEXT_PUBLIC_APP_URL configurations across .env and .env.local
Severity: HIGH
Area: config
Location: .env:69, .env.local:2
Steps to reproduce:
1. Inspect `.env.local` line 2: `NEXT_PUBLIC_APP_URL=https://petsaathi.vercel.app`.
2. Inspect `.env` line 69: `NEXT_PUBLIC_APP_URL="https://petsaathi-blue.vercel.app"`.
3. Compare with active deployment: `https://petsaathi-two.vercel.app` or local `http://localhost:3000`.
Expected: `NEXT_PUBLIC_APP_URL` should consistently represent the active canonical base URL (`http://localhost:3000` for local dev, and the exact production domain in production).
Actual: Local development environments and build systems inherit stale external domains (`petsaathi.vercel.app` and `petsaathi-blue.vercel.app`), causing canonical tags, OpenGraph URLs, and metadata to link to incorrect deployments.
Evidence:
```
.env.local:2: NEXT_PUBLIC_APP_URL=https://petsaathi.vercel.app
.env:69: NEXT_PUBLIC_APP_URL="https://petsaathi-blue.vercel.app"
```
Impact: Search engines index wrong canonical URLs and auth callbacks/email links point to incorrect or defunct deployments.
Suggested fix: Set `NEXT_PUBLIC_APP_URL="http://localhost:3000"` in `.env.local` and configure `https://petsaathi-two.vercel.app` (or custom domain) in production Vercel environment settings.

---

ID: BUG-004
Title: Sensitive production credentials and tokens stored unencrypted in local .env file
Severity: HIGH
Area: security
Location: .env:49-85
Steps to reproduce:
1. Inspect `.env` file on local workstation.
Expected: Production credentials (database connection strings with embedded passwords, email SMTP passwords, API secrets) should only exist in production secret managers, not on local disk in plaintext.
Actual: Live/active credentials for Gmail SMTP (`mrsenjaliya532@gmail.com` with App Password `vmvi unxs qcos uqrc`), MongoDB Atlas with username and password, NVIDIA API key, Resend API key, Upstash Redis token, and Sentry Auth Token are saved in plaintext.
Evidence:
```
SMTP_USER="mrsenjaliya532@gmail.com"
SMTP_PASS="vmvi unxs qcos uqrc"
MONGODB_URI="mongodb+srv://bhavnabensenjaliya6_db_user:XZCPuwDUHN9KF0rY@cluster0.on80adu.mongodb.net/petsaathi?retryWrites=true&w=majority"
RESEND_API_KEY="re_QBeCAabX_6rzMurTgjt1GMf6u6kqjfw2m"
```
Impact: Workstation compromise or accidental inclusion in build artifacts/backups exposes primary database, email sending channels, and cloud cache.
Suggested fix: Rotate all exposed keys immediately and use dedicated test credentials for local development.

---

ID: BUG-005
Title: 47 referenced environment variables missing from local environment configuration
Severity: MEDIUM
Area: config
Location: Multiple source files (see Phase 0 inventory)
Steps to reproduce:
1. Run `node qa/check-env.mjs`.
2. Inspect modules referencing `CLEARTAX_API_KEY`, `CLAMAV_INTERNAL_SECRET`, `MYGATE_API_KEY`, `SMS_OTP_WEBHOOK_URL`, `DIGILOCKER_CLIENT_ID`.
Expected: All external service integrations must either have mocked fallbacks or be declared in `.env.example` / `.env.local`.
Actual: 47 variables referenced in `src/` are undefined in `.env` and `.env.local`, including integration keys that throw or fail silently when invoked.
Evidence:
```
- CLEARTAX_API_KEY (in .env.example: false) -> used in src/lib/einvoice.ts
- CLAMAV_HOST (in .env.example: false) -> used in src/app/api/webhooks/scanner/route.ts
- MYGATE_API_KEY (in .env.example: false) -> used in src/modules/integrations/mygate-adapter.ts
- SMS_OTP_WEBHOOK_URL (in .env.example: true) -> used in src/modules/notifications/providers.ts
```
Impact: Invoking enterprise invoice generation, virus scanning webhooks, MyGate society integration, or SMS OTP fallback triggers unhandled exceptions or failed promises.
Suggested fix: Add mock modes or document required fallbacks for all integration endpoints in `.env.example` and validate them gracefully on startup.

---

## Phase 1: Static Quality Gates Findings

ID: BUG-006
Title: next.config.mjs configures ignoreBuildErrors via PETSAATHI_BUILD_SKIP_TYPECHECK and scripts/build.mjs invokes next build with --no-lint
Severity: HIGH
Area: build
Location: next.config.mjs:26-28, scripts/build.mjs:56-63
Steps to reproduce:
1. Inspect `next.config.mjs` lines 26-28.
2. Inspect `scripts/build.mjs` lines 56-63.
Expected: Next.js native build pipeline should enforce TypeScript type checking and ESLint linting unconditionally during bundling (`next build`), without bypassing build flags or setting `ignoreBuildErrors`.
Actual: `next.config.mjs` dynamically sets `typescript.ignoreBuildErrors: process.env.PETSAATHI_BUILD_SKIP_TYPECHECK === "1"`, and `scripts/build.mjs` sets `PETSAATHI_BUILD_SKIP_TYPECHECK = "1"` and executes `next build --no-lint`.
Evidence:
```javascript
// next.config.mjs lines 26-28
typescript: {
  ignoreBuildErrors: process.env.PETSAATHI_BUILD_SKIP_TYPECHECK === "1",
},
```
```javascript
// scripts/build.mjs lines 56-63
process.env.PETSAATHI_BUILD_SKIP_TYPECHECK = "1";

console.log("==> [4/4] Running Next.js build...");
run(process.execPath, [
  path.join(projectRoot, "node_modules/next/dist/bin/next"),
  "build",
  "--no-lint",
]);
```
Impact: If `next build` is executed directly in environments or CI pipelines where `PETSAATHI_BUILD_SKIP_TYPECHECK=1` is set, compilation errors in page or API components can be silently packaged and deployed into production bundles.
Suggested fix: Remove `typescript.ignoreBuildErrors` from `next.config.mjs` and remove `--no-lint` from `next build` invocations so Next.js type checking and linting run as un-bypassable quality gates.

---

## Phase 2: Server Boot & Crawl Findings

ID: BUG-007
Title: Doubled title suffix "| PetSaathi | PetSaathi" generated on /contact, /book, and /login
Severity: LOW
Area: seo
Location: src/app/layout.tsx:28, src/app/contact/page.tsx:8, src/app/book/page.tsx:17, src/app/login/page.tsx:9
Steps to reproduce:
1. Start dev server and fetch `http://localhost:3000/contact` or `http://localhost:3000/book`.
2. Inspect the rendered `<title>` tag in HTML.
Expected: Title should have a single brand suffix, e.g., `<title>Contact Care Concierge | PetSaathi</title>`.
Actual: Root layout applies `title.template: "%s | PetSaathi"` while child page metadata defines `title: "Contact Care Concierge | PetSaathi"`, rendering `<title>Contact Care Concierge | PetSaathi | PetSaathi</title>`.
Evidence:
```html
<title>Contact Care Concierge | PetSaathi | PetSaathi</title>
<title>Book Doorstep Pet Care | PetSaathi | PetSaathi</title>
<title>Parent &amp; Saathi Sign In | PetSaathi | PetSaathi</title>
```
Impact: Degrades SEO appearance in Google SERPs with redundant brand names.
Suggested fix: In child pages, omit `| PetSaathi` from the `title` string and rely on the root layout template.

---

ID: BUG-008
Title: Canonical URLs point to stale/foreign domain "https://petsaathi.vercel.app" instead of localhost or active deployment
Severity: HIGH
Area: seo
Location: .env.local:2, src/lib/app-url.ts:7-14
Steps to reproduce:
1. Crawl any public route (e.g. `http://localhost:3000/services/dog-walking`).
2. Inspect `<link rel="canonical" href="...">`.
Expected: In development, canonical should point to `http://localhost:3000` or omit domain; in production, to the canonical production domain.
Actual: Canonical points to `https://petsaathi.vercel.app/services/dog-walking`.
Evidence:
```html
<link rel="canonical" href="https://petsaathi.vercel.app/services/dog-walking"/>
<link rel="canonical" href="https://petsaathi.vercel.app/cities/ahmedabad"/>
```
Impact: Search engines treat the pages as duplicates and attribute page ranking to an obsolete domain.
Suggested fix: Make canonical resolution strictly reflect the configured canonical host, or fallback to the request Host header if `NEXT_PUBLIC_APP_URL` is unset.

---

ID: BUG-009
Title: OpenGraph og:image tags point to external URL returning text/html instead of image binary
Severity: HIGH
Area: seo
Location: .env.local:2, public metadata across src/app/**/*.tsx
Steps to reproduce:
1. Inspect `og:image` on `http://localhost:3000/`: `https://petsaathi.vercel.app/images/hero-care-handover-highres.webp`.
2. Send HTTP HEAD request to that URL: `curl -I https://petsaathi.vercel.app/images/hero-care-handover-highres.webp`.
Expected: Response must return HTTP 200 with `Content-Type: image/webp` or `image/png`.
Actual: Response returns `Content-Type: text/html; charset=utf-8` (404/redirect SPA page).
Evidence:
```
HTTP/1.1 200 OK
Content-Length: 1285
Content-Type: text/html; charset=utf-8
Server: Vercel
```
Impact: All social media platforms (WhatsApp, Twitter/X, Facebook, LinkedIn, iMessage) fail to render preview cards when links to PetSaathi are shared.
Suggested fix: Use relative image paths or resolve og:image against the verified live domain where assets exist.

---

ID: BUG-010
Title: Query-parameterized pages share identical titles resulting in duplicate metadata
Severity: LOW
Area: seo
Location: src/app/contact/page.tsx, src/app/book/page.tsx
Steps to reproduce:
1. Request `http://localhost:3000/contact?topic=SOCIETY` and `http://localhost:3000/contact?topic=BOARDING_PILOT`.
2. Inspect title and description.
Expected: Distinct topics and prefilled services have customized titles and meta descriptions (or canonicalize cleanly to the base page).
Actual: 4 contact URLs and 8 booking URLs share identical page titles.
Evidence:
```
Title: "Contact Care Concierge | PetSaathi | PetSaathi" (4 pages)
Title: "Book Doorstep Pet Care | PetSaathi | PetSaathi" (8 pages)
```
Impact: Search engines flag duplicate page titles across parameterized URLs.
Suggested fix: Dynamically compute metadata from `searchParams` or specify canonical tags pointing to the base path without parameters.

---

## Phase 3: API Security & Contract Testing Findings

- Evaluated all 184 API routes in `src/app/api/**`.
- Unauthenticated requests to protected endpoints (`/api/admin/*`, `/api/saathi/*`, `/api/customer/*`, `/api/bookings/*`, `/api/pets/*`) consistently return HTTP 401 Unauthorized or HTTP 403 Forbidden with zero protected data leakage.
- Webhook signature verification: `POST /api/webhooks/razorpay` without `x-razorpay-signature` returns HTTP 401 `{"error":"invalid_signature"}`. Requests with forged signatures are rejected with HTTP 401.
- Cron authentication: `POST /api/cron/expire-employees` rejects unauthenticated and invalid secret requests with HTTP 403.
- Rate limiting: High-frequency requests trigger HTTP 429 (verified with 25 rapid requests against `/api/contact` yielding 16 throttled responses, and `/api/auth/otp/request` yielding 25 throttled responses).
- Upload restrictions: `/api/uploads/sign` enforces strict Zod schema validation requiring `mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "application/pdf"])` and requires `SAFETY_ADMIN`, `OPERATIONS_ADMIN`, or `SUPER_ADMIN` roles. Executable or SVG uploads are rejected.
- IDOR audit: Detailed inspection of parameter routes (`/api/bookings/[id]/*`, `/api/pets/[id]/*`, `/api/saathi/assignments/[id]/*`) confirmed that all queries strictly join on `customerId: identity.id`, `ownerId: identity.id`, or `sitter: { userId: identity.id }`. No IDOR vulnerabilities found.

---

## Phase 4: Auth & Session Findings

ID: BUG-011
Title: Incompatible dual authentication subsystems break login between /api/auth/register and /api/auth/password/signin
Severity: HIGH
Area: auth
Location: src/app/api/auth/register/route.ts:33-72, src/modules/auth/mongodb-auth.ts:642-648, src/lib/auth.ts:34-48
Steps to reproduce:
1. Register a user via `POST /api/auth/register` with email and password.
2. Attempt to sign in via `POST /api/auth/password/signin` with the same credentials.
3. Register a user via `POST /api/auth/password/signup` with email and password.
4. Attempt to sign in via NextAuth credentials callback `POST /api/auth/callback/credentials`.
Expected: Both registration endpoints create compatible credentials and allow successful authentication across all sign-in pathways.
Actual: `POST /api/auth/register` hashes passwords with `bcryptjs` and stores `{ email, passwordHash, ... }`. `signInWithPassword` in `mongodb-auth.ts` parses credentials using `encoded.split(":")` expecting scrypt format (`scrypt:<salt>:<hex>`) and fails with HTTP 401. Conversely, `mongodb-auth.ts` inserts documents with `_id: email` without an `email` field, causing NextAuth's `authOptions` query `findOne({ email })` to return `null` and fail with HTTP 401.
Evidence:
```
Testing auth subsystem incompatibilities via HTTP...
1. /api/auth/register status: 201 {
  message: 'User registered successfully',
  userId: '7f5053a5-7060-43fd-b444-de6c47ce9f51'
}
2. /api/auth/password/signin status for bcrypt-registered user: 401 {
  error: 'invalid_credentials',
  message: 'Incorrect email or password.'
}
3. /api/auth/password/signup status: 201 { created: true, requiresVerification: true, developmentOtp: '123456' }
4. NextAuth credentials callback status for scrypt-registered user: 401 Location: null
```
Impact: Users who register through `/api/auth/register` cannot sign in through the password sign-in form, and users who register through `/api/auth/password/signup` cannot sign in via NextAuth sessions.
Suggested fix: Unify the authentication credential storage and verification routines. Standardize on one hashing strategy (or support fallback passwordMatches for bcrypt hashes) and ensure credential documents store both `_id: email` and `email: email`.

---

ID: BUG-012
Title: Edge middleware RBAC evaluation bypassed for native petsaathi_session cookie
Severity: HIGH
Area: security
Location: src/middleware.ts:186-235
Steps to reproduce:
1. Sign in as a `CUSTOMER` using native session (`POST /api/auth/email/verify` or `POST /api/auth/password/signin`) to obtain a `petsaathi_session` cookie.
2. Make a request to `/admin` or `/api/admin/cities` with the `petsaathi_session` cookie.
Expected: Edge middleware enforces RBAC, detecting that `CUSTOMER` lacks administrative roles and immediately redirecting to `/dashboard` or returning HTTP 403.
Actual: Middleware checks `token = await getToken({ req, secret })` which only resolves NextAuth JWT tokens (`next-auth.session-token`). For native sessions, `token` is `null`, so the entire RBAC block (`if (token) { ... }`) is skipped, allowing non-admin requests past the edge firewall into internal route handlers.
Evidence:
```typescript
// src/middleware.ts lines 188-193
const secret = getAuthSecret();
const token = await getToken({ req: request as any, secret });

if (token) {
  const userRole = token.role as string;
  const path = request.nextUrl.pathname;
  ...
```
```
GET /admin 200 (Middleware allows request; reached server layout)
GET /api/admin/cities (Middleware allows request; reached route handler)
```
Impact: Non-admin users with native session cookies bypass the edge proxy firewall. Defense-in-depth is degraded, forcing inner application code to act as the sole boundary.
Suggested fix: Decode native session tokens or sign lightweight role claims into edge-verifiable tokens (or synchronize NextAuth session cookies with native sessions) so `middleware.ts` enforces role restrictions for all authentication mechanisms.

---

ID: BUG-013
Title: Unauthenticated navigation redirects (307) lack Cache-Control: no-store header
Severity: MEDIUM
Area: security
Location: src/middleware.ts:172-183
Steps to reproduce:
1. Issue an unauthenticated `GET /admin` or `GET /dashboard` request with `redirect: "manual"`.
2. Inspect response headers for `Cache-Control` and `Pragma`.
Expected: All redirect responses for protected routes must include `Cache-Control: no-store, no-cache, must-revalidate` to prevent intermediary proxy or browser history caching.
Actual: `NextResponse.redirect(loginUrl)` is returned without `Cache-Control` headers (`cache-control: null`).
Evidence:
```
[FAIL] AUTH-NAV--admin: Unauthenticated /admin redirects to /login with no-store cache headers
   Details: {
  "status": 307,
  "location": "http://localhost:3000/login?returnTo=%2Fadmin",
  "cacheControl": null,
  "pragma": null
}
```
Impact: Browsers or intermediate HTTP caches may cache the 307 redirect, causing authenticated users using the "Back" button to see stale redirect loops or cached unauthorized states.
Suggested fix: Add `redirected.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")` in `src/middleware.ts` before returning `redirected`.

---

ID: BUG-014
Title: Admin API route handlers throw unhandled Error("Forbidden") resulting in HTTP 500 instead of HTTP 403
Severity: MEDIUM
Area: auth
Location: src/modules/auth/server.ts:15, src/app/api/admin/cities/route.ts:40, 60-62
Steps to reproduce:
1. Authenticate with a non-admin session cookie (`CUSTOMER`).
2. Make a `GET` request to `http://localhost:3000/api/admin/cities`.
Expected: Response returns HTTP 403 Forbidden with `{ "error": "forbidden" }`.
Actual: `getAdminSession()` throws generic `new Error("Forbidden")`, which the route handler catches in a generic `catch (error)` block and returns HTTP 500 `{ "error": "Internal server error" }`.
Evidence:
```
City listing error: Error: Forbidden
    at getAdminSession (src\modules\auth\server.ts:15:11)
    at async GET (src\app\api\admin\cities\route.ts:40:21)
  13 |
  14 |   if (!isAdmin) {
> 15 |     throw new Error("Forbidden");
     |           ^
  16 |   }
  17 |
  18 |   return identity.id;
 GET /api/admin/cities 500 in 1227ms
```
Impact: Generates false-positive 500 error alerts in Sentry/monitoring dashboards and obscures authorization failures as infrastructure crashes.
Suggested fix: Throw typed authorization errors (e.g. `ApiError.forbidden()`) or catch `Error("Forbidden")` explicitly to return HTTP 403.

---

ID: BUG-015
Title: Password sign-in endpoint lacks account-level rate limiting or lockout
Severity: MEDIUM
Area: security
Location: src/app/api/auth/password/signin/route.ts:26
Steps to reproduce:
1. Inspect `src/app/api/auth/password/signin/route.ts` line 26.
2. Note that rate limiting is strictly bounded by client IP (`consumeRateLimit("password-signin-ip", requestIp(request), 10, 15 * 60_000)`).
Expected: Authentication endpoints should enforce rate limiting or lockout per target account/email in addition to IP rate limiting, preventing distributed brute-force attacks.
Actual: No email-level rate limiting exists. An attacker distributing requests across multiple IP addresses or proxies can submit unlimited credential guesses against any targeted email without triggering lockout.
Evidence:
```typescript
// src/app/api/auth/password/signin/route.ts line 26
const rate = await consumeRateLimit("password-signin-ip", requestIp(request), 10, 15 * 60_000);
if (!rate.allowed) {
  return jsonError("too_many_attempts", "Too many sign-in attempts. Please wait a few minutes and try again.", 429, {
    headers: { "Retry-After": String(rate.retryAfterSeconds) },
  });
}
```
Impact: Vulnerability to distributed credential-stuffing and password brute-force attacks against customer and caregiver accounts.
Suggested fix: Add `consumeRateLimit("password-signin-email", parsed.data.email, 5, 15 * 60_000)` alongside IP rate limiting.

---

## Phase 5: Booking Flow End-to-End Findings

ID: BUG-016
Title: Unauthenticated booking wizard accepts past dates, 3 AM time slots, unbounded pet names, and unserviceable localities without validation
Severity: MEDIUM
Area: booking
Location: src/components/booking/booking-wizard.tsx:184-210
Steps to reproduce:
1. Open `http://localhost:3000/book` while logged out.
2. Advance through wizard steps:
   - Step 1 (Pet name): Enter 200+ characters with emoji/unicode (`🐶 Bruno મોતી मोती A...`).
   - Step 2 (Schedule): Enter past date (`2020-01-01`), overnight 3 AM time (`03:00`), and non-existent locality (`Invalid Locality Non-Pilot Mars Colony`).
   - Step 3 (Contact): Enter phone and name.
3. Click "Review request".
Expected: Wizard client validation should reject past dates, out-of-service hours (e.g. 3 AM walks), unreasonable pet names (>50 chars), and validate against supported pilot localities before progressing.
Actual: Wizard accepts all invalid values without client-side error or validation guards, presenting a completion card indicating "Your care request is ready."
Evidence:
```
// Playwright test execution in tests/e2e/qa-phase5-booking.spec.ts:
- Date input filled with '2020-01-01' -> Allowed
- Time input filled with '03:00' -> Allowed
- Pet name filled with 200 chars -> Allowed
- Locality filled with 'Invalid Locality Non-Pilot Mars Colony' -> Allowed
- Screenshot saved: qa/artifacts/p5-wizard-submitted.png
```
Impact: Degrades user experience; users complete multi-step forms expecting a booking only to be hit with rejection or confusion downstream.
Suggested fix: Add `min` attribute to date picker (`today`), enforce service window constraints (e.g., 06:00 - 21:00), max length on name fields, and check locality/postal code availability against active service areas.

---

ID: BUG-017
Title: Unauthenticated booking wizard discards all form state and redirects to /login?returnTo=/book with zero state preservation
Severity: MEDIUM
Area: booking
Location: src/components/booking/booking-wizard.tsx:320-335
Steps to reproduce:
1. Complete all steps in the unauthenticated booking wizard (`/book`).
2. On the final step, click "Sign in to confirm booking" or the redirect CTA.
3. Observe redirect to `/login?returnTo=/book`.
4. Sign in as a customer.
Expected: Form inputs (selected service, pet details, scheduled time, customer notes) should be persisted in sessionStorage or local storage and automatically restored into the authenticated booking flow.
Actual: Entire form state is held only in React component state (`useState`). Upon navigating to `/login`, all entered pet info, schedule, notes, and preferences are permanently lost. After login, user is returned to `/book` with a blank form.
Evidence:
```typescript
// src/components/booking/booking-wizard.tsx lines 320-335:
// State is held in plain useState() with no localStorage/sessionStorage sync:
const [step, setStep] = useState<Step>(0);
const [service, setService] = useState<ServiceType>("dog_walking");
const [petName, setPetName] = useState("");
const [date, setDate] = useState("");
const [notes, setNotes] = useState("");
// Link routes to /login?returnTo=/book discarding all wizard state
```
Impact: Severe booking drop-off / conversion friction; customers are forced to re-enter all details from scratch after authenticating.
Suggested fix: Persist wizard state in `sessionStorage` (or a secure transient cookie/URL params) and hydrate the authenticated form upon return.

---

ID: BUG-018
Title: Free-text booking input fields store unescaped raw HTML/XSS payload strings in database
Severity: MEDIUM
Area: booking
Location: src/modules/bookings/create-booking.ts:140-150, src/components/booking/authenticated-booking-form.tsx:120
Steps to reproduce:
1. In authenticated booking form (`/book`), enter notes containing `<script>alert(1)</script>` or HTML formatting.
2. Submit the booking request.
3. Query the database record in MongoDB for `Booking.customerNotes`.
Expected: User-supplied notes should be sanitized, stripped of executable tags, or properly encoded before storage.
Actual: Raw unescaped strings are persisted directly into MongoDB.
Evidence:
```json
"customerNotes": "Notes: handle gently. <script>alert(1)</script>"
```
Impact: If booking notes are rendered in administrative portals, caregiver companion apps, or email notifications using `dangerouslySetInnerHTML` or unescaped HTML templates, stored XSS could be executed.
Suggested fix: Sanitize string inputs with DOMPurify or sanitize-html before persisting, and ensure all render targets use standard React JSX text nodes (which escape HTML by default).

---

ID: BUG-019
Title: AuthenticatedBookingForm permanently locks in HTTP 409 pricing_changed state when server price version increments
Severity: MEDIUM
Area: booking
Location: src/components/booking/authenticated-booking-form.tsx:180-210, src/modules/bookings/create-booking.ts:114
Steps to reproduce:
1. User loads `/book` which pre-renders `servicePrices` via Server Component props.
2. An administrator or system update updates the `servicePrice` table (incrementing version or changing price).
3. User submits the booking.
4. Server rejects with HTTP 409 Conflict (`pricing_changed`).
Expected: The client form should capture the 409 response, re-fetch the latest price quote, display the updated price with an alert ("Pricing has been updated, please review"), and allow the user to proceed.
Actual: `AuthenticatedBookingForm` shows an error banner, but the underlying `servicePrices` prop is static. Every subsequent submission with the same form instance sends the stale `servicePriceId`, locking the user in a perpetual 409 error loop until a full hard page refresh.
Evidence:
```typescript
// src/components/booking/authenticated-booking-form.tsx:
const [error, setError] = useState<string | null>(null);
// On 409 error, setError("The pricing for this service was updated. Please review the new price.")
// But activePrice is derived from props.initialPrices, which is never refetched without full navigation.
```
Impact: User cannot complete booking without realizing they must hard refresh the page.
Suggested fix: In response to `pricing_changed`, re-fetch current pricing via `/api/pricing` or reload the server component data dynamically using `router.refresh()`.

---

ID: BUG-020
Title: /book?service=boarding-beta silently falls back to DOG_WALK_30 instead of redirecting to waitlist
Severity: LOW
Area: booking
Location: src/components/booking/booking-wizard.tsx:45-55, src/app/book/page.tsx:25-35
Steps to reproduce:
1. Navigate to `http://localhost:3000/book?service=boarding-beta`.
2. Inspect selected service in wizard or authenticated form.
Expected: Since boarding is in private pilot waitlist, navigating to `/book?service=boarding-beta` should immediately redirect the user to `/contact?topic=BOARDING_PILOT` or display the Boarding Waitlist banner.
Actual: `serviceMap` fails to match `boarding-beta`, silently falling back to `DOG_WALK_30` (30-Min Dog Walk).
Evidence:
```
// Playwright test log:
/book?service=boarding-beta defaulted to DOG_WALK_30: true
```
Impact: Users intending to book boarding are silently switched to dog walking, potentially submitting and paying for an unwanted service type.
Suggested fix: Check `service === "boarding-beta"` in `book/page.tsx` or `booking-wizard.tsx` and redirect to `/contact?topic=BOARDING_PILOT`.

---

## Phase 6: Payments, Wallet & Refunds Findings

ID: BUG-021
Title: Razorpay payment.captured webhook fails to transition payment status from CREATED to CAPTURED due to state machine omission
Severity: CRITICAL
Area: payments
Location: src/modules/payments/state-machine.ts:17-18, src/app/api/webhooks/razorpay/route.ts:107-112
Steps to reproduce:
1. Customer initiates checkout, creating a payment record in state `CREATED`.
2. Customer completes Razorpay checkout; Razorpay dispatches `payment.captured` webhook.
3. Webhook handler calls `canTransitionPayment(payment.status, "CAPTURED")`.
4. Inspect database records for `Payment` and `Booking`.
Expected: Both `Booking` transitions to `CONFIRMED` and `Payment` transitions to `CAPTURED` with `capturedAt` timestamp.
Actual: `canTransitionPayment("CREATED", "CAPTURED")` returns `false` because `paymentTransitions.CREATED` is defined as `["PENDING", "AUTHORIZED", "FAILED", "CANCELLED"]`, omitting `"CAPTURED"`. The webhook transitions `Booking` to `CONFIRMED`, but leaves `Payment` permanently stuck in `CREATED`.
Evidence:
```
// test-phase6-payments.mjs test WH-04 execution:
[FAIL] WH-04: Webhook transitioned payment to CAPTURED and booking to CONFIRMED
   Details: {
  "paymentStatus": "CREATED",
  "bookingStatus": "CONFIRMED"
}
```
Impact: Critical business flow breakdown:
- Customer cannot request a refund via `/api/payments/refund` because it requires `payment.status === "CAPTURED"` (returns 400 `no_captured_payment`).
- Sitter payout calculation fails or reports uncollected funds.
- Financial reconciliation shows bookings confirmed without captured payment records.
Suggested fix: Add `"CAPTURED"` to `paymentTransitions.CREATED` in `src/modules/payments/state-machine.ts`.

---

ID: BUG-022
Title: Benefit wallet redemption suffers from double-spend race condition allowing multiple concurrent deductions exceeding balance
Severity: CRITICAL
Area: wallet
Location: src/modules/b2b/wallets.ts:75-129
Steps to reproduce:
1. Issue ₹500 (50,000 paise) into a benefit wallet.
2. Fire 5 concurrent requests to `redeemCredits` each requesting ₹300 (30,000 paise) with unique idempotency keys.
3. Observe outcomes and inspect final ledger entries.
Expected: Exactly 1 request succeeds (balance becomes ₹200); the remaining 4 requests fail with `InsufficientBenefitCreditsError`.
Actual: All 5 concurrent transactions read the identical `latestEntry` balance (50,000 paise) before any insert commits. All 5 pass the `currentBalance >= amountPaise` check. Total ₹1,500 is debited from a ₹500 balance, and all 5 write `balanceAfter: 20000`.
Evidence:
```
// test-phase6-payments.mjs test WAL-04 execution:
Running concurrent double-spend race condition test...
[FAIL] WAL-04: Race condition prevention on concurrent redemptions (no negative balance, atomic transactions)
   Details: {
  "successfulRedemptions": 5,
  "failedRedemptions": 0,
  "finalBalancePaise": 20000
}
```
Impact: Direct financial loss. Rapid concurrent redemption requests or automated bot scripts can repeatedly drain credits far exceeding the wallet's actual balance.
Suggested fix: Implement optimistic concurrency control with an integer `version` field on `BenefitWallet` (or atomic balance decrement via MongoDB `$inc` with `$gte: amountPaise`), rejecting stale transactions.

---

ID: BUG-023
Title: Customer service wallet UI renders hardcoded mock balance of ₹2,450.00 and fake transaction entries when real balance is zero
Severity: HIGH
Area: wallet
Location: src/app/(portal)/customer/wallet/page.tsx:30-87
Steps to reproduce:
1. Create a brand new customer account with zero memberships and zero credits.
2. Sign in and navigate to `/customer/wallet`.
3. Observe the displayed balance and transaction ledger.
Expected: Dashboard displays "₹0.00" with an empty state banner ("No active memberships or credits found").
Actual: Because `dbBalancePaise === 0`, line 30 falls back to `245000` paise (₹2,450.00). The UI renders "Verified service credits: ₹2,450" along with fake mock memberships ("PetSaathi Resident Care Programme", "Wellness & Preventive Vet Cover") and fake mock ledger transactions ("Neighborhood Dog Walk", "Indiranagar Resident Perk").
Evidence:
```typescript
// src/app/(portal)/customer/wallet/page.tsx lines 30-31:
const balancePaise = dbBalancePaise > 0 ? dbBalancePaise : 245000;
const wallets = dbWallets.length > 0 ? dbWallets : [ ... mock data ... ];
```
```
// test-phase6-payments.mjs test WAL-05 execution:
[FAIL] WAL-05: Customer wallet page leaks hardcoded ₹2,450 mock balance to customers with zero real balance
   Details: {
  "hasMockBalance": true,
  "snippetFound": "Mock balance ₹2,450 / Indiranagar perk found in HTML"
}
```
Impact: Severe customer confusion and trust breakdown; customers believe they have ₹2,450 in free care credits, only to have checkout reject credit redemption.
Suggested fix: Remove the mock fallback. When `dbBalancePaise === 0`, render `money(0)` and display `<DashboardEmptyState>`.

---

ID: BUG-024
Title: Payment refund API (/api/payments/refund) executes 100% full refunds unconditionally, violating published cancellation tiers and notice periods
Severity: HIGH
Area: payments
Location: src/app/api/payments/refund/route.ts:78-95, src/app/refund-policy/page.tsx:40-78
Steps to reproduce:
1. Inspect the public `/refund-policy` page.
2. Compare with `src/app/api/payments/refund/route.ts` lines 78-95.
Expected: The backend refund endpoint must enforce the published cancellation rules:
- > 24 hours before `scheduledStart`: 100% refund.
- 4–24 hours before `scheduledStart`: 50% refund (50% retained for caregiver schedule compensation).
- < 4 hours before `scheduledStart`: Non-refundable (0% refund).
- Caregiver cancellation: 100% refund + ₹250 apology wallet credit.
Actual: `POST /api/payments/refund` unconditionally refunds `payment.amountPaise` (100%) through Razorpay regardless of when the cancellation occurs (even 5 minutes before or during the service). The 50% tier, 0% tier, and ₹250 caregiver cancellation apology credits are completely un-implemented.
Evidence:
```typescript
// src/app/api/payments/refund/route.ts lines 76-96:
const refundRecord = await tx.refund.create({
  data: {
    paymentId: payment.id,
    amountPaise: payment.amountPaise, // Always 100%
    reason,
    ...
  },
});
const rpRefund = await razorpay.payments.refund(payment.providerPaymentId, {
  amount: payment.amountPaise, // Always 100%
  ...
});
```
Impact: Financial loss for caregivers and the platform. A customer can cancel 1 minute prior to an appointment and receive a 100% refund, leaving caregivers completely uncompensated for committed time and travel.
Suggested fix: Calculate refund eligibility dynamically from `booking.scheduledStart - Date.now()`, apply the 50% / 0% tiers as specified in `/refund-policy`, and disburse apology credits to the customer wallet when sitters cancel.

---

## Phase 7: Data Layer Findings

ID: BUG-025
Title: Catastrophic cascade deletion chain (Pet -> Booking -> Payment) permanently destroys financial and legal records or crashes on refunds
Severity: CRITICAL
Area: database
Location: prisma/schema.prisma:188, 235, 340
Steps to reproduce:
1. Inspect `prisma/schema.prisma` relations between `User`, `Pet`, `Booking`, `Payment`, and `Refund`.
2. Observe that `Pet.owner` is configured with `onDelete: Cascade`.
3. Observe that `Booking.pet` is configured with `onDelete: Cascade`.
4. Observe that `Payment.booking` is configured with `onDelete: Cascade`.
5. Observe that `Refund.payment` is configured with `onDelete: Restrict`.
Expected: Financial transactions (`Payment`), audit logs, and completed service contracts (`Booking`) must be permanent and immutable. Deleting a pet should either soft-delete the pet or restrict deletion if bookings exist.
Actual: Deleting a pet triggers a multi-level cascade delete that purges all historical bookings and payments. If any payment was refunded, the deletion crashes with a foreign key constraint violation on `Refund.payment`. If no refund exists, all payment history and tax receipts are permanently destroyed without a trace.
Evidence:
```prisma
// prisma/schema.prisma:
// Booking model:
pet                  Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)
// Payment model:
booking       Booking          @relation(fields: [bookingId], references: [id], onDelete: Cascade)
// Refund model:
payment          Payment      @relation(fields: [paymentId], references: [id], onDelete: Restrict)
```
Impact: Critical compliance and financial hazard. Customers can purge financial evidence and caregiver payment obligations by deleting their pet profile.
Suggested fix: Change `onDelete: Cascade` to `onDelete: Restrict` on `Booking.pet` and `Payment.booking`, and implement soft deletion (`active: false` or `deletedAt: DateTime?`) for pet and user profiles.

---

ID: BUG-026
Title: Missing MongoDB indexes on 50 foreign keys across core domain models trigger full collection scans (COLLSCAN)
Severity: HIGH
Area: performance
Location: prisma/schema.prisma (Address.userId, Booking.petId, Booking.addressId, BookingStatusHistory.actorId, Incident.petId, Incident.sitterId, Incident.customerId, ReportMedia.reportId)
Steps to reproduce:
1. Run `node qa/audit-phase7-data-layer.mjs`.
2. Inspect models in `prisma/schema.prisma` for relation foreign key fields lacking `@@index`.
Expected: All foreign key fields used in queries and relation joins must be indexed in MongoDB.
Actual: 50 relational foreign keys across core domain models have no index defined.
Evidence:
```
// From qa/audit-phase7-data-layer.mjs report:
Unindexed foreign key / relation fields found: 50
- Address.userId
- Booking.petId
- Booking.addressId
- BookingStatusHistory.actorId
- Incident.petId
- Incident.sitterId
- Incident.customerId
- ReportMedia.reportId
- ServiceEvent.actorId
- IncidentEvent.actorId
```
Impact: In MongoDB Atlas, queries filtering by unindexed foreign keys perform `COLLSCAN` operations over every document in the collection, creating high CPU utilization and query latency as the database grows.
Suggested fix: Add composite or single-field `@@index([userId])`, `@@index([petId])`, `@@index([addressId])` definitions to all affected models in `prisma/schema.prisma`.

---

ID: BUG-027
Title: Over 100 unbounded findMany queries throughout portal and administrative dashboards lack take limits or pagination
Severity: HIGH
Area: performance
Location: src/app/(portal)/admin/operations/queue/page.tsx:16, 27, src/app/(portal)/admin/partners/page.tsx:18, src/app/(portal)/addresses/page.tsx:17, and 98 other call sites
Steps to reproduce:
1. Run `node qa/audit-phase7-data-layer.mjs`.
2. Inspect queries in `src/app/(portal)/**` and `src/app/api/**`.
Expected: All database listing queries should enforce bounded limits (`take: 50` or `take: 100`) and implement pagination.
Actual: 102 queries across 616 scanned source files call `prisma.<model>.findMany(...)` with zero `take` constraints.
Evidence:
```
// Sample unbounded queries detected:
- src/app/(portal)/admin/operations/queue/page.tsx:27: prisma.booking.findMany({ ... })
- src/app/(portal)/admin/operations/queue/page.tsx:16: prisma.matchScore.findMany({ ... })
- src/app/(portal)/admin/partners/page.tsx:18: prisma.partner.findMany({ ... })
- src/app/(portal)/addresses/page.tsx:17: prisma.address.findMany({ ... })
```
Impact: In production with thousands of records, opening admin operations or portal pages pulls entire database tables into server memory, triggering Node.js heap exhaustion (OOM crashes) and blocking the event loop.
Suggested fix: Enforce pagination defaults (`take: 25`, `skip: ...`) across all list views and administrative tables.

---

ID: BUG-028
Title: Timezone naive toISOString().split("T")[0] produces day-boundary invoice and medical event date drift in Indian Standard Time (IST)
Severity: MEDIUM
Area: database
Location: src/modules/b2b/invoicing.ts:119, src/app/(portal)/pets/[id]/records/page.tsx:109
Steps to reproduce:
1. Generate an invoice or record a pet medical event between 12:00 AM IST and 5:29 AM IST (which corresponds to 18:30–23:59 UTC of the previous day).
2. Inspect the generated date string.
Expected: The date string should reflect the active calendar date in India (IST, UTC+5:30).
Actual: `new Date().toISOString().split("T")[0]` evaluates the ISO string in UTC, causing dates recorded in the first 5.5 hours of any Indian day to be back-dated to the previous calendar day.
Evidence:
```typescript
// src/modules/b2b/invoicing.ts line 119:
invoiceDate: new Date().toISOString().split("T")[0] ?? "2026-09-03",

// src/app/(portal)/pets/[id]/records/page.tsx line 109:
<span className="text-xs font-bold uppercase tracking-[0.16em] text-ink/80">
  {record.occurredAt.toISOString().split('T')[0]}
</span>
```
Impact: B2B corporate invoices, GST compliance records, and medical administration logs are stamped with the incorrect calendar date.
Suggested fix: Format dates using an explicit Asia/Kolkata timezone formatter (`Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(date)`).

---

## Phase 8: Security Sweep Findings

ID: BUG-029
Title: Authentication panel completely drops returnTo search parameter, breaking deep linking and post-login return flows
Severity: MEDIUM
Area: auth
Location: src/app/login/page.tsx:22-58, src/components/forms/auth-sliding-panel.tsx:48-60
Steps to reproduce:
1. Issue an unauthenticated request to a deep route, e.g. `/customer/wallet` or complete the booking wizard on `/book`.
2. Notice the browser redirects to `/login?returnTo=%2Fcustomer%2Fwallet` or `/login?returnTo=/book`.
3. Sign in via email/password or OTP code.
4. Observe the post-login destination URL.
Expected: User is redirected back to the URL specified in `returnTo` (`/customer/wallet` or `/book`).
Actual: `src/app/login/page.tsx` never extracts `searchParams.returnTo` and does not pass it to `<AuthSlidingPanel />`. In `auth-sliding-panel.tsx`, `redirectToDashboardOrPortal` strictly hardcodes navigation to `/dashboard` or `/admin` or `/saathi`. The user's intended destination is permanently dropped.
Evidence:
```typescript
// src/components/forms/auth-sliding-panel.tsx lines 48-60:
function redirectForRoles(roles?: string[]) {
  if (roles?.includes("SUPER_ADMIN") || roles?.includes("OPERATIONS_ADMIN") || roles?.includes("ADMIN")) return "/admin";
  if (role === "SITTER" && roles?.includes("SITTER")) return "/saathi";
  return "/dashboard";
}
// window.location.href = target; (Never checks window.location.search for returnTo)
```
Impact: Critical UX degradation and broken customer journeys. Customers redirected to log in from email links, payment completion prompts, or booking wizards are dumped into the generic dashboard instead of their intended page.
Suggested fix: Read `returnTo` in `LoginPage`, sanitize it to guarantee relative internal URLs (rejecting protocol-relative or external URLs), and redirect to `returnTo` upon successful authentication.

---

ID: BUG-030
Title: Content-Security-Policy script-src enables unsafe-eval and unsafe-inline without nonces in response headers
Severity: LOW
Area: security
Location: src/middleware.ts:60-70
Steps to reproduce:
1. Issue an HTTP HEAD request to `http://localhost:3000/`.
2. Inspect the `Content-Security-Policy` response header.
Expected: In production environments, CSP should utilize cryptographic nonces (`'nonce-...'`) or hashes and avoid `'unsafe-eval'`.
Actual: The CSP header explicitly permits `'unsafe-inline'` and `'unsafe-eval'` in `script-src`.
Evidence:
```
Content-Security-Policy: default-src 'self'; ... script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com ...
```
Impact: Weakens defense-in-depth against Cross-Site Scripting (XSS). If user input is improperly escaped anywhere in HTML templates or third-party widgets, the browser will execute the injected script.
Suggested fix: Implement per-request CSP nonce generation in Next.js middleware and remove `'unsafe-eval'` from production headers.

---

## Phase 9: Performance & Accessibility Findings

ID: BUG-031
Title: 15 uncompressed PNG image assets in public/images exceed 1.5MB to 2.3MB, degrading mobile Largest Contentful Paint (LCP)
Severity: HIGH
Area: performance
Location: public/images/hero-couple-dog.png (2.32MB), care-protocol-constellation.png (2.31MB), care-handover-courtyard.png (1.99MB), login-pet-companion.png (1.77MB)
Steps to reproduce:
1. Inspect files in `public/images/`.
2. Observe 15 raw PNG files exceeding 1 MB each.
Expected: Production web applications should serve responsive WebP/AVIF formats under 200 KB per asset.
Actual: Massive high-resolution PNGs totaling >25 MB are stored in `public/images`. When referenced as direct background images or shared over social meta tags, they choke client bandwidth and fail Core Web Vitals LCP benchmarks on 4G networks.
Evidence:
```
// Top image sizes detected by qa/audit-phase9-perf-a11y.mjs:
- hero-couple-dog.png: 2,319.4 KB
- care-protocol-constellation.png: 2,307.6 KB
- care-handover-courtyard.png: 1,987.3 KB
- login-pet-companion.png: 1,765.7 KB
- sitter-park-cinematic.png: 1,688.7 KB
```
Impact: Excessive bandwidth consumption, slow initial page rendering, poor Core Web Vitals scores, and mobile battery drain.
Suggested fix: Convert PNGs to WebP/AVIF format with 80% quality compression and ensure all images use `next/image` with responsive `sizes` and `priority` only on above-the-fold heroes.

---

ID: BUG-032
Title: Booking wizard and homepage search inputs lack accessible labels and ID associations (WCAG 2.1 AA violation)
Severity: MEDIUM
Area: accessibility
Location: src/components/marketing/marketing-experience.tsx:180-210, src/components/booking/booking-wizard.tsx:120-170
Steps to reproduce:
1. Run accessibility automated inspection on `/` and `/book`.
2. Inspect the search input on the homepage and radio buttons on `/book`.
Expected: Every interactive form control must have a programmatically determinable accessible name via `<label for="...">`, `aria-label`, or `aria-labelledby`.
Actual: The hero search input and the 8 service selection radio buttons are rendered with `sr-only` or without `aria-label` and `id` linking.
Evidence:
```html
<input class="w-full bg-transparent text-[0.84rem] sm:text-[0.9rem] font-bold te..." />
<input type="radio" class="jsx-81c6e7ee3f174d08 sr-only" name="service" value="DOG_WALK_30" />
```
Impact: Fails WCAG 2.1 Success Criteria 1.3.1 (Info and Relationships) and 4.1.2 (Name, Role, Value). Screen reader users cannot determine the purpose of the search field or which care service radio button is selected.
Suggested fix: Add `aria-label="Search city or neighborhood"` and connect all radio buttons with `<label htmlFor="service-dog-walk-30">` elements.

---

ID: BUG-033
Title: Fixed pixel widths on chat widgets (w-[400px], w-[420px]) cause horizontal viewport overflow on 360px-375px mobile screens
Severity: MEDIUM
Area: responsive
Location: src/components/ai/GlobalChatWidget.tsx:85, src/components/customer/PetSaathiChatWidget.tsx:90
Steps to reproduce:
1. Emulate a mobile device with 360px (standard Android) or 375px (iPhone SE) viewport width.
2. Open the AI Concierge or PetSaathi chat widget.
3. Observe the widget width and horizontal scrollbar.
Expected: Floating widgets must be constrained by `max-w-[calc(100vw-2rem)]` or `w-full` on mobile viewports.
Actual: `GlobalChatWidget` specifies `w-[400px]` and `PetSaathiChatWidget` specifies `w-[420px]`. On a 360px or 375px screen, the widget spills 40px–60px off the right edge of the screen, clipping close buttons and input actions.
Evidence:
```tsx
// src/components/ai/GlobalChatWidget.tsx:
className="fixed bottom-6 right-6 w-[400px] ... "

// src/components/customer/PetSaathiChatWidget.tsx:
className="fixed bottom-6 right-6 w-[420px] ... "
```
Impact: Mobile users cannot interact with or dismiss the chat widget; page layout breaks horizontally.
Suggested fix: Change width classes to `w-[calc(100vw-2rem)] sm:w-[400px] max-w-[420px]`.

---

## Phase 10: Content, Consistency & Legal Findings

ID: BUG-034
Title: Grievance Officer disclosure lacks individual name, designation, and phone number required by Consumer Protection (E-Commerce) Rules 2020
Severity: HIGH
Area: legal
Location: src/app/terms/page.tsx:85-95, src/app/privacy/page.tsx:120-135
Steps to reproduce:
1. Inspect Section 8 of `/terms` and the Grievance Redressal section of `/privacy`.
2. Check against the requirements of Rule 4(4) and Rule 5(3)(b) of the Consumer Protection (E-Commerce) Rules, 2020.
Expected: The platform must clearly state the full name of an individual natural person, their official corporate designation, a direct telephone number, and physical registered office address.
Actual: Section 8 designates a generic pseudonym (`"Trust & Safety Redressal Desk"`), provides only an email address, and omits a contact telephone number.
Evidence:
```html
<p><strong>Grievance Officer:</strong> Trust &amp; Safety Redressal Desk</p>
<p><strong>Email:</strong> <a href="mailto:grievance@petsaathi.com">grievance@petsaathi.com</a></p>
```
Impact: Statutory non-compliance under Indian e-commerce regulations, exposing the founders and platform to regulatory action and customer grievance fines.
Suggested fix: Designate a named individual officer (e.g., "Prince Senjaliya, Head of Trust & Safety"), publish an active telephone contact number, and list the registered address.

---

ID: BUG-035
Title: Absence of registered corporate entity name, CIN, and physical office address in platform Terms of Service
Severity: MEDIUM
Area: legal
Location: src/app/terms/page.tsx:20-45, 78-85
Steps to reproduce:
1. Review `src/app/terms/page.tsx` Section 1 ("Service Agreement & Platform Scope") and Section 7 ("Governing Law").
2. Look for the formal corporate entity registration details.
Expected: Under the Indian Companies Act 2013 and consumer protection guidelines, commercial portals must identify the exact incorporated legal entity (e.g. "PetSaathi Technologies Private Limited", CIN: U..., Registered Office: ...).
Actual: The Terms reference only the brand name "PetSaathi" without identifying the underlying legal entity, company registration type, Corporate Identification Number (CIN), or physical corporate headquarters.
Evidence:
```html
PetSaathi operates a managed, verified pet care discovery and coordination platform...
...exclusive jurisdiction resting in the courts of Ahmedabad, Gujarat.
```
Impact: Legal contracts executed with customers and independent caregivers lack a well-defined corporate party, posing enforceability risks in judicial proceedings.
Suggested fix: Define the incorporated operating entity, CIN, and complete registered address in Section 1 of the Terms of Service.

---

## Phase 11: Resilience & Edge Cases Findings

ID: BUG-036
Title: Simultaneous double-click booking submissions create duplicate bookings for the same pet and time slot
Severity: HIGH
Area: booking
Location: src/modules/bookings/create-booking.ts:80-140, src/app/api/bookings/route.ts:40-70
Steps to reproduce:
1. Submit two concurrent booking requests via `POST /api/bookings` with the exact same payload (same pet, same address, same service code, and same scheduled start time).
2. Inspect the HTTP responses and query the MongoDB `Booking` collection.
Expected: The backend should detect conflicting concurrent requests using an idempotency key or active slot reservation check, succeeding on the first request and rejecting the duplicate with HTTP 409 Conflict.
Actual: Both concurrent requests succeed with HTTP 201 Created, generating two distinct bookings with different IDs and references.
Evidence:
```
// From qa/audit-phase11-resilience.mjs:
Concurrent booking 1 status: 201 7ef2643a-161b-4139-9f0e-27f33ccf7bae
Concurrent booking 2 status: 201 19006182-8993-440f-acdf-c2cc379ceb30
[FAIL] RES-04: Duplicate booking prevention on simultaneous double-click submissions
   Details: {
  "booking1Status": 201,
  "booking1Id": "7ef2643a-161b-4139-9f0e-27f33ccf7bae",
  "booking2Status": 201,
  "booking2Id": "19006182-8993-440f-acdf-c2cc379ceb30",
  "duplicateCreated": true
}
```
Impact: Pet parents who double-click the booking confirmation button or experience network latency are charged twice, leading to duplicate payment deductions and conflicting caregiver assignments.
Suggested fix: Enforce a client-supplied or generated `idempotencyKey` on `POST /api/bookings`, and verify within a transaction that no pending/active booking exists for `(petId, scheduledStart)`.

---

ID: BUG-037
Title: Missing PWA manifest link in root metadata prevents browser install prompts and app installation
Severity: MEDIUM
Area: pwa
Location: src/app/layout.tsx:20-50
Steps to reproduce:
1. Load `http://localhost:3000/` on mobile Chrome or Safari.
2. Inspect rendered HTML `<head>` for `<link rel="manifest">`.
Expected: Root metadata should declare `manifest: "/manifest.webmanifest"` so mobile browsers recognize PetSaathi as an installable Progressive Web App.
Actual: Root metadata in `src/app/layout.tsx` omits the `manifest` property. The manifest link tag is never rendered, and requests to `/manifest.json` return HTTP 404.
Evidence:
```typescript
// src/app/layout.tsx lines 20-50:
export const metadata: Metadata = {
  // manifest is missing
};
```
```
// HTTP check:
GET /manifest.json -> 404 Not Found
Rendered HTML: 0 occurrences of rel="manifest"
```
Impact: Mobile users cannot install PetSaathi to their home screen as a standalone PWA, degrading mobile retention and push notification delivery.
Suggested fix: Add `manifest: "/manifest.webmanifest"` to `export const metadata` in `src/app/layout.tsx`.

---

## NOT TESTED Section

The following areas were explicitly excluded from live execution during this local audit, with specific technical rationales:

1. **Live Razorpay Bank Settlements & Real Card/UPI Debits**:
   - *Reason*: The test environment runs against Razorpay sandbox/test mode credentials (`rzp_test_...`). Real bank settlement transfers, IMPS/NEFT payouts to caregiver bank accounts, and actual debit card charges were not initiated to prevent financial charges on live payment rails.
2. **Production DigiLocker Government KYC Flow**:
   - *Reason*: `DIGILOCKER_USE_MOCK="true"` is enabled in `.env`. Live DigiLocker API credentials (`DIGILOCKER_CLIENT_ID` and `DIGILOCKER_CLIENT_SECRET`) are unset.
3. **Production WhatsApp Cloud API Message Delivery**:
   - *Reason*: `WHATSAPP_ACCESS_TOKEN` is populated with a documentation dummy token (`EAAQYOURACCESSTOKENHERE12345`). Outbound message templates were not dispatched to the Meta WhatsApp Business Cloud API.
4. **AWS S3 Cloud Binary Object Storage**:
   - *Reason*: `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` are empty in `.env`. The application runs in mock/local storage mode for uploaded assets.
5. **Continuous Mobile Background GPS Session Streaming**:
   - *Reason*: Continuous background GPS polling while mobile operating systems (iOS/Android) suspend browser processes requires native client application execution on physical hardware devices. Web PWA telemetry was verified via milestone check-ins.

---

## Prioritized Fix Order with Effort Estimates

Effort T-Shirt Sizing:
- **Small (S)**: < 2 hours (configuration change, single file logic fix, missing attribute)
- **Medium (M)**: 2–6 hours (multi-file refactor, state machine adjustment, schema index updates)
- **Large (L)**: 1–2 days (cross-cutting architectural update, comprehensive query pagination across 100+ files)

### Sprint 1: Critical Security & Financial Integrity Killswitches (Immediate)
1. `BUG-002` [CRITICAL - Effort: S]: Remove hardcoded administrator credentials from `src/modules/auth/mongodb-auth.ts`. Require environment variables strictly.
2. `BUG-021` [CRITICAL - Effort: S]: Add `"CAPTURED"` to `paymentTransitions.CREATED` in `src/modules/payments/state-machine.ts` so Razorpay capture webhooks transition payment records properly.
3. `BUG-022` [CRITICAL - Effort: M]: Implement optimistic locking (version counter) or atomic balance decrement (`$inc` with `$gte`) on `BenefitWallet` in `src/modules/b2b/wallets.ts` to stop double-spending.
4. `BUG-025` [CRITICAL - Effort: S]: Change `Booking.pet` and `Payment.booking` relations from `onDelete: Cascade` to `onDelete: Restrict` in `prisma/schema.prisma` to prevent deletion of financial and booking audit records.
5. `BUG-012` [HIGH - Effort: M]: Update `src/middleware.ts` to decode or verify native `petsaathi_session` cookies so RBAC firewall rules are enforced for all sessions.
6. `BUG-011` [HIGH - Effort: M]: Standardize credential hashing (scrypt vs bcrypt) and align user record fields between `/api/auth/register` and `mongodb-auth.ts`.
7. `BUG-004` [HIGH - Effort: S]: Rotate all exposed production keys (MongoDB, Gmail App Password, NVIDIA, Resend, Upstash) and remove them from local `.env`.

### Sprint 2: Core Booking, Payments & UX Restorations (Week 1)
8. `BUG-024` [HIGH - Effort: M]: Implement cancellation notice period checks (>24h, 4-24h, <4h) and caregiver apology credits in `src/app/api/payments/refund/route.ts` matching `/refund-policy`.
9. `BUG-036` [HIGH - Effort: M]: Enforce client `idempotencyKey` and duplicate slot checking in `src/modules/bookings/create-booking.ts` to prevent double-click duplicate bookings.
10. `BUG-019` [MEDIUM - Effort: S]: On 409 `pricing_changed`, dynamically re-fetch updated service prices via `router.refresh()` in `AuthenticatedBookingForm`.
11. `BUG-017` [MEDIUM - Effort: M]: Synchronize unauthenticated `BookingWizard` state with `sessionStorage` and restore entered inputs upon return from `/login`.
12. `BUG-029` [MEDIUM - Effort: S]: Read `searchParams.returnTo` in `src/app/login/page.tsx` and pass to `AuthSlidingPanel` for post-auth navigation.
13. `BUG-023` [HIGH - Effort: S]: Remove fake ₹2,450 mock balance fallback from `src/app/(portal)/customer/wallet/page.tsx` and render genuine empty state.
14. `BUG-016` [MEDIUM - Effort: S]: Add min date constraint, operating hour checks (06:00–21:00), and max character limits to `BookingWizard`.
15. `BUG-020` [LOW - Effort: S]: Add explicit check redirecting `/book?service=boarding-beta` to `/contact?topic=BOARDING_PILOT`.
16. `BUG-003`, `BUG-008` [HIGH - Effort: S]: Align `NEXT_PUBLIC_APP_URL` across `.env` and `.env.local` to resolve canonical SEO domain pollution.
17. `BUG-006` [HIGH - Effort: S]: Remove `typescript.ignoreBuildErrors` from `next.config.mjs` and remove `--no-lint` from `scripts/build.mjs`.

### Sprint 3: Database Performance & Statutory Compliance (Week 2)
18. `BUG-026` [HIGH - Effort: M]: Add `@@index` annotations to 50 relational foreign keys in `prisma/schema.prisma` to eliminate MongoDB `COLLSCAN` operations.
19. `BUG-027` [HIGH - Effort: L]: Add pagination limits (`take: 50`, `skip: ...`) across 102 unbounded `findMany` queries in portals and APIs.
20. `BUG-028` [MEDIUM - Effort: S]: Replace naive `toISOString().split("T")[0]` with `Intl.DateTimeFormat` using `Asia/Kolkata` timezone.
21. `BUG-034` [HIGH - Effort: S]: Designate a named Grievance Officer with official title, contact telephone number, and physical office in `/terms`.
22. `BUG-035` [MEDIUM - Effort: S]: Specify registered corporate legal entity name, CIN, and registered address in Section 1 of `/terms`.
23. `BUG-018` [MEDIUM - Effort: S]: Sanitize customer booking notes and text inputs using DOMPurify before MongoDB persistence.
24. `BUG-015` [MEDIUM - Effort: S]: Add account-level rate limiting (`consumeRateLimit("password-signin-email", ...)`).
25. `BUG-014` [MEDIUM - Effort: S]: Catch authorization errors in admin routes and return HTTP 403 instead of throwing unhandled 500 errors.
26. `BUG-013` [MEDIUM - Effort: S]: Add `Cache-Control: no-store` headers to 307 redirect responses in `middleware.ts`.

### Sprint 4: Performance, Accessibility & PWA Hardening (Week 2)
27. `BUG-031` [HIGH - Effort: M]: Convert 15 giant PNG images in `public/images` to compressed WebP/AVIF formats.
28. `BUG-032` [MEDIUM - Effort: M]: Add `aria-label` attributes and `<label for="...">` associations to all search and radio inputs.
29. `BUG-033` [MEDIUM - Effort: S]: Clamp floating chat widget widths to `w-[calc(100vw-2rem)]` on mobile viewports.
30. `BUG-037` [MEDIUM - Effort: S]: Add `manifest: "/manifest.webmanifest"` to `export const metadata` in `src/app/layout.tsx`.
31. `BUG-001` [HIGH - Effort: M]: Upgrade nodemailer and resolve vulnerable dependencies reported by `npm audit`.
32. `BUG-007`, `BUG-010` [LOW - Effort: S]: Remove redundant brand suffix in page titles and dynamic search parameter titles.
33. `BUG-030` [LOW - Effort: M]: Implement per-request cryptographic nonces for Content-Security-Policy script-src.
34. `BUG-005` [MEDIUM - Effort: M]: Document missing environment variables with safe defaults in `.env.example`.

---

## Module Completion Matrix

| Module / Subsystem | Completion % | Production Ready? | Primary Blockers |
| :--- | :---: | :---: | :--- |
| **Authentication & Identity** | **70%** | **NO** | Incompatible bcrypt/scrypt registration subsystems (BUG-011); edge middleware RBAC bypassed for native sessions (BUG-012); hardcoded admin credentials (BUG-002). |
| **Booking Flow & Scheduling** | **75%** | **NO** | Concurrent double-booking creation (BUG-036); wizard form state dropped on login redirect (BUG-017); static 409 pricing lock (BUG-019); unvalidated wizard inputs (BUG-016). |
| **Payment Processing (Razorpay)** | **80%** | **NO** | Razorpay capture webhook fails to mark payment as CAPTURED (BUG-021); refund API refunds 100% unconditionally, bypassing cancellation tiers (BUG-024). |
| **Wallet & Credit Ledger** | **60%** | **NO** | Race condition double-spend allowing overdrafts (BUG-022); customer UI displays hardcoded ₹2,450 mock balance to empty wallets (BUG-023). |
| **Admin & Operations Portal** | **85%** | **NO** | 102 unbounded `findMany` queries causing severe memory bloat (BUG-027); admin permission errors crash with HTTP 500 (BUG-014). |
| **Caregiver ("Saathi") Portal** | **80%** | **NO** | Payout calculations fail when payments remain stuck in CREATED (BUG-021); missing MongoDB relation indexes (BUG-026). |
| **PWA & Mobile Web Experience** | **65%** | **NO** | Missing PWA manifest link in root `<head>` (BUG-037); chat widgets clip on 375px screens (BUG-033); 15 giant PNG images >1.5MB degrade mobile LCP (BUG-031). |
| **Legal, Trust & Compliance** | **75%** | **NO** | Grievance Officer listing lacks required name/phone under E-Commerce Rules (BUG-034); corporate legal entity name and CIN missing from Terms (BUG-035). |
| **Data Layer & Schema** | **70%** | **NO** | Catastrophic cascade deletion from Pet to Payment records (BUG-025); 50 unindexed foreign keys in MongoDB Atlas (BUG-026); timezone day-drift (BUG-028). |
| **OVERALL APPLICATION** | **73%** | **NO** | **Requires resolution of Sprint 1 (Criticals) and Sprint 2 before production traffic cutover.** |









