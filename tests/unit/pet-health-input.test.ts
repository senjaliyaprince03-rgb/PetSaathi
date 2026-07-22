import { describe, expect, it } from "vitest";

import { careInstructionSchema, medicationSchema, vaccinationSchema } from "@/modules/pets/health-input";

describe("pet health input", () => {
  it("requires a meaningful feeding routine", () => {
    expect(careInstructionSchema.safeParse({ feedingRoutine: "x" }).success).toBe(false);
    expect(careInstructionSchema.safeParse({ feedingRoutine: "Two measured meals each day" }).success).toBe(true);
  });

  it("rejects medication end dates before the start", () => {
    const result = medicationSchema.safeParse({ name: "Tablet", dosage: "5 mg", schedule: "Once daily", startsAt: "2030-02-02", endsAt: "2030-02-01" });
    expect(result.success).toBe(false);
  });

  it("requires a vaccination due date to follow administration", () => {
    const result = vaccinationSchema.safeParse({ vaccine: "Rabies", administeredAt: "2030-02-02", nextDueAt: "2030-02-02" });
    expect(result.success).toBe(false);
  });
});
