import { z } from "zod";

export const reportReviewStatuses = ["PENDING", "APPROVED", "CORRECTION_REQUIRED", "ESCALATED"] as const;
export type ReportReviewStatus = (typeof reportReviewStatuses)[number];

export const reportReviewInputSchema = z.object({
  action: z.enum(["APPROVE", "REQUEST_CORRECTION", "ESCALATE"]),
  note: z.string().trim().min(10).max(2_000)
});

const transitions: Record<ReportReviewStatus, readonly ReportReviewStatus[]> = {
  PENDING: ["APPROVED", "CORRECTION_REQUIRED", "ESCALATED"],
  ESCALATED: ["APPROVED", "CORRECTION_REQUIRED"],
  CORRECTION_REQUIRED: [],
  APPROVED: []
};

export function reviewTarget(action: z.infer<typeof reportReviewInputSchema>["action"]): ReportReviewStatus {
  if (action === "APPROVE") return "APPROVED";
  if (action === "REQUEST_CORRECTION") return "CORRECTION_REQUIRED";
  return "ESCALATED";
}

export function canTransitionReportReview(from: ReportReviewStatus, to: ReportReviewStatus) {
  return transitions[from].includes(to);
}
