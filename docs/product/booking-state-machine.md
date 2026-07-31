# Booking State Machine

This document defines the lifecycle states and allowed transitions for a Booking in PetSaathi, synchronized strictly with our Prisma schema `BookingStatus`.

## Booking States (Prisma Enum)
- **DRAFT:** Customer is still creating the booking request.
- **REQUESTED:** Booking has been submitted by the customer.
- **RISK_REVIEW:** Held for automated or manual safety/risk review.
- **MATCHING:** The system is identifying eligible Sitters (Partners).
- **SITTER_PROPOSED:** A Sitter has been proposed to the customer.
- **CUSTOMER_APPROVAL_PENDING:** Waiting for the customer to approve the proposed Sitter.
- **PAYMENT_PENDING:** Sitter approved; waiting for payment completion.
- **CONFIRMED:** Payment successful; booking is locked in.
- **SITTER_EN_ROUTE:** The Sitter is traveling to the location.
- **IN_PROGRESS:** The service is actively happening.
- **REPORT_PENDING:** Service finished, waiting for the Sitter to file the care report.
- **COMPLETED:** Report filed and booking is fully resolved.
- **CANCELLED:** Booking was cancelled.
- **DISPUTED:** Customer or Sitter raised an issue requiring resolution.

## Allowed Transitions (Conceptual)
State transitions flow linearly through the above list, with branches to `CANCELLED` possible from most pre-service states, and `DISPUTED` possible from active/completed states.
