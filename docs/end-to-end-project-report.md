# PetSaathi End-to-End Project Report

**Audit date:** 29 July 2026 (Asia/Kolkata)

**Repository:** `C:\Users\Prince\Downloads\PetSaathi`

**Branch and audited commit:** `main` at `458bf51`

**Scope:** Product, frontend, backend, database, security, payments, operations, testing, deployment, observability, and launch readiness.

---

## 1. Executive summary

PetSaathi is a production-oriented, India-focused pet-care marketplace and operating platform. It is not merely a marketing website: the repository contains customer, caregiver, operations, safety, finance, content, society, partner, enterprise, city-management, and operator workflows.

The architecture is strongest in domain modelling, fail-closed service activation, state-machine-driven workflows, auditability, and operational safety. The implementation includes a large MongoDB/Prisma domain, strict TypeScript, Zod boundary validation, first-party session authentication, Razorpay integration, notification orchestration, private GridFS upload handling, feature gates, MongoDB validators, and extensive role-oriented interfaces.

The project is **pilot-capable in source but not production-launch-ready today**. The current release gate is red because lint and the production build fail. The live Chromium suite passes 16 of 21 tests. Database, authentication, payment, messaging, scanning, monitoring, and production-domain credentials are absent locally. Terms and privacy pages are intentional placeholders. Current `npm audit` reports five high-severity advisories.

### Recommended release decision

**Do not deploy this commit to production.**
Use it as a strong pilot implementation baseline, then complete the P0 release-remediation checklist in section 18.

---

## 2. Current status scorecard

| Area | Status | Evidence |
| --- | --- | --- |
| Product architecture | Strong | Modular monolith, explicit state machines, server-side gates |
| Public experience | Implemented | Marketing, services, city SEO, safety, societies, membership, journal |
| Customer workspace | Implemented in source | Pets, health records, bookings, payments, tracking, reports, privacy |
| Saathi workspace | Implemented in source | Application, availability, assignments, service events, reports, earnings |
| Admin operations | Broadly implemented | Matching, safety, finance, verification, content, features, B2B |
| Database design | Extensive | 134 models, 59 enums, 19 migrations |
| API surface | Extensive | 111 route handlers |
| Type safety | Pass | `npm run typecheck` |
| Unit tests | Pass | 25 files, 61 tests |
| Lint | Fail | 24 errors, 2 warnings |
| Production build | Fail release gate | Compilation succeeds; lint validation blocks completion |
| Chromium E2E | Partial | 16/21 pass |
| Accessibility automation | Pass in current Chromium run | Public-route serious/critical scan passed |
| Integration/database replay | Not currently verifiable | `DATABASE_URL` and `DIRECT_URL` absent |
| Provider integrations | Implemented but inactive | Required credentials absent |
| Legal readiness | Blocked | Terms and privacy remain placeholders |
| Dependency security | Blocked | Five high-severity audit findings |
| Production readiness | **Not ready** | P0 release blockers remain |

---

## 3. Repository scale and structure

### Measured size

| Metric | Count |
| --- | ---: |
| TypeScript/TSX/CSS source files | 353 |
| Source lines | 18,801 |
| Test files | 31 |
| Test lines | 930 |
| Application pages | 80 |
| API route handlers | 111 |
| Prisma models | 134 |
| Prisma enums | 59 |
| Database migrations | 19 |
| Unit-test files | 25 |
| Integration-test files | 3 |
| E2E test cases | 21 |

### Primary directories

- `src/app`: Next.js App Router pages, portal routes, APIs, metadata, PWA, and error boundaries.
- `src/modules`: Server-focused domain logic, validation, state machines, permissions, finance, safety, and workflows.
- `src/components`: Marketing, forms, portal actions, motion, branding, SEO, and shared UI.
- `prisma`: Canonical schema, additive migrations, and safe non-commercial seed data.
- `tests`: Unit, PostgreSQL integration, accessibility, and browser E2E coverage.
- `docs`: Requirements, implementation status, environment contract, runbooks, SOPs, design reports, and security notes.
- `public`: PWA files, brand assets, service imagery, generated visual assets, and care films.
- `.github/workflows`: Release-gating CI.

