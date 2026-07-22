import type { AccountRequestStatus } from "@prisma/client";

export const accountRequestTransitions: Record<AccountRequestStatus, readonly AccountRequestStatus[]> = {
  RECEIVED: ["IDENTITY_VERIFIED", "REJECTED", "CANCELLED"],
  IDENTITY_VERIFIED: ["IN_REVIEW", "REJECTED"],
  IN_REVIEW: ["APPROVED", "REJECTED"],
  APPROVED: ["FULFILLED", "REJECTED"],
  FULFILLED: [],
  REJECTED: [],
  CANCELLED: []
};

export function canTransitionAccountRequest(from: AccountRequestStatus, to: AccountRequestStatus) { return accountRequestTransitions[from].includes(to); }
