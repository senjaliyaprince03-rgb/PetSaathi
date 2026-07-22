# PetSaathi Full Project Design Audit

**Audit date:** 22 July 2026  
**Audited checkout:** `C:\Users\Prince\Downloads\PetSaathi`  
**Scope:** every routed page, shared visual component, brand asset, responsive/navigation state, loading/error/offline state, accessibility test, and known design-system gap in this checkout.

## 1. Executive status

The premium light-luxury migration is substantial, but the **entire repository is not yet design-complete**.

| Route status | Count | Percentage | Meaning |
| --- | ---: | ---: | --- |
| **Done** | 45 | 56.25% | Uses the current PetSaathi identity and a complete shared or purpose-built light-luxury composition. |
| **Partial** | 24 | 30.00% | Uses the current palette/components, but still lacks shared navigation, responsive completion, or visual-system consistency. |
| **Not migrated** | 11 | 13.75% | Still uses legacy grey/blue utility styling or an older product design. |
| **Total routed pages** | **80** | **100%** | All `page.tsx` routes under `src/app` were inventoried. |

This audit supersedes any earlier statement that the full project design was complete. The earlier migration report accurately covered its named Stitch-style screen list, but it did not inventory the older enterprise, operator, corporate-benefit, health-record, PWA, and testing surfaces.

### Status definitions

- **Done:** route-level design is coherent, responsive foundations are present, and the surface belongs to the active PetSaathi system.
- **Partial:** functional UI and current design tokens are present, but the route is not yet a finished end-to-end product surface.
- **Not migrated:** the route visibly belongs to the older generic Tailwind/blue-grey design and needs a full visual pass.
- A design status does **not** claim that missing business rules, live data, payment execution, or deployment are complete.

## 2. Active design direction — done

| Foundation | Evidence | Status |
| --- | --- | --- |
| Light-luxury palette | Warm cream/paper, plum hierarchy, coral action, saffron warmth, leaf verification in `src/app/globals.css` | Done |
| Typography | Playfair Display, Manrope, and Inter configured in `src/app/layout.tsx` | Done |
| Layout scale | Shared container, spacing, radii, shadow, and typography tokens in `tailwind.config.ts` | Done |
| Public shell | Header, desktop navigation, CTA, footer in `src/components/marketing/public-shell.tsx` | Partial — mobile navigation is missing |
| Authenticated shell | Customer, Saathi, admin, and society workspace system in `src/components/portal/portal-shell.tsx` | Partial — many admin routes do not use it and mobile access is incomplete |
| Brand identity | Supplied dog-and-cat logo, exact wordmark, responsive mark, dark-footer variant in `src/components/brand/logo.tsx` | Done for web headers |
| Buttons and fields | Shared button variants and `.form-control` system | Done |
| Motion | Homepage reveals, custom cursor, route transition, and reduced-motion CSS | Partial |
| Loading and error states | `src/app/loading.tsx`, `src/app/global-error.tsx`, `src/app/(portal)/error.tsx` | Done |
| Responsive foundations | Mobile/desktop grid and typography utilities across migrated surfaces | Partial — authenticated QA is incomplete |
| Content integrity | Real records and honest empty states replace fabricated dashboard/provider content | Done on migrated surfaces |

## 3. Complete route-by-route audit

### 3.1 Public and marketing routes — 20 pages