### Architecture choice

The project uses a **modular monolith**. This is the recommended implementation for the pilot because it keeps transactions, authorization, and operational workflows in one deployable unit.

Tradeoff:

- Benefit: simpler transactional correctness, fewer network boundaries, and easier audit tracing.
- Cost: the 134-model schema and 111-route API surface are large for a one-area pilot and require disciplined ownership, documentation, and regression testing.

---

## 4. Product definition and launch scope

PetSaathi connects pet parents with service-approved local caregivers through assisted matching rather than an uncontrolled directory.

### Initial operating assumptions

- Launch city: Ahmedabad.
- Primary micro-market: Bopal.
- Secondary area: Satellite after stability.
- Initial active services: dog walking and home pet sitting.
- Initial supply: 3–5 approved Saathis.
- Initial capacity: three bookings per day.
- Matching: hard eligibility filters followed by human approval.
- Payments: verified server-priced prepayment.
- Risk scope: Green and selected Yellow cases.

### Product differentiators

- Evidence-backed caregiver verification.
- Service-specific permissions instead of generic approval.
- Assisted matching with manual operations control.
- Immutable price and quote records.
- Structured care milestones and report cards.
- Controlled, consent-bound live tracking.
- Formal incident, no-show, replacement, complaint, and support workflows.
- Role-separated safety, verification, operations, finance, and content administration.

### Claims deliberately excluded

The product must not claim diagnosis, guaranteed veterinary availability, guaranteed transport, insurance coverage, or universal caregiver safety.

---

## 5. Technology stack

### Frontend

- Next.js 15.5 App Router.
- React 19 and React Server Components.
- Strict TypeScript 5.9.
- Tailwind CSS with a local shadcn-compatible UI layer.
- Framer Motion, GSAP, Lenis, Three.js, React Three Fiber, and progressive visual effects.
- Next Image, typed routes, metadata, sitemap, robots, JSON-LD, and PWA assets.

### Backend

- Next.js Route Handlers and server-only domain modules.
- PostgreSQL through Prisma 6.
- MongoDB-backed OTP/password authentication, opaque SSR sessions, database validators, and private GridFS storage.
- Zod validation for request and domain inputs.
- Database-backed rate limiting.

### Integrations

- Razorpay orders, checkout verification, webhooks, refunds, and subscription foundations.
- Resend transactional email.
- WhatsApp Cloud API notification adapter.
- Sentry server, edge, client, and source-map configuration.
- Configurable Mappls, Google, or disabled map provider.
- Scanner callback and private upload lifecycle.

### Delivery

- Vercel-oriented deployment contract.
- GitHub Actions for quality, database, and E2E jobs.
- PWA service worker with controlled caching.

---

## 6. User roles and access model

The database defines customer, caregiver, specialist-admin, city, operator, and super-admin roles.

### Principal roles

- Guest
- Customer
- Sitter/Saathi
- Operations Admin
- Verification Admin
- Safety Admin
- Finance Admin
- Content Admin
- Society Manager
- Partner Manager
- City Manager
- Operator
- Super Admin

### Authorization layers

Sensitive actions are designed to verify:

1. Active server-managed MongoDB session.
2. Active application user.
3. Required role or permission.
4. Resource ownership or assignment.
5. Current business state.
6. Service/feature eligibility.
7. Audited decision metadata where required.

### Identified authorization maintenance risk

`prisma/schema.prisma` includes `CITY_MANAGER` and `OPERATOR`, while the separate role list in `src/modules/auth/permissions.ts` does not. Current operator routes use Prisma roles directly, so this is not proof of an immediate access bypass; however, the duplicated role definitions can drift.

**Recommendation:** generate or import a single canonical role type and maintain one central permission matrix.

---

## 7. End-to-end customer journey

### Public discovery

- Homepage with care matching, service shortcuts, care films, stories, trust evidence, and concierge.
- Services catalogue and service-detail pages.
- City and city/service SEO pages.
- Caregiver, safety, society, membership, journal, about, contact, privacy, and terms routes.
- Public leads, lead magnets, community joining, and consent-controlled testimonial endpoints.

### Authentication

