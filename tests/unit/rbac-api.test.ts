import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { mockGetCurrentIdentity } = vi.hoisted(() => ({
  mockGetCurrentIdentity: vi.fn(),
}));

vi.mock("@/modules/auth/session", () => ({
  getCurrentIdentity: mockGetCurrentIdentity,
}));

vi.mock("@/lib/db", () => ({
  isDatabaseConfigured: vi.fn(() => true),
  prisma: {
    user: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: "u-1",
          displayName: "Admin Alice",
          email: "alice@petsaathi.test",
          status: "ACTIVE",
          createdAt: new Date(),
          roles: [{ role: "SUPER_ADMIN", grantedAt: new Date(), grantedBy: "system" }],
          permissionsHeld: [],
        },
      ]),
      count: vi.fn().mockResolvedValue(1),
      findUnique: vi.fn().mockResolvedValue({
        id: "u-2",
        displayName: "Bob Sitter",
        roles: [{ role: "SITTER" }],
      }),
    },
    userRole: {
      upsert: vi.fn().mockResolvedValue({ id: "ur-1" }),
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
    adminPermission: {
      upsert: vi.fn().mockResolvedValue({ id: "ap-1" }),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      findMany: vi.fn().mockResolvedValue([]),
    },
    auditLog: {
      create: vi.fn().mockResolvedValue({ id: "audit-1" }),
      findMany: vi.fn().mockResolvedValue([
        {
          id: "al-1",
          action: "rbac.role_assigned",
          actorId: "u-1",
          actorRole: "SUPER_ADMIN",
          resourceType: "user",
          resourceId: "u-2",
          createdAt: new Date(),
        },
      ]),
      count: vi.fn().mockResolvedValue(1),
    },
  },
}));

import { GET as getUsersRoute } from "@/app/api/admin/rbac/users/route";
import { POST as assignRoleRoute } from "@/app/api/admin/rbac/assign-role/route";
import { POST as permissionsRoute } from "@/app/api/admin/rbac/permissions/route";
import { GET as auditLogsRoute } from "@/app/api/admin/rbac/audit-logs/route";

