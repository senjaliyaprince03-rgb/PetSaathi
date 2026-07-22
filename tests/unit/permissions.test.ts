import { describe, expect, it } from "vitest";

import { hasPermission } from "@/modules/auth/permissions";

describe("role permissions", () => {
  it("allows multi-role users to inherit each role's scoped permissions", () => {
    expect(hasPermission(["CUSTOMER", "SITTER"], "booking:create")).toBe(true);
    expect(hasPermission(["CUSTOMER", "SITTER"], "service:update:assigned")).toBe(true);
  });

  it("keeps finance and verification access separated", () => {
    expect(hasPermission(["FINANCE_ADMIN"], "finance:operate")).toBe(true);
    expect(hasPermission(["FINANCE_ADMIN"], "verification:decide")).toBe(false);
  });
});