- Phone OTP request and verification through the server-side MongoDB auth module and configured SMS webhook.
- Server-side rate limiting.
- Fail-closed behavior when authentication configuration is missing.
- Protected portal routes redirect anonymous users to sign-in.

### Customer setup

- Customer profile.
- Address creation and ownership.
- Pet profile creation.
- Versioned care instructions.
- Medications, vaccination records, health events, and emergency context.
- Communication and privacy preferences.

### Booking

1. Select service, pet, date, time, and locality.
2. Validate service area, active price version, and capacity.
3. Create an immutable quote snapshot.
4. Reserve capacity atomically.
5. Conduct risk review where required.
6. Match only eligible and service-permitted Saathis.
7. Present a proposal for customer approval.
8. Create a server-priced payment order.
9. Verify provider signatures and webhooks.
10. Confirm the booking without trusting client payment state.

### Care delivery

- En-route, arrival, start, update, completion, and report milestones.
- Optional feature-gated live tracking.
- Private photo and report records.
- Concern and incident escalation.

### Completion

- Saathi submits a versioned report.
- Operations or Safety reviews the report.
- Correction creates a new immutable version.
- Booking closure and payout eligibility wait for report approval.
- Customer receives the report and may review, complain, request support, or repeat care.

---

## 8. End-to-end Saathi journey

1. Submit structured application.
2. Complete identity/evidence verification.
3. Complete training and practical assessment.
4. Receive service-specific permissions.
5. Configure availability and exceptions.
6. Receive eligible assignment offers only.
7. Accept or decline.
8. Wait for customer approval.
9. Receive exact care instructions only after authorization.
10. Record service events and controlled tracking.
11. Submit a structured report.
12. Respond to correction requests when necessary.
13. Receive payout only after report approval and booking closure.

### Safety protections

- Expired, suspended, held, or unpermitted Saathis are excluded from matching.
- Incident-linked holds are separate from the profile status.
- No-show and cancellation recovery preserve history.
- Replacement assignments reuse verified captured payment rather than requesting a second charge.

---

## 9. Admin, safety, finance, and operations

### Operations

- Request queue.
- Risk review.
- Matching and assignment proposals.
- Capacity controls.
- Live service monitoring.
- No-show and replacement handling.
- Report review.
- Support-case transitions.

### Safety

- Customer/Saathi incident reporting.
- Incident hold on affected bookings.
- Append-only timeline.
- Owner, veterinary, transport, monitoring, and evidence events.
- Corrective actions with owner, deadline, and completion evidence.
- Purpose-limited Saathi holds.
- Controlled closure that cannot bypass report review.

### Verification

- Sitter verification evidence.
- Training attempts.
- Status decisions.
- Service-permission decisions.
- Expiry and revocation handling.

### Finance

- Immutable service-price versions.
- Customer and Saathi amount separation.
- Payment verification.
- Refund transitions.
- Payout transitions and adjustments.
- Capacity-linked booking economics.
- Statement reconciliation and mismatch recording.
- Enterprise invoices and credit notes.

### Content and growth

- Structured content drafts.
- Review, approval, publication, and archive states.
- Mandatory expert review for health/safety content.
- Consent-controlled testimonials.
- Leads, campaigns, community, and outreach foundations.

---

## 10. Society, partner, B2B, and scale modules

### Society

- Society records and public discovery.
- Resident membership foundations.
- Approved sitter pools.
- Events and agreements.
- Society-manager workspace.
- Server-side `society_portal` gate.

### Partner services

- Grooming, veterinary support, training, and other adjacent-service foundations.
- Partner, location, verification, service, and order records.
- Request-only customer workflow.
- Audited manager fulfilment state machine.
- No partner-service payment collection until commercial policy is approved.

### B2B and enterprise

- Organizations and contacts.
- Opportunity pipeline.
- Contracts.
- Partner programmes.
- Eligibility verification.
- Programme memberships.
- Benefit wallets and immutable benefit ledger.
- Promotions.
- Enterprise invoices, payment records, and credit notes.
- Reporting and investor metrics.

### City and operator scale

- City launch stages.
- Service zones.
- City health and financial records.
- City managers.
- Operating partners and territories.
- Territory-scoped RBAC helpers.

