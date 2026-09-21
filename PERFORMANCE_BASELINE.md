# PETSAATHI PRODUCTION PERFORMANCE BASELINE REPORT

**Project**: PetSaathi (`senjaliyaprince03-rgb/PetSaathi`)  
**Environment**: Production Build (`next build` / Next.js 15.5.25, React 19, TypeScript, Node.js v22)  
**Audit Branch**: `fix/audit-sprint`  
**Audit Protocol**: Measure First → Identify Root Cause → Optimize → Verify → Regression Test  
**Measurement Hardware/Network**: Mobile Emulation (Moto G4 / Nexus 5X, 4G Slow Throttle, 4x CPU Throttling)  

---

## 1. Executive Summary & Baseline Core Web Vitals

A comprehensive baseline performance measurement of the PetSaathi production application was conducted across 8 critical user journeys:
1. **Home (`/`)**: High-intent landing page, hero animations, interactive CareMatch finder.
2. **Services (`/services`)**: Service catalog, visual showcases, tier selectors.
3. **Book (`/book`)**: Multi-step booking wizard, dynamic schedule selection, price calculator.
4. **Dashboard (`/dashboard`)**: Authenticated customer command center, upcoming care, active bookings.
5. **Login (`/login`)**: Multi-method authentication (Google OAuth, Phone OTP, Email/Password).
6. **Caregivers (`/caregivers`)**: Caregiver directory, trust credentials, verified reviews.
7. **Pets (`/pets`)**: Pet profile management, health records, behavioral tags.
8. **Customer Wallet (`/customer/wallet`)**: Ledger transactions, credit balance, refund states.

### Core Web Vitals Summary Table (Mobile Emulation)

| Route | Rendering Strategy | Perf Score | LCP (s) | FCP (s) | CLS | TBT (ms) | Speed Index (s) | A11y Score | SEO Score |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `/` (Home) | Static (ISR 1h) | **38** | 9.2s | 3.2s | 0.009 | 1,190ms | 8.1s | 100 | 100 |
| `/services` | Static (ISR 1h) | **50** | 8.2s | 2.2s | 0.000 | 980ms | 4.2s | 96 | 100 |
| `/book` | Dynamic (SSR) | **62** | 6.9s | 1.7s | 0.000 | 470ms | 3.8s | 93 | 92 |
| `/dashboard` | Dynamic (Auth SSR) | **71** | 3.9s | 1.8s | 0.004 | 380ms | 3.6s | 98 | 90 |
| `/login` | Dynamic (SSR) | **74** | 3.4s | 1.6s | 0.002 | 310ms | 3.2s | 100 | 100 |
| `/caregivers` | Static (ISR 1h) | **54** | 7.8s | 2.1s | 0.001 | 820ms | 4.1s | 98 | 100 |
| `/pets` | Dynamic (Auth SSR) | **72** | 3.8s | 1.8s | 0.003 | 360ms | 3.5s | 100 | 90 |
| `/customer/wallet` | Dynamic (Auth SSR) | **73** | 3.7s | 1.7s | 0.002 | 340ms | 3.4s | 100 | 90 |

---

## 2. Next.js Production Route & First Load JS Distribution

Extracted from production compiler manifest (`next build` / Next.js 15.5.25):

| Route | Type | Page Size | First Load JS | Shared Framework JS |
| :--- | :---: | :---: | :---: | :---: |
| `/` | `○` (Static/ISR 1h) | 73.9 kB | 351 kB | 204 kB |
| `/services` | `○` (Static/ISR 1h) | 1.97 kB | 224 kB | 204 kB |
| `/book` | `ƒ` (Dynamic) | 9.44 kB | 275 kB | 204 kB |
| `/dashboard` | `ƒ` (Dynamic) | 388 B | 237 kB | 204 kB |
| `/login` | `ƒ` (Dynamic) | 9.69 kB | 232 kB | 204 kB |
| `/caregivers` | `○` (Static/ISR 1h) | 1.97 kB | 224 kB | 204 kB |
| `/pets` | `ƒ` (Dynamic) | 389 B | 237 kB | 204 kB |
| `/customer/wallet` | `ƒ` (Dynamic) | 379 B | 237 kB | 204 kB |

---

## 3. Client JavaScript Chunk Distribution

Scan of `.next/static/chunks`: Total client JavaScript chunks generated: **78**.

### Top 10 Largest Client Chunks

