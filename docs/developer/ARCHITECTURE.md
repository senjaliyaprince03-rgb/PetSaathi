# PetSaathi Architecture Reference

## Overview
PetSaathi is a full-stack, hyper-local pet care and society dog-walking platform engineered specifically for gated communities, societies, and urban pet parents across Indian metropolitan regions (Ahmedabad, Pune, Bangalore, Mumbai, NCR).

## Core Architecture Pillars

### 1. Presentation & Mobile Shell
- **Web App**: Next.js 15 App Router with React Server Components, server actions, and optimistic client UI.
- **Mobile Client**: Hybrid Capacitor 8.5 bridge (`com.petsaathi.app`) connecting directly to the live App Router backend with offline fallbacks, background geolocation, and push notifications.

### 2. State Machines & Concurrency Guarantees
- **Booking Lifecycle**: 14 strictly enforced states (`DRAFT`, `REQUESTED`, `RISK_REVIEW`, `MATCHING`, `SITTER_PROPOSED`, `CUSTOMER_APPROVAL_PENDING`, `PAYMENT_PENDING`, `CONFIRMED`, `SITTER_EN_ROUTE`, `IN_PROGRESS`, `REPORT_PENDING`, `COMPLETED`, `CLOSED`, `INCIDENT_HOLD`).
- **Atomic Concurrency Control**: All capacity reservations, assignment accepts, and wallet/entitlement deductions use MongoDB multi-document ACID transactions with optimistic locking via `updateMany({ where: { status: 'OFFERED' } })`. Verified to eliminate double-accept, double-spend, and race conditions under 10 concurrent requests.

### 3. Payment Processing & Webhook Idempotency
- **Gateway**: Razorpay Checkout & Webhooks for INR UPI, Net Banking, and Cards.
- **Security**: HMAC SHA-256 webhook signature verification with raw-body buffering and single-flight execution claiming (`attempts: 0 -> 1`) preventing duplicate credit or double execution.
- **Failure Resilience**: 3-attempt automated retry prompt before releasing held capacity and auto-declining booking.

### 4. AI & Knowledge Base Subsystem
- **Router**: Capability-based NVIDIA AI Router (`ai/router.mjs`) querying NVIDIA NIM API (`meta/llama-3.2-11b-vision-instruct`).
- **Domain RAG**: 15 localized Indian pet care modules (`content/pet-care-kb/*.md`) with 100% precision@3 retrieval for climate, disease (tick fever), RWA regulations, and emergency toxicology.
- **Governance**: Concurrency limiter, rate limiter (20 req/min), token budget store, and circuit breaker.