These later-phase modules are valuable foundations but materially expand the audit and maintenance surface. They should remain disabled until the Ahmedabad pilot proves operational demand.

---

## 11. Service catalogue and feature gates

### Seeded active service records

- 30-minute dog walk.
- 60-minute dog walk.
- Home visit.
- One-hour home sitting.

### Seeded inactive/manual services

- Travel sitting.
- Boarding beta.
- At-home grooming.
- Veterinary support.
- Training assessment.
- Pet taxi.

### Seeded server-side feature flags

- `boarding_beta`
- `live_walk_tracking`
- `society_portal`
- `subscriptions`
- `partner_marketplace`
- `travel_sitting`
- `multi_city`
- `loyalty_referrals`
- `society_events`
- `public_testimonials`
- `enterprise_accounts`
- `advanced_pet_health`

All are seeded disabled. This is an appropriate fail-closed default.

---

## 12. Data architecture

The schema contains 134 models and 59 enums. Major domains include:

- Identity and access.
- Pets, health, care instructions, and risk.
- Saathi trust, training, verification, and availability.
- Catalogue, pricing, city, service area, and capacity.
- Bookings, assignments, events, reports, and reviews.
- Payments, refunds, payouts, credits, and reconciliation.
- Incidents, evidence, notifications, holds, and corrective actions.
- Notification outbox and provider deliveries.
- Support, complaints, and communication preferences.
- Society, partner, and operator records.
- Subscriptions, entitlements, loyalty, and referrals.
- Content, consent, testimonials, campaigns, and leads.
- B2B organizations, contracts, programmes, wallets, and invoices.
- City health, financial metrics, and scale governance.

### Important invariants

- Booking end must follow booking start.
- Client-provided price identifiers are revalidated.
- Quote, capacity reservation, and booking creation commit together.
- One active primary/replacement assignment is allowed.
- Payment events are idempotent.
- Booking state changes are immutable.
- Report correction creates a new version.
- Open incidents block report approval.
- Report approval gates closure and payout.
- Replacement matching preserves captured payment and capacity.
- Critical incident closure requires response and corrective evidence.
- Public trust evidence must be current and non-revoked.

### Database strategy

- Pooled `DATABASE_URL` for runtime.
- Direct `DIRECT_URL` for migrations.
- Additive migrations.
- Roll-forward recovery instead of destructive rollback.
- Seed data avoids invented prices by using zero-value legacy fields and requiring approved immutable price records.

---

## 13. API architecture

### API distribution

| Group | Routes |
| --- | ---: |
| Admin | 51 |
| Bookings | 9 |
| Customer | 7 |
| Saathi | 7 |
| Pets | 6 |
| Public | 4 |
| Partner programmes | 4 |
| Auth | 3 |
| Webhooks | 3 |
| Jobs | 3 |
| Privacy | 2 |
| Account requests | 2 |
| Other focused groups | 13 |

### Boundary patterns

- Zod validation.
- Server-side identity lookup.
- Role/resource checks.
- State-machine transition checks.
- Same-origin browser mutation protection.
- Database-backed rate limits.
- Provider-signature verification.
- Idempotency records for payments, notifications, jobs, and ledgers.
- Server-only modules for secrets and privileged clients.

### API documentation gap

There is no generated OpenAPI contract or route catalogue. With 111 handlers, this is now a maintainability and integration risk.

**Recommendation:** introduce a typed API inventory or OpenAPI generation for externally consumed endpoints and operational callbacks.

---

## 14. Security and privacy assessment

### Implemented controls

- Opaque session-cookie verification against hashed MongoDB session records.
- Role and resource authorization.
- RLS-enabled migrations and revoked broad PostgREST access.
- Same-origin protection for browser mutations.
- Database-backed rate limiting.
- HMAC and timing-safe Razorpay verification.
- Private upload quarantine and scanner callback.
- Expiring private-object access patterns.
- Audit records for privileged workflows.
- Consent, account request, and DPDP-oriented data subject request models.
- Tracking retention configuration.
- PII-conscious Sentry integration.
- Security headers: CSP, frame denial, MIME sniffing prevention, referrer policy, and permissions policy.

