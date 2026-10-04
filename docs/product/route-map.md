# PetSaathi Route Map

This document maps the verified routes and API endpoints in the PetSaathi root application (`src/app`), classified by access tier and role boundary (`src/modules/auth/admin-access.ts` and `src/middleware.ts`).

---

## 1. Canonical Role Landings (`getDefaultDashboardForRoles`)

| Role | Canonical Landing Route |
|---|---|
| `CUSTOMER` | `/dashboard` |
| `SITTER` | `/saathi` |
| `OPERATOR` | `/operator` |
| `SOCIETY_MANAGER` | `/society` |
| `CITY_MANAGER` | `/admin/cities` |
| `PARTNER_MANAGER` | `/admin/b2b` |
| `VERIFICATION_ADMIN` | `/admin/verification` |
| `CONTENT_ADMIN` | `/admin/content` |
| `FINANCE_ADMIN` | `/admin/finance` |
| `SAFETY_ADMIN` | `/admin/safety` |
| `OPERATIONS_ADMIN` | `/admin` |
| `SUPER_ADMIN` | `/admin` |

---

## 2. Public Marketing & Informational Routes
- `/` — Homepage & Care Concierge
- `/about` — Platform story & mission
- `/services` — Service catalog overview
- `/services/[slug]` — Service detail pages (`dog-walking`, `home-pet-sitting`, `boarding-beta`, `grooming`, `veterinary`, `training`, `pet-taxi`)
- `/book` — Public booking wizard (hands off to `/login` when anonymous)
- `/become-a-saathi` — Caregiver application & onboarding info
- `/caregivers`, `/saathis`, `/sitters/[id]` — Caregiver information & profiles
- `/cities`, `/cities/[slug]`, `/cities/[slug]/[service]` — City & territory service availability
- `/societies`, `/societies/[slug]` — Residential society programme pages
- `/corporate/pet-care-benefits`, `/benefits/[slug]` — B2B corporate pet-care benefit pages
- `/membership` — PetSaathi membership plans
- `/safety` — Trust, safety, and incident response protocols
- `/journal`, `/journal/[slug]` — Editorial journal & pet care articles
- `/resources/new-pet-checklist` — Pet parent checklist resource
- `/contact` — Public enquiry & lead capture
- `/login` — Multi-mechanism authentication entry point
- `/privacy`, `/privacy-policy`, `/terms`, `/refund-policy` — Statutory legal disclosures
- `/offline` — PWA offline fallback page

---

## 3. Customer Portal Routes (`CUSTOMER`)
- `/dashboard`, `/dashboard/history` — Customer overview, active bookings, and history
- `/pets`, `/pets/new`, `/pets/[id]`, `/pets/[id]/edit`, `/pets/[id]/id-card`, `/pets/[id]/records` — Pet profiles, medical records, and emergency ID cards
- `/bookings/[id]`, `/bookings/[id]/checkout`, `/bookings/[id]/live`, `/bookings/[id]/report`, `/bookings/[id]/timeline`, `/bookings/[id]/feedback` — Booking lifecycle, Razorpay checkout, live tracking, care reports, and reviews
- `/customer/services`, `/customer/grooming`, `/customer/vet`, `/customer/training`, `/customer/taxi` — Customer service portals
- `/customer/subscriptions`, `/customer/wallet`, `/customer/loyalty`, `/customer/referrals` — Membership entitlements, wallet, loyalty, and referrals
- `/customer/protocols`, `/customer/inbox` — Care instructions and customer inbox
- `/notifications`, `/settings`, `/settings/notifications`, `/settings/privacy`, `/support` — Account settings, DPDP privacy controls, and support

---

## 4. Saathi (Caregiver) Portal Routes (`SITTER`)
- `/saathi` — Canonical Saathi dashboard
- `/saathi/inbox` — Offered booking assignments (privacy-gated locality context)
- `/saathi/assignments` — Active and upcoming assignments (exact address released only after confirmation)
- `/saathi/availability`, `/saathi/availability/edit` — Recurring operating windows and blackout schedules
- `/saathi/reports` — Structured post-service care report submission
- `/saathi/earnings` — Payout ledger and completed service earnings
- `/saathi/profile`, `/saathi/profile/edit` — Caregiver profile and verification status
- `/saathi/academy`, `/saathi/performance` — Training academy and service quality metrics

---

## 5. Society & Operator Portal Routes
- **Society Portal (`SOCIETY_MANAGER`):**
  - `/society` — Canonical society dashboard
  - `/society/residents` — Resident pet registry
  - `/society/saathi-pool` — Society preferred Saathi pool
  - `/society/gate-protocol` — Gate entry protocol configuration
  - `/society/events` — Community & vaccination events
- **Operator Portal (`OPERATOR`):**
  - `/operator` — Canonical territory operator dashboard
  - `/operator/territories`, `/operator/city-health`, `/operator/economics` — Territory operations & metrics
  - `/operator-portal/[city]` — Secondary city operator view
- **Partner Portal (`PARTNER_MANAGER` secondary view):**
  - `/partners`, `/partners/membership` — Secondary partner portal views

---

## 6. Administrative Portal Routes (`/admin/*`)
- `/admin` — Canonical landing for `SUPER_ADMIN` and `OPERATIONS_ADMIN` (accessible to all admin dashboard roles)
- `/admin/operations`, `/admin/operations/live`, `/admin/operations/queue` — `OPERATIONS_ADMIN`, `SUPER_ADMIN`
- `/admin/operations/cities`, `/admin/operations/cities/[id]/health`, `/admin/cities` — `CITY_MANAGER`, `OPERATIONS_ADMIN`, `SUPER_ADMIN`
- `/admin/operations/community` — `SOCIETY_MANAGER`, `OPERATIONS_ADMIN`, `SUPER_ADMIN`
- `/admin/operations/trust-safety`, `/admin/safety`, `/admin/reports`, `/admin/support` — `SAFETY_ADMIN`, `OPERATIONS_ADMIN`, `SUPER_ADMIN`
- `/admin/matching`, `/admin/leads`, `/admin/vaccination-camps` — `OPERATIONS_ADMIN`, `SUPER_ADMIN`
- `/admin/verification` — `VERIFICATION_ADMIN`, `SUPER_ADMIN`
- `/admin/finance`, `/admin/plans`, `/admin/b2b/invoices`, `/admin/reports/investor-metrics` — `FINANCE_ADMIN`, `SUPER_ADMIN`
- `/admin/catalog` — `FINANCE_ADMIN`, `OPERATIONS_ADMIN`, `SUPER_ADMIN`
- `/admin/content`, `/admin/content/testimonials`, `/admin/testimonials` — `CONTENT_ADMIN`, `SUPER_ADMIN`
- `/admin/b2b`, `/admin/partners`, `/admin/partners/[id]`, `/admin/partner-orders` — `PARTNER_MANAGER`, `SUPER_ADMIN`
- `/admin/rbac`, `/admin/privacy`, `/admin/features` — `SUPER_ADMIN` only
