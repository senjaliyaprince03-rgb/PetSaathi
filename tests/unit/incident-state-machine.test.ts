import { describe, expect, it } from "vitest";

import { canTransitionIncident } from "@/modules/incidents/state-machine";

describe("incident state machine", () => {
  it("requires triage before active response", () => {
    expect(canTransitionIncident("REPORTED", "TRIAGING")).toBe(true);
    expect(canTransitionIncident("REPORTED", "ACTIVE_RESPONSE")).toBe(false);
  });

  it("requires immediate-risk resolution before review", () => {
    expect(canTransitionIncident("IMMEDIATE_RISK_RESOLVED", "REVIEW_PENDING")).toBe(true);
    expect(canTransitionIncident("MONITORING", "REVIEW_PENDING")).toBe(false);
  });

  it("prevents changes after closure", () => expect(canTransitionIncident("CLOSED", "TRIAGING")).toBe(false));
});
