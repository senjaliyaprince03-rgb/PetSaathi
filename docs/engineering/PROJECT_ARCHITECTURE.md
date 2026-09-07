# PetSaathi — Comprehensive Project Architecture & Technical Specification

**Date:** September 3, 2026  
**Audience:** Lead Staff Engineer, Security Architect, DevOps, Leadership  
**Status:** Production Baseline Audit & Structural Blueprint

---

## 1. Executive Technical Overview
PetSaathi is an urban pet-care marketplace tailored to Indian metropolitan hubs (Ahmedabad, Pune, Bangalore). It operates as a Next.js 15 full-stack application using the App Router, Prisma ORM against MongoDB Atlas, Tailwind CSS, and Node.js cryptographic primitives.

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                      │
│   Web PWA (Desktop/Mobile)   │   Expo / RN Mobile Task      │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON / Cookies
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 15 App Router                    │
│   Middleware: City Subdomain, Security Headers, Rate Limits │
│   Public Marketing  │ Customer Portal │ Saathi Caregiver    │
│   Admin Operations  │ Operator Portal │ REST API Handlers   │
└──────────────┬───────────────┬──────────────────────────────┘
               │               │
      Internal │      External │ Services
               │               ▼
               │       ┌──────────────────────────────────────┐
               │       │ Third-Party Production Boundaries    │
               │       │ - Razorpay (Orders, Webhooks, Subs)  │
               │       │ - Resend / SMTP (OTP & Transactional)│
               │       │ - Meta WhatsApp & Cloud API          │
               │       │ - NVIDIA NIM AI Router               │
               │       │ - Sentry & Clarity & GA4             │
               │       │ - ClearTax GST & MyGate Gate Protocol│
               │       └──────────────────────────────────────┘
               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Database & State Layer                    │
│   MongoDB Atlas via Prisma ORM (136 Active Schema Models)   │
│   Collections: Users, Pets, Bookings, Ledgers, Outbox       │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Layer-by-Layer Architecture

### A. Frontend Layer (Next.js 15 App Router)
- **Portals:**
  - **Public Marketing & SEO (`src/app/(public)` & root routes):** Landing pages, journal, legal notices, lead magnets.
  - **Customer Portal (`src/app/(portal)/dashboard`, `pets`, `bookings`):** Pet management, booking checkout, live map tracking, end-of-service reports.
  - **Caregiver Portal (`src/app/(portal)/saathi/*`):** Profile, availability calendar, Academy training, assignments inbox, earnings, performance scorecard.
  - **Admin Command Center (`src/app/(portal)/admin/*`):** Dispatch matching inspector, sitter verifications, safety incidents, plan pricing, B2B CRM, finance.
  - **Operator City Portal (`src/app/operator-portal/[city]`):** Localized city operational metrics, P&L, service area control.
- **Design System:** Custom responsive UI with Tailwind CSS, Lucide icons, Framer Motion, and mobile app bar/drawer navigation.

### B. Backend Route Handlers (`src/app/api/*`)
- **168 REST API Endpoints:**
  - All endpoints enforce strict TypeScript input validation using `zod`.
  - Structured response contracts with standardized JSON problem details.
  - Strict role authorization via `getCurrentIdentity()` and `authorizeApi()`.

### C. Security & Authentication Layer
- **No JWT in LocalStorage:** Uses HTTP-only, `SameSite: Lax`, Secure cookies (`petsaathi_session`).
- **Scrypt Password Hashing:** Node.js native `scrypt` with 16-byte cryptographically secure random salt (`scrypt:${salt}:${derived}`).
- **OTP Delivery Pipeline:** 6-digit random integers via `crypto.randomInt()`, hashed with HMAC-SHA256, expired in 10 minutes, backed by Resend + Gmail SMTP fallback + secondary local console logger.
- **Anti-Enumeration:** Sign-up, sign-in, and reset routes return non-revealing error shapes to prevent account discovery.
- **Cross-Site Request Forgery (CSRF):** SameSite cookies + origin/referer validation on mutating HTTP methods.

### D. Booking Engine & State Machine
- **20+ Discrete States:** Strict lifecycle transition mapping (`src/modules/bookings/state-machine.ts`).
- **Concurrency & Double-Booking Protection:**
  1. Transactional capacity reservations with decrement-and-check locking (`CapacityLimit`).
  2. Temporal overlap conflict queries checking `scheduledStart < existing.end AND scheduledEnd > existing.start` across active caregiver assignments.
  3. Optimistic locking on `Booking` records using version fields.

### E. Financial & Payment Engine
- **Razorpay Server-Side Order Generation:** Frontend never dictates booking prices or payment amounts; quotes are calculated from approved `ServicePrice` rows.
- **Webhook Idempotency:** Write-ahead logging in `PaymentEvent` table using `providerEventId` unique constraint. Duplicate webhook deliveries are acknowledged with 200/202 and skipped.
- **HMAC-SHA256 Signature Verification:** Verified before any JSON parsing or internal routing.

### F. Notification Outbox Pattern
- **DB-First Architecture:** Outgoing transactional notifications are written to `NotificationOutbox` before network dispatch.
- **Reliability:** Failed attempts undergo exponential backoff retries via `/api/jobs/notifications`.
- **Supported Channels:** Email (Resend/SMTP), WhatsApp (Meta Cloud API), SMS, Web Push (VAPID).

### G. AI Intelligence Layer
- **NVIDIA AI Router (`ai/router.mjs`):** Capability-based model scoring, circuit-breaker health tracking, token telemetry, and Server-Sent Events (SSE) streaming.
- **Security Guardrails:** AI has no raw write access to databases or payments; requests are constrained to sandboxed advisory chats and matching scores.
