import { afterEach, describe, expect, it, vi } from "vitest";

import { getAuthSecret, AUTH_SECRET_MIN_LENGTH } from "@/lib/auth-secret";

describe("getAuthSecret", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("prefers NEXTAUTH_SECRET when both variables are configured", () => {
    const nextauth = "n".repeat(AUTH_SECRET_MIN_LENGTH);
    const legacy = "a".repeat(AUTH_SECRET_MIN_LENGTH);
    vi.stubEnv("NEXTAUTH_SECRET", nextauth);
    vi.stubEnv("AUTH_SECRET", legacy);

    expect(getAuthSecret()).toBe(nextauth);
  });

  it("accepts AUTH_SECRET as the documented legacy alias", () => {
    const legacy = "a".repeat(AUTH_SECRET_MIN_LENGTH);
    vi.stubEnv("NEXTAUTH_SECRET", undefined as unknown as string);
    vi.stubEnv("AUTH_SECRET", legacy);

    expect(getAuthSecret()).toBe(legacy);
  });

  it("rejects secrets shorter than the minimum length", () => {
    vi.stubEnv("NEXTAUTH_SECRET", undefined as unknown as string);
    vi.stubEnv("AUTH_SECRET", "short");

    expect(() => getAuthSecret()).toThrow(/too weak/i);
  });

  it("fails closed with a configuration error instead of using a default secret", () => {
    vi.stubEnv("NEXTAUTH_SECRET", undefined as unknown as string);
    vi.stubEnv("AUTH_SECRET", undefined as unknown as string);

    expect(() => getAuthSecret()).toThrow(/not configured/);
    // The known development fallback must never return.
    expect(() => getAuthSecret()).not.toThrow(/petsaathi-local-development-secret/);
  });
});
