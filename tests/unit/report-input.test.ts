import { describe, expect, it } from "vitest";

import { bookingReportSchema } from "@/modules/reports/input";

describe("booking report input", () => {
  it("requires a meaningful summary", () => expect(bookingReportSchema.safeParse({ summary: "Too short" }).success).toBe(false));
  it("preserves a structured concern flag", () => {
    const parsed = bookingReportSchema.parse({ summary: "Milo completed the walk calmly and returned home settled.", concernFlag: true, water: "Drank after returning" });
    expect(parsed.concernFlag).toBe(true);
  });
});
