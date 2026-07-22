import { describe, expect, it } from "vitest";

import { canTransitionAccountRequest } from "@/modules/privacy/account-request-state";

describe("account request state machine", () => {
  it("requires identity verification before review", () => {
    expect(canTransitionAccountRequest("RECEIVED", "IDENTITY_VERIFIED")).toBe(true);
    expect(canTransitionAccountRequest("RECEIVED", "APPROVED")).toBe(false);
  });

  it("keeps fulfilled requests terminal", () => {
    expect(canTransitionAccountRequest("FULFILLED", "IN_REVIEW")).toBe(false);
  });
});
