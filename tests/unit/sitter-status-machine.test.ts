import { describe, expect, it } from "vitest";

import { canTransitionSitter } from "@/modules/sitters/status-machine";

describe("sitter status machine", () => {
  it("uses review and training before approval", () => {
    expect(canTransitionSitter("APPLICANT", "UNDER_REVIEW")).toBe(true);
    expect(canTransitionSitter("APPLICANT", "APPROVED")).toBe(false);
    expect(canTransitionSitter("TRAINING", "APPROVED")).toBe(true);
  });
  it("allows an approved sitter to be suspended", () => expect(canTransitionSitter("APPROVED", "SUSPENDED")).toBe(true));
});
