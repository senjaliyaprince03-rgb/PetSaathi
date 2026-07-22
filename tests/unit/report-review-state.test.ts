import { describe, expect, it } from "vitest";

import { canTransitionReportReview, reportReviewInputSchema, reviewTarget } from "@/modules/reports/review";

describe("report review workflow", () => {
  it("supports approve, correction and escalation only from an open review", () => {
    expect(canTransitionReportReview("PENDING", "APPROVED")).toBe(true);
    expect(canTransitionReportReview("PENDING", "CORRECTION_REQUIRED")).toBe(true);
    expect(canTransitionReportReview("ESCALATED", "APPROVED")).toBe(true);
    expect(canTransitionReportReview("APPROVED", "ESCALATED")).toBe(false);
    expect(canTransitionReportReview("CORRECTION_REQUIRED", "APPROVED")).toBe(false);
  });

  it("maps actions to stored review states and requires a decision note", () => {
    expect(reviewTarget("REQUEST_CORRECTION")).toBe("CORRECTION_REQUIRED");
    expect(reviewTarget("ESCALATE")).toBe("ESCALATED");
    expect(reportReviewInputSchema.safeParse({ action: "APPROVE", note: "short" }).success).toBe(false);
    expect(reportReviewInputSchema.safeParse({ action: "APPROVE", note: "Care evidence and timing were reviewed." }).success).toBe(true);
  });
});
