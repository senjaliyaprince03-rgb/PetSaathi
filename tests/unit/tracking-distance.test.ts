import { describe, expect, it } from "vitest";

import { distanceMetres } from "@/modules/tracking/distance";

describe("tracking distance", () => {
  it("returns zero for an unchanged position", () => {
    expect(distanceMetres(23.0225, 72.5714, 23.0225, 72.5714)).toBe(0);
  });

  it("calculates a plausible short Ahmedabad segment", () => {
    const distance = distanceMetres(23.0225, 72.5714, 23.0235, 72.5724);
    expect(distance).toBeGreaterThan(100);
    expect(distance).toBeLessThan(200);
  });
});
