import { describe, expect, it } from "vitest";

// @ts-expect-error - the AI runtime is authored as an ESM JavaScript module.
import { withTimeout } from "../../ai/timeouts.mjs";

describe("AI timeout cancellation", () => {
  it("aborts compatible work when a timeout expires", async () => {
    let aborted = false;

    await expect(
      withTimeout(
        (signal: AbortSignal) =>
          new Promise<void>((_resolve, reject) => {
            signal.addEventListener("abort", () => {
              aborted = true;
              reject(new Error("request aborted"));
            });
          }),
        10,
        "AI test request",
      ),
    ).rejects.toThrow("TIMEOUT: AI test request exceeded 10ms limit");

    expect(aborted).toBe(true);
  });
});