describe("RBAC API Endpoints Authorization & Security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/admin/rbac/users", () => {
    it("returns 401 when unauthenticated", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce(null);
      const req = new NextRequest("http://localhost:3000/api/admin/rbac/users");
      const res = await getUsersRoute(req);
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe("unauthorized");
    });

    it("returns 403 when authenticated as customer", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce({
        id: "cust-1",
        roles: ["CUSTOMER"],
        displayName: "Customer Charlie",
        status: "ACTIVE",
      });
      const req = new NextRequest("http://localhost:3000/api/admin/rbac/users");
      const res = await getUsersRoute(req);
      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.error).toBe("forbidden");
    });

    it("returns 200 with users list for SUPER_ADMIN", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce({
        id: "super-1",
        roles: ["SUPER_ADMIN"],
        displayName: "Super Admin",
        status: "ACTIVE",
      });
      const req = new NextRequest("http://localhost:3000/api/admin/rbac/users");
      const res = await getUsersRoute(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.users).toHaveLength(1);
    });
  });

  describe("POST /api/admin/rbac/assign-role", () => {
    it("returns 401 when unauthenticated", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce(null);
      const req = new NextRequest("http://localhost:3000/api/admin/rbac/assign-role", {
        method: "POST",
        body: JSON.stringify({ targetUserId: "u-2", role: "CUSTOMER", action: "ASSIGN" }),
      });
      const res = await assignRoleRoute(req);
      expect(res.status).toBe(401);
    });

    it("returns 403 when customer tries to assign roles", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce({
        id: "cust-1",
        roles: ["CUSTOMER"],
        displayName: "Customer Charlie",
        status: "ACTIVE",
      });
      const req = new NextRequest("http://localhost:3000/api/admin/rbac/assign-role", {
        method: "POST",
        body: JSON.stringify({ targetUserId: "u-2", role: "CUSTOMER", action: "ASSIGN" }),
      });
      const res = await assignRoleRoute(req);
      expect(res.status).toBe(403);
    });

    it("returns 403 when non-SuperAdmin attempts privilege escalation to SUPER_ADMIN", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce({
        id: "ops-1",
        roles: ["OPERATIONS_ADMIN"],
        displayName: "Ops Admin",
        status: "ACTIVE",
      });
      const req = new NextRequest("http://localhost:3000/api/admin/rbac/assign-role", {
        method: "POST",
        body: JSON.stringify({ targetUserId: "u-2", role: "SUPER_ADMIN", action: "ASSIGN" }),
      });
      const res = await assignRoleRoute(req);
      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.message).toContain("permission");
    });

    it("returns 400 when missing required fields", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce({
        id: "super-1",
        roles: ["SUPER_ADMIN"],
        displayName: "Super Admin",
        status: "ACTIVE",
      });
      const req = new NextRequest("http://localhost:3000/api/admin/rbac/assign-role", {
        method: "POST",
        body: JSON.stringify({ targetUserId: "u-2" }),
      });
      const res = await assignRoleRoute(req);
      expect(res.status).toBe(400);
    });

    it("returns 200 when SUPER_ADMIN assigns role", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce({
        id: "super-1",
        roles: ["SUPER_ADMIN"],
        displayName: "Super Admin",
        status: "ACTIVE",
      });
      const req = new NextRequest("http://localhost:3000/api/admin/rbac/assign-role", {
        method: "POST",
        body: JSON.stringify({
          targetUserId: "u-2",
          role: "OPERATIONS_ADMIN",
          action: "ASSIGN",
          reason: "Promotion to Operations Lead",
        }),
      });
      const res = await assignRoleRoute(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
    });
  });

  describe("POST /api/admin/rbac/permissions", () => {
    it("returns 401 when unauthenticated", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce(null);
      const req = new NextRequest("http://localhost:3000/api/admin/rbac/permissions", {
        method: "POST",
        body: JSON.stringify({ targetUserId: "u-2", permission: "finance:refund", action: "GRANT" }),
      });
      const res = await permissionsRoute(req);
      expect(res.status).toBe(401);
    });

    it("returns 403 when non-SUPER_ADMIN tries to manage custom permissions", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce({
        id: "ops-1",
        roles: ["OPERATIONS_ADMIN"],
        displayName: "Ops Admin",
        status: "ACTIVE",
      });
      const req = new NextRequest("http://localhost:3000/api/admin/rbac/permissions", {
        method: "POST",
        body: JSON.stringify({
          targetUserId: "u-2",
          permission: "finance:refund",
          action: "GRANT",
          reason: "Need refund authority",
        }),
      });
      const res = await permissionsRoute(req);
      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.message).toContain("Super Admin privileges required");
    });

    it("returns 400 when invalid permission is requested", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce({
        id: "super-1",
        roles: ["SUPER_ADMIN"],
        displayName: "Super Admin",
        status: "ACTIVE",
      });
      const req = new NextRequest("http://localhost:3000/api/admin/rbac/permissions", {
        method: "POST",
        body: JSON.stringify({
          targetUserId: "u-2",
          permission: "invalid:permission",
          action: "GRANT",
          reason: "Testing",
        }),
      });
      const res = await permissionsRoute(req);
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.message).toContain("Invalid permission");
    });

    it("returns 200 when SUPER_ADMIN grants custom permission", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce({
        id: "super-1",
        roles: ["SUPER_ADMIN"],
        displayName: "Super Admin",
        status: "ACTIVE",
      });
      const req = new NextRequest("http://localhost:3000/api/admin/rbac/permissions", {
        method: "POST",
        body: JSON.stringify({
          targetUserId: "u-2",
          permission: "finance:refund",
          action: "GRANT",
          reason: "Authorized temporary override for holiday support",
        }),
      });
      const res = await permissionsRoute(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
    });
  });

  describe("GET /api/admin/rbac/audit-logs", () => {
    it("returns 401 when unauthenticated", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce(null);
      const req = new NextRequest("http://localhost:3000/api/admin/rbac/audit-logs");
      const res = await auditLogsRoute(req);
      expect(res.status).toBe(401);
    });

    it("returns 403 when customer tries to read audit logs", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce({
        id: "cust-1",
        roles: ["CUSTOMER"],
        displayName: "Customer Charlie",
        status: "ACTIVE",
      });
      const req = new NextRequest("http://localhost:3000/api/admin/rbac/audit-logs");
      const res = await auditLogsRoute(req);
      expect(res.status).toBe(403);
    });

    it("returns 200 with audit logs for SUPER_ADMIN", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce({
        id: "super-1",
        roles: ["SUPER_ADMIN"],
        displayName: "Super Admin",
        status: "ACTIVE",
      });
      const req = new NextRequest("http://localhost:3000/api/admin/rbac/audit-logs");
      const res = await auditLogsRoute(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.logs).toHaveLength(1);
      expect(body.total).toBe(1);
    });
  });
});
