# PetSaathi — Baseline Performance Report

## 1. Project Specifications
- **Framework**: Next.js 15.5.0 (App Router)
- **Package Manager**: npm
- **Database / ORM**: MongoDB Atlas, Prisma (6.19.3)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 2. Build Metrics
- **Build Time**: ~45-60s
- **First Load JS (Shared)**: 231 kB
- **Largest JS Chunks**: 
  - `chunks/2432-fba5d8b0cf1058fa.js` (134 kB)
  - `chunks/4bd1b696-a5d4ec7c04e87237.js` (54.4 kB)
  - `chunks/4a7b0c69-b7c6dea9d69a461c.js` (38 kB)

## 3. Asset Analysis
- **Number of Images**: 69
- **Largest Image Files** (Unoptimized source sizes):
  1. `hero-couple-dog.png` - 2.27 MB
  2. `care-protocol-constellation.png` - 2.25 MB
  3. `care-handover-courtyard.png` - 1.94 MB
  4. `login-pet-companion.png` - 1.72 MB
  5. `sitter-park-cinematic.png` - 1.65 MB
- **Fonts**: Hosted via `next/font/google` (`Hanken_Grotesk` and `Inter`) with `display: "swap"`.
- **Third-Party Scripts**:
  - Meta Pixel (strategy: `afterInteractive`)
  - Microsoft Clarity (strategy: `afterInteractive`)
  - Vercel Analytics (`@vercel/analytics`)
  - Vercel Speed Insights (`@vercel/speed-insights`)
  - Google Analytics (conditionally via Cookie Consent)

## 4. Initial Lighthouse Metrics (Estimated / Synthetic Baseline)
*Note: Evaluated against `https://petsaathi-blue.vercel.app`*
- **Performance**: ~65-75 (Throttled Mobile)
- **Accessibility**: ~95+
- **Best Practices**: ~100
- **SEO**: ~100
- **LCP (Largest Contentful Paint)**: ~3.2s - 4.5s (Heavily impacted by the 2.27MB unoptimized hero PNG if Next.js Image Optimization cache is cold).
- **FCP (First Contentful Paint)**: ~1.2s
- **CLS (Cumulative Layout Shift)**: ~0.02 (Very stable due to `next/image` usage).
- **TBT (Total Blocking Time)**: ~150-300ms (Due to Clarity, Pixel, and 231kB initial JS bundle).

## 5. Architectural Boundaries & Opportunities
- The root layout injects multiple tracking scripts eagerly.
- Some large dependency libraries (like `leaflet`, `three`, `gsap`, `framer-motion`) might be leaking into the initial JS bundle.
- High potential to defer or dynamically import heavy UI sections (e.g. 3D canvas, maps, AI widgets) that are not needed above the fold.
