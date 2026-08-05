import { beforeEach, describe, expect, it, vi } from "vitest";

const getCurrentIdentity = vi.hoisted(() => vi.fn());

vi.mock("@/modules/auth/session", () => ({ getCurrentIdentity }));

import { authorizeApi, authorizedActorRole } from "@/modules/auth/authorization";

describe("authorizedActorRole", () => {
  beforeEach(() => {
    getCurrentIdentity.mockReset();
  });
  it("returns the first permitted role held by the current identity", () => {
    expect(
      authorizedActorRole(
        { roles: ["CUSTOMER", "SAFETY_ADMIN"] },
        ["SAFETY_ADMIN", "OPERATIONS_ADMIN"],
      ),
    ).toBe("SAFETY_ADMIN");
  });

  it("rejects an identity with no permitted role", () => {
    expect(authorizedActorRole({ roles: ["CUSTOMER"] }, ["FINANCE_ADMIN"])).toBeNull();
  });

  it("returns a no-store unauthorized response when there is no session", async () => {
    getCurrentIdentity.mockResolvedValueOnce(null);

    const result = await authorizeApi(["OPERATIONS_ADMIN"]);
    expect(result.authorized).toBe(false);
    if (!result.authorized) {
      expect(result.response.status).toBe(401);
      expect(result.response.headers.get("Cache-Control")).toBe("no-store");
    }
  });

  it("distinguishes an authenticated but unauthorized identity", async () => {
    getCurrentIdentity.mockResolvedValueOnce({ id: "user-1", roles: ["CUSTOMER"] });

    const result = await authorizeApi(["OPERATIONS_ADMIN"]);
    expect(result.authorized).toBe(false);
    if (!result.authorized) expect(result.response.status).toBe(403);
  });

  it("returns the selected role for a permitted identity", async () => {
    const identity = { id: "admin-1", roles: ["CUSTOMER", "OPERATIONS_ADMIN"] };
    getCurrentIdentity.mockResolvedValueOnce(identity);

    await expect(authorizeApi(["OPERATIONS_ADMIN"])).resolves.toEqual({
      authorized: true,
      identity,
      actorRole: "OPERATIONS_ADMIN",
    });
  });
});
