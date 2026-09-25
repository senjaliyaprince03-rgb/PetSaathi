import { describe, expect, it } from "vitest";
import { adminRolesForPath, getDefaultDashboardForRoles } from "@/modules/auth/admin-access";
import { getFilteredAdminLinks, roleNavigationMap } from "@/components/portal/portal-navigation";
import type { Role } from "@prisma/client";

describe("12-Role Dashboard & Navigation Routing", () => {
  it("routes each role to its dedicated dashboard destination", () => {
    expect(getDefaultDashboardForRoles(["SUPER_ADMIN"])).toBe("/admin");
    expect(getDefaultDashboardForRoles(["OPERATIONS_ADMIN"])).toBe("/admin");
    expect(getDefaultDashboardForRoles(["SAFETY_ADMIN"])).toBe("/admin/safety");
    expect(getDefaultDashboardForRoles(["FINANCE_ADMIN"])).toBe("/admin/finance");
    expect(getDefaultDashboardForRoles(["VERIFICATION_ADMIN"])).toBe("/admin/verification");
    expect(getDefaultDashboardForRoles(["CONTENT_ADMIN"])).toBe("/admin/content");
    expect(getDefaultDashboardForRoles(["PARTNER_MANAGER"])).toBe("/admin/b2b");
    expect(getDefaultDashboardForRoles(["CITY_MANAGER"])).toBe("/admin/cities");
    expect(getDefaultDashboardForRoles(["OPERATOR"])).toBe("/operator");
    expect(getDefaultDashboardForRoles(["SOCIETY_MANAGER"])).toBe("/society");
    expect(getDefaultDashboardForRoles(["SITTER"])).toBe("/saathi");
    expect(getDefaultDashboardForRoles(["CUSTOMER"])).toBe("/dashboard");
  });

  it("ensures roleNavigationMap defines valid navigation routes for all 12 roles", () => {
    const roles: Role[] = [
      "SUPER_ADMIN",
      "OPERATIONS_ADMIN",
      "SAFETY_ADMIN",
      "FINANCE_ADMIN",
      "VERIFICATION_ADMIN",
      "CONTENT_ADMIN",
      "PARTNER_MANAGER",
      "CITY_MANAGER",
      "OPERATOR",
      "SOCIETY_MANAGER",
      "SITTER",
      "CUSTOMER",
    ];

    roles.forEach((role) => {
      const routes = roleNavigationMap[role];
      expect(routes).toBeDefined();
      expect(Array.isArray(routes)).toBe(true);
      expect(routes.length).toBeGreaterThan(0);
      routes.forEach((route) => {
        expect(route.startsWith("/")).toBe(true);
      });
    });
  });

  it("filters administrative sidebar links strictly according to role permissions", () => {
    // Super Admin: Governance links only
    const superAdminLinks = getFilteredAdminLinks(["SUPER_ADMIN"]);
    expect(superAdminLinks.some((l) => l.href === "/admin")).toBe(true);
    expect(superAdminLinks.some((l) => l.href === "/admin/rbac")).toBe(true);
    expect(superAdminLinks.some((l) => l.href === "/admin/features")).toBe(true);
    expect(superAdminLinks.some((l) => l.href === "/admin/privacy")).toBe(true);
    expect(superAdminLinks.some((l) => l.href === "/admin/finance")).toBe(false);
    expect(superAdminLinks.some((l) => l.href === "/admin/safety")).toBe(false);

    // Operations Admin: Operations links
    const opsLinks = getFilteredAdminLinks(["OPERATIONS_ADMIN"]);
    expect(opsLinks.some((l) => l.href === "/admin")).toBe(true);
    expect(opsLinks.some((l) => l.href === "/admin/operations")).toBe(true);
    expect(opsLinks.some((l) => l.href === "/admin/matching")).toBe(true);
    expect(opsLinks.some((l) => l.href === "/admin/rbac")).toBe(false);

    // Safety Admin: Safety Queue & Trust links
    const safetyLinks = getFilteredAdminLinks(["SAFETY_ADMIN"]);
    expect(safetyLinks.some((l) => l.href === "/admin/safety")).toBe(true);
    expect(safetyLinks.some((l) => l.href === "/admin/reports")).toBe(true);
    expect(safetyLinks.some((l) => l.href === "/admin/support")).toBe(true);
    expect(safetyLinks.some((l) => l.href === "/admin/rbac")).toBe(false);
    expect(safetyLinks.some((l) => l.href === "/admin/finance")).toBe(false);

    // Finance Admin: Finance, Plans, Catalog
    const financeLinks = getFilteredAdminLinks(["FINANCE_ADMIN"]);
    expect(financeLinks.some((l) => l.href === "/admin/finance")).toBe(true);
    expect(financeLinks.some((l) => l.href === "/admin/plans")).toBe(true);
    expect(financeLinks.some((l) => l.href === "/admin/catalog")).toBe(true);
    expect(financeLinks.some((l) => l.href === "/admin/rbac")).toBe(false);
    expect(financeLinks.some((l) => l.href === "/admin/safety")).toBe(false);

    // Verification Admin: Verification review
    const verificationLinks = getFilteredAdminLinks(["VERIFICATION_ADMIN"]);
    expect(verificationLinks.some((l) => l.href === "/admin/verification")).toBe(true);
    expect(verificationLinks.some((l) => l.href === "/admin/rbac")).toBe(false);
    expect(verificationLinks.some((l) => l.href === "/admin/finance")).toBe(false);

    // Content Admin: Content & Testimonials
    const contentLinks = getFilteredAdminLinks(["CONTENT_ADMIN"]);
    expect(contentLinks.some((l) => l.href === "/admin/content")).toBe(true);
    expect(contentLinks.some((l) => (l.href as string) === "/admin/content/testimonials")).toBe(true);
    expect(contentLinks.some((l) => l.href === "/admin/rbac")).toBe(false);

    // Partner Manager: B2B Enterprise & Partner Directory
    const partnerLinks = getFilteredAdminLinks(["PARTNER_MANAGER"]);
    expect(partnerLinks.some((l) => l.href === "/admin/b2b")).toBe(true);
    expect(partnerLinks.some((l) => l.href === "/admin/partners")).toBe(true);
    expect(partnerLinks.some((l) => l.href === "/admin/rbac")).toBe(false);

    // City Manager: City Expansion
    const cityLinks = getFilteredAdminLinks(["CITY_MANAGER"]);
    expect(cityLinks.some((l) => l.href === "/admin/cities")).toBe(true);
    expect(cityLinks.some((l) => l.href === "/admin/rbac")).toBe(false);
  });

  it("permits CITY_MANAGER on /admin/cities and /admin/operations/cities", () => {
    const citiesRoles = adminRolesForPath("/admin/cities");
    expect(citiesRoles).toContain("CITY_MANAGER");
    expect(citiesRoles).toContain("OPERATIONS_ADMIN");
    expect(citiesRoles).toContain("SUPER_ADMIN");

    const opsCitiesRoles = adminRolesForPath("/admin/operations/cities");
    expect(opsCitiesRoles).toContain("CITY_MANAGER");
  });
});
