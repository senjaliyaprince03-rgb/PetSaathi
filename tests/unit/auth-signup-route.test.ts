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

  it("returns a retryable 503 envelope for infrastructure failures without exposing details", async () => {
    const infraError = Object.assign(new Error("querySrv ECONNREFUSED _mongodb._tcp.cluster"), { name: "MongoServerSelectionError" });
    mocks.registerWithPassword.mockRejectedValue(infraError);

    const response = await POST(signupRequest());

    expect(response.status).toBe(503);
    expect(response.headers.get("Retry-After")).toBe("30");
    await expect(response.json()).resolves.toEqual({
      error: "SERVICE_UNAVAILABLE",
      message: "We're temporarily unable to complete this request. Please try again in a moment.",
      retryable: true,
    });
    expect(mocks.loggerException).toHaveBeenCalledWith(
      "auth.password_signup_failed",
      infraError,
      { requestId: "request-test-id" },
    );
    const body = await response.json().catch(() => null);
    expect(JSON.stringify(body)).not.toContain("querySrv");
  });

  it("returns a generic 409 with a human message for duplicate accounts", async () => {
    mocks.registerWithPassword.mockResolvedValue({ created: false, reason: "account_exists" });

    const response = await POST(signupRequest());

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error: "account_exists",
      message: "An account with this email already exists.",
    });
  });

  it("returns a generic 500 envelope for unexpected failures", async () => {
    mocks.registerWithPassword.mockRejectedValue(new Error("unexpected boom"));

    const response = await POST(signupRequest());

    expect(response.status).toBe(500);
    const body = (await response.json()) as { error: string; message: string };
    expect(body.error).toBe("INTERNAL_ERROR");
    expect(body.message).not.toContain("boom");
  });
});
