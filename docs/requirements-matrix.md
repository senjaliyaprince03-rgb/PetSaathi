# PetSaathi canonical requirements matrix

This document is the implementation baseline for the PetSaathi platform. It consolidates the eight supplied specifications covering phases 0–14 and separates enduring product requirements from launch-stage operational guidance.

## 1. Source audit

| Source | Pages | Ordered blocks | Tables | Media | External links | SHA-256 |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Phase 0 and 1 | 518 | 12,009 | 92 | 0 | 0 | `4b364a24caaec17bf768e0aa6077d28d7eaa35dd25c231e8aafd69c3cae47e1c` |
| Phase 2 and 3 | 618 | 13,481 | 200 | 0 | 0 | `1fa927f899255f88323e3d33781ee9974f29d1bb86caaca372c940a9a61b611c` |
| Phase 4 | 962 | 24,138 | 130 | 0 | 0 | `5426ebf10f9b970f1c57dc5543bf26796a6e56d96c9b5acf7e18fd0683bc847c` |
| Phase 5 and 6 | 1,169 | 29,007 | 199 | 4 | 0 | `6a14f728bb25e44536534588950d38d1dff5db72fad5328e77a7014acb80d614` |
| Phase 7 | 640 | 15,216 | 169 | 0 | 0 | `2d499cd3fb91bcfb951ff389d9996e02555d50acc11a0a9d7095ddac41b77cb5` |
| Phase 8 and 9 | 938 | 20,981 | 375 | 8 | 0 | `48839bf45bcff90d2695a20cc11f0d6dc491ef56f44fe0f81246f54684f7a287` |
| Phase 10 and 11 | 592 | 12,794 | 250 | 9 | 0 | `16afb7cd738eb808e7a879e5a9e092800e63249d3ae90fbf5b21b500b64bfc04` |
| Phase 12, 13 and 14 | 485 | 11,559 | 126 | 0 | 77 | `f7b53cc88980f8055d48451346c6d149eab8e31814c489c792fdb62d6591dc2a` |
| **Total** | **5,922** | **139,185** | **1,541** | **21** | **77** | — |

The sources contain no comments or tracked changes. Machine-readable reports and representative page renders are under `analysis/specs/`.

## 2. Product definition

PetSaathi is an India-focused, trust-first pet-care marketplace that connects pet parents with service-approved local caregivers. Its primary differentiators are assisted matching, evidence-backed verification, structured service proof, controlled live tracking, pet report cards, and formal incident escalation.

The platform must not claim to provide veterinary diagnosis, guaranteed clinic availability, guaranteed transport, insurance coverage, or universal sitter safety. Public trust claims must be generated from valid underlying evidence and expiry status.

### Initial operating scope

- Launch city: Ahmedabad.
- Primary micro-market: Bopal.
- Secondary area after stability: Satellite.
- Active services: dog walking and home pet sitting.
- Boarding: feature-flagged, admin-approved beta only.
- Matching: hard eligibility filters plus human decision.
- Payment: verified full prepayment.
- Initial risk acceptance: Green and selected Yellow cases.
- Initial supply: 3–5 approved sitters.
- Initial booking cap: 3 bookings/day; increase only after stability.

## 3. Phase roadmap

