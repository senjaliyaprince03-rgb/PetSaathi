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
| Brand identity | The exact supplied dog-and-cat `PET SAATHI / SINCE 2026` master image is rendered unchanged by `src/components/brand/logo.tsx` | Done for web headers |
| Buttons and fields | Shared button variants and `.form-control` system | Done |
| Motion | Global Animos-inspired reveal/focus system, homepage choreography, route transitions, and reduced-motion handling | Done; documented in `docs/motion-system.md` |
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

- Shared web logo component rendering the exact supplied `PET SAATHI / SINCE 2026` master image without cropping, recoloring, filtering, or reconstruction.
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

4. **Motion browser QA**
   The global observer, homepage choreography, scroll primitives, and route transition now respect reduced motion. Authenticated cross-browser visual QA is still pending.

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
| Official web logo | Done | `public/images/petsaathi-logo-official.png` is byte-identical to the user-supplied image and is used directly by every shared web header/footer. |
| Earlier derived logo assets | Cleanup pending | Mark, wordmark, and transparent derivatives remain stored but are no longer rendered by the shared logo component. |
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
| Homepage E2E assertions | Current hero, finder, care films, proposal preview, report card, journey explorer, ecosystem links, and booking-prefill paths are covered | Updated; live browser execution pending |
| Visual regression | Screenshots only on failure; no approved baselines | Not done |
| Mobile overflow | Homepage-only overflow assertion | Partial |
| Keyboard navigation | No complete route-by-route automated test | Not done |
| Reduced motion | CSS fallback plus direct hooks in homepage, route transition, scroll, parallax, scale, rotation, and floating primitives | Done |

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
- The full strict TypeScript pass is clean as of 23 July 2026.
- ESLint completes with zero warnings, all 61 unit tests pass, and the production build generates all 80 pages successfully.
- This checkout has Git metadata; the saved report and design files remain local and uncommitted until the user requests a commit.
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

## 12. Homepage expansion addendum — 23 July 2026

The PetBacker-inspired discovery work has been expanded without copying PetBacker branding, page structure, customer claims, or proprietary assets.

### Added and complete

- Interactive four-path care journey explorer for dog walking, home visits, at-home grooming, and veterinary support.
- Accessible tab and tab-panel semantics with selected-state feedback.
- Reduced-motion-aware panel transitions.
- Service-specific previews for the information a family shares, the checks PetSaathi performs, and the record the family receives.
- Booking deep links that preserve the selected service code.
- Three premium ecosystem pathways for membership, residential societies, and the care journal.
- Responsive two-column mobile and four-column desktop journey controls.
- Original PetSaathi copy and existing project-owned image assets throughout.
- Updated Playwright coverage for journey switching, selected-state semantics, content changes, and service-intent preservation.

### Current validation

- `npm run typecheck` — passed.
- `npm run lint` — passed with zero warnings.
- `npm run test` — 25 files and 61 tests passed.
- `npm run build` — passed; all 80 pages generated.
- Live browser and 375px visual verification remain pending because the instructed production server on `127.0.0.1:3110` was not listening and was not restarted.

## 13. Care concierge and original editorial imagery — 23 July 2026

### Added and complete

- Three-step guided care recommender with pet selection, care-need selection, and a service-specific result.
- Safe recommendation mapping for dog walking, home visits, at-home grooming, and non-emergency veterinary support.
- Emergency limitation copy shown when veterinary support is selected.
- Booking deep links preserve both the recommended service code and selected pet type.
- Restartable recommender flow with progress feedback, `aria-pressed` states, an `aria-live` result, and reduced-motion-aware transitions.
- New animated editorial story explaining staged access, meaningful updates, and traceable exceptions.
- Two original PetSaathi editorial images generated specifically for this project and visually inspected after conversion.
- Optimized WebP delivery: approximately 4.5 MB of generated PNG source reduced to approximately 350 KB of project assets.
- Playwright coverage for home-visit recommendations, pet-context preservation, and veterinary emergency limitations.

### New project assets

- `public/images/care-handover-editorial-v2.webp`
- `public/images/care-observation-editorial-v2.webp`

## 14. Image-led hero, service rail and consent-safe story carousel — 23 July 2026

### Added and complete

- Full-width homepage hero image layer using the original PetSaathi handover editorial image.
- Normal document-scroll behavior matching the reference site, without fixed-background rendering.
- A substantially lighter directional cream gradient preserves text and finder contrast while keeping the image clearly visible.
- Six-item service shortcut rail overlapping the hero/content boundary.
- Direct service-prefilled booking links for walking, home visits, grooming, veterinary support and training.
- Previous/next care-story carousel with animated transitions and one-card mobile presentation.
- Public testimonial reader that returns only `PUBLISHED` stories with a current, non-withdrawn consent record.
- `public_testimonials` feature flag enforcement and graceful empty/degraded responses.
- Clearly labelled preview stories when public testimonials are disabled; the project does not fabricate customer ratings or reviews.
- Playwright assertions for the service rail, service deep links and carousel controls.

### Live verification

- The existing server on `127.0.0.1:3110` rendered the current source without being restarted.
- The hero now uses a real optimized full-bleed Next.js image layer, matching the reference site’s scroll behavior.
- Six service shortcuts render in the overlapping rail with the expected booking URLs.
- The care-story carousel renders three desktop cards, and the next control changes the leading card.
- The 375px accessibility snapshot renders one visible story card and all six service shortcuts.
- Browser runtime logs contained zero warnings and zero errors during this focused check.

### Build boundary

- Strict TypeScript, zero-warning ESLint and all 61 unit tests pass.
- An isolated offline build reached `Compiled successfully`.
- Full post-compile route generation remains blocked in this Windows environment by `spawn EPERM`.
- The normal `npm run build` cannot replace Prisma's query-engine DLL while the existing production process holds it open; that process was deliberately not stopped.

## 15. Hero visibility and duplicate-image correction — 23 July 2026

### Corrected

- `care-handover-editorial-v2.webp` is now referenced only once: the homepage hero.
- Removed the same handover image from the Care Concierge and story carousel.
- Removed the care-observation image from the story carousel so it remains exclusive to the care-detail section.
- Replaced CSS fixed-background rendering with a full-bleed optimized image layer that scrolls normally like the reference site.
- Reduced the hero overlay opacity and decorative grid strength so the photograph remains clearly visible.
- Added three dedicated, non-reused story-card images for home care, dog walking and at-home grooming.

### New unique assets

- `public/images/care-story-home-v1.webp`
- `public/images/care-story-walk-v1.webp`
- `public/images/care-story-grooming-v1.webp`