| Route | Status | Design evidence / remaining work |
| --- | --- | --- |
| `/` | Done | Original premium landing experience, editorial hero, real CTAs, local imagery, custom cursor, reduced motion, mobile bottom navigation. |
| `/about` | Done | Shared public shell and editorial page intro. |
| `/become-a-saathi` | Done | Shared public shell and styled application workflow. |
| `/book` | Done | Shared shell and multi-step care request design. |
| `/caregivers` | Done | Premium assisted-matching explanation; intentionally not a public provider directory. |
| `/cities/[slug]` | Done | City hub, local availability, service hierarchy, premium public shell. |
| `/cities/[slug]/[service]` | Done | City/service detail composition and conversion path. |
| `/contact` | Done | Shared shell and styled contact form. |
| `/journal` | Done | Editorial card/list system. |
| `/journal/[slug]` | Done | Long-form article design inside public shell. |
| `/login` | Done | Premium authentication composition with supplied PetSaathi branding inherited from shell. |
| `/membership` | Done | Membership hierarchy, benefit cards, states, and CTA design. |
| `/privacy` | Done | Branded legal/information layout. |
| `/safety` | Done | Public safety framework and escalation guidance. |
| `/services` | Done | Service catalogue using current cards and typography. |
| `/services/[slug]` | Done | Service detail and booking conversion route. |
| `/societies` | Done | Society value proposition and lead path. |
| `/terms` | Done | Branded legal layout. |
| `/benefits/[slug]` | **Not migrated** | Uses generic blue circles, grey text, standard rounded cards, and no `PublicShell`. Needs a full light-luxury partner-programme redesign. |
| `/corporate/pet-care-benefits` | **Not migrated** | Uses generic blue hero/CTA and grey typography. Needs public shell, premium enterprise composition, responsive proof and conversion sections. |

### 3.2 Customer and shared authenticated routes — 23 pages

| Route | Status | Design evidence / remaining work |
| --- | --- | --- |
| `/addresses/new` | Partial | Styled form and current background, but no authenticated shell, breadcrumb system, or mobile workspace navigation. |
| `/dashboard` | Done | Full customer workspace, live metrics, care cards, and route-backed actions. |
| `/notifications` | Done | Authenticated shell and real notification states. |
| `/partners` | Done | Authenticated partner-service request design with fail-closed empty states. |
| `/settings/notifications` | Done | Shared workspace and communication-preference form. |
| `/settings/privacy` | Done | Shared workspace, privacy request workflow, and request history. |
| `/support` | Done | Role-aware workspace and structured support submission. |
| `/customer/inbox` | Done | Care notifications and traceable support threads. |
| `/customer/loyalty` | Done | Personal loyalty balance, tier, ledger, and empty states. |
| `/customer/protocols` | Done | Care-protocol history and booking links. |
| `/customer/referrals` | Done | Referral state and honest reward handling. |
| `/customer/wallet` | Done | Partner-credit ledger plus original premium protocol artwork. |
| `/pets` | Done | Resident pet registry and real empty states. |
| `/pets/new` | Partial | Premium form styling, but not embedded in the customer shell and lacks contextual navigation. |
| `/pets/[id]` | Done | Private pet passport, records summary, timeline, disclaimers, and ID link. |
| `/pets/[id]/id-card` | Done | Dedicated digital ID composition and disclaimer. Print-specific CSS is still a project-level gap. |
| `/pets/[id]/records` | **Not migrated** | Uses generic grey/yellow utility UI and standard rounded cards. Duplicates parts of the newer passport design and needs consolidation. |
| `/bookings/[id]` | Partial | Visually premium and functionally rich, but it is a standalone page without `PortalShell`, shared logo/navigation, or consistent mobile workspace framing. |
| `/bookings/[id]/checkout` | Done | Dedicated server-state-led checkout design. |
| `/bookings/[id]/feedback` | Done | Dedicated completion-gated feedback design. |
| `/bookings/[id]/live` | Done | Dedicated feature-gated telemetry design and fail-closed state. |
| `/bookings/[id]/report` | Done | Structured session report card and review state. |
| `/bookings/[id]/timeline` | Done | Chronological state, service-event, and report timeline. |

### 3.3 Saathi routes — 7 pages

| Route | Status | Design evidence / remaining work |
| --- | --- | --- |
| `/saathi` | Done | Full Saathi mission-control workspace. |
| `/saathi/availability` | Done | Premium availability ledger; intentionally read-only until mutation rules exist. |
| `/saathi/earnings` | Done | Earnings and payout design with honest states. |
| `/saathi/inbox` | Done | Assignment/status-led protocol inbox. |
| `/saathi/profile` | Done | Private profile and verification readiness. |
| `/saathi/reports` | Done | Submitted report and correction states. |
| `/saathi/assignments` | Partial | Current cards/actions are visually coherent, but the route bypasses `PortalShell` and therefore loses shared navigation and branding. |