| Phase | Business purpose | Product or platform implication |
| --- | --- | --- |
| 0 | Vision, research, city selection, economics and trust promise | Preserve assumptions and metrics as configurable operational data, not hard-coded claims. |
| 1 | Demand validation and landing experience | Conversion-oriented public site, lead capture, sitter applications, society enquiries and analytics. |
| 2 | Concierge pilot | Structured records for every customer, pet, sitter, booking, payment, report, complaint and payout. |
| 3 | Sitter trust and operating model | Verification, training, practical assessment, service permissions, pet-risk classification and emergency SOPs. |
| 4 | Website/PWA MVP | Three role-based experiences, complete booking/payment/report/incident flow, private storage and audit history. |
| 5 | Controlled one-area launch | Capacity controls, launch dashboards, funnel and unit-economics metrics, operational gates. |
| 6 | Safety, tracking, automation and reliability | GPS sessions, automated report drafts, reminders, escalation, backups, reliability scoring, incidents and command centre. |
| 7 | Society partnerships | B2B2C society pages, resident verification, approved sitter pools, local calendars, alerts, partnership dashboard and agreements. |
| 8 | Adjacent service expansion | Partner-operated grooming, vet support/camps, training, pet taxi pilot and product partnerships, each separately gated. |
| 9 | Subscriptions and membership | Walking subscriptions first, then pet-parent membership, sitter pro, society and partner plans with immutable entitlements. |
| 10 | Multi-city expansion | City/cluster configuration, central/local permissions, city launch gates, budgets and cross-city quality controls. |
| 11 | Advanced product and mobile | Sitter-first mobile architecture, advanced GPS, assisted matching, loyalty, pet-health timeline and B2B dashboards. |
| 12 | Brand, content and community | CMS, expert review, local SEO, social proof, consented testimonials, community and content analytics. |
| 13 | B2B and enterprise partnerships | Repeatable enterprise lead, contract, entitlement, reporting and account-management workflows. |
| 14 | National scale and governance | Funding readiness, franchise/partner governance, national operating controls, privacy and financial consistency. |

All later-phase modules should be represented in the architecture now, but risky or unvalidated capabilities must remain disabled behind server-side feature flags and operational gates.

## 4. Roles and least-privilege boundaries

| Role | Core capability | Restricted from |
| --- | --- | --- |
| Guest | Browse, view indicative prices, register, apply as sitter, submit society enquiry | Private profiles, bookings, payments, incidents and exact locations |
| Customer | Own profile, household, pets, requests, sitter approval, payment, tracking, reports, reviews and complaints | Other customers, unassigned sitter data and administrative decisions |
| Sitter | Availability, authorised offers, assigned pet instructions, service actions, updates, reports and payout view | Unassigned addresses, unrelated pet medical data and finance/admin controls |
| Operations admin | Booking, assisted matching, service monitoring, replacement and routine support | Raw identity evidence unless explicitly granted |
| Verification admin | Sitter verification, training and permission decisions | Unnecessary customer medical/home-access data |
| Safety admin | Incidents, emergency contacts, evidence and corrective actions | Unrelated financial/marketing data |
| Finance admin | Payment reconciliation, refunds, payouts and adjustments | Identity documents, medical details and home-entry instructions |
| Content admin | CMS, city/service pages, consented proof and SEO | Booking, medical, identity and incident data |
| Society manager | Approved society, resident and aggregate service views | Other societies and private incident/medical details |
| Partner manager | Partner verification, catalogue and fulfilment oversight | Core sitter/customer records outside partner orders |
| Super admin | Emergency cross-domain administration | Must still use audited, purpose-limited access |

A user may hold multiple roles. Authorization must check active session, role/permission, resource ownership, business state and action permission on the server for every mutation.

## 5. Service catalogue and eligibility

### Dog walking

- 30- and 60-minute options.
- One-time and repeat-booking requests.
- Same-sitter preference.
- Walking instructions, actual timestamps, controlled location session and distance.
- Pee/poop, water, behaviour, concern and media fields in the report card.

### Home pet sitting

- Short visits, one-hour sitting, cat visits and travel-period visits.
- Feeding, water, play, rest, arrival/departure and home-security checklist.
- Medical complexity requires specific sitter permission and manual approval.

### Boarding beta

Requires active host permission, active property assessment, capacity, household/resident-pet data, pet compatibility review and admin approval. It must never become available merely because a sitter selects “boarding.”

### Emergency referral support

Provides saved vet/clinic contacts, click-to-call, escalation guidance, partner directory and admin coordination. It does not provide diagnosis, treatment, availability guarantees, transport guarantees or insurance.

### Later partner services

Grooming, veterinary support, vaccination camps, training, pet taxi and product partnerships require separate partner verification, fulfilment state machines, pricing, cancellation policy, incident handling and contribution gates.

The implementation currently supports a feature-gated, request-only partner order path. Only active partner services with a current passed verification may accept a request; managers move the request through an audited fulfilment state machine. It deliberately collects no price or payment until approved commercial and cancellation terms are supplied.

