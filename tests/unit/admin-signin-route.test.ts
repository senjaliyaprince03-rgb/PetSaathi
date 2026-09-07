import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  consumeRateLimit: vi.fn(),
  loggerException: vi.fn(),
  signInAdmin: vi.fn(),
}));

vi.mock("@/modules/auth/mongodb-auth", () => ({
  signInAdmin: mocks.signInAdmin,
}));

vi.mock("@/modules/security/rate-limit", () => ({
  consumeRateLimit: mocks.consumeRateLimit,
  requestIp: () => "127.0.0.1",
}));

vi.mock("@/lib/logger", () => ({
  logger: { exception: mocks.loggerException },
}));

import { POST } from "@/app/api/auth/admin/signin/route";

function adminSigninRequest(body: unknown) {
  return new Request("http://127.0.0.1:3110/api/auth/admin/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("admin signin route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.consumeRateLimit.mockResolvedValue({ allowed: true, remaining: 4, retryAfterSeconds: 0 });
  });

  it("authenticates locked admin with correct credentials", async () => {
    mocks.signInAdmin.mockResolvedValue({ success: true, roles: ["SUPER_ADMIN", "OPERATIONS_ADMIN"] });

    const response = await POST(adminSigninRequest({
      email: "mrsenjaliya532@gmail.com",
      password: "Prince@@@123@@@",
    }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      authenticated: true,
      roles: ["SUPER_ADMIN", "OPERATIONS_ADMIN"],
    });
    expect(mocks.signInAdmin).toHaveBeenCalledWith("mrsenjaliya532@gmail.com", "Prince@@@123@@@");
  });

  it("rejects non-admin email or wrong password with 401", async () => {
    mocks.signInAdmin.mockResolvedValue({ success: false });

    const response = await POST(adminSigninRequest({
      email: "otheruser@test.local",
      password: "wrongpassword",
    }));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "invalid_credentials",
      message: "Incorrect admin email or password.",
    });
  });

  it("rejects requests exceeding rate limits with 429", async () => {
    mocks.consumeRateLimit.mockResolvedValue({ allowed: false, remaining: 0, retryAfterSeconds: 60 });

    const response = await POST(adminSigninRequest({
      email: "mrsenjaliya532@gmail.com",
      password: "Prince@@@123@@@",
    }));

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("60");
  });
});
