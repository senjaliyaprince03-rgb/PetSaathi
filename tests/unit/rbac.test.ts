import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  roles,
  permissions,
  rolePermissions,
  hasPermission,
  canActorManageRole,
  ROLE_HIERARCHY_RANK,
  type Role,
  type Permission,
} from "@/modules/rbac/permissions";
import {
  canUser,
  resolveUserPermissions,
  assignUserRole,
  revokeUserRole,
  grantCustomPermission,
  revokeCustomPermission,
} from "@/modules/rbac/authorize";
import { resolveTerritoryScope } from "@/modules/rbac/territory-scope";
import { recordRbacAuditLog, getRecentAuditLogs } from "@/modules/rbac/audit-logger";

// Mock DB and Session
vi.mock("@/lib/db", () => ({
  isDatabaseConfigured: vi.fn(() => true),
  prisma: {
    adminPermission: {
      findMany: vi.fn().mockResolvedValue([]),
      upsert: vi.fn().mockResolvedValue({ id: "custom-perm-1" }),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
    user: {
      findUnique: vi.fn().mockResolvedValue({
        id: "target-user-1",
        displayName: "Test User",
        status: "ACTIVE",
        roles: [{ role: "CUSTOMER" }],
      }),
    },
    userRole: {
      upsert: vi.fn().mockResolvedValue({ id: "role-1" }),
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
    auditLog: {
      create: vi.fn().mockResolvedValue({ id: "audit-1" }),
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
    },
    cityManager: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    operatingPartner: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}));

vi.mock("@/modules/auth/session", () => ({
  getCurrentIdentity: vi.fn(),
}));

describe("RBAC Permissions Matrix & Hierarchy", () => {
  it("defines all 12 platform roles", () => {
    expect(roles).toHaveLength(12);
    expect(roles).toContain("SUPER_ADMIN");
    expect(roles).toContain("OPERATIONS_ADMIN");
    expect(roles).toContain("SAFETY_ADMIN");
    expect(roles).toContain("FINANCE_ADMIN");
    expect(roles).toContain("VERIFICATION_ADMIN");
    expect(roles).toContain("CONTENT_ADMIN");
    expect(roles).toContain("SOCIETY_MANAGER");
    expect(roles).toContain("PARTNER_MANAGER");
    expect(roles).toContain("CITY_MANAGER");
    expect(roles).toContain("OPERATOR");
    expect(roles).toContain("SITTER");
    expect(roles).toContain("CUSTOMER");
  });

  it("super admin has all permissions and rank 100", () => {
    expect(ROLE_HIERARCHY_RANK.SUPER_ADMIN).toBe(100);
    for (const perm of permissions) {
      expect(hasPermission(["SUPER_ADMIN"], perm)).toBe(true);
    }
  });

  it("restricts customer to customer-scoped permissions", () => {
    expect(hasPermission(["CUSTOMER"], "booking:create")).toBe(true);
    expect(hasPermission(["CUSTOMER"], "pet:read:own")).toBe(true);
    expect(hasPermission(["CUSTOMER"], "booking:operate")).toBe(false);
    expect(hasPermission(["CUSTOMER"], "finance:refund")).toBe(false);
    expect(hasPermission(["CUSTOMER"], "system:admin")).toBe(false);
  });

  it("restricts sitter to assigned delivery permissions", () => {
    expect(hasPermission(["SITTER"], "assignment:read:assigned")).toBe(true);
    expect(hasPermission(["SITTER"], "service:update:assigned")).toBe(true);
    expect(hasPermission(["SITTER"], "booking:operate")).toBe(false);
    expect(hasPermission(["SITTER"], "matching:decide")).toBe(false);
  });

  it("grants operations admin booking operations and matching", () => {
    expect(hasPermission(["OPERATIONS_ADMIN"], "booking:operate")).toBe(true);
    expect(hasPermission(["OPERATIONS_ADMIN"], "matching:decide")).toBe(true);
    expect(hasPermission(["OPERATIONS_ADMIN"], "booking:dispatch")).toBe(true);
    expect(hasPermission(["OPERATIONS_ADMIN"], "finance:refund")).toBe(false);
  });

  it("grants finance admin refund and payout authorities", () => {
    expect(hasPermission(["FINANCE_ADMIN"], "finance:refund")).toBe(true);
    expect(hasPermission(["FINANCE_ADMIN"], "finance:payout")).toBe(true);
    expect(hasPermission(["FINANCE_ADMIN"], "b2b:invoicing")).toBe(true);
    expect(hasPermission(["FINANCE_ADMIN"], "matching:decide")).toBe(false);
  });

  it("grants safety admin incident management and holds", () => {
    expect(hasPermission(["SAFETY_ADMIN"], "incident:operate")).toBe(true);
    expect(hasPermission(["SAFETY_ADMIN"], "safety:hold_manage")).toBe(true);
    expect(hasPermission(["SAFETY_ADMIN"], "finance:payout")).toBe(false);
  });
});

describe("Privilege Escalation Prevention", () => {
  it("allows SUPER_ADMIN to assign any role", () => {
    for (const r of roles) {
      expect(canActorManageRole(["SUPER_ADMIN"], r)).toBe(true);
    }
  });

  it("blocks non-SUPER_ADMIN from assigning SUPER_ADMIN", () => {
    const nonSuperRoles: Role[] = [
      "OPERATIONS_ADMIN",
      "SAFETY_ADMIN",
      "FINANCE_ADMIN",
      "VERIFICATION_ADMIN",
      "CONTENT_ADMIN",
      "SOCIETY_MANAGER",
      "PARTNER_MANAGER",
      "CITY_MANAGER",
      "OPERATOR",
      "SITTER",
      "CUSTOMER",
    ];

    for (const role of nonSuperRoles) {
      expect(canActorManageRole([role], "SUPER_ADMIN")).toBe(false);
    }
  });

  it("blocks an admin from granting a role of equal rank", () => {
    expect(canActorManageRole(["OPERATIONS_ADMIN"], "OPERATIONS_ADMIN")).toBe(false);
    expect(canActorManageRole(["OPERATIONS_ADMIN"], "SAFETY_ADMIN")).toBe(false);
  });

  it("allows an admin to manage lower rank roles if permitted", () => {
    expect(canActorManageRole(["OPERATIONS_ADMIN"], "SITTER")).toBe(true);
    expect(canActorManageRole(["OPERATIONS_ADMIN"], "CUSTOMER")).toBe(true);
  });
});

describe("canUser and IDOR Ownership Validation", () => {
  it("grants access to own resource when owner matches", async () => {
    const identity = {
      id: "cust-1",
      displayName: "Parent",
      status: "ACTIVE" as const,
      roles: ["CUSTOMER" as Role],
    };

    const allowed = await canUser(identity, "pet:write:own", { ownerId: "cust-1" });
    expect(allowed).toBe(true);
  });

  it("denies access to another customer's resource (IDOR guard)", async () => {
    const identity = {
      id: "cust-1",
      displayName: "Parent",
      status: "ACTIVE" as const,
      roles: ["CUSTOMER" as Role],
    };

    const allowed = await canUser(identity, "pet:write:own", { ownerId: "cust-2" });
    expect(allowed).toBe(false);
  });

  it("allows SUPER_ADMIN to access any resource despite owner mismatch", async () => {
    const identity = {
      id: "super-1",
      displayName: "Super Admin",
      status: "ACTIVE" as const,
      roles: ["SUPER_ADMIN" as Role],
    };

    const allowed = await canUser(identity, "pet:write:own", { ownerId: "cust-2" });
    expect(allowed).toBe(true);
  });
});

describe("assignUserRole and revokeUserRole Guard Rails", () => {
  it("rejects role assignment if actor lacks roles:assign permission", async () => {
    const actorIdentity = {
      id: "ops-1",
      displayName: "Ops Admin",
      status: "ACTIVE" as const,
      roles: ["OPERATIONS_ADMIN" as Role],
    };

    await expect(
      assignUserRole({
        actorIdentity,
        targetUserId: "target-user-1",
        role: "CUSTOMER",
      }),
    ).rejects.toThrow("Actor does not have roles:assign permission");
  });

  it("rejects role assignment if actor attempts privilege escalation even with roles:assign grant", async () => {
    const { prisma } = await import("@/lib/db");
    vi.mocked(prisma.adminPermission.findMany).mockResolvedValueOnce([
      { permission: "roles:assign" } as any,
    ]);

    const actorIdentity = {
      id: "ops-elevated",
      displayName: "Ops Admin with Assign Perm",
      status: "ACTIVE" as const,
      roles: ["OPERATIONS_ADMIN" as Role],
    };

    await expect(
      assignUserRole({
        actorIdentity,
        targetUserId: "target-user-1",
        role: "SUPER_ADMIN",
      }),
    ).rejects.toThrow("Privilege escalation prevented");
  });

  it("allows SUPER_ADMIN to assign a role and generates an audit log", async () => {
    const actorIdentity = {
      id: "super-1",
      displayName: "Platform Admin",
      status: "ACTIVE" as const,
      roles: ["SUPER_ADMIN" as Role],
    };

    const result = await assignUserRole({
      actorIdentity,
      targetUserId: "target-user-1",
      role: "OPERATIONS_ADMIN",
      reason: "Promoted to regional dispatcher",
    });

    expect(result.success).toBe(true);
  });
});

describe("AdminPermission & GateStatus Coupling", () => {
  it("resolves active, non-expired custom permissions", async () => {
    const { prisma } = await import("@/lib/db");
    vi.mocked(prisma.adminPermission.findMany).mockResolvedValueOnce([
      { permission: "finance:refund" } as any,
    ]);

    const perms = await resolveUserPermissions("user-custom-1", ["CUSTOMER"]);
    expect(perms.has("finance:refund")).toBe(true);
    expect(perms.has("booking:create")).toBe(true);

    expect(prisma.adminPermission.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: "user-custom-1",
          status: "ACTIVE",
        }),
      }),
    );
  });

  it("super admin always gets all permissions regardless of database grants", async () => {
    const perms = await resolveUserPermissions("super-id", ["SUPER_ADMIN"]);
    expect(perms.size).toBe(permissions.length);
    for (const p of permissions) {
      expect(perms.has(p)).toBe(true);
    }
  });
});

