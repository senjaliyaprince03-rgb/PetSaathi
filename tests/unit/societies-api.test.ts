import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { mockGetCurrentIdentity } = vi.hoisted(() => ({
  mockGetCurrentIdentity: vi.fn(),
}));

vi.mock("@/modules/auth/session", () => ({
  getCurrentIdentity: mockGetCurrentIdentity,
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    society: {
      findUnique: vi.fn().mockImplementation(({ where }: { where: { id: string } }) => {
        if (where.id === "society-404") return Promise.resolve(null);
        return Promise.resolve({
          id: where.id,
          name: "Emerald Heights",
          city: "Mumbai",
          status: "ACTIVE",
          members: [],
          sitterPools: [],
          partnerships: [],
        });
      }),
      update: vi.fn().mockResolvedValue({
        id: "society-assigned",
        name: "Emerald Heights",
        status: "ACTIVE",
      }),
    },
    societyMember: {
      findMany: vi.fn().mockResolvedValue([
        { societyId: "society-assigned" },
      ]),
    },
    $transaction: vi.fn().mockImplementation(async (callback) => {
      const tx = {
        society: {
          update: vi.fn().mockResolvedValue({
            id: "society-assigned",
            name: "Emerald Heights Updated",
            status: "ACTIVE",
          }),
        },
        societyAccessRule: {
          upsert: vi.fn().mockResolvedValue({}),
          findUnique: vi.fn().mockResolvedValue(null),
        },
      };
      return callback(tx);
    }),
  },
}));

import { GET, PATCH } from "@/app/api/admin/societies/[id]/route";

describe("Society Admin API — Multi-Tenancy & IDOR Boundaries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/admin/societies/[id]", () => {
    it("returns 401 when unauthenticated", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce(null);
      const req = new NextRequest("http://localhost:3000/api/admin/societies/society-1");
      const res = await GET(req, { params: Promise.resolve({ id: "society-1" }) });
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe("unauthorized");
    });

    it("returns 403 when customer tries to access society", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce({
        id: "cust-1",
        roles: ["CUSTOMER"],
        displayName: "Customer",
        status: "ACTIVE",
      });
      const req = new NextRequest("http://localhost:3000/api/admin/societies/society-1");
      const res = await GET(req, { params: Promise.resolve({ id: "society-1" }) });
      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.error).toBe("forbidden");
    });

    it("returns 403 when SOCIETY_MANAGER attempts cross-society IDOR access", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce({
        id: "sm-1",
        roles: ["SOCIETY_MANAGER"],
        displayName: "Society Manager",
        status: "ACTIVE",
      });
      const req = new NextRequest("http://localhost:3000/api/admin/societies/society-unassigned");
      const res = await GET(req, { params: Promise.resolve({ id: "society-unassigned" }) });
      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.message).toContain("restricted");
    });

    it("returns 200 when SOCIETY_MANAGER accesses their assigned society", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce({
        id: "sm-1",
        roles: ["SOCIETY_MANAGER"],
        displayName: "Society Manager",
        status: "ACTIVE",
      });
      const req = new NextRequest("http://localhost:3000/api/admin/societies/society-assigned");
      const res = await GET(req, { params: Promise.resolve({ id: "society-assigned" }) });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.id).toBe("society-assigned");
    });

    it("returns 200 when SUPER_ADMIN accesses any society (unrestricted)", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce({
        id: "super-1",
        roles: ["SUPER_ADMIN"],
        displayName: "Super Admin",
        status: "ACTIVE",
      });
      const req = new NextRequest("http://localhost:3000/api/admin/societies/society-any");
      const res = await GET(req, { params: Promise.resolve({ id: "society-any" }) });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.id).toBe("society-any");
    });
  });

  describe("PATCH /api/admin/societies/[id]", () => {
    it("returns 403 when SOCIETY_MANAGER attempts update on unassigned society", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce({
        id: "sm-1",
        roles: ["SOCIETY_MANAGER"],
        displayName: "Society Manager",
        status: "ACTIVE",
      });
      const req = new NextRequest("http://localhost:3000/api/admin/societies/society-unassigned", {
        method: "PATCH",
        body: JSON.stringify({ status: "ACTIVE" }),
      });
      const res = await PATCH(req, { params: Promise.resolve({ id: "society-unassigned" }) });
      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.message).toContain("restricted");
    });

    it("returns 200 when SOCIETY_MANAGER updates their assigned society", async () => {
      mockGetCurrentIdentity.mockResolvedValueOnce({
        id: "sm-1",
        roles: ["SOCIETY_MANAGER"],
        displayName: "Society Manager",
        status: "ACTIVE",
      });
      const req = new NextRequest("http://localhost:3000/api/admin/societies/society-assigned", {
        method: "PATCH",
        body: JSON.stringify({ status: "ACTIVE", contactName: "New Contact" }),
      });
      const res = await PATCH(req, { params: Promise.resolve({ id: "society-assigned" }) });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.id).toBe("society-assigned");
    });
  });
});
