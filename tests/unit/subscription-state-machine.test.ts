import { describe, expect, it } from "vitest";

import { canTransitionSubscription } from "@/modules/subscriptions/state-machine";

describe("subscription state machine", () => {
  it("requires provider activation from incomplete", () => {
    expect(canTransitionSubscription("INCOMPLETE", "ACTIVE")).toBe(true);
    expect(canTransitionSubscription("INCOMPLETE", "PAUSED")).toBe(false);
  });

  it("keeps terminal subscriptions terminal", () => {
    expect(canTransitionSubscription("CANCELLED", "ACTIVE")).toBe(false);
    expect(canTransitionSubscription("EXPIRED", "ACTIVE")).toBe(false);
  });
});
