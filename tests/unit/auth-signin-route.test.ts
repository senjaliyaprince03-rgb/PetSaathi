import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  consumeRateLimit: vi.fn(),
  loggerException: vi.fn(),
  signInWithPassword: vi.fn(),
}));

vi.mock("@/modules/auth/mongodb-auth", () => ({
  signInWithPassword: mocks.signInWithPassword,
}));

vi.mock("@/modules/security/rate-limit", () => ({
  consumeRateLimit: mocks.consumeRateLimit,
  requestIp: () => "127.0.0.1",
}));

vi.mock("@/lib/logger", () => ({
  logger: { exception: mocks.loggerException },
}));

import { POST } from "@/app/api/auth/password/signin/route";

function signinRequest(body: unknown) {
  return new Request("http://127.0.0.1:3110/api/auth/password/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("password signin route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.consumeRateLimit.mockResolvedValue({ allowed: true, remaining: 9, retryAfterSeconds: 0 });
  });

  it("returns 401 with a stable message for wrong credentials", async () => {
    mocks.signInWithPassword.mockResolvedValue({ success: false });

    const response = await POST(signinRequest({ email: "user@test.local", password: "nope" }));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "invalid_credentials",
      message: "Incorrect email or password.",
    });
  });

  it("returns a retryable 503 envelope when the database is unreachable", async () => {
    const infraError = Object.assign(new Error("server selection timeout"), { name: "MongoServerSelectionError" });
    mocks.signInWithPassword.mockRejectedValue(infraError);

    const response = await POST(signinRequest({ email: "user@test.local", password: "Whatever123!" }));

    expect(response.status).toBe(503);
    expect(response.headers.get("Retry-After")).toBe("30");
    const body = (await response.json()) as { error: string; retryable: boolean };
    expect(body.error).toBe("SERVICE_UNAVAILABLE");
    expect(body.retryable).toBe(true);
    expect(mocks.loggerException).toHaveBeenCalledWith("auth.password_signin_failed", infraError, { requestId: undefined });
  });

  it("never leaks infrastructure details for non-infra unexpected errors", async () => {
    mocks.signInWithPassword.mockRejectedValue(new Error("secret-internal-detail"));

    const response = await POST(signinRequest({ email: "user@test.local", password: "Whatever123!" }));

    expect(response.status).toBe(500);
    const raw = await response.text();
    expect(raw).not.toContain("secret-internal-detail");
    expect(raw).toContain("INTERNAL_ERROR");
  });
});
