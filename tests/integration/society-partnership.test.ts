import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";
import { POST as SocietyPOST } from "@/app/api/admin/societies/route";
import { PATCH as SocietyPATCH, GET as SocietyGET } from "@/app/api/admin/societies/[id]/route";

vi.mock("@/modules/auth/server", () => ({
  getAdminSession: vi.fn().mockResolvedValue("admin-123"),
}));
vi.mock("@/modules/auth/session", () => ({
  getCurrentIdentity: vi.fn().mockResolvedValue({ id: "admin-123", roles: ["SUPER_ADMIN"] }),
  hasAnyRole: vi.fn(() => true),
}));

const SOCIETY_PAYLOAD = {
  slug: "test-society-pilot",
  name: "Green Valley Apartments",
  city: "Bangalore",
  locality: "Koramangala",
  partnershipModel: "MODEL_C",
  address: "Block 1, Green Valley",
  bookingCap: 50,
};

describe("Phase 7: Society Partnerships (Integration)", () => {
  let societyId: string;

  afterEach(async () => {
    await prisma.society.deleteMany({
      where: { slug: "test-society-pilot" }
    });
  });

  it("should create a society with extended fields", async () => {
    const req = new NextRequest("http://localhost/api/admin/societies", {
      method: "POST",
      body: JSON.stringify(SOCIETY_PAYLOAD),
    });

    const res = await SocietyPOST(req);
    expect(res.status).toBe(201);
    
    const data = await res.json();
    expect(data.society.name).toBe("Green Valley Apartments");
    expect(data.society.partnershipModel).toBe("MODEL_C");
    expect(data.society.bookingCap).toBe(50);
    societyId = data.society.id;
  });

  it("should update society access rules and fetch them correctly", async () => {
    // First create a society
    const society = await prisma.society.create({
      data: { ...SOCIETY_PAYLOAD, status: "DRAFT" }
    });
    societyId = society.id;

    const req = new Request(`http://localhost/api/admin/societies/${societyId}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: "ACTIVE",
        accessRule: {
          visitorApprovalRequired: true,
          petLiftRules: "Use service lift only",
          approvedGates: ["Gate 1", "Gate 2"]
        }
      }),
    });

    const res = await SocietyPATCH(req, { params: Promise.resolve({ id: societyId }) });
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data.status).toBe("ACTIVE");
    expect(data.accessRule).toBeDefined();
    expect(data.accessRule.petLiftRules).toBe("Use service lift only");
    expect(data.accessRule.approvedGates).toEqual(["Gate 1", "Gate 2"]);
  });

  it("should verify society read returns nested pools and rules", async () => {
    // First create a society and access rules
    const society = await prisma.society.create({
      data: { ...SOCIETY_PAYLOAD, status: "DRAFT" }
    });
    societyId = society.id;

    await prisma.societyAccessRule.create({
      data: {
        societyId,
        visitorApprovalRequired: true,
        sitterRegistrationRequired: false
      }
    });

    const req = new Request(`http://localhost/api/admin/societies/${societyId}`, {
      method: "GET"
    });

    const res = await SocietyGET(req, { params: Promise.resolve({ id: societyId }) });
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data.accessRule).toBeDefined();
    expect(data.accessRule.visitorApprovalRequired).toBe(true);
    expect(data.accessRule.sitterRegistrationRequired).toBe(false);
  });
});
