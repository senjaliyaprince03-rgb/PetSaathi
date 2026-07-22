export const paymentStatuses = ["CREATED", "PENDING", "AUTHORIZED", "CAPTURED", "FAILED", "CANCELLED", "PARTIALLY_REFUNDED", "REFUNDED", "DISPUTED"] as const;
export type PaymentStatus = (typeof paymentStatuses)[number];

export const paymentTransitions: Record<PaymentStatus, readonly PaymentStatus[]> = {
  CREATED: ["PENDING", "FAILED", "CANCELLED"],
  PENDING: ["AUTHORIZED", "CAPTURED", "FAILED", "CANCELLED"],
  AUTHORIZED: ["CAPTURED", "FAILED", "CANCELLED"],
  CAPTURED: ["PARTIALLY_REFUNDED", "REFUNDED", "DISPUTED"],
  FAILED: [],
  CANCELLED: [],
  PARTIALLY_REFUNDED: ["REFUNDED", "DISPUTED"],
  REFUNDED: ["DISPUTED"],
  DISPUTED: ["CAPTURED", "PARTIALLY_REFUNDED", "REFUNDED"]
};

export function canTransitionPayment(from: PaymentStatus, to: PaymentStatus) {
  return paymentTransitions[from].includes(to);
}
