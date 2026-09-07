import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const harness = vi.hoisted(() => ({
  // "fail-once": the first constructed client fails to connect (e.g. SRV/DNS
  // outage), every later one succeeds. "ok": everything succeeds.
  mode: "fail-once" as "fail-once" | "fail-always" | "ok",
  instances: [] as Array<{ connected: boolean }>,
}));

vi.mock("mongodb", () => {
  class MongoClient {
    connected = false;
    constructor(
      public uri: string,
      public options: Record<string, unknown>,
    ) {
      harness.instances.push(this);
    }
    async connect() {
      const shouldFail =
        harness.mode === "fail-always" ||
        (harness.mode === "fail-once" && harness.instances.length === 1);
      if (shouldFail) {
        throw Object.assign(new Error("querySrv ECONNREFUSED _mongodb._tcp.cluster.invalid"), {
          name: "MongoServerSelectionError",
        });
      }
      this.connected = true;
      return this;
    }
    db(name?: string) {
      return { name: name ?? "test", client: this };
    }
  }
  return { MongoClient };
});

async function importFreshModule() {
  // Reset module registry and the global singleton so each test starts with
  // a cold connection cache.
  vi.resetModules();
  delete (globalThis as Record<string, unknown>).__petsaathiMongo;
  return await import("@/lib/mongodb");
}

describe("mongodb connection cache", () => {
  beforeEach(() => {
    harness.mode = "ok";
    harness.instances = [];
    vi.stubEnv("MONGODB_URI", "mongodb://127.0.0.1:27017/petsaathi_test");
    vi.stubEnv("MONGODB_DATABASE", "petsaathi_test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("clears a rejected connection promise so later requests can retry", async () => {
    harness.mode = "fail-once";
    const { getMongoDatabase } = await importFreshModule();

    await expect(getMongoDatabase()).rejects.toThrow(/ECONNREFUSED/);
    expect(harness.instances).toHaveLength(1);

    // Next request must construct a fresh client instead of replaying the
    // cached rejection forever.
    const database = await getMongoDatabase();
    expect(harness.instances).toHaveLength(2);
    expect(harness.instances[1]!.connected).toBe(true);
    expect((database as { client?: { connected?: boolean } }).client?.connected).toBe(true);
  });

  it("surfaces the original error to the caller while failing", async () => {
    harness.mode = "fail-always";
    const { getMongoDatabase } = await importFreshModule();

    await expect(getMongoDatabase()).rejects.toThrow(/ECONNREFUSED/);
    await expect(getMongoDatabase()).rejects.toThrow(/ECONNREFUSED/);
    expect(harness.instances.length).toBeGreaterThanOrEqual(2);
  });

  it("shares one initialization across concurrent callers", async () => {
    const { getMongoDatabase } = await importFreshModule();

    const results = await Promise.all([
      getMongoDatabase(),
      getMongoDatabase(),
      getMongoDatabase(),
      getMongoDatabase(),
    ]);

    expect(harness.instances).toHaveLength(1);
    expect(new Set(results.map((database) => (database as { client: unknown }).client)).size).toBe(1);
    expect(harness.instances[0]?.connected).toBe(true);
  });

  it("keeps the successful connection cached for sequential callers", async () => {
    const { getMongoDatabase } = await importFreshModule();

    const first = await getMongoDatabase();
    const second = await getMongoDatabase();

    expect(harness.instances).toHaveLength(1);
    expect(second).toBe(first);
  });
});
