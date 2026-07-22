import { describe, expect, it } from "vitest";

import { createReconciliationRunSchema, createServiceAreaSchema, createServicePriceSchema, upsertCapacityLimitSchema } from "@/modules/pricing/input";

describe("controlled catalog input", () => {
  it("requires valid India PIN codes and an approval reason", () => {
    const valid = { cityName: "Ahmedabad", state: "Gujarat", localityName: "Bopal", postalCodes: ["380058"], status: "ACTIVE", reason: "Pilot operations approved" } as const;
    expect(createServiceAreaSchema.safeParse(valid).success).toBe(true);
    expect(createServiceAreaSchema.safeParse({ ...valid, postalCodes: ["38005"] }).success).toBe(false);
  });

  it("rejects a Saathi amount above customer subtotal", () => {
    const value = { serviceCode: "DOG_WALK_30", amountPaise: 30_000, sitterPaise: 31_000, taxBasisPoints: 1_800, effectiveAt: "2026-07-20T09:00:00+05:30", reason: "Finance approval record" };
    expect(createServicePriceSchema.safeParse(value).success).toBe(false);
  });

  it("validates capacity and half-open reconciliation periods", () => {
    expect(upsertCapacityLimitSchema.safeParse({ serviceAreaId: crypto.randomUUID(), serviceCode: "HOME_VISIT", serviceDate: "2026-07-20", maximum: 5, reason: "Two Saathis rostered" }).success).toBe(true);
    expect(createReconciliationRunSchema.safeParse({ provider: "razorpay", periodStart: "2026-07-20T00:00:00+05:30", periodEnd: "2026-07-19T00:00:00+05:30" }).success).toBe(false);
  });
});
