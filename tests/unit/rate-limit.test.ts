import { beforeEach, describe, expect, it, vi } from "vitest";

const findOneAndUpdate = vi.hoisted(() => vi.fn());
const createIndex = vi.hoisted(() => vi.fn().mockResolvedValue("rate_limit_buckets_ttl"));

vi.mock("@/lib/mongodb", () => ({
  getMongoDatabase: vi.fn().mockResolvedValue({
    collection: vi.fn().mockReturnValue({ findOneAndUpdate, createIndex }),
  }),
}));

import { consumeRateLimit, requestIp } from "@/modules/security/rate-limit";

describe("requestIp", () => {
  beforeEach(() => {
    findOneAndUpdate.mockReset();
  });
  it("uses the first valid forwarded address and ignores malformed values", () => {
    const request = new Request("https://petsaathi.test/api/public/leads", {
      headers: { "x-forwarded-for": "not-an-ip, 198.51.100.8, 10.0.0.4" },
    });

    expect(requestIp(request)).toBe("198.51.100.8");
  });

  it("uses the real-ip header when forwarding information is unavailable", () => {
    const request = new Request("https://petsaathi.test/api/public/leads", {
      headers: { "x-real-ip": "2001:db8::8" },
    });

    expect(requestIp(request)).toBe("2001:db8::8");
  });

  it("does not trust an invalid address", () => {
    expect(requestIp(new Request("https://petsaathi.test"))).toBe("unknown");
  });

  it("returns a bounded counter result from the shared database bucket", async () => {
    findOneAndUpdate.mockResolvedValueOnce({ count: 3 });

    await expect(consumeRateLimit("public-lead", "198.51.100.8", 3, 60_000)).resolves.toMatchObject({
      allowed: true,
      remaining: 0,
      retryAfterSeconds: expect.any(Number),
    });

    findOneAndUpdate.mockResolvedValueOnce({ count: 4 });
    await expect(consumeRateLimit("public-lead", "198.51.100.8", 3, 60_000)).resolves.toMatchObject({
      allowed: false,
      remaining: 0,
    });
  });
});
