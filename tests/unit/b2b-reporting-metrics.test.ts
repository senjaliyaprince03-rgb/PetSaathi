import { describe, expect, it } from "vitest";

import {
  averageResolutionHours,
  percentage,
} from "@/modules/b2b/reporting-metrics";

describe("B2B reporting metrics", () => {
  it("calculates percentages without dividing by zero", () => {
    expect(percentage(3, 4)).toBe(75);
    expect(percentage(0, 0)).toBe(0);
  });

  it("averages only resolved complaint durations", () => {
    const start = new Date("2026-07-29T00:00:00.000Z");
    expect(
      averageResolutionHours([
        {
          createdAt: start,
          resolvedAt: new Date("2026-07-29T02:00:00.000Z"),
        },
        {
          createdAt: start,
          resolvedAt: new Date("2026-07-29T06:00:00.000Z"),
        },
        { createdAt: start, resolvedAt: null },
      ]),
    ).toBe(4);
  });

  it("returns zero when no complaints are resolved", () => {
    expect(
      averageResolutionHours([
        { createdAt: new Date("2026-07-29T00:00:00.000Z"), resolvedAt: null },
      ]),
    ).toBe(0);
  });
});
