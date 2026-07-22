import type { PayoutStatus } from "@prisma/client";

export const payoutTransitions: Record<PayoutStatus, readonly PayoutStatus[]> = {
  PENDING: ["APPROVED", "HELD", "CANCELLED"],
  APPROVED: ["PROCESSING", "HELD", "CANCELLED"],
  PROCESSING: ["PAID", "FAILED", "HELD"],
  PAID: [],
  HELD: ["PENDING", "APPROVED", "CANCELLED"],
  FAILED: ["PROCESSING", "HELD", "CANCELLED"],
  CANCELLED: []
};

export function canTransitionPayout(from: PayoutStatus, to: PayoutStatus) {
  return payoutTransitions[from].includes(to);
}
