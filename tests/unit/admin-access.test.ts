import { describe, expect, it } from "vitest";

import {
  adminRolesForPath,
  normalizeAdminReturnTo,
} from "@/modules/auth/admin-access";

describe("admin route access", () => {
  it("uses the most specific role boundary for sensitive nested routes", () => {
    expect(adminRolesForPath("/admin/b2b/invoices")).toEqual([
      "FINANCE_ADMIN",
      "SUPER_ADMIN",
    ]);
    expect(
      adminRolesForPath(
        "/admin/operations/cities/6da9e5c9-f9f8-49a8-91a8-5adb31f7d45f/health",
      ),
    ).toEqual(["CITY_MANAGER", "OPERATIONS_ADMIN", "SUPER_ADMIN"]);
    expect(adminRolesForPath("/admin/reports/investor-metrics")).toEqual([
      "FINANCE_ADMIN",
      "SUPER_ADMIN",
    ]);
  });

  it("fails closed for unregistered admin surfaces", () => {
    expect(adminRolesForPath("/admin/unregistered-console")).toBeNull();
    expect(adminRolesForPath("/customer/dashboard")).toBeNull();
  });

  it("does not grant broad operations access to scoped roles", () => {
    expect(adminRolesForPath("/admin/operations")).toEqual([
      "OPERATIONS_ADMIN",
      "SUPER_ADMIN",
    ]);
    expect(adminRolesForPath("/admin/operations/live")).not.toContain(
      "CITY_MANAGER",
    );
    expect(adminRolesForPath("/admin/operations/live")).not.toContain(
      "OPERATOR",
    );
  });

  it("accepts only local admin return paths", () => {
    expect(
      normalizeAdminReturnTo(
        "/admin/leads?status=NEW",
        "/admin",
      ),
    ).toBe("/admin/leads?status=NEW");
    expect(
      normalizeAdminReturnTo("//attacker.example", "/admin"),
    ).toBe("/admin");
    expect(
      normalizeAdminReturnTo("/customer/dashboard", "/admin"),
    ).toBe("/admin");
    expect(
      normalizeAdminReturnTo("/admin\r\nX-Test: injected", "/admin"),
    ).toBe("/admin");
  });
});
