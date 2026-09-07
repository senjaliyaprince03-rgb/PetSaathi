import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { PrismaClient, BookingStatus, RiskLevel, SitterStatus, PermissionStatus, type ServiceCode } from "@prisma/client";
import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { GET as MatchGET, POST as MatchPOST } from "@/app/api/admin/bookings/[id]/match/route";

const testIdentity = vi.hoisted(() => ({ id: "", roles: ["OPERATIONS_ADMIN"] as const }));
vi.mock("@/modules/auth/session", () => ({
  getCurrentIdentity: vi.fn(() => Promise.resolve(testIdentity)),
  // Real semantics so route-level RBAC behaves as in production.
  hasAnyRole: (identity: { roles: readonly string[] } | null, allowed: readonly string[]) =>
    Boolean(identity?.roles?.some((role) => (allowed as readonly string[]).includes(role))),
}));

const prisma = new PrismaClient();

describe("Phase 11: Assisted Matching Integration", () => {
  let customerId: string;
  let sitterId: string;
  let sitterUserId: string;
  let adminId: string;
  let petId: string;
  let addressId: string;
  let serviceTypeId: string;
  let serviceTypeCode: ServiceCode;
  let bookingId: string;

  beforeEach(async () => {
    // Admin
    const admin = await prisma.user.create({
      data: {
        email: `admin_${randomUUID()}@petsaathi.in`,
        displayName: "Admin",
        roles: { create: [{ role: "OPERATIONS_ADMIN" }] }
      }
    });
    adminId = admin.id;
    testIdentity.id = adminId;

    // Customer
    const customer = await prisma.user.create({
      data: {
        email: `customer_${randomUUID()}@petsaathi.in`,
        displayName: "Customer",
        roles: { create: [{ role: "CUSTOMER" }] }
      }
    });
    customerId = customer.id;

    // Service Type — canonical enum code shared by the whole catalogue.
    // Isolation comes from purging every permission for it below so ONLY this
    // test's sitter is eligible, regardless of seed or cross-file leftovers.
    const serviceType = await prisma.serviceType.upsert({
      where: { code: "DOG_WALK_30" },
      update: {},
      create: {
        code: "DOG_WALK_30",
        name: "Dog Walking 30m",
        description: "30 min walk",
        basePricePaise: 20000,
      }
    });
    serviceTypeId = serviceType.id;
    serviceTypeCode = serviceType.code;
    await prisma.sitterServicePermission.deleteMany({ where: { serviceTypeId } });

    // Pet
    const pet = await prisma.pet.create({
      data: {
        ownerId: customerId,
        name: "Buddy",
        species: "Dog",
        breed: "Golden Retriever",
        birthDate: new Date("2020-01-01"),
        weightKg: 30,
        riskAssessments: {
          create: [{
            serviceCode: serviceTypeCode,
            suggestedLevel: RiskLevel.GREEN,
            finalLevel: RiskLevel.GREEN,
            factorSnapshot: {}
          }]
        }
      }
    });
    petId = pet.id;

    // Address
    const address = await prisma.address.create({
      data: {
        user: { connect: { id: customerId } },
        line1: "123 Main St",
        locality: "Downtown",
        city: "Ahmedabad",
        state: "Gujarat",
        postalCode: "380001",
        label: "Home",
      }
    });
    addressId = address.id;

    // Sitter
    const sitterUser = await prisma.user.create({
      data: {
        email: `sitter_${randomUUID()}@petsaathi.in`,
        displayName: "Sitter",
        roles: { create: [{ role: "SITTER" }] }
      }
    });
    sitterUserId = sitterUser.id;
    const sitter = await prisma.sitterProfile.create({
      data: {
        userId: sitterUser.id,
        status: SitterStatus.APPROVED,
        yearsExperience: 2,
        reliabilityScore: 98.5
      }
    });
    sitterId = sitter.id;

    // Sitter Permission
    await prisma.sitterServicePermission.create({
      data: {
        sitterId,
        serviceTypeId,
        status: PermissionStatus.ACTIVE,
        riskLimit: RiskLevel.YELLOW,
      }
    });

    // Booking
    const booking = await prisma.booking.create({
      data: {
        reference: `BKG-${randomUUID().substring(0, 8)}`,
        customerId,
        petId,
        serviceTypeId,
        addressId,
        status: BookingStatus.REQUESTED,
        scheduledStart: new Date(),
        scheduledEnd: new Date(Date.now() + 30 * 60 * 1000),
        quoteAmountPaise: 20000,
      }
    });
    bookingId = booking.id;
  });

  afterEach(async () => {
    // Scope every delete to rows this test created: global deleteMany()s
    // collide with bookings that other spec files legitimately still own.
    await prisma.auditLog.deleteMany({ where: { OR: [{ actorId: adminId }, { resourceType: "booking", resourceId: bookingId }] } });
    await prisma.bookingAssignment.deleteMany({ where: { bookingId } });
    if (bookingId) {
      await prisma.payment.deleteMany({ where: { bookingId } });
      await prisma.bookingStatusHistory.deleteMany({ where: { bookingId } });
      await prisma.booking.deleteMany({ where: { id: bookingId } });
    }
    await prisma.sitterServicePermission.deleteMany({ where: { sitterId } });
    await prisma.sitterProfile.deleteMany({ where: { id: sitterId } });
    await prisma.address.deleteMany({ where: { id: addressId } });
    await prisma.petHealthEvent.deleteMany({ where: { petId } });
    await prisma.petRiskAssessment.deleteMany({ where: { petId } });
    await prisma.pet.deleteMany({ where: { id: petId } });
    await prisma.user.deleteMany({ where: { id: { in: [adminId, customerId, sitterUserId].filter(Boolean) } } });
    bookingId = "";
  });

  it("should match an eligible sitter and allow proposing them", async () => {
    // 1. Get matches
    const getReq = new NextRequest(`http://localhost/api/admin/bookings/${bookingId}/match`, {
      method: "GET"
    });
    const getRes = await MatchGET(getReq as any, { params: Promise.resolve({ id: bookingId }) } as any);
    expect(getRes.status).toBe(200);
    const data = await getRes.json();
    
    expect(data.sitters).toBeDefined();
    expect(data.sitters.length).toBe(1);
    expect(data.sitters[0].sitterId).toBe(sitterId);
    expect(data.sitters[0].score).toBeGreaterThan(0); // 2 years * 5 + 98.5 * 10

    // 2. Propose sitter
    const postReq = new NextRequest(`http://localhost/api/admin/bookings/${bookingId}/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sitterId })
    });
    const postRes = await MatchPOST(postReq as any, { params: Promise.resolve({ id: bookingId }) } as any);
    if (postRes.status !== 200) {
      console.error(await postRes.text());
    }
    expect(postRes.status).toBe(200);

    const updatedBookingData = await postRes.json();
    expect(updatedBookingData.booking.status).toBe("SITTER_PROPOSED");

    const assignment = await prisma.bookingAssignment.findFirst({
      where: { bookingId, sitterId }
    });
    expect(assignment).toBeDefined();
    expect(assignment?.status).toBe("OFFERED");
  });
});
