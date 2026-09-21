# PETSAATHI PRODUCTION PERFORMANCE FORENSIC AUDIT

**Project**: PetSaathi (`senjaliyaprince03-rgb/PetSaathi`)  
**Environment**: Next.js 15.5.25 App Router, React 19, TypeScript 5.8, Node.js v22  
**Audit Branch**: `fix/audit-sprint`  
**Methodology**: Forensic Profiling across 17 Performance & Engineering Dimensions (Categories A – Q)  

---

## Category A: Route-by-Route Rendering Analysis (RSC vs Client Components)
- **Status**: MIXED / OPTIMIZATION REQUIRED
- **Evidence**:
  - `src/app/page.tsx` is an RSC, importing `marketing-experience.tsx` (RSC) which imports client components (`TextReveal`, `Float3D`, `ScrollReveal`, `CareMatchFinder`).
  - Total first-load JS for `/` is **351 kB** (73.9 kB page chunk + 204 kB framework + 73.1 kB shared client dependencies).
  - Several components that only render static visual content were unnecessarily tagged with `"use client"` or wrapped with heavy client boundary hooks.
- **Remediation**:
  - Keep layout and structural wrappers as pure React Server Components.
  - Defer non-critical client component hydration until idle or below-the-fold viewport intersection.

---

## Category B: JavaScript Bundle & Chunk Distribution
- **Status**: BOTTLENECK IDENTIFIED
- **Evidence**:
  - `719-*.js` is **347.9 kB** uncompressed and consumed **5,093 ms** of CPU time on mobile bootup.
  - Sentry Session Replay integration was unconditionally initialized on the client even in local/development profiles (`tracesSampleRate: 1.0`, `replaysOnErrorSampleRate: 1.0`).
  - `5571-*.js` (144.2 kB) and `9178-*.js` (90.3 kB) contain full Framer Motion springs and animators evaluated during initial parse.
- **Remediation**:
  - Gate Sentry client tracing and session replay with `isSentryEnabled()`, ensuring local and standard loads don't pay a 350 kB scripting tax.
  - Lazy load Framer Motion spring modules or use lightweight CSS keyframes for immediate above-the-fold hero rendering.

---

## Category C: Image Delivery & LCP Critical Path
- **Status**: CRITICAL LCP CULPRIT
- **Evidence**:
  - On `/` (Home), mobile emulation recorded an LCP of **9.2s**.
  - Forensic inspection of `lcp-breakdown-insight` revealed the mobile LCP element is `<img alt="PetSaathi caregiver and smiling golden retriever in a sunlit home" ...>`.
  - In `marketing-experience.tsx`, line 128:
    ```tsx
    <div className="relative my-6 w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-3xl border border-white/20 shadow-2xl xl:hidden">
      <Image src="/images/hero-dog-woman.webp" alt="..." fill sizes="(max-width: 768px) 100vw, 80vw" className="object-cover object-[58%_35%]" />
    </div>
    ```
    This image **omitted `priority` and `fetchPriority="high"`**. Next.js defaulted it to `loading="lazy"`.
  - Because it was lazy loaded, the browser deferred loading until DOM layout was complete, causing an element render delay of **1,933 ms** and pushing LCP to 9.2s.
  - Simultaneously, the desktop hero background image (line 93) had `priority` and was downloading simultaneously at 100vw, wasting bandwidth on mobile.
- **Remediation**:
  - Set `priority` and `fetchPriority="high"` directly on the mobile hero showcase image.
  - Apply responsive hiding (`hidden xl:block`) on the full-bleed background so mobile devices only download a single, preloaded hero image.
  - Verify images on `/services` and `/book` have explicit `priority` when positioned above the fold.

---

## Category D: Font Optimization & Layout Stability (CLS)
- **Status**: EXCELLENT (CLS: 0.000 – 0.009)
- **Evidence**:
  - `next/font/google` (`Plus_Jakarta_Sans` and `Playfair_Display`) configured with `display: "swap"`, preloaded subsets `["latin"]`, and CSS variable injection.
  - Zero layout shift detected on Home (0.009), Services (0.000), and Book (0.000).
- **Remediation**:
  - Maintain font declarations in `src/app/layout.tsx`.

---

## Category E: CSS & Styling Overhead
- **Status**: CLEAN
- **Evidence**:
  - Tailwind CSS 3.4 with content purging active. Generated global stylesheet is only **18.7 kB** gzipped.
  - Phase 9 audit found zero unconstrained fixed-pixel widths exceeding 375px without scroll containers.
- **Remediation**:
  - Ensure all drop-shadow and backdrop-filter classes use GPU-accelerated CSS transforms.

---

## Category F: Third-Party Scripts & Analytics Impact
- **Status**: OPTIMIZATION REQUIRED
- **Evidence**:
  - Microsoft Clarity (`scripts.clarity.ms`) consumed **428 ms** of main-thread time.
  - Google Analytics (`gtag.js`) consumed **363 ms** of main-thread time.
  - Both were executing during initial page hydration.
- **Remediation**:
  - Load third-party analytics via `next/script` with `strategy="lazyOnload"` or defer after page becomes interactive.

---