describe("Custom Permission Privilege Escalation Prevention", () => {
  it("rejects grantCustomPermission if actor is not SUPER_ADMIN", async () => {
    const nonSuperIdentity = {
      id: "ops-admin-1",
      displayName: "Ops Admin",
      status: "ACTIVE" as const,
      roles: ["OPERATIONS_ADMIN" as Role],
    };

    await expect(
      grantCustomPermission({
        actorIdentity: nonSuperIdentity,
        targetUserId: "target-user-1",
        permission: "finance:refund",
        reason: "Temporary coverage",
      }),
    ).rejects.toThrow("Only SUPER_ADMIN can grant explicit custom permissions");
  });

  it("rejects revokeCustomPermission if actor is not SUPER_ADMIN", async () => {
    const nonSuperIdentity = {
      id: "ops-admin-1",
      displayName: "Ops Admin",
      status: "ACTIVE" as const,
      roles: ["OPERATIONS_ADMIN" as Role],
    };

    await expect(
      revokeCustomPermission({
        actorIdentity: nonSuperIdentity,
        targetUserId: "target-user-1",
        permission: "finance:refund",
        reason: "Coverage ended",
      }),
    ).rejects.toThrow("Only SUPER_ADMIN can revoke explicit custom permissions");
  });

  it("rejects granting an invalid or unrecognized permission", async () => {
    const superIdentity = {
      id: "super-1",
      displayName: "Super Admin",
      status: "ACTIVE" as const,
      roles: ["SUPER_ADMIN" as Role],
    };

    await expect(
      grantCustomPermission({
        actorIdentity: superIdentity,
        targetUserId: "target-user-1",
        permission: "hacker:grant_everything" as any,
        reason: "Test exploit",
      }),
    ).rejects.toThrow("Invalid permission: hacker:grant_everything");
  });

  it("allows SUPER_ADMIN to grant custom permission and creates audit log", async () => {
    const { prisma } = await import("@/lib/db");
    const superIdentity = {
      id: "super-1",
      displayName: "Super Admin",
      status: "ACTIVE" as const,
      roles: ["SUPER_ADMIN" as Role],
    };

    const res = await grantCustomPermission({
      actorIdentity: superIdentity,
      targetUserId: "target-user-1",
      permission: "finance:refund",
      reason: "Emergency refund escalation duty",
      expiresAt: new Date(Date.now() + 86400000),
    });

    expect(res.success).toBe(true);
    expect(prisma.adminPermission.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          status: "ACTIVE",
          permission: "finance:refund",
        }),
      }),
    );
    expect(prisma.auditLog.create).toHaveBeenCalled();
  });

  it("allows SUPER_ADMIN to revoke custom permission setting status to ARCHIVED", async () => {
    const { prisma } = await import("@/lib/db");
    const superIdentity = {
      id: "super-1",
      displayName: "Super Admin",
      status: "ACTIVE" as const,
      roles: ["SUPER_ADMIN" as Role],
    };

    const res = await revokeCustomPermission({
      actorIdentity: superIdentity,
      targetUserId: "target-user-1",
      permission: "finance:refund",
      reason: "Shift completed",
    });

    expect(res.success).toBe(true);
    expect(prisma.adminPermission.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId: "target-user-1",
          permission: "finance:refund",
          status: "ACTIVE",
        },
        data: expect.objectContaining({
          status: "ARCHIVED",
        }),
      }),
    );
  });
});

