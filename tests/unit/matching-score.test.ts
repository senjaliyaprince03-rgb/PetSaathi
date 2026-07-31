import { describe, expect, it } from "vitest";

import {
  isRiskWithinPermission,
  scoreAvailability,
  scoreLocality,
} from "@/modules/matching/score-engine";

const start = new Date("2026-07-30T04:30:00.000Z"); // Thursday 10:00 Asia/Kolkata
const end = new Date("2026-07-30T05:30:00.000Z");

describe("matching score eligibility helpers", () => {
  it("normalises locality without assuming that different localities are nearby", () => {
    expect(scoreLocality(" Bopal ", "bopal")).toEqual({
      score: 1,
      explanation: "Exact locality match",
    });
    expect(scoreLocality("Satellite", "Bopal").score).toBe(0.25);
    expect(scoreLocality(null, "Bopal").score).toBe(0);
  });

  it("enforces service-specific risk limits", () => {
    expect(isRiskWithinPermission("GREEN", "GREEN")).toBe(true);
    expect(isRiskWithinPermission("YELLOW", "GREEN")).toBe(false);
    expect(isRiskWithinPermission("YELLOW", "YELLOW")).toBe(true);
    expect(isRiskWithinPermission("RED", "YELLOW")).toBe(false);
    expect(isRiskWithinPermission("UNASSESSED", "GREEN")).toBe(true);
  });

  it("requires a weekly rule covering the complete booking", () => {
    expect(
      scoreAvailability({
        rules: [
          {
            weekday: 4,
            startTime: "09:00",
            endTime: "12:00",
            timezone: "Asia/Kolkata",
            active: true,
          },
        ],
        exceptions: [],
        conflicts: [],
        scheduledStart: start,
        scheduledEnd: end,
        timezone: "Asia/Kolkata",
      }),
    ).toEqual({
      score: 1,
      explanation: "Weekly availability covers the full booking",
    });
  });

  it("rejects overlapping unavailability and active assignments", () => {
    const base = {
      rules: [
        {
          weekday: 4,
          startTime: "09:00",
          endTime: "12:00",
          timezone: "Asia/Kolkata",
          active: true,
        },
      ],
      scheduledStart: start,
      scheduledEnd: end,
      timezone: "Asia/Kolkata",
    };

    expect(
      scoreAvailability({
        ...base,
        exceptions: [
          {
            startsAt: new Date("2026-07-30T04:00:00.000Z"),
            endsAt: new Date("2026-07-30T06:00:00.000Z"),
            available: false,
          },
        ],
        conflicts: [],
      }).score,
    ).toBe(0);

    expect(
      scoreAvailability({
        ...base,
        exceptions: [],
        conflicts: [
          {
            booking: {
              scheduledStart: new Date("2026-07-30T05:00:00.000Z"),
              scheduledEnd: new Date("2026-07-30T06:00:00.000Z"),
            },
          },
        ],
      }).score,
    ).toBe(0);
  });

  it("allows an explicit available exception to cover the booking", () => {
    expect(
      scoreAvailability({
        rules: [],
        exceptions: [
          {
            startsAt: new Date("2026-07-30T04:00:00.000Z"),
            endsAt: new Date("2026-07-30T06:00:00.000Z"),
            available: true,
          },
        ],
        conflicts: [],
        scheduledStart: start,
        scheduledEnd: end,
        timezone: "Asia/Kolkata",
      }).score,
    ).toBe(1);
  });
});
