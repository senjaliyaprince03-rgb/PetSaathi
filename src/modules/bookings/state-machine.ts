/**
 * Booking State Machine
 * Enforces valid booking lifecycle transitions
 * Prevents invalid state changes that could corrupt data or violate business rules
 */

import "server-only";

import { BookingStatus } from "@prisma/client";

// Re-export types for external use
export type { BookingStatus } from "@prisma/client";

/**
 * Valid state transitions for bookings
 * Each booking can only transition to states listed in its current state's array
 */
export const bookingTransitions: Record<BookingStatus, readonly BookingStatus[]> = {
  // New booking draft
  DRAFT: ["REQUESTED", "CUSTOMER_CANCELLED"],

  // Customer submitted booking request
  REQUESTED: [
    "RISK_REVIEW",
    "MATCHING",
    "DECLINED",
    "CUSTOMER_CANCELLED"
  ],

  // Pet risk assessment in progress
  RISK_REVIEW: [
    "MATCHING",
    "DECLINED",
    "CUSTOMER_CANCELLED"
  ],

  // Finding appropriate sitter
  MATCHING: [
    "SITTER_PROPOSED",
    "DECLINED",
    "CUSTOMER_CANCELLED"
  ],

  // Sitter found and proposed to customer
  SITTER_PROPOSED: [
    "CUSTOMER_APPROVAL_PENDING",
    "MATCHING", // Try different sitter
    "REPLACEMENT_REQUIRED",
    "DECLINED",
    "CUSTOMER_CANCELLED"
  ],

  // Waiting for customer to approve proposed sitter
  CUSTOMER_APPROVAL_PENDING: [
    "PAYMENT_PENDING",
    "CONFIRMED", // Pre-paid or instant confirmed replacement
    "MATCHING", // Customer rejected sitter
    "DECLINED",
    "CUSTOMER_CANCELLED"
  ],

  // Waiting for payment
  PAYMENT_PENDING: [
    "CONFIRMED",
    "DECLINED",
    "CUSTOMER_CANCELLED"
  ],

  // Payment captured, booking confirmed
  CONFIRMED: [
    "SITTER_EN_ROUTE",
    "SITTER_CANCELLED",
    "CUSTOMER_CANCELLED",
    "REPLACEMENT_REQUIRED",
    "NO_SHOW",
    "INCIDENT_HOLD"
  ],

  // Sitter traveling to service location
  SITTER_EN_ROUTE: [
    "IN_PROGRESS",
    "SITTER_CANCELLED",
    "CUSTOMER_CANCELLED",
    "REPLACEMENT_REQUIRED",
    "NO_SHOW",
    "INCIDENT_HOLD"
  ],

  // Service actively in progress
  IN_PROGRESS: [
    "REPORT_PENDING",
    "INCIDENT_HOLD"
  ],

  // Service completed, waiting for sitter report
  REPORT_PENDING: [
    "COMPLETED",
    "INCIDENT_HOLD"
  ],

  // Service successfully completed
  COMPLETED: [
    "CLOSED" // Final state after review/feedback
  ],

  // Final closed state (archived)
  CLOSED: [], // Terminal state - no further transitions

  // Booking declined (not feasible)
  DECLINED: [], // Terminal state

  // Customer cancelled
  CUSTOMER_CANCELLED: ["CLOSED"], // Can close after refund processed

  // Sitter cancelled
  SITTER_CANCELLED: [
    "MATCHING", // Find replacement
    "REPLACEMENT_REQUIRED",
    "CUSTOMER_CANCELLED",
    "CLOSED"
  ],

  // Replacement sitter needed
  REPLACEMENT_REQUIRED: [
    "MATCHING", // Find replacement
    "CUSTOMER_CANCELLED",
    "DECLINED",
    "CLOSED"
  ],

  // Sitter no-show
  NO_SHOW: [
    "REPLACEMENT_REQUIRED",
    "CUSTOMER_CANCELLED",
    "CLOSED"
  ],

  // Safety incident occurred, booking on hold
  INCIDENT_HOLD: [
    "REPLACEMENT_REQUIRED",
    "COMPLETED", // Incident resolved, service completed
    "CUSTOMER_CANCELLED",
    "CLOSED"
  ]
};

/**
 * Check if a booking state transition is valid
 */
export function canTransitionBooking(from: BookingStatus, to: BookingStatus): boolean {
  return bookingTransitions[from].includes(to);
}

/**
 * Get all valid next states for a booking
 */
export function getValidNextStates(current: BookingStatus): readonly BookingStatus[] {
  return bookingTransitions[current];
}

/**
 * Check if a booking state is terminal (no further transitions allowed)
 */
export function isTerminalState(status: BookingStatus): boolean {
  return bookingTransitions[status].length === 0;
}

/**
 * Validate and return transition or throw error
 */
export function validateBookingTransition(
  from: BookingStatus,
  to: BookingStatus
): BookingStatus {
  if (!canTransitionBooking(from, to)) {
    const validStates = getValidNextStates(from).join(", ");
    throw new Error(
      `Invalid booking transition from ${from} to ${to}. Valid transitions: ${validStates}`
    );
  }
  return to;
}

/**
 * Booking lifecycle stage for grouping
 */
export type BookingStage =
  | "draft"
  | "requested"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

/**
 * Get booking stage from status
 */
export function getBookingStage(status: BookingStatus): BookingStage {
  if (status === "DRAFT") return "draft";

  if (
    status === "REQUESTED" ||
    status === "RISK_REVIEW" ||
    status === "MATCHING" ||
    status === "SITTER_PROPOSED" ||
    status === "CUSTOMER_APPROVAL_PENDING" ||
    status === "PAYMENT_PENDING"
  ) {
    return "requested";
  }

  if (
    status === "CONFIRMED" ||
    status === "SITTER_EN_ROUTE"
  ) {
    return "confirmed";
  }

  if (
    status === "IN_PROGRESS" ||
    status === "REPORT_PENDING"
  ) {
    return "in_progress";
  }

  if (
    status === "COMPLETED" ||
    status === "CLOSED"
  ) {
    return "completed";
  }

  // All cancellation/declined states
  return "cancelled";
}

/**
 * Check if booking can be cancelled by customer
 */
export function canCustomerCancel(status: BookingStatus): boolean {
  return bookingTransitions[status].includes("CUSTOMER_CANCELLED");
}

/**
 * Check if booking can be cancelled by sitter
 */
export function canSitterCancel(status: BookingStatus): boolean {
  return bookingTransitions[status].includes("SITTER_CANCELLED");
}

/**
 * Check if booking requires payment
 */
export function requiresPayment(status: BookingStatus): boolean {
  return status === "PAYMENT_PENDING";
}

/**
 * Check if booking is active (sitter should be providing service)
 */
export function isActiveBooking(status: BookingStatus): boolean {
  return [
    "CONFIRMED",
    "SITTER_EN_ROUTE",
    "IN_PROGRESS",
    "REPORT_PENDING"
  ].includes(status);
}

/**
 * Check if booking can receive GPS tracking
 */
export function canReceiveTracking(status: BookingStatus): boolean {
  return [
    "SITTER_EN_ROUTE",
    "IN_PROGRESS"
  ].includes(status);
}
