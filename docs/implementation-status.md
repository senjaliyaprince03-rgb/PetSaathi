# PetSaathi implementation status

Last verified: 19 July 2026 (Asia/Kolkata)

This document separates implemented software from production activation. A feature is not considered live merely because its UI, API, schema or provider adapter exists.

## Release position

PetSaathi is a production-oriented pilot implementation for Ahmedabad. The public experience, core customer and Saathi journeys, controlled operations workflows, security boundaries, database migrations and automated release gates are implemented. Production activation remains intentionally fail-closed until the owner decisions and live credentials in `docs/requirements-matrix.md` section 15 are supplied and verified.

## Implemented and verified

- Immersive, responsive marketing experience with an original visual system, WebGL/3D enhancement, reduced-motion handling, service pages, safety, societies, membership, journal and contact surfaces.
- Phone OTP entry points with server-side rate limits and fail-closed behavior when Supabase is not configured.
- Customer pet, address, booking, assignment approval, payment, refund, review, notification, tracking and privacy-request workflows.
- Authenticated support cases and booking complaints with rate limits, ownership checks, duplicate-open-case prevention, dedicated operations/safety queues, audited transitions and terminal-resolution requirements.
- Authenticated My Pets workspace with versioned care instructions, structured medication/vaccination records, owner-reported health timelines, medication closure, ownership checks, rate limits and medical disclaimers.
- Authenticated care-update channel preferences with mandatory in-app operational notices and promotional messaging held off until the consent policy is approved.
- Fail-closed booking economics with active city/PIN-code service areas, immutable area/global price versions, accepted quote snapshots, per-area/service/date capacity limits and one-to-one capacity reservations committed in a serializable transaction.
- Audited Super Admin service-area controls, Finance price-version controls, Operations capacity controls, pre-payment customer cancellation with atomic capacity release, and Razorpay statement reconciliation with expected/actual/difference records.
- Versioned care-report review with Operations/Safety approval, correction and escalation paths; booking closure and capacity consumption occur only after approval, while Finance payout actions remain locked until the quality gate is complete.
- Saathi payout amounts now come from the accepted immutable service-price record, not an environment percentage; payout changes require decision notes, preserve adjustments, emit audit records and notify the Saathi when paid.
- Full incident-response workflow: customer/Saathi reporting, booking incident holds, Safety timeline/contact/veterinary/transport/review records, private quarantined evidence promotion, audited state transitions, owned corrective actions and controlled closure/recovery.
- Incident-linked, purpose-limited Saathi holds prevent new matching and acceptance without silently changing the Saathi profile; releases and expiry metadata are independently auditable.
- Operations no-show and Saathi pre-travel cancellation recovery: immutable history, preserved original payment and capacity hold, replacement-only matching and customer approval that verifies and reuses the original captured payment without a second charge.
- Saathi application, eligibility, verification, training, assignment response, care events, reports and explicit live-location controls.
- Operations and Super Admin queues for matching, risk review, safety, verification, finance, leads, feature flags, privacy and controlled content publishing.
- Razorpay order, signature, webhook, refund and subscription adapters with idempotent state transitions; no unverified client-side payment state is trusted.
- Notification outbox with provider dispatch, retry state, authenticated inbox and idempotent event enqueueing. Incident-notification records uniquely mirror their linked outbox lifecycle and timestamp recipient acknowledgement without conflating it with incident closure evidence.
- Private upload quarantine, signed manifests, scanner callback, MIME enforcement, promotion/rejection and retention cleanup.
- PostgreSQL/Prisma schema, additive migrations, RLS policies, private-table PostgREST revocations, assignment invariants and seed data.
- Private, feature-gated foundations for society pools/events/agreements, multi-city geography/capacity, entitlement consumption, loyalty/referrals, consented testimonials, campaigns/experiments and governance job/audit records. Partner services now have a request-only customer workspace and manager fulfilment queue, current-verification admission checks, audited state transitions and no payment collection until commercial policy is approved.
- Same-origin mutation protection, role/resource authorization, database-backed rate limits, audited privileged actions and PII-safe Sentry setup.
- PWA shell caching that excludes authenticated, API and portal data.
- CI gates for lint, strict typecheck, unit tests, production build, migration replay, seed validation and Playwright E2E.

