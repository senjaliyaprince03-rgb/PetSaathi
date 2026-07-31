import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";
import { POST as PartnerPOST, GET as PartnerListGET } from "@/app/api/admin/partners/route";
import { GET as PartnerGET, PATCH as PartnerPATCH } from "@/app/api/admin/partners/[id]/route";
import { POST as LocationPOST } from "@/app/api/admin/partners/[id]/locations/route";
import { POST as VerificationPOST } from "@/app/api/admin/partners/[id]/verifications/route";
import { POST as ServicePOST } from "@/app/api/admin/partners/[id]/services/route";
import { createPartnerOrder } from "@/modules/partners/order-workflow";
import { GateStatus } from "@prisma/client";

vi.mock("@/modules/auth/server", () => ({
  getAdminSession: vi.fn().mockResolvedValue("admin-123"),
}));
vi.mock("@/modules/auth/session", () => ({
  getCurrentIdentity: vi.fn().mockResolvedValue({ id: "admin-123", roles: ["SUPER_ADMIN", "PARTNER_MANAGER"] }),
}));

describe("Phase 8: Partner Management Integration", () => {
  let partnerId: string;
  let serviceId: string;
  let customerId: string;

  beforeEach(async () => {
    // Create a dummy customer
    const user = await prisma.user.create({
      data: {
        email: "test_customer@example.com",
        displayName: "Test Customer",
        roles: { create: [{ role: "CUSTOMER" }] },
        authUserId: randomUUID()
      }
    });
    customerId = user.id;
  });

  afterEach(async () => {
    await prisma.partnerOrder.deleteMany();
    await prisma.partnerService.deleteMany();
    await prisma.partnerVerification.deleteMany();
    await prisma.partnerLocation.deleteMany();
    await prisma.partner.deleteMany();
    await prisma.user.delete({ where: { id: customerId } });
  });

  it("should create a partner, location, verification, and service, and then allow an order", async () => {
    // 1. Create Partner
    const partnerReq = new NextRequest("http://localhost/api/admin/partners", {
      method: "POST",
      body: JSON.stringify({
        slug: "vet-support-clinic",
        legalName: "Vet Support Clinic Pvt Ltd",
        displayName: "Vet Support Clinic",
        category: "VET_SUPPORT"
      })
    });
    const resPartner = await PartnerPOST(partnerReq);
    expect(resPartner.status).toBe(201);
    const dataPartner = await resPartner.json();
    partnerId = dataPartner.id;
    expect(dataPartner.status).toBe(GateStatus.DRAFT);

    // 2. Add Location
    const locReq = new NextRequest(`http://localhost/api/admin/partners/${partnerId}/locations`, {
      method: "POST",
      body: JSON.stringify({
        name: "Main Branch",
        address: { street: "123 Main St", zip: "560001" }
      })
    });
    const resLoc = await LocationPOST(locReq, { params: Promise.resolve({ id: partnerId }) });
    expect(resLoc.status).toBe(201);

    // 3. Add Service
    const srvReq = new NextRequest(`http://localhost/api/admin/partners/${partnerId}/services`, {
      method: "POST",
      body: JSON.stringify({
        serviceCode: "VET_SUPPORT"
      })
    });
    const resSrv = await ServicePOST(srvReq, { params: Promise.resolve({ id: partnerId }) });
    expect(resSrv.status).toBe(201);
    const dataSrv = await resSrv.json();
    serviceId = dataSrv.id;

    // 4. Activate Service manually (or via patch, but let's assume it was activated)
    await prisma.partnerService.update({ where: { id: serviceId }, data: { status: "ACTIVE" } });

    // 5. Verify the partner order creation FAILS if partner is not verified
    await expect(createPartnerOrder(customerId, { partnerServiceId: serviceId }))
      .rejects.toThrow("This partner service is not available for controlled requests.");

    // 6. Record Verification (Passing)
    const verReq = new NextRequest(`http://localhost/api/admin/partners/${partnerId}/verifications`, {
      method: "POST",
      body: JSON.stringify({
        type: "LICENSE_CHECK",
        status: "PASSED"
      })
    });
    const resVer = await VerificationPOST(verReq, { params: Promise.resolve({ id: partnerId }) });
    expect(resVer.status).toBe(201);

    // 7. Verify the partner is now ACTIVE
    const resGet = await PartnerGET(new Request(`http://localhost/api/admin/partners/${partnerId}`), { params: Promise.resolve({ id: partnerId }) });
    const dataGet = await resGet.json();
    expect(dataGet.status).toBe("ACTIVE");

    // 8. Verify partner order creation SUCCEEDS now
    const order = await createPartnerOrder(customerId, { partnerServiceId: serviceId });
    expect(order.status).toBe("REQUESTED");
    expect(order.metadata).toMatchObject({ commercialStatus: "REQUEST_ONLY" });
  });
});
