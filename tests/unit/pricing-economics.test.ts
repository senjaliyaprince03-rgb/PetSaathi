import { describe, expect, it } from "vitest";

import { calculateQuote, indiaServiceDate, reconciliationDifference, reconciliationMatches, reconciliationTotals, serviceDateFromInput, toSlug } from "@/modules/pricing/economics";

describe("booking economics", () => {
  it("calculates tax in paise with deterministic integer rounding", () => {
    expect(calculateQuote(29_999, 1_800)).toEqual({ subtotalPaise: 29_999, taxPaise: 5_400, totalPaise: 35_399 });
    expect(() => calculateQuote(-1, 1_800)).toThrow("Invalid service amount");
  });

  it("maps an instant to its India calendar date", () => {
    expect(indiaServiceDate(new Date("2026-07-18T18:40:00.000Z")).toISOString()).toBe("2026-07-19T00:00:00.000Z");
    expect(serviceDateFromInput("2026-07-19").toISOString()).toBe("2026-07-19T00:00:00.000Z");
    expect(() => serviceDateFromInput("2026-02-30")).toThrow("Invalid service date");
  });

  it("creates stable admin slugs", () => {
    expect(toSlug(" Satellite, Ahmedabad ")).toBe("satellite-ahmedabad");
  });
});

describe("finance reconciliation", () => {
  it("compares all statement totals including net cash", () => {
    const expected = reconciliationTotals(100_000, 10_000, 60_000);
    const exact = reconciliationDifference(expected, reconciliationTotals(100_000, 10_000, 60_000));
    expect(reconciliationMatches(exact)).toBe(true);
    const mismatch = reconciliationDifference(expected, reconciliationTotals(100_000, 12_000, 60_000));
    expect(mismatch).toEqual({ capturedPaise: 0, refundedPaise: 2_000, paidOutPaise: 0, netCashPaise: -2_000 });
    expect(reconciliationMatches(mismatch)).toBe(false);
  });
});
