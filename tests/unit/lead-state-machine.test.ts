import { describe, expect, it } from "vitest";

import { canTransitionLead } from "@/modules/leads/state-machine";

describe("lead qualification state machine", () => {
  it("requires contact before qualification", () => {
    expect(canTransitionLead("NEW", "CONTACTED")).toBe(true);
    expect(canTransitionLead("NEW", "QUALIFIED")).toBe(false);
  });

  it("keeps converted leads terminal", () => {
    expect(canTransitionLead("CONVERTED", "NEW")).toBe(false);
  });
});
