import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getMongoDatabase: vi.fn(),
  isDatabaseConfigured: vi.fn(() => true),
}));

vi.mock("@/lib/db", () => ({
  isDatabaseConfigured: mocks.isDatabaseConfigured,
}));

vi.mock("@/lib/mongodb", () => ({
  getMongoDatabase: mocks.getMongoDatabase,
}));

import { probeReadiness } from "@/lib/readiness";

describe("readiness probe", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("allows a normal Atlas cold connection longer than the former 1.5-second limit", async () => {
    vi.useFakeTimers();
    vi.stubEnv("AUTH_SECRET", "a".repeat(32));
    vi.stubEnv("MONGODB_URI", "mongodb+srv://example.invalid/petsaathi");
    mocks.getMongoDatabase.mockResolvedValue({
      command: () => new Promise((resolve) => setTimeout(() => resolve({ ok: 1 }), 2_000)),
    });

    const readiness = probeReadiness();
    await vi.advanceTimersByTimeAsync(2_000);

    await expect(readiness).resolves.toMatchObject({ database: "connected", auth: "configured" });
  });
});
