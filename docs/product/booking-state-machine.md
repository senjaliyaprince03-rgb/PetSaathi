# Booking State Machine

This document defines the exact lifecycle states and allowed transitions for a Booking in PetSaathi, synchronized strictly with `prisma/schema.prisma` (`enum BookingStatus`) and `src/modules/bookings/state-machine.ts` (`bookingTransitions`).

## 1. Canonical Primary Lifecycle Flow

```text
DRAFT
  → REQUESTED
  → RISK_REVIEW / MATCHING
  → SITTER_PROPOSED
  → CUSTOMER_APPROVAL_PENDING
  → PAYMENT_PENDING
  → CONFIRMED
  → SITTER_EN_ROUTE
  → IN_PROGRESS
  → REPORT_PENDING
  → COMPLETED
  → CLOSED
```

> **Entitlement Invariant:** Even when a customer redeems an active subscription entitlement during booking creation (`src/modules/bookings/create-booking.ts`), the booking begins in `REQUESTED` and must still pass through caregiver matching, sitter acceptance, and customer approval before reaching `CONFIRMED`.

---

## 2. All 18 `BookingStatus` States & Exact Allowed Transitions

| Current State | Allowed Next States | Description |
|---|---|---|
| `DRAFT` | `REQUESTED`, `CUSTOMER_CANCELLED` | Initial booking draft before submission |
| `REQUESTED` | `RISK_REVIEW`, `MATCHING`, `DECLINED`, `CUSTOMER_CANCELLED` | Customer submitted booking request |
| `RISK_REVIEW` | `MATCHING`, `DECLINED`, `CUSTOMER_CANCELLED` | Pet or booking risk assessment in progress |
| `MATCHING` | `SITTER_PROPOSED`, `DECLINED`, `CUSTOMER_CANCELLED` | Identifying eligible Saathi caregivers |
| `SITTER_PROPOSED` | `CUSTOMER_APPROVAL_PENDING`, `MATCHING`, `REPLACEMENT_REQUIRED`, `DECLINED`, `CUSTOMER_CANCELLED` | Caregiver matched/offered and proposed |
| `CUSTOMER_APPROVAL_PENDING` | `PAYMENT_PENDING`, `CONFIRMED`, `MATCHING`, `DECLINED`, `CUSTOMER_CANCELLED` | Waiting for pet parent to approve proposed Saathi |
| `PAYMENT_PENDING` | `CONFIRMED`, `DECLINED`, `CUSTOMER_CANCELLED` | Saathi approved; awaiting payment capture |
| `CONFIRMED` | `SITTER_EN_ROUTE`, `SITTER_CANCELLED`, `CUSTOMER_CANCELLED`, `REPLACEMENT_REQUIRED`, `NO_SHOW`, `INCIDENT_HOLD` | Payment or entitlement confirmed; booking locked |
| `SITTER_EN_ROUTE` | `IN_PROGRESS`, `SITTER_CANCELLED`, `CUSTOMER_CANCELLED`, `REPLACEMENT_REQUIRED`, `NO_SHOW`, `INCIDENT_HOLD` | Saathi traveling to service address (GPS tracking eligible) |
| `IN_PROGRESS` | `REPORT_PENDING`, `INCIDENT_HOLD` | Care service actively in progress (GPS tracking eligible) |
| `REPORT_PENDING` | `COMPLETED`, `INCIDENT_HOLD` | Service finished; awaiting structured Saathi care report |
| `COMPLETED` | `CLOSED` | Care report submitted and service completed |
| `CLOSED` | *(Terminal — none)* | Final archived state after completion, review, or refund closure |
| `DECLINED` | *(Terminal — none)* | Booking request declined as unfeasible |
| `CUSTOMER_CANCELLED` | `CLOSED` | Cancelled by customer; closes after refund/settlement resolution |
| `SITTER_CANCELLED` | `MATCHING`, `REPLACEMENT_REQUIRED`, `CUSTOMER_CANCELLED`, `CLOSED` | Cancelled by assigned Saathi; triggers replacement or cancellation |
| `REPLACEMENT_REQUIRED` | `MATCHING`, `CUSTOMER_CANCELLED`, `DECLINED`, `CLOSED` | Replacement Saathi required due to cancellation, no-show, or incident |
| `NO_SHOW` | `REPLACEMENT_REQUIRED`, `CUSTOMER_CANCELLED`, `CLOSED` | Assigned Saathi did not arrive at scheduled start |
| `INCIDENT_HOLD` | `CONFIRMED`, `REPLACEMENT_REQUIRED`, `COMPLETED`, `CUSTOMER_CANCELLED`, `CLOSED` | Safety incident reported; booking held under Safety Admin control |
