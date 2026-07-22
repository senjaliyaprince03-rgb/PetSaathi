import { describe, expect, it } from "vitest";

import { selectApplicablePrice, type PriceCandidate } from "@/modules/pricing/selection";

const now = new Date("2026-07-18T12:00:00.000Z");
const base: PriceCandidate = { id: "global-v1", serviceTypeId: "walk", serviceAreaId: null, version: 1, amountPaise: 30_000, sitterPaise: 20_000, taxBasisPoints: 1_800, currency: "INR", effectiveAt: new Date("2026-07-01T00:00:00.000Z"), expiresAt: null };

describe("price selection", () => {
  it("prefers the latest effective area version over a global fallback", () => {
    const areaV1 = { ...base, id: "area-v1", serviceAreaId: "bopal", amountPaise: 31_000 };
    const areaV2 = { ...areaV1, id: "area-v2", version: 2, amountPaise: 32_000 };
    expect(selectApplicablePrice([base, areaV1, areaV2], "walk", "bopal", now)?.id).toBe("area-v2");
    expect(selectApplicablePrice([base, areaV1], "walk", "satellite", now)?.id).toBe("global-v1");
  });

  it("does not return future or expired versions", () => {
    const future = { ...base, id: "future", version: 3, effectiveAt: new Date("2026-08-01T00:00:00.000Z") };
    const expired = { ...base, id: "expired", version: 2, expiresAt: new Date("2026-07-18T11:59:59.000Z") };
    expect(selectApplicablePrice([future, expired], "walk", "bopal", now)).toBeNull();
  });
});
