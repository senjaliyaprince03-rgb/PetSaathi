import { describe, expect, it } from "vitest";

import { canTransitionNotification, retryDelayMs } from "@/modules/notifications/state-machine";

describe("notification delivery", () => {
  it("does not send a cancelled notification", () => { expect(canTransitionNotification("QUEUED", "SENDING")).toBe(true); expect(canTransitionNotification("CANCELLED", "SENDING")).toBe(false); });
  it("caps exponential retry delay at one hour", () => { expect(retryDelayMs(1)).toBe(30_000); expect(retryDelayMs(99)).toBe(3_600_000); });
});
