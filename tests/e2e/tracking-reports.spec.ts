import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

test.afterAll(async () => {
  await prisma.$disconnect();
});

test.describe("Tracking and Reports Models Verification", () => {
  test("Can create a TrackingSession with TrackingPoints", async () => {
    // 1. Create dependencies
    const customer = await prisma.user.create({
      data: { email: `tracking-${Date.now()}@test.com`, displayName: "Tracker Test" }
    });
    
    const pet = await prisma.pet.create({
      data: { ownerId: customer.id, name: "Rover", species: "DOG", active: true }
    });

    const serviceType = await prisma.serviceType.upsert({
      where: { code: "DOG_WALK_30" },
      update: {},
      create: { code: "DOG_WALK_30", name: "30-Min Dog Walk", description: "S", durationMinutes: 30, basePricePaise: 1000, active: true }
    });

    const address = await prisma.address.create({
      data: { userId: customer.id, label: "Home", line1: "123", locality: "Test", city: "Test", state: "State", postalCode: "000" }
    });

    const booking = await prisma.booking.create({
      data: {
        reference: `B-TRK-${Date.now()}`,
        status: "CONFIRMED",
        customerId: customer.id,
        petId: pet.id,
        serviceTypeId: serviceType.id,
        addressId: address.id,
        scheduledStart: new Date(),
        scheduledEnd: new Date(Date.now() + 1800000),
        quoteAmountPaise: 1180,
        currency: "INR"
      }
    });

    // 2. Create TrackingSession
    const session = await prisma.trackingSession.create({
      data: {
        bookingId: booking.id,
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 3600000),
        consentBasis: "SERVICE_FULFILMENT_BROWSER_PERMISSION",
        status: "ACTIVE",
        distanceM: 0
      }
    });
    
    expect(session.id).toBeDefined();

    // 3. Add TrackingPoint
    const point = await prisma.trackingPoint.create({
      data: {
        sessionId: session.id,
        latitude: 12.9716,
        longitude: 77.5946,
        accuracyM: 5,
        recordedAt: new Date()
      }
    });

    expect(point.id).toBeDefined();
    expect(point.latitude).toBe(12.9716);
  });

  test("Can create a ServiceEvent and BookingReport with ReportMedia", async () => {
    // 1. Create dependencies
    const customer = await prisma.user.create({
      data: { email: `report-${Date.now()}@test.com`, displayName: "Report Test" }
    });
    
    const sitter = await prisma.user.create({
      data: { email: `sitter-${Date.now()}@test.com`, displayName: "Sitter Test" }
    });

    const pet = await prisma.pet.create({
      data: { ownerId: customer.id, name: "Rex", species: "DOG", active: true }
    });

    const serviceType = await prisma.serviceType.upsert({
      where: { code: "DOG_WALK_30" },
      update: {},
      create: { code: "DOG_WALK_30", name: "30-Min Dog Walk", description: "S", durationMinutes: 30, basePricePaise: 1000, active: true }
    });

    const address = await prisma.address.create({
      data: { userId: customer.id, label: "Home", line1: "123", locality: "Test", city: "Test", state: "State", postalCode: "000" }
    });

    const booking = await prisma.booking.create({
      data: {
        reference: `B-REP-${Date.now()}`,
        status: "IN_PROGRESS",
        customerId: customer.id,
        petId: pet.id,
        serviceTypeId: serviceType.id,
        addressId: address.id,
        scheduledStart: new Date(),
        scheduledEnd: new Date(Date.now() + 1800000),
        quoteAmountPaise: 1180,
        currency: "INR"
      }
    });

    // 2. Create ServiceEvent
    const serviceEvent = await prisma.serviceEvent.create({
      data: {
        bookingId: booking.id,
        actorId: sitter.id,
        type: "CHECK_IN",
        latitude: 12.9716,
        longitude: 77.5946,
        notes: "Arrived at location"
      }
    });

    expect(serviceEvent.id).toBeDefined();
    expect(serviceEvent.type).toBe("CHECK_IN");

    // 3. Create BookingReport
    const report = await prisma.bookingReport.create({
      data: {
        bookingId: booking.id,
        submittedBy: sitter.id,
        fields: { mood: "happy", pee: true, poop: false, notes: "Good boy!" },
        concernFlag: false,
        reviewStatus: "PENDING"
      }
    });

    expect(report.id).toBeDefined();

    // 4. Create ReportMedia
    const media = await prisma.reportMedia.create({
      data: {
        reportId: report.id,
        objectPath: "reports/images/dog-walking-1.jpg",
        mediaType: "image/jpeg",
        capturedAt: new Date()
      }
    });

    expect(media.id).toBeDefined();
    expect(media.objectPath).toContain("dog-walking");
  });
});
