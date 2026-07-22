import { describe, expect, it } from "vitest";

import { suggestRiskLevel } from "@/modules/risk/assessment";

const clear = { biteHistory: false, aggressionTowardPeople: false, aggressionTowardAnimals: false, escapeRisk: false, leashReactivity: false, medicalComplexity: false };

describe("risk suggestion", () => {
  it("keeps a clear questionnaire green", () => expect(suggestRiskLevel(clear)).toBe("GREEN"));
  it("flags operational complexity yellow", () => expect(suggestRiskLevel({ ...clear, escapeRisk: true })).toBe("YELLOW"));
  it("flags bite history red for human review", () => expect(suggestRiskLevel({ ...clear, biteHistory: true })).toBe("RED"));
});