## Category G: Animation & Framer Motion Execution Overhead
- **Status**: HIGH MAIN THREAD OVERHEAD
- **Evidence**:
  - `mainthread-work-breakdown` revealed **3,519 ms** spent in style and layout calculations.
  - `TextReveal` splits text into individual word spans wrapped in motion divs, causing repeated layout thrashing on mobile CPU.
  - `ScrollReveal` attaches IntersectionObserver and transforms to every hero element simultaneously.
- **Remediation**:
  - For mobile/reduced-motion environments, bypass JavaScript text splitting and use native CSS `@keyframes` with `content-visibility: auto` for instant hero paint.

---

## Category H: Client State & Hydration Costs
- **Status**: HEALTHY
- **Evidence**:
  - React 19 concurrent hydration is smooth. No hydration mismatches (`Text content does not match server-rendered HTML`) logged.
  - LocalStorage / cookie access is correctly guarded with `useEffect` or client event handlers.
- **Remediation**:
  - Keep client state localized to interactive leaves (`CareMatchFinder`, `AuthNav`).

---

## Category I: Data Fetching & Server Rendering Latency (TTFB)
- **Status**: EXCELLENT
- **Evidence**:
  - Root document TTFB on local/edge preview is **106 ms – 118 ms**.
  - Static pages (`/`, `/services`, `/caregivers`) utilize ISR (`revalidate: 3600`), serving pre-rendered HTML from the Next.js cache.
- **Remediation**:
  - Maintain ISR caching tags and keep dynamic routes (`/book`, `/dashboard`) optimized with selective Prisma field queries.

---

## Category J: Database Queries & Prisma Overhead
- **Status**: FULLY AUDITED & VERIFIED
- **Evidence**:
  - Phase 7 audit (`audit-phase7-data-layer.mjs`) confirmed:
    - 0 unindexed foreign key relations.
    - 0 floating-point monetary fields (all prices strictly stored in integer paise).
    - Compound indexes present on high-frequency queries (`[userId, createdAt]`, `[saathiId, date]`).
  - No N+1 query patterns detected in server actions.
- **Remediation**:
  - Continue enforcing compound indexes on all upcoming Prisma models.

---

## Category K: Caching Strategies & HTTP Headers
- **Status**: HARDENED
- **Evidence**:
  - Static assets (`/_next/static/`) served with `Cache-Control: public, max-age=31536000, immutable`.
  - Media assets (`/videos/`, `/icons/`) served with 1-year immutable caching.
  - Public images (`/images/`) served with `stale-while-revalidate=604800`.
  - Comprehensive CSP, HSTS, X-Frame-Options, and nosniff headers active across all routes.
- **Remediation**:
  - Maintain edge-cache header rules in `next.config.mjs`.

---

## Category L: Memory & CPU Profiling
- **Status**: NORMAL
- **Evidence**:
  - V8 Garbage Collection consumed only **58.7 ms** during initial load.
  - Zero memory leaks detected during client route transitions.
- **Remediation**:
  - Ensure listeners and observers in motion components are cleaned up on unmount.

---

## Category M: Accessibility (a11y) & Semantic Markup Compliance
- **Status**: PASSED (Lighthouse a11y score: 93 – 100)
- **Evidence**:
  - All interactive buttons have visible text or `aria-label`.
  - Form inputs have associated `<label>` tags with `htmlFor` and `id`.
  - Heading hierarchy (`h1`, `h2`, `h3`) is structurally consistent across all routes.
- **Remediation**:
  - Maintain semantic landmarks and color contrast ratios $\ge$ 4.5:1.

---

## Category N: SEO & Metadata Optimization
- **Status**: EXCELLENT (Lighthouse SEO: 92 – 100)
- **Evidence**:
  - OpenGraph, Twitter Cards, canonical tags, and JSON-LD schema markup configured in `src/app/layout.tsx` and route metadata exports.
  - `robots.ts` and `sitemap.ts` dynamically generate valid crawler directives.
- **Remediation**:
  - Keep structured data synchronized with service catalog updates.

---

## Category O: Mobile Responsiveness & Viewport Budget
- **Status**: VERIFIED
- **Evidence**:
  - `<meta name="viewport" content="width=device-width, initial-scale=1">` present.
  - Touch targets meet WCAG $\ge$ 44x44px requirements.
  - Zero horizontal scrollbar overflows on 375px mobile viewports.
- **Remediation**:
  - Enforce `touch-action: manipulation` on mobile interactive controls.

---

## Category P: Network & CDN Delivery
- **Status**: PRODUCTION READY
- **Evidence**:
  - Next.js Image Optimization service converts source assets to modern `image/avif` and `image/webp`.
  - Gzip and Brotli compression enabled for all text responses.
- **Remediation**:
  - Ensure correct responsive `sizes` attribute on all `<Image>` components to prevent oversized variant downloads.

---

## Category Q: Production Build & Dependency Hygiene
- **Status**: VERIFIED CLEAN
- **Evidence**:
  - `npm run lint`: 0 warnings, 0 errors.
  - `npm run typecheck`: 0 errors.
  - `npm test`: 55/55 test suites passed, 202/202 unit & integration tests passed.
  - `npm run build`: 113 routes compiled cleanly.
  - No legacy or unmaintained dependencies in critical path.
- **Remediation**:
  - Maintain strict TypeScript type checks and automated CI gates.