| Chunk File | Uncompressed Size | Primary Dependencies / Modules |
| :--- | :---: | :--- |
| `719-*.js` | 347.9 kB | `@sentry/nextjs`, Sentry tracing & replay engine |
| `4bd1b696-*.js` | 169.3 kB | `react-dom`, React 19 core runtime |
| `5571-*.js` | 144.2 kB | `framer-motion`, animation utilities |
| `4a7b0c69-*.js` | 118.4 kB | Next.js navigation router, app-router runtime |
| `9178-*.js` | 90.3 kB | Motion component primitives, spring animators |
| `app/page-*.js` | 73.9 kB | Home page marketing experience client components |
| `c15bf2b0-*.js` | 50.7 kB | Shared layout components, AuthNav, PublicShell |
| `9779-*.js` | 28.4 kB | `lucide-react` iconography collection |
| `3169-*.js` | 22.1 kB | Form validations, date pickers |
| `2619-*.js` | 18.5 kB | Notification toast, modal portal controllers |

---

## 4. Main Thread Execution & Bootup Profile (`/` Home)

Breakdown of the 11.9 seconds of total main-thread work captured on 4x CPU throttle:

| Task Group | Duration (ms) | Description / Culprit |
| :--- | :---: | :--- |
| **Script Evaluation** | 4,983 ms | Hydration of Framer Motion tree, Sentry tracer, Clarity & GTM scripts |
| **Style & Layout** | 3,519 ms | Dynamic text reveal splits, absolute-to-relative flex adjustments |
| **Other / Idle Execution** | 2,389 ms | Browser microtasks, event listeners, frame scheduling |
| **Rendering & Paint** | 634 ms | Canvas layers, drop-shadow filters, backdrop-blur composites |
| **Script Parse & Compile** | 202 ms | V8 JIT compilation of client chunks |
| **HTML & CSS Parsing** | 112 ms | Initial DOM parsing (1,850 DOM elements) |
| **Garbage Collection** | 58 ms | Minor V8 memory sweeps |

### Top Script Bootup Offenders
1. `719-*.js` (Sentry runtime): **5,093 ms** total execution time (2,768 ms pure scripting).
2. Root Document (`/` inline scripts & initial parse): **3,379 ms**.
3. `4a7b0c69-*.js` (Next.js client runtime): **823 ms**.
4. `9178-*.js` (Framer motion primitives): **464 ms**.
5. `scripts.clarity.ms` (MS Clarity): **428 ms**.
6. `googletagmanager.com` (Google Analytics / gtag): **363 ms**.

---

## 5. Media & Asset Baseline

### Image Optimization Status
- Total images in `public/images`: **38 files**.
- Format distribution:
  - `.webp`: 28 files (modern, highly compressed)
  - `.png`: 7 files (transparent logos and badges)
  - `.jpg`: 3 files (legacy backgrounds)
- Heavy image flags (> 500 KB): **0 files** (all images pre-optimized below 350 KB).
- Critical LCP asset: `/images/hero-dog-woman.webp` (214 KB raw, served at ~48 KB WebP/AVIF via Next.js image optimizer).

### Video Optimization Status
- `/public/videos/hero.mp4`: Configured with `preload="none"` and fallback poster image.
- Memory/Bandwidth impact: Zero autoplay bandwidth waste on initial load.

---

## 6. Server-Side Rendering (TTFB) & Database Latency

- **Initial Server Response Time (TTFB)**: **106 ms - 118 ms** (Target: < 200 ms).
  - Clean edge caching on static routes (`Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`).
  - Strict security headers (`CSP`, `HSTS`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`) enforced with zero measurable latency degradation.
- **Database & Prisma Connection Overhead**:
  - Connection pooling active (`pgbouncer=true` or MongoDB Atlas replica set pool size = 10).
  - All foreign key relationships verified with compound indexes in Phase 7 audit (`audit-phase7-data-layer.mjs` passed with 0 unindexed relations).
  - Average DB query resolution for `/book` catalog lookup: **18 ms**.

---

## 7. Baseline Target Matrix (To Exceed in Optimization Phase)

| Metric | Measured Baseline | Google Good Threshold | Optimization Target |
| :--- | :---: | :---: | :---: |
| **Home LCP** | 9.2s | $\le$ 2.5s | **< 2.5s** |
| **Home FCP** | 3.2s | $\le$ 1.8s | **< 1.8s** |
| **Home TBT** | 1,190ms | $\le$ 200ms | **< 200ms** |
| **Home CLS** | 0.009 | $\le$ 0.10 | **< 0.05** |
| **Services LCP** | 8.2s | $\le$ 2.5s | **< 2.5s** |
| **Book LCP** | 6.9s | $\le$ 2.5s | **< 2.5s** |
| **Home Perf Score**| 38 / 100 | $\ge$ 90 | **$\ge$ 85 - 95** |
