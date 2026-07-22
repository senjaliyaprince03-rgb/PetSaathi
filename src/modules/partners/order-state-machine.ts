import type { PartnerOrderStatus } from "@prisma/client";

export const partnerOrderTransitions: Record<PartnerOrderStatus, readonly PartnerOrderStatus[]> = {
  REQUESTED: ["ACCEPTED", "CANCELLED"],
  ACCEPTED: ["SCHEDULED", "CANCELLED", "DISPUTED"],
  SCHEDULED: ["IN_PROGRESS", "CANCELLED", "DISPUTED"],
  IN_PROGRESS: ["COMPLETED", "DISPUTED"],
  COMPLETED: ["DISPUTED"],
  CANCELLED: [],
  DISPUTED: []
};

export function canTransitionPartnerOrder(from: PartnerOrderStatus, to: PartnerOrderStatus) {
  return partnerOrderTransitions[from].includes(to);
}
