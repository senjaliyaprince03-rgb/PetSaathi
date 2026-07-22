import { describe, expect, it } from "vitest";

import { canTransitionComplaint, canTransitionSupportCase, requiresResolution } from "@/modules/support/state-machine";

describe("support state machines", () => {
  it("keeps closed support cases terminal while allowing a resolved case to reopen", () => {
    expect(canTransitionSupportCase("RESOLVED", "OPEN")).toBe(true);
    expect(canTransitionSupportCase("CLOSED", "OPEN")).toBe(false);
  });

  it("requires triage before a complaint can enter review", () => {
    expect(canTransitionComplaint("RECEIVED", "IN_REVIEW")).toBe(false);
    expect(canTransitionComplaint("RECEIVED", "TRIAGING")).toBe(true);
    expect(canTransitionComplaint("TRIAGING", "IN_REVIEW")).toBe(true);
  });

  it("requires a recorded outcome for terminal decisions", () => {
    expect(requiresResolution("RESOLVED")).toBe(true);
    expect(requiresResolution("REJECTED")).toBe(true);
    expect(requiresResolution("TRIAGING")).toBe(false);
  });
});
