import { describe, expect, it } from "vitest";

import { readinessIsAcceptable } from "@/lib/readiness-policy";

describe("readiness policy", () => {
  it("requires every critical dependency in production", () => {
    expect(
      readinessIsAcceptable(
        { database: "connected", auth: "configured", payments: "configured" },
        true,
      ),
    ).toBe(true);
    expect(
      readinessIsAcceptable(
        { database: "connected", auth: "not_configured", payments: "configured" },
        true,
      ),
    ).toBe(false);
  });

  it("allows an intentionally unconfigured development environment", () => {
    expect(
      readinessIsAcceptable(
        {
          database: "not_configured",
          auth: "not_configured",
          payments: "not_configured",
        },
        false,
      ),
    ).toBe(true);
  });

  it("never reports an unreachable configured database as ready", () => {
    expect(
      readinessIsAcceptable(
        { database: "unreachable", auth: "configured", payments: "configured" },
        false,
      ),
    ).toBe(false);
  });
});
