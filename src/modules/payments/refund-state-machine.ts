import type { RefundStatus } from "@prisma/client";

export const refundTransitions: Record<RefundStatus, readonly RefundStatus[]> = {
  REQUESTED: ["APPROVED", "REJECTED"],
  APPROVED: ["PROCESSING", "REJECTED"],
  PROCESSING: ["COMPLETED", "FAILED"],
  COMPLETED: [],
  FAILED: ["PROCESSING", "REJECTED"],
  REJECTED: []
};

export function canTransitionRefund(from: RefundStatus, to: RefundStatus) {
  return refundTransitions[from].includes(to);
}
