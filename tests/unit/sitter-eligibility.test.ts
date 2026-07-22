import { describe, expect, it } from "vitest";

import { sitterEligibility } from "@/modules/sitters/eligibility";

const eligible = { sitterStatus: "APPROVED", permissionStatus: "ACTIVE", permissionExpiresAt: new Date("2030-01-01"), riskLimit: "YELLOW", petRisk: "GREEN", hasScheduleConflict: false, hasActiveHold: false, now: new Date("2029-01-01") } as const;

describe("sitter eligibility", () => {
  it("accepts an approved, permitted and available sitter within risk limit", () => {
    expect(sitterEligibility(eligible)).toEqual({ eligible: true, reasons: [] });
  });

  it("rejects expired permission, red risk, schedule conflict and an active safety hold independently", () => {
    const result = sitterEligibility({ ...eligible, permissionExpiresAt: new Date("2028-01-01"), petRisk: "RED", hasScheduleConflict: true, hasActiveHold: true });
    expect(result.eligible).toBe(false);
    expect(result.reasons).toEqual(expect.arrayContaining(["service_permission_expired", "pet_risk_not_supported", "risk_exceeds_permission", "schedule_conflict", "active_safety_hold"]));
  });
});
