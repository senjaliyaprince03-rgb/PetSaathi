import type { SitterStatus } from "@prisma/client";

export const sitterTransitions: Record<SitterStatus, readonly SitterStatus[]> = {
  APPLICANT: ["UNDER_REVIEW", "REJECTED"],
  UNDER_REVIEW: ["TRAINING", "REJECTED"],
  TRAINING: ["APPROVED", "REJECTED"],
  APPROVED: ["PAUSED", "SUSPENDED"],
  PAUSED: ["APPROVED", "SUSPENDED"],
  SUSPENDED: ["APPROVED", "REJECTED"],
  REJECTED: ["APPLICANT"]
};

export function canTransitionSitter(from: SitterStatus, to: SitterStatus) {
  return sitterTransitions[from].includes(to);
}