describe("Multi-Tenant Territory Scoping & IDOR Prevention", () => {
  it("central admins have unrestricted territory scope", async () => {
    const superScope = await resolveTerritoryScope("super-1", ["SUPER_ADMIN"]);
    expect(superScope.unrestricted).toBe(true);

    const opsScope = await resolveTerritoryScope("ops-1", ["OPERATIONS_ADMIN"]);
    expect(opsScope.unrestricted).toBe(true);
  });

  it("city manager is scoped strictly to assigned cities", async () => {
    const { prisma } = await import("@/lib/db");
    vi.mocked(prisma.cityManager.findMany).mockResolvedValueOnce([
      { cityId: "city-mumbai" } as any,
      { cityId: "city-pune" } as any,
    ]);

    const scope = await resolveTerritoryScope("cm-1", ["CITY_MANAGER"]);
    expect(scope.unrestricted).toBe(false);
    expect(scope.cityIds).toEqual(["city-mumbai", "city-pune"]);
  });

  it("operator is scoped to operating partner territories", async () => {
    const { prisma } = await import("@/lib/db");
    vi.mocked(prisma.operatingPartner.findMany).mockResolvedValueOnce([
      {
        id: "partner-123",
        territories: [
          { cityId: "city-blr", serviceZoneId: "zone-east" },
          { cityId: "city-blr", serviceZoneId: "zone-north" },
        ],
      } as any,
    ]);

    const scope = await resolveTerritoryScope("op-1", ["OPERATOR"]);
    expect(scope.unrestricted).toBe(false);
    expect(scope.operatingPartnerId).toBe("partner-123");
    expect(scope.cityIds).toContain("city-blr");
    expect(scope.serviceZoneIds).toContain("zone-east");
    expect(scope.serviceZoneIds).toContain("zone-north");
  });

  it("canUser enforces territory boundary for CITY_MANAGER", async () => {
    const { prisma } = await import("@/lib/db");
    vi.mocked(prisma.cityManager.findMany).mockResolvedValue([
      { cityId: "city-mumbai" } as any,
    ]);

    const cmIdentity = {
      id: "cm-1",
      displayName: "Mumbai Manager",
      status: "ACTIVE" as const,
      roles: ["CITY_MANAGER" as Role],
    };

    // Allowed city
    const allowed = await canUser(cmIdentity, "booking:operate", {
      cityId: "city-mumbai",
    });
    expect(allowed).toBe(true);

    // Disallowed city (IDOR prevention)
    const blocked = await canUser(cmIdentity, "booking:operate", {
      cityId: "city-delhi",
    });
    expect(blocked).toBe(false);
  });

  it("canUser enforces zone boundary for OPERATOR", async () => {
    const { prisma } = await import("@/lib/db");
    vi.mocked(prisma.operatingPartner.findMany).mockResolvedValue([
      {
        id: "partner-123",
        territories: [{ cityId: "city-blr", serviceZoneId: "zone-east" }],
      } as any,
    ]);

    const opIdentity = {
      id: "op-1",
      displayName: "Zone Operator",
      status: "ACTIVE" as const,
      roles: ["OPERATOR" as Role],
    };

    // Allowed zone
    const allowed = await canUser(opIdentity, "booking:operate", {
      cityId: "city-blr",
      serviceZoneId: "zone-east",
    });
    expect(allowed).toBe(true);

    // Disallowed zone (IDOR prevention)
    const blocked = await canUser(opIdentity, "booking:operate", {
      cityId: "city-blr",
      serviceZoneId: "zone-west",
    });
    expect(blocked).toBe(false);
  });
});

describe("Immutable Audit Logging", () => {
  it("records audit log via prisma.auditLog.create", async () => {
    const { prisma } = await import("@/lib/db");
    const res = await recordRbacAuditLog({
      actorId: "super-1",
      actorRole: "SUPER_ADMIN",
      action: "rbac.security_test",
      resourceType: "system",
      resourceId: "rbac-engine",
      reason: "Automated security verification",
    });

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        actorId: "super-1",
        actorRole: "SUPER_ADMIN",
        action: "rbac.security_test",
        resourceType: "system",
        resourceId: "rbac-engine",
      }),
    });
  });

  it("retrieves paginated audit logs without exposing mutation APIs", async () => {
    const { prisma } = await import("@/lib/db");
    vi.mocked(prisma.auditLog.findMany).mockResolvedValueOnce([
      {
        id: "log-1",
        actorId: "super-1",
        action: "rbac.role_assigned",
        createdAt: new Date(),
      } as any,
    ]);
    vi.mocked(prisma.auditLog.count).mockResolvedValueOnce(1);

    const result = await getRecentAuditLogs({ limit: 10, offset: 0 });
    expect(result.logs).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(prisma.auditLog.findMany).toHaveBeenCalled();
  });
});