### Security gaps and risks

#### [Critical] Production configuration does not fail hard

Core database, auth, and provider variables are optional in `src/lib/env.ts`. This is appropriate for local fail-closed demos, but a production deployment can boot while essential dependencies are absent. `/api/health` returns `status: "ok"` even when database, auth, and payments are `not_configured`.

**Recommendation:** add production-only required-variable validation and a separate readiness endpoint that returns non-2xx when mandatory dependencies are unavailable.

#### [Critical] Five high-severity dependency advisories

Current `npm audit --omit=dev` reports:

- `next`
- `postcss`
- `sharp`
- `fast-uri`
- `brace-expansion`

There are zero critical advisories, but five high-severity findings. The older dependency note describing only a moderate PostCSS issue is no longer current.

**Recommendation:** evaluate supported upgrades in a dedicated branch, run the entire quality/database/E2E matrix, and avoid blind `npm audit fix --force`.

#### [Critical] Legal policies are placeholders

The terms and privacy routes explicitly state that final entity, vendor, retention, cancellation, refund, safety, and DPDP language is not approved.

#### [High] CSP remains permissive

The CSP contains `script-src 'unsafe-inline' 'unsafe-eval'`. This may support current framework/motion behavior but weakens XSS defence.

**Recommendation:** define development and production policies separately, adopt nonces/hashes where practical, and remove `unsafe-eval` from production.

#### [High] Role definitions are duplicated

Prisma and the local permission module do not expose an identical role set.

#### [Medium] Logging is inconsistent

Some routes use structured event-style keys, while marketing and content routes use ad hoc `console.log/error`. A central PII-redacting logger is not evident.

#### [Medium] Operational security evidence remains missing

No current restore drill, secret-rotation drill, webhook replay drill, or production incident exercise was verified during this audit.

---

## 15. UI, design, accessibility, and content

### Design system

- Warm premium palette with saffron, coral, indigo, leaf, paper, and cream.
- Editorial display typography paired with legible operational UI.
- Premium pet-care photography and care films.
- Progressive motion and 3D enhancements.
- Reduced-motion support.
- Responsive public, customer, caregiver, and admin surfaces.

### Recent homepage state

- Background imagery is visible without the former dark overlay.
- Content imagery uses distinct topic-specific sources.
- Cat imagery appears in home care, sitting, grooming, veterinary, and mixed-pet contexts.
- Header and footer intentionally reuse the same logo.

### Accessibility

The current Chromium accessibility test passed its serious/critical automated checks across the configured public routes.

Automated testing does not replace:

- Keyboard-only manual testing.
- Screen-reader testing.
- Zoom and text-spacing testing.
- Color-contrast review for image overlays.
- Reduced-motion testing on actual devices.

### Content readiness

- Product and safety language is generally careful and avoids unsupported guarantees.
- Journal publication is state-controlled.
- Health and safety content requires expert review.
- Terms and privacy content are not production-ready.
- Final brand-asset licences and approved photography rights remain owner inputs.

---

## 16. Testing and current verification

### Commands executed on 29 July 2026

```powershell
npm run check
npm run typecheck
npm run test
npm run build
npm run test:e2e -- --project=chromium
npx prisma validate
npm audit --omit=dev
```

### Results

| Check | Result |
| --- | --- |
| Strict TypeScript | Pass |
| Unit tests | 25 files, 61 tests passed |
| Lint | Fail: 24 errors, 2 warnings |
| Production compilation | Compiles |
| Production build gate | Fail during lint validation |
| Chromium E2E | 16 passed, 5 failed |
| Accessibility E2E | Pass in current Chromium run |
| Prisma validation | Not runnable without `DIRECT_URL` |
| Integration tests | Not rerun; database URLs absent |
| Local health | Unavailable after E2E server stopped |
| Dependency audit | 5 high, 0 critical |

### Lint/build blockers

- Unused imports in services and marketing components.
- Explicit `any` usage in marketing and OriginKit motion components.
- Missing React Hook dependencies in motion components.

### Current E2E failures

