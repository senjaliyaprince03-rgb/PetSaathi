# PETSAATHI PERFORMANCE REGRESSION GUARD
## Production Baseline Policy, Monitoring Thresholds & Preservation Rules

**Project**: PetSaathi (`senjaliyaprince03-rgb/PetSaathi`)  
**Status**: PERFORMANCE BASELINE LOCKED  
**Production Host**: `https://petsaathi-blue.vercel.app`  
**Framework**: Next.js 15.5.25 App Router, React 19, TypeScript 5.8  
**Authoritative Bug & Performance Ledger**: `qa/BUGS.md`, `PERFORMANCE_BASELINE.md`, `PRODUCTION_PERFORMANCE_VALIDATION.md`  

---

## 1. Locked Production Baselines

The following values represent measured real-world and mobile-throttled baselines on the live Vercel production deployment (`https://petsaathi-blue.vercel.app`):

### Route-by-Route Baseline Matrix

| Journey / Route | LCP | FCP | INP | CLS | TBT | TTFB | First Load JS | Initial Requests | CDN Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Home (`/`)** | **1.8s** | **0.9s** | **45ms** | **0.005** | **140ms** | **50ms** | **204 KB** | **22** | Edge HIT |
| **Services (`/services`)** | **1.7s** | **0.8s** | **40ms** | **0.000** | **120ms** | **46ms** | **204 KB** | **18** | Edge HIT |
| **Book (`/book`)** | **1.6s** | **1.1s** | **55ms** | **0.000** | **95ms** | **345ms** | **204 KB** | **20** | SSR Dynamic |
| **Login (`/login`)** | **1.2s** | **0.8s** | **35ms** | **0.002** | **80ms** | **96ms** | **204 KB** | **16** | SSR Dynamic |
| **Dashboard (`/dashboard`)** | **1.4s** | **0.9s** | **40ms** | **0.004** | **110ms** | **38ms** | **204 KB** | **15** | Auth Guard (307) |

---

## 2. Regression Monitoring Thresholds

Any pull request, deployment, or infrastructure modification that pushes metrics beyond these thresholds must trigger automated build failure or high-priority engineering alerts:

### Alert & Guard Thresholds Table

| Metric | Verified Baseline | Warning Threshold (`WARN`) | Critical Threshold (`FAIL`) | Action Required |
| :--- | :---: | :---: | :---: | :--- |
| **Home LCP** | 1.8s | **> 2.2s** | **> 2.5s** | Block release; audit hero image preload & sizes |
| **Home FCP** | 0.9s | **> 1.5s** | **> 1.8s** | Block release; verify SSR hero text visibility |
| **Home INP** | 45ms | **> 150ms** | **> 200ms** | Block release; profile main-thread long tasks |
| **Home CLS** | 0.005 | **> 0.08** | **> 0.10** | Block release; inspect font swaps & dynamic cards |
| **Home TBT** | 140ms | **> 180ms** | **> 300ms** | Block release; audit script evaluation & hydration |
| **Home TTFB** | 50ms | **> 150ms** | **> 300ms** | Alert DevOps; inspect Vercel Edge caching rules |
| **Initial Client JS** | 204 KB | **> 250 KB** | **> 300 KB** | Block release; run `@next/bundle-analyzer` |
| **Initial Requests** | 22 | **> 30** | **> 40** | Block release; inspect un-deferred asset calls |

---

## 3. Mandatory Optimization Preservation Rules

The following 8 architectural optimizations are critical to maintaining production performance and **MUST NEVER** be reverted, removed, or bypassed:

### Rule 1: Mobile Hero Image Priority & Hinting
- **Location**: `src/components/marketing/marketing-experience.tsx`
- **Requirement**: The mobile/tablet hero showcase `<Image>` (`/images/hero-dog-woman.webp`) must always retain `priority`, `fetchPriority="high"`, and explicit responsive `sizes="(max-width: 768px) 100vw, 80vw"`.
- **Reason**: Without priority hinting, Next.js defaults to `loading="lazy"`, creating an element render delay of ~1,933 ms and pushing LCP beyond 8 seconds.

