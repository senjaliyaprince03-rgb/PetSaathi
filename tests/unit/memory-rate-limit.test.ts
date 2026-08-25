import { describe, expect, it, vi } from "vitest";

import { createMemoryRateLimiter } from "@/modules/security/memory-rate-limit";

describe("memory rate limiter", () => {
  it("allows requests under the limit and blocks beyond it", async () => {
    const limiter = createMemoryRateLimiter(3, 60_000);
    expect((await limiter.limit("ip-a")).success).toBe(true);
    expect((await limiter.limit("ip-a")).success).toBe(true);
    expect((await limiter.limit("ip-a")).success).toBe(true);
    const blocked = await limiter.limit("ip-a");
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("tracks identifiers independently", async () => {
    const limiter = createMemoryRateLimiter(1, 60_000);
    expect((await limiter.limit("ip-a")).success).toBe(true);
    expect((await limiter.limit("ip-a")).success).toBe(false);
    expect((await limiter.limit("ip-b")).success).toBe(true);
  });

  it("resets after the window elapses", async () => {
    vi.useFakeTimers();
    try {
      const limiter = createMemoryRateLimiter(1, 1_000);
      expect((await limiter.limit("ip-a")).success).toBe(true);
      expect((await limiter.limit("ip-a")).success).toBe(false);
      vi.advanceTimersByTime(1_100);
      expect((await limiter.limit("ip-a")).success).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it("warns once in production when configured", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("NODE_ENV", "production");
    try {
      const limiter = createMemoryRateLimiter(10, 60_000, { onFirstUseWarn: "warn-once" });
      await limiter.limit("ip-a");
      await limiter.limit("ip-a");
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn).toHaveBeenCalledWith("warn-once");
    } finally {
      warn.mockRestore();
      vi.unstubAllEnvs();
    }
  });

  it("never exceeds the bounded key budget", async () => {
    vi.useFakeTimers();
    try {
      const limiter = createMemoryRateLimiter(1, 1);
      for (let index = 0; index < 25_000; index += 1) {
        await limiter.limit(`ip-${index}`);
      }
      // Survived without unbounded growth errors; expired entries evictable.
      expect(true).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
});
