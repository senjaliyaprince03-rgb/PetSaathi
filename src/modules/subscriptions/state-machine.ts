import type { SubscriptionStatus } from "@prisma/client";

export const subscriptionTransitions: Record<SubscriptionStatus, readonly SubscriptionStatus[]> = {
  INCOMPLETE: ["ACTIVE", "CANCELLED", "EXPIRED"],
  ACTIVE: ["PAUSED", "GRACE", "PAST_DUE", "CANCELLED", "EXPIRED"],
  PAUSED: ["ACTIVE", "CANCELLED", "EXPIRED"],
  GRACE: ["ACTIVE", "PAST_DUE", "CANCELLED", "EXPIRED"],
  PAST_DUE: ["ACTIVE", "PAUSED", "CANCELLED", "EXPIRED"],
  CANCELLED: [],
  EXPIRED: []
};

export function canTransitionSubscription(from: SubscriptionStatus, to: SubscriptionStatus) { return from === to || subscriptionTransitions[from].includes(to); }