1. Logo test uses a strict locator that matches both header and footer.
2. Veterinary-support tab test is ambiguous between hero-film and journey tablists.
3. Cursor halo remains hidden after pointer movement in the test environment.
4. Care-film poster expectation omits the current cache-busting query string.
5. Quick-match test searches for the old CTA label.

Four failures appear to be test drift or selector ambiguity. The cursor case requires a product decision and behavior verification.

### Historical but not current evidence

`docs/implementation-status.md` records successful migration replay, integration tests, build, and full E2E on 19 July 2026. Those results are useful history but must not be presented as the status of the current 29 July commit.

---

## 17. CI/CD, deployment, and observability

### GitHub Actions

The CI workflow contains:

- Quality job: install, lint, typecheck, unit tests, build.
- Database job: PostgreSQL 16, migration replay, seed, integration tests, Prisma validation.
- E2E job: Chromium installation, browser tests, report artifact.

This is an appropriate release-gating structure. The current commit would fail the quality and E2E jobs.

### Deployment contract

Required release sequence:

1. Review and apply additive migrations.
2. Run all quality and database gates.
3. Deploy an immutable preview.
4. Run browser smoke tests.
5. Promote the verified build.
6. Verify health/readiness.
7. Enable features gradually.

### Rollback

- Re-promote the last known-good Vercel build.
- Preserve backward compatibility for at least one release.
- Roll forward database corrections.
- Rotate exposed credentials.
- Record an incident before restoring affected services.

### Observability

Implemented:

- Sentry client/server/edge configuration.
- Source-map upload support.
- Health endpoint.
- Notification, incident, reconciliation, and job records.
- Observability and incident runbooks.

Missing or unverified:

- Current production Sentry project and alerts.
- Central structured logger.
- Readiness checks that test real connectivity.
- External uptime monitor.
- Queue depth, webhook failure, reconciliation mismatch, and incident-SLA dashboards.

### Minimum production alerts

- Error-rate and latency spike.
- Authentication failure spike.
- Payment/webhook verification failure.
- Notification outbox backlog.
- Scanner callback backlog.
- Capacity or price configuration error.
- Incident acknowledgement SLA breach.
- Reconciliation mismatch.
- Database connection exhaustion.

---

## 18. Prioritized risk register and remediation

### [Critical] P0 — release gate is red

**Effort:** 1–2 days
**Risk:** High

- Remove unused imports.
- Replace unsafe `any` types.
- stabilize hook dependencies.
- Re-run lint and production build.
- Update the five stale/ambiguous E2E checks.
- Confirm cursor behavior or remove the obsolete expectation.

### [Critical] P0 — dependency advisories

**Effort:** 1–3 days
**Risk:** High

- Upgrade Next.js and affected transitive packages through supported versions.
- Re-run unit, integration, E2E, image, and payment-signature tests.
- Update `docs/security-dependency-notes.md`.

### [Critical] P0 — production configuration gate

**Effort:** 1 day
**Risk:** High

- Require core environment variables in production.
- Add dependency connectivity checks.
- Return non-2xx readiness when core dependencies fail.
- Keep the current fail-closed local behavior.

### [Critical] P0 — legal and commercial decisions

**Effort:** Owner/legal dependent
**Risk:** High

- Final legal entity and contact details.
- Terms, privacy, cancellation, refund, safety, emergency, and partner policies.
- Customer prices, Saathi payouts, taxes, and cancellation windows.

### [Critical] P0 — production integrations

**Effort:** 2–5 days after credentials
**Risk:** High

- MongoDB Atlas project, database collections, auth collections, and GridFS bucket.
- Razorpay sandbox-to-production verification.
- OTP sender.
- Resend and WhatsApp.
- Scanner.
- Maps.
- Sentry and analytics.

### [High] P1 — current database verification

**Effort:** 0.5–1 day
**Risk:** High

- Replay all migrations in disposable PostgreSQL.
- Run seed.
- Run all three integration suites.
- Verify RLS using anon, authenticated, and service-role clients.
- Test backup and restore.

### [High] P1 — authorization consolidation

**Effort:** 1–2 days
**Risk:** Medium

- Unify Prisma roles and application permissions.
- Add matrix tests for every privileged API group.
- Add territory-scope tests for City Manager and Operator.