### Rule 2: SSR Immediate Above-the-Fold Hero Rendering
- **Location**: `src/components/effects/animos-motion.tsx`, `src/components/3d/scroll-reveal.tsx`
- **Requirement**: Hero headline, badge, and intro copy must render visibly in SSR using `immediate={true}`. Never gate text opacity behind client-side `const [mounted, setMounted] = useState(false)`.
- **Reason**: Hiding hero text until client hydration forces a blank screen on slow mobile CPUs, delaying FCP by over 2 seconds.

### Rule 3: Sentry Client Runtime & Replay Gating
- **Location**: `src/instrumentation-client.ts`, `src/sentry.server.config.ts`, `src/sentry.edge.config.ts`
- **Requirement**: Client-side Sentry initialization and heavy session replay (`Sentry.replayIntegration()`) must be gated with `isSentryEnabled(dsn, environment)`.
- **Reason**: Unconditional client replay imports add a 347.9 kB scripting payload and consume > 5,000 ms of CPU bootup time during standard user browsing.

### Rule 4: Third-Party Analytics Lazy Loading
- **Location**: `src/app/layout.tsx`
- **Requirement**: Google Analytics (`gtag.js`), Microsoft Clarity, and Meta Pixel must use Next.js `<Script strategy="lazyOnload">`.
- **Reason**: Loading third-party tracking scripts with `afterInteractive` blocks React 19 concurrent hydration and inflates Total Blocking Time (TBT).

### Rule 5: Hero Video IntersectionObserver Gating
- **Location**: `src/components/marketing/hero-video-showcase.tsx`
- **Requirement**: Below-the-fold care film videos must use `preload={isVisible ? "metadata" : "none"}` and `autoPlay={isVisible}`, where `isVisible` is controlled by an `IntersectionObserver` with `{ rootMargin: "200px" }`. The video poster image (`/videos/dog-walking.jpg`, 35 KB) must always be specified.
- **Reason**: Setting `preload="auto"` or autoplaying offscreen video forces the browser to download a 2.6 MB MP4 file on initial page load, consuming critical network bandwidth.

### Rule 6: Responsive Image Sizing
- **Location**: All `<Image>` instances in `src/components/` and `src/app/`
- **Requirement**: Every Next.js `<Image fill>` must include explicit, accurate `sizes` attributes reflecting viewport boundaries (e.g. `sizes="(max-width: 768px) 100vw, 50vw"`).
- **Reason**: Omission of `sizes` forces Next.js to serve full-width (1920px+) image variants to mobile viewports, wasting mobile data and cache capacity.

### Rule 7: Production Caching & Security Headers
- **Location**: `next.config.mjs`
- **Requirement**:
  - `/_next/static/:path*` → `Cache-Control: public, max-age=31536000, immutable`
  - `/videos/:path*`, `/icons/:path*` → `Cache-Control: public, max-age=31536000, immutable`
  - `/images/:path*` → `Cache-Control: public, max-age=86400, stale-while-revalidate=604800`
  - Dynamic user endpoints (`/api/auth/session`, `/dashboard`) → `private, no-cache, no-store`
- **Reason**: Ensures 100% edge hit ratios for static assets while guaranteeing zero cross-user cache contamination on authenticated routes.

### Rule 8: Authentication Request Deduplication
- **Location**: `src/components/marketing/auth-nav.tsx`, `src/middleware.ts`
- **Requirement**: Guest sessions and user authentication lookups (`/api/auth/session`) must only trigger once on component mount (`useEffect(..., [])`) without polling loops.
- **Reason**: Prevents duplicate session calls, layout shift re-renders, and serverless invocation storms.

---

## 4. Verification & CI Gate Commands

The PetSaathi production gate requires 100% clean passes on all four verification stages prior to merging:

```bash
# 1. Zero ESLint warnings or errors
npm run lint

# 2. Strict TypeScript type check
npm run typecheck

# 3. Vitest unit & integration test suite (202/202 passing)
npm test

# 4. Production compiler & static generation (113/113 routes)
npm run build
```

---

## 5. Summary Declaration

The PetSaathi performance baseline is **LOCKED**. Any subsequent feature development, design refresh, or dependency upgrade must benchmark against the thresholds defined herein.
