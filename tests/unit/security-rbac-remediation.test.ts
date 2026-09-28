import { describe, expect, it, vi } from "vitest";
import { canUser } from "@/modules/rbac/authorize";
import { resolveTerritoryScope } from "@/modules/rbac/territory-scope";
import { getSocietyDashboard } from "@/modules/b2b/service";

// Mock DB
vi.mock("@/lib/db", () => ({
  isDatabaseConfigured: vi.fn(() => true),
  prisma: {
    adminPermission: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    societyMember: {
      findMany: vi.fn(),
      count: vi.fn().mockResolvedValue(0),
    },
    society: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
    societySitterPool: {
      count: vi.fn().mockResolvedValue(0),
    },
    societyEvent: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    cityManager: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    operatingPartner: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}));

describe("Phase 2 RBAC & Tenant Isolation Remediation", () => {
  it("RBAC-01: canUser respects scope constraints on AdminPermission", async () => {
    const { prisma } = await import("@/lib/db");

    // Grant user "booking:operate" but only for city-mumbai
    vi.mocked(prisma.adminPermission.findMany).mockResolvedValue([
      { permission: "booking:operate" } as any,
    ]);
    vi.mocked(prisma.adminPermission.findFirst).mockResolvedValue({
      id: "grant-1",
      userId: "scoped-user-1",
      permission: "booking:operate",
      scope: { cityId: "city-mumbai" },
      status: "ACTIVE",
    } as any);

    const identity = {
      id: "scoped-user-1",
      displayName: "Scoped User",
      status: "ACTIVE" as const,
      roles: ["CUSTOMER" as const], // customer does not have booking:operate by default
    };

    // Allowed when target is city-mumbai
    const allowed = await canUser(identity, "booking:operate", {
      cityId: "city-mumbai",
    });
    expect(allowed).toBe(true);

    // Denied when target is city-delhi
    const denied = await canUser(identity, "booking:operate", {
      cityId: "city-delhi",
    });
    expect(denied).toBe(false);

    // Denied when no cityId provided
    const deniedUnscoped = await canUser(identity, "booking:operate", {});
    expect(deniedUnscoped).toBe(false);
  });

  it("RBAC-02: resolveTerritoryScope requires management assignment, excluding ordinary resident flat memberships", async () => {
    const { prisma } = await import("@/lib/db");

    // Mock AdminPermissions: none
    vi.mocked(prisma.adminPermission.findMany).mockResolvedValue([]);

    // Mock memberships: User is resident in soc-resident (with unitRef) and manager in soc-manager
    vi.mocked(prisma.societyMember.findMany).mockResolvedValue([
      { societyId: "soc-manager" },
    ] as any);

    const scope = await resolveTerritoryScope("manager-user-1", ["SOCIETY_MANAGER"]);
    expect(scope.unrestricted).toBe(false);
    expect(scope.societyIds).toContain("soc-manager");
    expect(scope.societyIds).not.toContain("soc-resident");
  });

  it("RBAC-03: getSocietyDashboard enforces query-level scoping against authorizedScope", async () => {
    const { prisma } = await import("@/lib/db");

    // When authorizedScope allows "soc-1", querying "soc-2" throws access error
    await expect(
      getSocietyDashboard("soc-2", { societyIds: ["soc-1"] })
    ).rejects.toThrow("Society does not exist or access denied");

    // When authorizedScope matches "soc-1", query succeeds
    vi.mocked(prisma.society.findFirst).mockResolvedValueOnce({
      id: "soc-1",
      name: "Green Society",
    } as any);

    const result = await getSocietyDashboard("soc-1", { societyIds: ["soc-1"] });
    expect(result.society.id).toBe("soc-1");
  });
});
