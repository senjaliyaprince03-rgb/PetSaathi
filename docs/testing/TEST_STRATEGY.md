# PetSaathi — Testing Strategy & Quality Assurance Architecture

**Testing Framework:** Vitest (Unit & Integration) + Playwright (E2E)  
**Current Test Coverage:** 80 Test Files | 168 Unit & Integration Tests

---

## 1. Testing Pyramid Overview

```
       ▲
      / \
     /E2E\     Playwright (Checkout, Live Map, Onboarding)
    /-----\
   / INTEG \   API Handlers, DB Transactions, Webhook Idempotency
  /---------\
 /   UNIT    \ State Machines, Distance Formulas, Pricing Economics, Auth
/_____________\
```

---

## 2. Key Test Categories & Verification Files

### A. Unit Tests (`tests/unit/*`)
- **Booking State Machine (`booking-state-machine.test.ts`):** Validates all legal transitions across 20+ states and verifies illegal state transitions are rejected.
- **Pricing & Economics (`pricing-economics.test.ts`, `pricing-input.test.ts`):** Verifies GST tax calculations, platform commission splits, and quote snapshots.
- **Distance & Tracking (`tracking-distance.test.ts`):** Validates the Haversine formula distance computations across real GPS coordinate pairs.
- **Authentication & Security (`auth-secret.test.ts`, `origin-security.test.ts`, `razorpay-security.test.ts`):** Asserts HMAC signature validation, CSRF origin verification, and secure secret resolution.

### B. Integration Tests (`tests/integration/*`)
- **Payment Webhook Idempotency:** Asserts that duplicate Razorpay webhook event IDs are detected and not double-processed.
- **Caregiver Eligibility & Conflict Checks:** Asserts that caregivers with schedule overlaps cannot accept conflicting assignments.

---

## 3. Running the Test Suites

```bash
# Run all unit tests
npm test -- --run

# Run tests with code coverage
npm run test:coverage

# Run TypeScript type verification
npm run typecheck
```
