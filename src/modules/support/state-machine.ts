import type { ComplaintStatus, SupportCaseStatus } from "@prisma/client";

const supportTransitions: Record<SupportCaseStatus, readonly SupportCaseStatus[]> = {
  OPEN: ["WAITING_CUSTOMER", "WAITING_OPERATIONS", "ESCALATED", "RESOLVED"],
  WAITING_CUSTOMER: ["OPEN", "ESCALATED", "RESOLVED"],
  WAITING_OPERATIONS: ["OPEN", "ESCALATED", "RESOLVED"],
  ESCALATED: ["WAITING_CUSTOMER", "WAITING_OPERATIONS", "RESOLVED"],
  RESOLVED: ["OPEN", "CLOSED"],
  CLOSED: []
};

const complaintTransitions: Record<ComplaintStatus, readonly ComplaintStatus[]> = {
  RECEIVED: ["TRIAGING", "REJECTED"],
  TRIAGING: ["IN_REVIEW", "ACTION_REQUIRED", "RESOLVED", "REJECTED"],
  IN_REVIEW: ["ACTION_REQUIRED", "RESOLVED", "REJECTED"],
  ACTION_REQUIRED: ["IN_REVIEW", "RESOLVED"],
  RESOLVED: ["IN_REVIEW", "CLOSED"],
  CLOSED: [],
  REJECTED: ["IN_REVIEW", "CLOSED"]
};

export function canTransitionSupportCase(from: SupportCaseStatus, to: SupportCaseStatus) {
  return supportTransitions[from].includes(to);
}

export function canTransitionComplaint(from: ComplaintStatus, to: ComplaintStatus) {
  return complaintTransitions[from].includes(to);
}

export function requiresResolution(to: SupportCaseStatus | ComplaintStatus) {
  return to === "RESOLVED" || to === "CLOSED" || to === "REJECTED";
}