## Controlled or gated

- Boarding, memberships and live walk tracking remain server-feature-gated.
- Journal content is hidden until it passes the editorial workflow; medical, health and safety content additionally requires an approved expert review.
- Privacy deletion records the request but cannot delete an account from the review endpoint; identity verification and a separate execution process are required.
- Upload scanning is implemented but remains unavailable until a production scanner and callback secret are configured.
- Payment, refund, payout, subscription, email and OTP provider calls remain unavailable until their production credentials and operating policies are approved.
- Pilot locality and daily capacity are database-backed and role-gated; no area, price or date is bookable until explicitly approved. Final commercial values and launch PIN codes remain owner inputs.

## Canonical domain coverage

All named application-owned records in `docs/requirements-matrix.md` section 8 now have an explicit PostgreSQL model or a documented platform-owned equivalent. `sessions` are intentionally owned by Supabase Auth (`auth.sessions`) and are not duplicated into the public application schema. The canonical `admin_audit_logs` responsibility is implemented by the append-only `audit_logs` model used by privileged workflows. Booking-status words found by mechanical requirement scans are enum values, not missing tables.

The second canonical-domain migration adds structured household access; pet media, care, medication, vaccination and health history; risk factors; sitter applications, practical assessments, boarding properties and reliability history; immutable service pricing and quotes; booking instructions; complaints and support; communication preferences/templates; payout adjustments and reconciliation; incident evidence/notifications/holds; subscription events; authors and city pages. Following additive migrations add auditable capacity reservations, nullable-scope price-version uniqueness, the report-review lifecycle, safety/recovery integrity constraints, and one-to-one incident-notification/outbox delivery linkage. All remain private to server-side projections until narrower policies are reviewed.

## Production blockers — owner input required

- [Critical, medium effort, high risk] Final customer prices, Saathi payouts, cancellation/refund windows and tax treatment.
- [Critical, medium effort, high risk] Approved terms, privacy, cancellation, safety, emergency and partner-contract copy plus legal entity details.
- [Critical, medium effort, high risk] Supabase, Razorpay, OTP, Resend/WhatsApp, maps, analytics and Sentry production credentials.
- [Critical, medium effort, high risk] Verified launch-city Saathi evidence policy, clinic/partner directory and emergency contacts.
- [Critical, low effort, medium risk] Production domain, sender domain, final logo/font rights and approved photography/illustration assets.
- [Critical, low effort, medium risk] Mappls versus Google Maps pilot-area benchmark decision.

## Latest release evidence

- ESLint: pass with zero warnings.
- TypeScript: strict no-emit check passes.
- Unit tests: 24 files, 59 tests pass.
- PostgreSQL integration tests: 3 files, 10 transaction/constraint tests pass for booking economics, cancellation release, report correction/resubmission, booking closure/capacity consumption, incident response/closure, corrective actions, active-assignment uniqueness, incident-notification delivery/acknowledgement linkage, no-show recovery and replacement payment reuse.
- Prisma: schema validates; all 19 migrations replayed from zero in disposable PostgreSQL, seed completed, and database constraints reject duplicate active primary/replacement assignments, duplicate incident-notification/outbox linkage, invalid incident closure metadata and corrective-action completion without evidence.
- Production build: Next.js 15.5.20 compiled successfully; 51 pages generated, including Service Monitor, Safety command workflow and incident/recovery APIs.
- Browser E2E: 20/20 pass across desktop Chromium and Pixel 7 emulation, including anonymous support/pet-health privacy, admin-only catalog/finance controls, anonymous capacity-reservation denial and anonymous incident/no-show/Safety-control denial.
- Accessibility: seven public routes have no serious or critical automated WCAG 2.1 A/AA violations in either desktop or mobile projects.
- Local health endpoint: web service is healthy; database, auth and payment providers correctly report `not_configured` without local secrets.

## Known accepted dependency risk

`docs/security-dependency-notes.md` records the current moderate PostCSS advisory inherited through Next.js. The package manager cannot safely override Next.js's exact transitive version without invalidating the dependency tree; forced downgrade/audit-fix is prohibited. Recheck on each framework release and upgrade through a compatible Next.js version.
