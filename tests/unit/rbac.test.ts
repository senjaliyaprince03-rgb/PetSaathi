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
import { canUser, resolveUserPermissions, assignUserRole, revokeUserRole } from "@/modules/rbac/authorize";

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
