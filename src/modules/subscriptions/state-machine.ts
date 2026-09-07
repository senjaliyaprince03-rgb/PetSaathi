/**
 * Subscription State Machine
 * Enforces valid subscription lifecycle transitions
 */

import "server-only";

import { SubscriptionStatus } from "@prisma/client";

/**
 * Valid subscription state transitions
 */
export const subscriptionTransitions: Record<SubscriptionStatus, readonly SubscriptionStatus[]> = {
  INCOMPLETE: ["ACTIVE", "CANCELLED", "EXPIRED"],
  ACTIVE: ["PAUSED", "GRACE", "PAST_DUE", "CANCELLED", "EXPIRED"],
  PAUSED: ["ACTIVE", "CANCELLED", "EXPIRED"],
  GRACE: ["ACTIVE", "PAST_DUE", "CANCELLED", "EXPIRED"],
  PAST_DUE: ["ACTIVE", "GRACE", "CANCELLED", "EXPIRED"],
  CANCELLED: ["EXPIRED"], // Can transition to expired after cancellation period
  EXPIRED: [] // Terminal state
};

/**
 * Check if a subscription state transition is valid
 */
export function canTransitionSubscription(
  from: SubscriptionStatus,
  to: SubscriptionStatus
): boolean {
  return subscriptionTransitions[from].includes(to);
}

/**
 * Validate subscription transition or throw error
 */
export function validateSubscriptionTransition(
  from: SubscriptionStatus,
  to: SubscriptionStatus
): SubscriptionStatus {
  if (!canTransitionSubscription(from, to)) {
    const validStates = subscriptionTransitions[from].join(", ");
    throw new Error(
      `Invalid subscription transition from ${from} to ${to}. Valid transitions: ${validStates}`
    );
  }
  return to;
}

/**
 * Check if subscription is in a terminal state
 */
export function isTerminalSubscriptionState(status: SubscriptionStatus): boolean {
  return subscriptionTransitions[status].length === 0;
}

/**
 * Check if subscription is active (user can consume entitlements)
 */
export function isActiveSubscription(status: SubscriptionStatus): boolean {
  return status === "ACTIVE" || status === "GRACE";
}

/**
 * Check if subscription can be cancelled
 */
export function canCancelSubscription(status: SubscriptionStatus): boolean {
  return subscriptionTransitions[status].includes("CANCELLED");
}

/**
 * Check if subscription can be paused
 */
export function canPauseSubscription(status: SubscriptionStatus): boolean {
  return subscriptionTransitions[status].includes("PAUSED");
}

/**
 * Check if subscription can be resumed
 */
export function canResumeSubscription(status: SubscriptionStatus): boolean {
  return status === "PAUSED" && subscriptionTransitions[status].includes("ACTIVE");
}

/**
 * Get grace period days for subscription
 */
export function getGracePeriodDays(status: SubscriptionStatus): number {
  if (status === "GRACE" || status === "PAST_DUE") {
    return 7; // 7 days grace period for payment failure
  }
  return 0;
}

/**
 * Map Razorpay subscription status to internal status
 */
export function mapRazorpayStatus(razorpayStatus: string): SubscriptionStatus {
  switch (razorpayStatus.toLowerCase()) {
    case "created":
    case "authenticated":
      return "INCOMPLETE";
    case "active":
      return "ACTIVE";
    case "pending":
      return "PAST_DUE";
    case "halted":
      return "PAUSED";
    case "cancelled":
      return "CANCELLED";
    case "completed":
    case "expired":
      return "EXPIRED";
    default:
      return "INCOMPLETE";
  }
}