## 6. Required journeys

### Customer

Signup → profile → pet → medical/behaviour/emergency details → risk questionnaire → service/date/time/address → request → proposed sitter → sitter approval → server-priced payment → confirmation → service tracking → report card → review/complaint → repeat request.

### Sitter

Application → verification/training/assessment → service permission → availability → offer → accept/decline → customer approval → exact instructions released → en route → arrived → check-in → updates/concern → check-out → report → payout.

### Admin

Request queue → risk review → eligible shortlist → sitter proposal → customer approval → payment monitoring → service monitoring → replacement/incident response → report review → refund/payout → audit.

### Incident

Report → triage → active response → owner/vet contact → transport/monitoring when applicable → immediate risk resolved → review → corrective action → closure by an authorised role.

### Society

Enquiry → qualification → agreement/pilot → society page → resident verification → sitter pool → service calendar → controlled launch → aggregate reporting → paid conversion/renewal.

### Subscription

Plan version → purchase/mandate → payment webhook → subscription state → entitlement ledger → booking consumption → renewal/grace/pause/cancel → refund/credit adjustment. Payment, subscription and entitlement states remain separate.

## 7. Core state machines

### Booking

`DRAFT → REQUESTED → RISK_REVIEW → MATCHING → SITTER_PROPOSED → CUSTOMER_APPROVAL_PENDING → PAYMENT_PENDING → CONFIRMED → SITTER_EN_ROUTE → IN_PROGRESS → REPORT_PENDING → COMPLETED → CLOSED`

Alternate outcomes: `DECLINED`, `CUSTOMER_CANCELLED`, `SITTER_CANCELLED`, `REPLACEMENT_REQUIRED`, `NO_SHOW`, `INCIDENT_HOLD`.

### Payment

`CREATED → PENDING → AUTHORIZED → CAPTURED`; alternate/derived states: `FAILED`, `CANCELLED`, `PARTIALLY_REFUNDED`, `REFUNDED`, `DISPUTED`.

### Notification

`QUEUED → SENDING → SENT → DELIVERED → READ`; alternate states: `FAILED`, `CANCELLED`.

### Incident

`REPORTED → TRIAGING → ACTIVE_RESPONSE → VET_CONTACTED → TRANSPORTING → MONITORING → IMMEDIATE_RISK_RESOLVED → REVIEW_PENDING → CORRECTIVE_ACTION_OPEN → CLOSED`.

### Verification

Individual evidence records have type, issuer/provider, result, issue/expiry timestamps and revocation state. Public badges are derived, never free-text admin claims.

## 8. Canonical data domains

### Identity and access

`users`, `user_roles`, `admin_permissions`, `customer_profiles`, `household_members`, `sitter_profiles`, `addresses`, `consents`, `sessions`, `account_requests`.

### Pets and risk

`pets`, `pet_media`, `pet_medical_profiles`, `pet_emergency_contacts`, `pet_risk_assessments`, `pet_risk_factors`, `care_instructions`, `medications`, `vaccinations`, `pet_health_events`.

### Sitter trust and capacity

`sitter_applications`, `sitter_verifications`, `training_modules`, `training_attempts`, `practical_assessments`, `sitter_service_permissions`, `availability_rules`, `availability_exceptions`, `boarding_properties`, `reliability_scores`.

### Catalogue and geography

`service_types`, `service_variants`, `service_prices`, `cities`, `service_areas`, `clusters`, `feature_flags`, `capacity_limits`.

### Bookings and fulfilment

`bookings`, `booking_instructions`, `booking_assignments`, `booking_status_history`, `service_events`, `tracking_sessions`, `tracking_points`, `booking_reports`, `report_media`, `reviews`, `complaints`.

### Finance

`payments`, `payment_events`, `refunds`, `payouts`, `payout_adjustments`, `price_quotes`, `ledger_entries`, `reconciliation_runs`.

### Safety

`incidents`, `incident_events`, `incident_notifications`, `incident_evidence`, `corrective_actions`, `sitter_holds`.

### Communication

`notification_outbox`, `notification_deliveries`, `templates`, `communication_preferences`, `support_cases`.

### Society and partners

