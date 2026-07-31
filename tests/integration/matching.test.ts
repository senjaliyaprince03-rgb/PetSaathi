import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { PrismaClient, BookingStatus, RiskLevel, SitterStatus, PermissionStatus } from "@prisma/client";
import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { GET as MatchGET, POST as MatchPOST } from "@/app/api/admin/bookings/[id]/match/route";

const prisma = new PrismaClient();

describe("Phase 11: Assisted Matching Integration", () => {
  let customerId: string;
  let sitterId: string;
  let adminId: string;
  let petId: string;
  let addressId: string;
  let serviceTypeId: string;
  let bookingId: string;

  beforeEach(async () => {
    // Admin
    const admin = await prisma.user.create({
      data: {
        email: `admin_${randomUUID()}@petsaathi.in`,
        displayName: "Admin",
        authUserId: randomUUID(),
        roles: { create: [{ role: "OPERATIONS_ADMIN" }] }
      }
    });
    adminId = admin.id;

    // Customer
    const customer = await prisma.user.create({
      data: {
        email: `customer_${randomUUID()}@petsaathi.in`,
        displayName: "Customer",
        authUserId: randomUUID(),
        roles: { create: [{ role: "CUSTOMER" }] }
      }
    });
    customerId = customer.id;

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
            serviceCode: "DOG_WALK_30",
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
        authUserId: randomUUID(),
        roles: { create: [{ role: "SITTER" }] }
      }
    });
    const sitter = await prisma.sitterProfile.create({
      data: {
        userId: sitterUser.id,
        status: SitterStatus.APPROVED,
        yearsExperience: 2,
        reliabilityScore: 98.5
      }
    });
    sitterId = sitter.id;

    // Service Type
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
    await prisma.auditLog.deleteMany();
    await prisma.bookingAssignment.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.sitterServicePermission.deleteMany();
    await prisma.sitterProfile.deleteMany();
    await prisma.address.deleteMany();
    await prisma.petHealthEvent.deleteMany();
    await prisma.petRiskAssessment.deleteMany();
    await prisma.pet.deleteMany();
    await prisma.user.deleteMany();
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
      body: JSON.stringify({ sitterId, adminId })
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
