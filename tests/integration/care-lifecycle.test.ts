import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { prisma } from "@/lib/db";
import { createBookingWithQuote } from "@/modules/bookings/create-booking";
import { indiaServiceDate } from "@/modules/pricing/economics";
import { reviewBookingReport } from "@/modules/reports/review-report";
import { submitBookingReport } from "@/modules/reports/submit-report";

describe("care report to closure lifecycle", () => {
  const suffix = randomUUID().slice(0, 8);
  const ids = { customer: "", sitterUser: "", sitter: "", admin: "", pet: "", address: "", city: "", area: "", price: "", capacity: "", booking: "", assignment: "", firstReport: "", correctedReport: "" };
  const scheduledStart = new Date(Date.now() + 72 * 60 * 60_000);

  beforeAll(async () => {
    const [customer, sitterUser, admin] = await Promise.all([
      prisma.user.create({ data: { email: `care-customer-${suffix}@example.test`, displayName: "Care Customer", status: "ACTIVE" } }),
      prisma.user.create({ data: { email: `care-sitter-${suffix}@example.test`, displayName: "Care Saathi", status: "ACTIVE" } }),
      prisma.user.create({ data: { email: `care-admin-${suffix}@example.test`, displayName: "Care Reviewer", status: "ACTIVE" } })
    ]);
    const sitter = await prisma.sitterProfile.create({ data: { userId: sitterUser.id, status: "APPROVED", approvedAt: new Date() } });
    const pet = await prisma.pet.create({ data: { ownerId: customer.id, name: "Milo", species: "DOG", active: true } });
    const address = await prisma.address.create({ data: { userId: customer.id, label: "Home", line1: "14 Review Street", locality: `Locality ${suffix}`, city: `City ${suffix}`, state: "Gujarat", postalCode: "999000" } });
    const city = await prisma.city.create({ data: { slug: `care-city-${suffix}`, name: `City ${suffix}`, state: "Gujarat", status: "PUBLIC_LIMITED", launchedAt: new Date() } });
    const area = await prisma.serviceArea.create({ data: { cityId: city.id, slug: `care-area-${suffix}`, name: `Area ${suffix}`, postalCodes: ["999000"], status: "ACTIVE" } });
    const service = await prisma.serviceType.findUniqueOrThrow({ where: { code: "DOG_WALK_30" } });
    const price = await prisma.servicePrice.create({ data: { serviceTypeId: service.id, serviceAreaId: area.id, version: 1, amountPaise: 10_000, sitterPaise: 7_000, taxBasisPoints: 1_800, effectiveAt: new Date(Date.now() - 60_000), approvedBy: admin.id } });
    const capacity = await prisma.capacityLimit.create({ data: { serviceAreaId: area.id, serviceCode: service.code, serviceDate: indiaServiceDate(scheduledStart), maximum: 2, reason: "Care lifecycle integration roster" } });
    const booking = await createBookingWithQuote(customer.id, { petId: pet.id, addressId: address.id, serviceCode: "DOG_WALK_30", servicePriceId: price.id, scheduledStart: scheduledStart.toISOString() });
    const assignment = await prisma.bookingAssignment.create({ data: { bookingId: booking.id, sitterId: sitter.id, type: "PRIMARY", status: "ACTIVE", respondedAt: new Date(), activatedAt: new Date(), payoutPaise: price.sitterPaise } });
    await prisma.booking.update({ where: { id: booking.id }, data: { status: "REPORT_PENDING" } });
    Object.assign(ids, { customer: customer.id, sitterUser: sitterUser.id, sitter: sitter.id, admin: admin.id, pet: pet.id, address: address.id, city: city.id, area: area.id, price: price.id, capacity: capacity.id, booking: booking.id, assignment: assignment.id });
  });

  afterAll(async () => {
    await prisma.notificationOutbox.deleteMany({ where: { OR: [{ destination: { in: [ids.customer, ids.sitterUser, "operations-queue", "safety-queue"] } }, { idempotencyKey: { contains: ids.booking } }] } });
    const resourceIds = [ids.firstReport, ids.correctedReport, ids.booking].filter(Boolean);
    if (ids.admin || resourceIds.length > 0) {
      await prisma.auditLog.deleteMany({ where: { OR: [
        ...(ids.admin ? [{ actorId: ids.admin }] : []),
        ...(resourceIds.length > 0 ? [{ resourceId: { in: resourceIds } }] : [])
      ] } });
    }
    if (ids.booking) {
      await prisma.payoutAdjustment.deleteMany({ where: { payout: { bookingId: ids.booking } } });
      await prisma.payout.deleteMany({ where: { bookingId: ids.booking } });
      await prisma.bookingReport.deleteMany({ where: { bookingId: ids.booking } });
      await prisma.bookingAssignment.deleteMany({ where: { bookingId: ids.booking } });
      await prisma.capacityReservation.deleteMany({ where: { bookingId: ids.booking } });
      await prisma.priceQuote.deleteMany({ where: { bookingId: ids.booking } });
      await prisma.bookingStatusHistory.deleteMany({ where: { bookingId: ids.booking } });
      await prisma.booking.deleteMany({ where: { id: ids.booking } });
    }
    if (ids.capacity) await prisma.capacityLimit.deleteMany({ where: { id: ids.capacity } });
    if (ids.price) await prisma.servicePrice.deleteMany({ where: { id: ids.price } });
    if (ids.area) await prisma.serviceArea.deleteMany({ where: { id: ids.area } });
    if (ids.city) await prisma.city.deleteMany({ where: { id: ids.city } });
    if (ids.pet) await prisma.pet.deleteMany({ where: { id: ids.pet } });
    if (ids.address) await prisma.address.deleteMany({ where: { id: ids.address } });
    if (ids.sitter) await prisma.sitterProfile.deleteMany({ where: { id: ids.sitter } });
    const userIds = [ids.customer, ids.sitterUser, ids.admin].filter(Boolean);
    if (userIds.length > 0) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it("creates a pending payout and completed booking after the first report", async () => {
    const report = await submitBookingReport(ids.assignment, ids.sitterUser, { summary: "Milo completed the full walk, drank water and returned home settled.", behaviour: "Calm throughout the route.", concernFlag: false });
    ids.firstReport = report.id;
    expect(report).toMatchObject({ version: 1, reviewStatus: "PENDING" });
    expect((await prisma.booking.findUniqueOrThrow({ where: { id: ids.booking } })).status).toBe("COMPLETED");
    expect(await prisma.payout.findUnique({ where: { bookingId_sitterId: { bookingId: ids.booking, sitterId: ids.sitter } } })).toMatchObject({ amountPaise: 7_000, status: "PENDING" });
  });

  it("holds payout for correction and accepts a new version", async () => {
    const correction = await reviewBookingReport(ids.firstReport, { id: ids.admin, roles: ["OPERATIONS_ADMIN"] }, { action: "REQUEST_CORRECTION", note: "Please add the water and handover observations before closure." });
    expect(correction.report.reviewStatus).toBe("CORRECTION_REQUIRED");
    expect((await prisma.payout.findFirstOrThrow({ where: { bookingId: ids.booking } })).status).toBe("HELD");
    const corrected = await submitBookingReport(ids.assignment, ids.sitterUser, { summary: "Milo completed the walk, drank fresh water, and was handed back calmly at home.", water: "Fresh bowl refilled after the walk.", behaviour: "Calm handover with no concern.", concernFlag: false });
    ids.correctedReport = corrected.id;
    expect(corrected).toMatchObject({ version: 2, reviewStatus: "PENDING" });
  });

  it("closes the booking and consumes capacity only after approval", async () => {
    const approved = await reviewBookingReport(ids.correctedReport, { id: ids.admin, roles: ["OPERATIONS_ADMIN"] }, { action: "APPROVE", note: "Corrected report, service evidence and handover details were reviewed." });
    expect(approved).toMatchObject({ bookingStatus: "CLOSED", report: { reviewStatus: "APPROVED" } });
    expect((await prisma.booking.findUniqueOrThrow({ where: { id: ids.booking } })).status).toBe("CLOSED");
    expect((await prisma.capacityReservation.findUniqueOrThrow({ where: { bookingId: ids.booking } })).status).toBe("CONSUMED");
    expect((await prisma.payout.findFirstOrThrow({ where: { bookingId: ids.booking } })).status).toBe("HELD");
  });
});
