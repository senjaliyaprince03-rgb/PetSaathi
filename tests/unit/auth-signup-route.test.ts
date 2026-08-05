import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  consumeRateLimit: vi.fn(),
  loggerException: vi.fn(),
  registerWithPassword: vi.fn(),
}));

vi.mock("@/modules/auth/mongodb-auth", () => ({
  registerWithPassword: mocks.registerWithPassword,
}));

vi.mock("@/modules/security/rate-limit", () => ({
  consumeRateLimit: mocks.consumeRateLimit,
  requestIp: () => "127.0.0.1",
}));

vi.mock("@/lib/logger", () => ({
  logger: { exception: mocks.loggerException },
}));

import { POST } from "@/app/api/auth/password/signup/route";

function signupRequest() {
  return new Request("http://127.0.0.1:3110/api/auth/password/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-request-id": "request-test-id",
    },
    body: JSON.stringify({
      displayName: "Setup Check",
      email: "setup@example.com",
      password: "SecurePassword!2026",
    }),
  });
}

describe("password signup route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.consumeRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 4,
      retryAfterSeconds: 0,
    });
  });

  it("returns the configured development OTP only for a development delivery", async () => {
    mocks.registerWithPassword.mockResolvedValue({
      created: true,
      verification: { mode: "development", code: "123456" },
    });

    const response = await POST(signupRequest());

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      created: true,
      requiresVerification: true,
      developmentOtp: "123456",
    });
  });

  it("records a provider failure without exposing its details to the client", async () => {
    const providerError = new Error("provider rejected private details");
    mocks.registerWithPassword.mockRejectedValue(providerError);

    const response = await POST(signupRequest());

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ error: "signup_unavailable" });
    expect(mocks.loggerException).toHaveBeenCalledWith(
      "auth.password_signup_failed",
      providerError,
      { requestId: "request-test-id" },
    );
  });
});