`societies`, `society_members`, `society_sitter_pools`, `society_events`, `society_partnerships`, `partners`, `partner_locations`, `partner_verifications`, `partner_services`, `partner_orders`.

### Subscriptions and loyalty

`plan_versions`, `subscriptions`, `subscription_events`, `entitlement_ledger`, `entitlement_consumption`, `loyalty_ledger`, `referrals`.

### Content and growth

`content_entries`, `content_versions`, `expert_reviews`, `authors`, `city_pages`, `testimonials`, `testimonial_consents`, `campaigns`, `leads`, `experiments`.

### Governance

`admin_audit_logs`, `policy_versions`, `data_access_logs`, `retention_jobs`, `webhook_events`, `job_runs`, `feature_flags`.

## 9. Database invariants

- Booking end must be after start.
- Server-calculated payment amount must equal the booking quote.
- A booking must reference the currently effective immutable service-price version for its active city/PIN-code service area; client price IDs are revalidated server-side.
- Booking, accepted price quote, capacity counter increment and capacity reservation must commit atomically; pre-payment cancellation must release the reservation atomically.
- Capacity is scoped by service area, service code and India calendar date and may never exceed its approved maximum.
- A Saathi report completes service delivery but cannot close its own booking; the latest version requires an authorised, reasoned review decision.
- Report correction creates a new immutable version. Escalation or correction holds payout eligibility, and open incidents block report approval.
- Booking closure consumes the held capacity reservation. Finance cannot approve/process a payout until the latest report is approved and the booking is closed.
- The assignment and payout amount must come from the accepted immutable service price's approved Saathi amount.
- Only one active primary sitter can exist per booking.
- Suspended, expired or unpermitted sitters cannot receive confirmed assignments.
- Boarding requires active host, property, capacity and match approval.
- A review requires a completed booking and is unique per customer/booking.
- A payout requires a completed assignment and is unique by booking/beneficiary/type.
- Provider webhook event IDs are unique and processed idempotently.
- Booking state changes always create immutable history.
- Subscription plan versions and entitlement ledger entries are immutable.
- Critical incidents cannot close until response, communication, review and corrective actions are recorded.
- Incident reporting creates an append-only safety timeline and places eligible bookings on hold; incident closure may resume care or require replacement but cannot bypass report review to close a delivered booking.
- Every incident notification is uniquely linked to its concrete outbox record and mirrors its queued, sending, sent, failed or read lifecycle; recipient acknowledgement is timestamped without treating a read receipt as safety-case closure evidence.
- High and critical incidents require owned, time-bound corrective action with recorded completion evidence. Active incident-linked Saathi holds exclude the Saathi from matching without silently changing profile or permission status.
- Verified Saathi no-shows and confirmed Saathi cancellations preserve the original captured payment and held capacity while replacement matching runs. The customer approves the replacement, and the server must reuse the verified payment rather than request a second charge.
- Public trust badges require current, non-revoked evidence.

## 10. Technical architecture

- Next.js 15 App Router, strict TypeScript and React Server Components.
- Tailwind CSS and a local shadcn-compatible component system.
- Modular monolith with domain modules and server-only business logic.
- MongoDB Atlas for application data, authentication records, sessions and private GridFS objects.
- Prisma MongoDB schema under version control; reviewed indexes applied with `prisma db push`.
- Zod validation at every server boundary.
- Server Actions for authenticated internal mutations; Route Handlers for webhooks, callbacks and integration endpoints.
- Razorpay Orders/Checkout/signature verification/webhooks.
- WhatsApp Cloud API outbox, Resend email and provider-neutral notification orchestration.
- One map-provider adapter, selected after Mappls/Google benchmark.
- Vercel hosting, Sentry monitoring and privacy-safe structured logs.
- GA4 on public/product funnels; session replay excluded from sensitive surfaces.
- Installable PWA with offline support limited to app shell, static help and draft low-risk records.

## 11. Security, privacy and safety controls

