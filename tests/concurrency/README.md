# LOCKING STRATEGY AUDIT — Phase 3

## Executive Summary

Phase 3 established an automated, non-mocked concurrency verification suite testing atomic operations and race condition handling against real MongoDB Atlas database instances. All tests run in parallel and exercise distributed system failure modes:
1. **Simultaneous assignment acceptance** across 10 distinct service providers (Saathis).
2. **Race to redeem a single remaining entitlement credit** across concurrent customer booking submissions.
3. **High-frequency webhook replay attacks / retries** delivering identical payment capture events simultaneously.

---

## Concurrency Test Results Overview

| Test Suite | Scenario | In-Flight Concurrent Operations | Outcome | Regressions |
| :--- | :--- | :--- | :--- | :--- |
| `tests/concurrency/double-accept.test.ts` | 10 Saathis accepting the same booking offer simultaneously | 10 | **1x 200 OK (`ACCEPTED`), 9x 409 Conflict (`offer_already_accepted`)** | 0 |
| `tests/concurrency/double-spend-entitlement.test.ts` | Customer with balance=1 fires 2 simultaneous bookings | 2 | **2x 201 Created; Exactly 1 `CONFIRMED` with credit, 1 `REQUESTED` (awaiting payment). Final ledger balance = 0 (never negative).** | 0 |
| `tests/concurrency/webhook-replay.test.ts` | 5 identical Razorpay `payment.captured` webhook posts fired at once | 5 | **5x 2xx responses; exactly 1 `PaymentEvent` created, 1 payment capture executed, 1 booking confirmed.** | 0 |

- **Typecheck**: `npm run typecheck` (`tsc --noEmit`) -> **0 errors (PASSED)**
- **Production Build**: `npm run build` -> **109 static/dynamic pages compiled, 0 errors (PASSED)**
- **Full Test Suite**: `npm run test` -> **53 test files passed, 178 tests passed, 0 failures (PASSED)**

---

## Technical Audit & Locking Mechanisms

### 1. Double-Accept Prevention (Sitter Dispatch Race)

#### Vulnerability Model
When a booking is in `SITTER_PROPOSED` status with multiple Saathi candidates notified, uncoordinated read-modify-write patterns can allow two or more Saathis to both read status `OFFERED` and write status `ACCEPTED`, causing split-brain assignments.

#### Strategy Implemented
File: `src/app/api/saathi/assignments/[id]/response/route.ts`

- **Atomic Compare-and-Swap (CAS)**:
  Instead of unconditional writes or unguarded reads, state mutations execute inside a Prisma interactive MongoDB multi-document transaction with atomic conditional update clauses (`updateMany` with explicit predicate checks):
  - Booking status transitioned atomically from `SITTER_PROPOSED` -> `CUSTOMER_APPROVAL_PENDING`.
  - Assignment status transitioned atomically from `OFFERED` -> `ACCEPTED`.
- **MongoDB Write Conflict Handling (`P2034`)**:
  In MongoDB Atlas, transactions accessing concurrently modified documents trigger `Transaction failed due to a write conflict or a deadlock` (`P2034`). The route catches write conflicts and translates them directly into a 409 Conflict payload:
  `json
  {
    "error": "offer_already_accepted",
    "message": "Another Saathi accepted this booking concurrently"
  }
  `

---

### 2. Double-Spend Entitlement Prevention (Ledger Isolation)

#### Vulnerability Model
A subscriber with 1 remaining entitlement credit attempts to submit two concurrent bookings. If read and decrement logic are decoupled, both bookings could see `balance = 1`, resulting in an illegal balance of `-1` and unbilled service allocation.

#### Strategy Implemented
File: `src/modules/bookings/create-booking.ts`

- **Strict In-Transaction Ledger Validation**:
  Booking creation executes within an atomic multi-document transaction (`prisma.`).
  Inside the transaction:
  1. Service capacity limits are reserved using atomic CAS on `capacityLimit`.
  2. The subscription ledger is queried and re-verified: only when `freshLedger.balanceAfter > 0` is a credit deducted (delta -1) and status marked `CONFIRMED`.
  3. When balance is depleted, the booking creation still succeeds with `201 Created` in `REQUESTED` status (awaiting out-of-pocket payment).
- **Guaranteed Invariant**:
  - Exactly 1 booking captures the credit and becomes `CONFIRMED`.
  - The second booking creation succeeds cleanly with `201 Created` in `REQUESTED` status.
  - Final entitlement balance is mathematically bounded: `balance >= 0`.

---

### 3. Webhook Replay Idempotency (Razorpay Payment Confirmation)

#### Vulnerability Model
Network retries from payment gateways can send the identical webhook event simultaneously across parallel HTTP worker processes. Without single-claimer mutual exclusion, multiple handlers could attempt to confirm the booking, increment loyalty points multiple times, or duplicate customer invoices.

#### Strategy Implemented
File: `src/app/api/webhooks/razorpay/route.ts`

- **Database-Level Unique Key Constraint**:
  The `PaymentEvent` collection enforces a unique compound index on `(provider, eventId)`.
- **Atomic Single-Claim Primitive**:
  When a duplicate event arrives (or is inserted by the first worker), the worker attempts to atomically claim the event by mutating an unconsumed counter (`attempts: 0`) using `updateMany`.
- **Outcome**:
  - The gateway receives an instant HTTP 200/202 for all attempts.
  - Exactly one execution path runs the transactional state machine (`confirmPaymentTransaction`).
  - No duplicate payments or bookings are recorded.

---

## Verification & Execution Commands

Run the concurrency suite against local MongoDB Atlas:
`ash
npm run test:concurrency
`

Run all unit, integration, and concurrency tests:
`ash
npm run test
`

Typecheck and production build:
`ash
npm run typecheck
npm run build
`
