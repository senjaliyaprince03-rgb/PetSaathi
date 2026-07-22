import { describe, expect, it } from "vitest";

import { canTransitionPartnerOrder } from "@/modules/partners/order-state-machine";

describe("partner order state machine", () => {
  it("allows the controlled request fulfilment path", () => {
    expect(canTransitionPartnerOrder("REQUESTED", "ACCEPTED")).toBe(true);
    expect(canTransitionPartnerOrder("ACCEPTED", "SCHEDULED")).toBe(true);
    expect(canTransitionPartnerOrder("SCHEDULED", "IN_PROGRESS")).toBe(true);
    expect(canTransitionPartnerOrder("IN_PROGRESS", "COMPLETED")).toBe(true);
  });

  it("does not permit a terminal cancellation or bypass scheduling", () => {
    expect(canTransitionPartnerOrder("REQUESTED", "COMPLETED")).toBe(false);
    expect(canTransitionPartnerOrder("CANCELLED", "ACCEPTED")).toBe(false);
  });
});