### [High] P1 — observability hardening

**Effort:** 1–2 days
**Risk:** Medium

- Add a structured, PII-redacting logger.
- Configure production alerts.
- Add operational dashboards and runbook links.

### [High] P1 — performance budget

**Effort:** 1–2 days
**Risk:** Medium

- Complete a production build after lint repair.
- Measure route bundles and Core Web Vitals.
- Ensure Three.js, GSAP, and large media are loaded only where required.
- Add `images.qualities` before Next.js 16; current E2E emitted warnings for quality `100`.

### [Nice-to-Have] P2 — API and architecture documentation

**Effort:** 2–3 days
**Risk:** Low

- Generate an API inventory/OpenAPI surface.
- Add domain ownership and state-machine diagrams.
- Add an architecture-decision record for the large future-phase schema.

---

## 19. Environment and secret inventory

### Required authenticated core

- `DATABASE_URL`
- `DIRECT_URL`
- `MONGODB_URI`
- `MONGODB_DATABASE`
- `AUTH_SECRET`
- `UPLOAD_SIGNING_SECRET`
- `NEXT_PUBLIC_APP_URL`

### Capability-specific

- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `REQUIRED_SITTER_VERIFICATIONS`
- `REQUIRED_SITTER_TRAINING_MODULES`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_BUSINESS_ACCOUNT_ID`
- `CRON_SECRET`
- `SCANNER_CALLBACK_SECRET`
- `TRACKING_RETENTION_DAYS`
- `SENTRY_DSN`
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `SENTRY_AUTH_TOKEN`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_MAP_PROVIDER`

No secret values should be committed or copied into documentation.

---

## 20. Recommended implementation sequence

### Next 48 hours

1. Repair lint/build and update the five E2E checks.
2. Upgrade or formally triage all five high-severity dependency findings.
3. Add production environment/readiness enforcement and re-run `npm run check`.

### Following 7 days

1. Provision disposable PostgreSQL and replay migrations.
2. Run integration, RLS, restore, and idempotency tests.
3. Configure MongoDB Atlas and Razorpay sandbox credentials.
4. Complete one end-to-end customer/Saathi/admin booking simulation.
5. Approve pilot pricing, capacity, service areas, and safety evidence policy.

### Before pilot launch

1. Obtain approved legal and privacy copy.
2. Verify production provider credentials and webhook endpoints.
3. Complete security review and dependency remediation.
4. Conduct incident, refund, replacement, and restore drills.
5. Validate the Bopal caregiver pool and clinic/emergency directory.
6. Deploy a preview, pass all CI gates, and obtain launch sign-off.

---

## 21. Final assessment

PetSaathi has a serious production architecture and unusually broad operational coverage for an early pet-care marketplace. The booking, safety, finance, privacy, content, and expansion domains are modelled with a clear bias toward auditability and controlled activation.

Its principal weakness is not missing ambition; it is the gap between the breadth of implemented source and the current release state. The application needs a short, focused stabilization cycle, current database/provider verification, legal/commercial decisions, and production operational evidence.

**Final status: production-oriented pilot implementation, currently blocked from release.**

---

## 22. Source map

- Product requirements: `docs/requirements-matrix.md`
- Prior implementation status: `docs/implementation-status.md`
- Environment/deployment contract: `docs/environment.md`
- Database: `prisma/schema.prisma`, `prisma/migrations`, `prisma/seed.mjs`
- Authorization: `src/modules/auth`, `src/modules/rbac`
- Security: `src/middleware.ts`, `src/modules/security`, `next.config.mjs`
- Booking lifecycle: `src/modules/bookings`
- Payments: `src/modules/payments`
- Safety: `src/modules/incidents`, `src/app/api/admin/incidents`
- Reports and payouts: `src/modules/reports`, `src/app/api/admin/reports`
- B2B: `src/modules/b2b`
- Privacy: `src/modules/privacy`, `src/app/api/privacy`
- Feature gates: `src/modules/features/server.ts`
- CI: `.github/workflows/ci.yml`
- Tests: `tests/unit`, `tests/integration`, `tests/e2e`
- Runbooks: `docs/*runbook.md`, `docs/observability-runbook.md`
