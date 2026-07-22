import { describe, expect, it } from "vitest";

import { canTransitionContent } from "@/modules/content/state-machine";

describe("content publishing state machine", () => {
  it("requires review and approval before publication", () => {
    expect(canTransitionContent("DRAFT", "IN_REVIEW")).toBe(true);
    expect(canTransitionContent("DRAFT", "PUBLISHED")).toBe(false);
    expect(canTransitionContent("APPROVED", "PUBLISHED")).toBe(true);
  });

  it("requires archived content to return to draft", () => {
    expect(canTransitionContent("ARCHIVED", "DRAFT")).toBe(true);
    expect(canTransitionContent("ARCHIVED", "PUBLISHED")).toBe(false);
  });
});
