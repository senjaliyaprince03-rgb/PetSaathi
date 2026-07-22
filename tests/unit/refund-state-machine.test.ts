import { describe, expect, it } from "vitest";

import { canTransitionRefund } from "@/modules/payments/refund-state-machine";

describe("refund state machine", () => {
  it("requires approval before provider processing", () => {
    expect(canTransitionRefund("REQUESTED", "APPROVED")).toBe(true);
    expect(canTransitionRefund("REQUESTED", "PROCESSING")).toBe(false);
  });

  it("allows failed provider attempts to be deliberately retried", () => {
    expect(canTransitionRefund("FAILED", "PROCESSING")).toBe(true);
    expect(canTransitionRefund("COMPLETED", "PROCESSING")).toBe(false);
  });
});
