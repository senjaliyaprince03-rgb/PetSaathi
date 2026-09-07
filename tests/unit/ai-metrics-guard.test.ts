import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentIdentity: vi.fn(),
  hasAnyRole: vi.fn(),
  metricsHandler: vi.fn(async (_req: { query: { windowMs?: string | null } }) =>
    new Response(JSON.stringify({ total: 1 }), { status: 200 }),
  ),
}));

vi.mock("@/modules/auth/session", () => ({
  getCurrentIdentity: mocks.getCurrentIdentity,
  hasAnyRole: mocks.hasAnyRole,
}));

vi.mock("@/api/routes/dashboard", () => ({
  metricsHandler: mocks.metricsHandler,
}));

import { GET } from "@/app/api/ai/metrics/route";

function makeRequest() {
  return { nextUrl: new URL("http://127.0.0.1:3110/api/ai/metrics") } as Request & {
    nextUrl: URL;
  };
}

describe("GET /api/ai/metrics", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 for unauthenticated callers without touching telemetry", async () => {
    mocks.getCurrentIdentity.mockResolvedValue(null);

    const response = await GET(makeRequest());

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ error: "Unauthorized" });
    expect(mocks.metricsHandler).not.toHaveBeenCalled();
  });

  it("returns 403 for authenticated non-admin users", async () => {
    const identity = { id: "u1", roles: ["CUSTOMER"] };
    mocks.getCurrentIdentity.mockResolvedValue(identity);
    mocks.hasAnyRole.mockReturnValue(false);

    const response = await GET(makeRequest());

    expect(response.status).toBe(403);
    expect(mocks.metricsHandler).not.toHaveBeenCalled();
  });

  it("preserves the telemetry response for authorized admins", async () => {
    const identity = { id: "u2", roles: ["SUPER_ADMIN"] };
    mocks.getCurrentIdentity.mockResolvedValue(identity);
    mocks.hasAnyRole.mockReturnValue(true);

    const response = await GET(makeRequest());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ total: 1 });
    expect(mocks.metricsHandler).toHaveBeenCalledTimes(1);
    expect(mocks.metricsHandler.mock.calls[0]?.[0]?.query.windowMs).toBeUndefined();
  });

  it("forwards the windowMs query parameter to the handler", async () => {
    const identity = { id: "u3", roles: ["OPERATIONS_ADMIN"] };
    mocks.getCurrentIdentity.mockResolvedValue(identity);
    mocks.hasAnyRole.mockReturnValue(true);

    const request = {
      nextUrl: new URL("http://127.0.0.1:3110/api/ai/metrics?windowMs=60000"),
    } as Request & { nextUrl: URL };

    await GET(request);

    expect(mocks.metricsHandler.mock.calls[0]?.[0]?.query.windowMs).toBe("60000");
  });
});