### 3.4 Society route — 1 page

| Route | Status | Design evidence / remaining work |
| --- | --- | --- |
| `/society` | Done | Society workspace, verified relationship state, resident/pool metrics, pilot information, events, and unlinked empty state. |

### 3.5 Admin routes — 28 pages

| Route | Status | Design evidence / remaining work |
| --- | --- | --- |
| `/admin` | Done | Shared admin command-centre shell and priority lanes. |
| `/admin/catalog` | Partial | Premium components, but standalone layout without admin shell. |
| `/admin/cities` | Partial | Uses admin shell, but several inner controls still use legacy grey utility styling. |
| `/admin/content` | Partial | Premium content cards and workflows, but no shared admin shell. |
| `/admin/content/testimonials` | Partial | Current light-luxury cards and moderation states, but no shared admin shell. |
| `/admin/features` | Partial | Premium release-gate cards, but no shared admin shell. |
| `/admin/finance` | Partial | Premium financial queues and empty states, but no shared admin shell. |
| `/admin/leads` | Partial | Premium qualification cards, but no shared admin shell. |
| `/admin/matching` | Partial | Premium matching queue, but no shared admin shell. |
| `/admin/operations/cities/[id]/health` | Partial | Current colors and KPI styling, but standalone and internally inconsistent. |
| `/admin/operations/community` | Partial | Premium community cards/workflows, but no shared admin shell. |
| `/admin/operations/live` | Partial | Uses admin shell, but inner tables/controls retain generic grey treatment. |
| `/admin/operations` | Partial | Premium live-service cards, but no shared admin shell. |
| `/admin/operations/trust-safety` | Partial | Current design tokens and safety workflows, but no shared admin shell. |
| `/admin/partner-orders` | Partial | Current queue components, but no shared admin shell. |
| `/admin/privacy` | Partial | Current privacy controls, but no shared admin shell. |
| `/admin/reports/investor-metrics` | Partial | Rich KPI/dashboard treatment, but standalone with inconsistent density and no shared shell. |
| `/admin/reports` | Partial | Current report cards and review actions, but no shared admin shell. |
| `/admin/safety` | Partial | Current incident design and empty states, but no shared admin shell. |
| `/admin/support` | Partial | Premium support/complaint queues, but no shared admin shell. |
| `/admin/verification` | Partial | Current verification cards, but no shared admin shell. |
| `/admin/b2b` | **Not migrated** | Generic grey dashboard cards and standard rounding. |
| `/admin/b2b/invoices` | **Not migrated** | Generic grey table design; lacks responsive table strategy and admin shell. |
| `/admin/b2b/organizations` | **Not migrated** | Generic grey table design; lacks responsive table strategy and admin shell. |
| `/admin/b2b/pipeline` | **Not migrated** | Generic grey Kanban columns/cards; not aligned with PetSaathi tokens. |
| `/admin/b2b/programmes` | **Not migrated** | Generic grey table design; not aligned with the new service-wallet/customer benefit surfaces. |
| `/admin/operations/queue` | **Not migrated** | Legacy grey operational queue and inconsistent card/control language. |
| `/admin/partners` | **Not migrated** | Legacy data table/form styling and no shared admin shell. |

### 3.6 Operator route — 1 page

| Route | Status | Design evidence / remaining work |
| --- | --- | --- |
| `/operator` | **Not migrated** | Mixed legacy operational dashboard, generic table/form patterns, unused imports, `any` typing, and no shared workspace shell. |

## 4. Shared components and design states

### Done

