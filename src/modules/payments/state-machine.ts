/**
 * Payment State Machine
 * Enforces valid payment lifecycle transitions
 */

import "server-only";

import { PaymentStatus, RefundStatus, PayoutStatus } from "@prisma/client";

// Re-export types for external use
export type { PaymentStatus, RefundStatus, PayoutStatus } from "@prisma/client";

/**
 * Valid payment state transitions
 */
export const paymentTransitions: Record<PaymentStatus, readonly PaymentStatus[]> = {
  CREATED: ["PENDING", "AUTHORIZED", "FAILED", "CANCELLED"],
  PENDING: ["AUTHORIZED", "CAPTURED", "FAILED", "CANCELLED"],
  AUTHORIZED: ["CAPTURED", "FAILED", "CANCELLED"],
  CAPTURED: ["PARTIALLY_REFUNDED", "REFUNDED", "DISPUTED"],
  FAILED: [], // Terminal state
  CANCELLED: [], // Terminal state
  PARTIALLY_REFUNDED: ["REFUNDED", "DISPUTED"],
  REFUNDED: ["DISPUTED"], // Can dispute even after refund
  DISPUTED: [] // Terminal state (requires manual resolution)
};

export function canTransitionPayment(from: PaymentStatus, to: PaymentStatus): boolean {
  return paymentTransitions[from].includes(to);
}

export function validatePaymentTransition(from: PaymentStatus, to: PaymentStatus): PaymentStatus {
  if (!canTransitionPayment(from, to)) {
    throw new Error(`Invalid payment transition from ${from} to ${to}`);
  }
  return to;
}

/**
 * Valid refund state transitions
 */
export const refundTransitions: Record<RefundStatus, readonly RefundStatus[]> = {
  REQUESTED: ["APPROVED", "REJECTED"],
  APPROVED: ["PROCESSING"],
  PROCESSING: ["COMPLETED", "FAILED"],
  COMPLETED: [], // Terminal state
  FAILED: ["PROCESSING"], // Can retry
  REJECTED: [] // Terminal state
};

export function canTransitionRefund(from: RefundStatus, to: RefundStatus): boolean {
  return refundTransitions[from].includes(to);
}

/**
 * Valid payout state transitions
 */
export const payoutTransitions: Record<PayoutStatus, readonly PayoutStatus[]> = {
  PENDING: ["APPROVED", "CANCELLED"],
  APPROVED: ["PROCESSING"],
  PROCESSING: ["PAID", "FAILED"],
  PAID: [], // Terminal state
  HELD: ["APPROVED", "CANCELLED"], // Compliance hold
  FAILED: ["PROCESSING", "CANCELLED"], // Can retry
  CANCELLED: [] // Terminal state
};

export function canTransitionPayout(from: PayoutStatus, to: PayoutStatus): boolean {
  return payoutTransitions[from].includes(to);
}

/**
 * Check if payment is in a terminal state
 */
export function isTerminalPaymentState(status: PaymentStatus): boolean {
  return paymentTransitions[status].length === 0;
}

/**
 * Check if payment can be refunded
 */
export function canRefund(status: PaymentStatus): boolean {
  return status === "CAPTURED" || status === "PARTIALLY_REFUNDED";
}
