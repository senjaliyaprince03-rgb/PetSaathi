import { describe, expect, it } from "vitest";

import {
  AdminMutationError,
  adminMutationErrorResponse,
  adminResourceIdSchema,
} from "@/modules/admin/mutation";

describe("admin mutation helpers", () => {
  it("accepts only UUID resource identifiers", () => {
    expect(adminResourceIdSchema.safeParse("0b259f91-6535-4e34-a254-0ef324df1a23").success).toBe(true);
    expect(adminResourceIdSchema.safeParse("booking-1").success).toBe(false);
  });

  it("serializes expected admin mutation failures without caching", async () => {
    const response = adminMutationErrorResponse(
      new AdminMutationError(409, "state_conflict", "This booking cannot be changed in its current state."),
    );

    expect(response?.status).toBe(409);
    expect(response?.headers.get("Cache-Control")).toBe("no-store");
    await expect(response?.json()).resolves.toEqual({
      error: "state_conflict",
      message: "This booking cannot be changed in its current state.",
    });
  });

  it("does not turn unknown failures into an application response", () => {
    expect(adminMutationErrorResponse(new Error("unexpected"))).toBeNull();
  });
});