- Responsive web logo component using the supplied dog-and-cat artwork.
- Exact `PET SAATHI / SINCE 2026` wordmark asset.
- Homepage marketing experience and local editorial imagery.
- Shared button variants, form-control class, focus-visible outline, and touch highlight handling.
- Public information shell and role-based portal shell.
- Global loading state and branded global/portal error recovery states.
- Honest empty states on the main customer, Saathi, society, booking, safety, support, and finance surfaces.
- Desktop and mobile breakpoint foundations.
- CSS-level `prefers-reduced-motion` fallback.

### Partial

1. **[Critical] Public subpage mobile navigation**  
   `PublicShell` hides the primary navigation below `md` and provides no menu/drawer. Users retain the main CTA but cannot reach all public sections from the header.

2. **[Critical] Portal mobile navigation**  
   The mobile strip exposes only the first six items. The visible hamburger button has no interaction handler, so lower-priority routes can become inaccessible from the workspace header.

3. **Admin shell adoption**  
   Most specialist admin pages use the correct visual tokens but bypass `PortalShell`, causing navigation and hierarchy drift.

4. **Motion accessibility**  
   Homepage motion checks `useReducedMotion`, and global CSS reduces CSS animation. The Framer Motion route transition in `src/app/template.tsx` does not directly read the user preference.

5. **Responsive data tables**  
   Legacy B2B/operator tables do not have a documented mobile card, column-priority, or horizontal-scroll treatment.

6. **Empty/loading states**  
   A global loader exists, but dense dashboards do not yet have route-level skeleton designs.

7. **Image system**  
   Premium local assets exist, but there is no central image aspect-ratio, crop, focal-point, or compression standard.

### Not done

- Dedicated branded `not-found.tsx` / 404 experience.
- Print styles for the digital pet ID, booking report, invoice, and incident/report exports.
- Shared toast, dialog, confirmation modal, drawer, and command-palette design primitives.
- Full component documentation or Storybook-style state catalogue.
- Visual-regression screenshot baselines.
- Authenticated customer/Saathi/admin/society accessibility suite.
- Complete keyboard/focus-path QA for every workflow.
- Complete mobile QA for all 80 routes.

## 5. Brand and asset audit

| Asset area | Status | Notes |
| --- | --- | --- |
| Web header logo | Done | Uses supplied animal artwork plus exact wordmark. |
| Compact mark | Done | `public/images/petsaathi-logo-mark.png`. |
| Full transparent lockup | Done | `public/images/petsaathi-logo-lockup.png`. |
| App Router icon | Done | `src/app/icon.png` uses the supplied dog-and-cat artwork. |
| PWA icons | **Not done** | `public/icons/icon-192.svg` and `icon-512.svg` still contain the removed generic pet-face mark. |
| Web manifest colors | Partial | Still uses older `#fffaf1` / `#f4b134` identity values rather than the current logo-led palette. |
| Offline page | Partial | Uses the older paw emoji and purple/yellow palette rather than the supplied logo. |
| Legacy public logo files | Cleanup pending | `public/logo.png`, `public/favicon.ico`, and `public/images/petsaathi-logo.png` remain older assets. |
| Premium editorial assets | Done | Auth, care handover, service art, sitter imagery, and care-protocol still life are local. |

## 6. Accessibility, responsiveness, and test coverage

| Area | Current state | Status |
| --- | --- | --- |
| Automated public accessibility | Axe tests cover `/`, services, safety, societies, membership, journal, and contact | Partial |
| Authenticated accessibility | No role-authenticated Axe coverage | Not done |
| Desktop browser E2E | Chromium configuration exists | Partial |
| Mobile browser E2E | Pixel 7 project exists | Partial |
| Homepage E2E assertions | Test copy still expects an older hero (`Their world stays warm`, `Find my PetSaathi`) | **Outdated / failing risk** |
| Visual regression | Screenshots only on failure; no approved baselines | Not done |
| Mobile overflow | Homepage-only overflow assertion | Partial |
| Keyboard navigation | No complete route-by-route automated test | Not done |
| Reduced motion | CSS fallback plus homepage hook | Partial |