- Deny-by-default server authorization, ownership predicates, role gates and transaction-backed invariants.
- Private buckets, random object keys, MIME/size validation, malware-scanning hook and expiring signed URLs.
- Separate service processing, terms, marketing, media-publication and testimonial consents.
- No PII, medical narrative, identity data, home-access details or payment secrets in logs/analytics.
- Audit login failures, role/permission changes, verification, risk, assignments, refunds, payouts, incidents and suspensions.
- Account correction, export and deletion-request workflows.
- Purpose limitation, retention schedules, access logs, processor inventory and breach runbook aligned to India’s DPDP framework.
- Rate limits on auth, lead, booking, upload, payment and webhook endpoints.
- Live tracking is feature-gated at the read, write and role-interface layers; when disabled, no tracking control or private location session is exposed.
- CSRF/origin protection, strong headers, secure cookies, input/output encoding and SSRF-safe integration clients.
- Backup and restore tests, separate development/staging/production data and no production PII in fixtures.

## 12. Immersive UI/UX direction

The interface should combine the strongest patterns observed across the competitor and immersive-design research without cloning any one site:

- Warm India-relevant premium palette: sunlit saffron, coral, indigo, leaf green and paper/stone neutrals.
- Editorial typography paired with highly legible product UI typography.
- A cinematic pet-and-caregiver hero with layered depth, subtle WebGL/3D elements and tactile motion.
- Scroll-linked narrative for trust, matching, tracking and report-card proof.
- Clear, high-contrast booking calls to action and mobile-first service selection.
- Trust evidence surfaced near decisions, not isolated on a generic safety page.
- Dashboard UI remains calm, fast and operational; immersive effects stay on public storytelling surfaces.
- Respect `prefers-reduced-motion`, keyboard navigation, WCAG contrast, screen readers and low-power/mobile fallbacks.
- 3D must be progressive enhancement: no essential content, navigation or action may depend on WebGL.

## 13. Required integrations and environment inventory

No secret values belong in source control or `.env.example`. Deployment documentation must list secret names and configure them in Vercel, GitHub, and MongoDB Atlas only.

Integration groups:

- MongoDB Atlas URI, database name, least-privilege database user, auth secret and GridFS upload-signing secret.
- Razorpay key ID/secret and webhook secret.
- WhatsApp phone number ID, business account ID, token and verification secret.
- Resend API key and verified sender domain.
- Map provider key and selected provider identifier.
- Sentry DSN/auth token/release values.
- GA4 measurement ID and optional consent-gated Clarity project ID.
- Cron/reconciliation secret and application encryption/signing secrets.

## 14. Test and release gates

CI must pass lint, strict typecheck, unit tests, integration tests, E2E tests and production build.

Mandatory E2E paths:

- Customer: signup → pet → request → sitter approval → payment → report → review.
- Sitter: offer → accept → service events → report → payout.
- Admin: risk → matching → monitoring → refund/payout.
- Incident: concern → response → contact → hold → review → corrective action.
- Security: cross-customer pet access, unassigned sitter address access, finance-to-ID access, expired permission acceptance and price tampering.
- Commerce controls: inactive/overlapping area, missing/stale price version, unopened/full capacity, concurrent reservation, cancellation release and reconciliation mismatch.
- Reliability: duplicate/out-of-order webhook, browser closed after payment, weak network, upload failure, cancellation, replacement and overdue report.

Release is blocked by any critical security defect, cross-user exposure, payment mismatch, untested restore path, unresolved critical incident or missing audit coverage for sensitive actions.

## 15. Decisions still requiring owner input or live credentials

The architecture can proceed without these, but production activation cannot:

- Final logo files, brand font licences and approved photography/illustration assets.
- Final customer prices, sitter payouts, cancellation/refund windows and tax treatment.
- Final legal entity, terms, privacy, cancellation, safety and partner-contract text.
- MongoDB Atlas, Razorpay, WhatsApp, Resend, map, analytics and monitoring credentials.
- Mappls versus Google Maps result for the pilot-area address benchmark.
- Final phone OTP provider and sender setup.
- Verified sitter evidence types available in the launch city.
- Clinic/partner directory and emergency escalation contacts.
- Production domain and email sender domain.

Until supplied, the implementation must use typed provider adapters, safe local demo data and clearly marked non-production configuration—not invented claims or secrets.
