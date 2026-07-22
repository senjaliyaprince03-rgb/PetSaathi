import { describe, expect, it } from "vitest";

import { canTransitionPayout } from "@/modules/payments/payout-state-machine";

describe("payout state machine", () => {
  it("does not allow a pending payout to skip approval", () => {
    expect(canTransitionPayout("PENDING", "APPROVED")).toBe(true);
    expect(canTransitionPayout("PENDING", "PAID")).toBe(false);
  });

  it("allows finance to hold processing and resume deliberately", () => {
    expect(canTransitionPayout("PROCESSING", "HELD")).toBe(true);
    expect(canTransitionPayout("HELD", "APPROVED")).toBe(true);
  });
});