## 7. Unused or obsolete design code

The following design components currently appear only at their definitions and are not imported by active routes:

- `src/components/3d/animated-logo.tsx`
- `src/components/3d/card-3d.tsx`
- `src/components/marketing/pet-orbit.tsx`
- `src/components/effects/cursor-glow.tsx`
- `src/components/providers/lenis-provider.tsx`
- `src/components/pwa/service-worker-registration.tsx`

Two form components also contain legacy grey/blue design language:

- `src/components/forms/dynamic-pricing-engine.tsx`
- `src/components/forms/service-assessment-flow.tsx`

These should be deliberately integrated, migrated, or removed. They should not remain ambiguous prototype code.

## 8. Verification and project health boundary

- All 80 routed page files were enumerated from `src/app/**/page.tsx`.
- 55 TSX component files, 31 portal components, 9 form components, 22 public assets, and 16 image assets were included in the source inventory.
- The new logo integration passes targeted ESLint.
- A full TypeScript pass still fails in older B2B/API/reporting code. No current failure points to the new logo component.
- The production bundler previously reached **Compiled successfully** before repository-wide lint/type gates stopped the build on older admin/B2B/API issues.
- This checkout is **not a Git repository**, so the saved report and design files are present on local disk but cannot be committed from this directory.
- No current public deployment was verified in this audit. Local source completion must not be presented as proof that a separately hosted URL shows the same design.

## 9. Prioritized completion backlog

### [Critical] P0 — complete the navigable product shell

| Work | Estimate | Risk if skipped |
| --- | ---: | --- |
| Add functional mobile drawer/menu to `PublicShell` | 3–5 hours | Public pages become navigation dead ends on small screens. |
| Add functional mobile drawer and full route access to `PortalShell` | 4–6 hours | Authenticated routes become difficult or impossible to reach on mobile. |
| Move the 20 partial admin pages into the shared admin shell | 1.5–2.5 days | Operations UI remains inconsistent and fragmented. |
| Migrate 11 legacy routes to current tokens/components | 2–3 days | The full project continues to look unfinished. |

### [Critical] P1 — finish brand propagation and responsive safety

| Work | Estimate | Risk if skipped |
| --- | ---: | --- |
| Replace PWA icons, offline mark, favicon, and manifest colors | 2–4 hours | Installed/offline product displays the old identity. |
| Redesign responsive B2B/operator tables | 1–2 days | Dense admin workflows remain unusable on mobile. |
| Consolidate `/pets/[id]/records` into the current passport system | 4–8 hours | Duplicate and conflicting health-record experiences remain. |
| Add print layouts for ID/report/invoice | 4–8 hours | Premium digital surfaces produce poor physical/PDF output. |

### [Nice-to-Have] P2 — polish and proof

| Work | Estimate | Risk if skipped |
| --- | ---: | --- |
| Add branded 404 and route-level skeletons | 4–6 hours | Edge states feel less intentional. |
| Add toast/dialog/drawer primitives | 1 day | Action feedback remains inconsistent. |
| Update stale homepage E2E assertions | 1–2 hours | CI may report false failures. |
| Add authenticated Axe and visual-regression coverage | 1–2 days | Regressions remain difficult to detect. |
| Document component states/tokens | 1 day | Future screens may drift from the design system. |

## 10. Recommended implementation order

1. Navigation and brand propagation.
2. The 11 legacy routes.
3. Shared-shell migration for 24 partial routes, starting with operational/admin work.
4. Responsive tables and authenticated mobile QA.
5. 404, skeleton, print, dialog/toast, and regression-test polish.

## 11. Final truth statement

The primary PetSaathi marketing, customer, Saathi, booking, society, safety, support, and moderation experiences now have a distinctive premium light-luxury direction. The project is **not yet fully design-complete** because 24 routes remain partially integrated and 11 routes have not been migrated from legacy styling. The files are saved locally in the audited checkout, and this report is the authoritative full-project design status until those remaining surfaces are completed and re-audited.
