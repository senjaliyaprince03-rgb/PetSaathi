import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { prisma } from "@/lib/db";
import { approveCustomerAssignment } from "@/modules/bookings/approve-assignment";
import { markSitterNoShow } from "@/modules/bookings/recovery";
import { createBookingWithQuote } from "@/modules/bookings/create-booking";
import { createIncidentCorrectiveAction, completeIncidentCorrectiveAction, IncidentWorkflowError, recordIncidentEvent, reportBookingIncident, transitionIncident } from "@/modules/incidents/workflow";
import { syncIncidentNotificationStatus } from "@/modules/notifications/incident-delivery";
import { indiaServiceDate } from "@/modules/pricing/economics";

describe("incident response and replacement recovery", () => {
  const suffix = randomUUID().slice(0, 8);
  const ids = { customer: "", sitterUser: "", sitter: "", safety: "", pet: "", address: "", city: "", area: "", price: "", capacity: "", booking: "", assignment: "", replacementAssignment: "", payment: "", incident: "", correctiveAction: "" };
  const scheduledStart = new Date(Date.now() + 48 * 60 * 60_000);

  beforeAll(async () => {
    const [customer, sitterUser, safety] = await Promise.all([
      prisma.user.create({ data: { email: `safety-customer-${suffix}@example.test`, displayName: "Safety Customer", status: "ACTIVE" } }),
      prisma.user.create({ data: { email: `safety-sitter-${suffix}@example.test`, displayName: "Safety Saathi", status: "ACTIVE" } }),
      prisma.user.create({ data: { email: `safety-admin-${suffix}@example.test`, displayName: "Safety Admin", status: "ACTIVE", roles: { create: { role: "SAFETY_ADMIN" } } } })
    ]);
    const sitter = await prisma.sitterProfile.create({ data: { userId: sitterUser.id, status: "APPROVED", approvedAt: new Date() } });
    const pet = await prisma.pet.create({ data: { ownerId: customer.id, name: "Milo", species: "DOG", active: true } });
    const address = await prisma.address.create({ data: { userId: customer.id, label: "Home", line1: "17 Safety Street", locality: `Locality ${suffix}`, city: `City ${suffix}`, state: "Gujarat", postalCode: "999000" } });
    const city = await prisma.city.create({ data: { slug: `safety-city-${suffix}`, name: `City ${suffix}`, state: "Gujarat", status: "PUBLIC_LIMITED", launchedAt: new Date() } });
    const area = await prisma.serviceArea.create({ data: { cityId: city.id, slug: `safety-area-${suffix}`, name: `Area ${suffix}`, postalCodes: ["999000"], status: "ACTIVE" } });
    const service = await prisma.serviceType.findUniqueOrThrow({ where: { code: "DOG_WALK_30" } });
    const price = await prisma.servicePrice.create({ data: { serviceTypeId: service.id, serviceAreaId: area.id, version: 1, amountPaise: 10_000, sitterPaise: 7_000, taxBasisPoints: 1_800, effectiveAt: new Date(Date.now() - 60_000), approvedBy: safety.id } });
    const capacity = await prisma.capacityLimit.create({ data: { serviceAreaId: area.id, serviceCode: service.code, serviceDate: indiaServiceDate(scheduledStart), maximum: 2, reason: "Safety recovery integration roster" } });
    const booking = await createBookingWithQuote(customer.id, { petId: pet.id, addressId: address.id, serviceCode: "DOG_WALK_30", servicePriceId: price.id, scheduledStart: scheduledStart.toISOString() });
    const assignment = await prisma.bookingAssignment.create({ data: { bookingId: booking.id, sitterId: sitter.id, type: "PRIMARY", status: "CUSTOMER_APPROVED", respondedAt: new Date(), payoutPaise: price.sitterPaise } });
    const payment = await prisma.payment.create({ data: { bookingId: booking.id, providerOrderId: `order_safety_${suffix}`, providerPaymentId: `pay_safety_${suffix}`, amountPaise: booking.quoteAmountPaise, status: "CAPTURED", signatureVerified: true, capturedAt: new Date() } });
    await prisma.booking.update({ where: { id: booking.id }, data: { status: "CONFIRMED" } });
    Object.assign(ids, { customer: customer.id, sitterUser: sitterUser.id, sitter: sitter.id, safety: safety.id, pet: pet.id, address: address.id, city: city.id, area: area.id, price: price.id, capacity: capacity.id, booking: booking.id, assignment: assignment.id, payment: payment.id });
  });

  afterAll(async () => {
    await prisma.notificationOutbox.deleteMany({ where: { OR: [{ destination: { in: [ids.customer, ids.sitterUser, "operations-queue", "safety-queue"] } }, { idempotencyKey: { contains: ids.booking } }, { idempotencyKey: { contains: ids.incident } }] } });
    const actorIds = [ids.customer, ids.sitterUser, ids.safety].filter(Boolean);
    const resourceIds = [ids.booking, ids.assignment, ids.incident, ids.correctiveAction].filter(Boolean);
    if (actorIds.length > 0 || resourceIds.length > 0) {
      await prisma.auditLog.deleteMany({ where: { OR: [
        ...(actorIds.length > 0 ? [{ actorId: { in: actorIds } }] : []),
        ...(resourceIds.length > 0 ? [{ resourceId: { in: resourceIds } }] : [])
      ] } });
    }
    if (ids.booking) {
      await prisma.incident.deleteMany({ where: { bookingId: ids.booking } });
      await prisma.payment.deleteMany({ where: { bookingId: ids.booking } });
      await prisma.bookingAssignment.deleteMany({ where: { bookingId: ids.booking } });
      await prisma.capacityReservation.deleteMany({ where: { bookingId: ids.booking } });
      await prisma.priceQuote.deleteMany({ where: { bookingId: ids.booking } });
      await prisma.serviceEvent.deleteMany({ where: { bookingId: ids.booking } });
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
    if (actorIds.length > 0) await prisma.user.deleteMany({ where: { id: { in: actorIds } } });
    await prisma.$disconnect();
  });

  it("rejects a second active primary or replacement assignment at the database boundary", async () => {
    await expect(prisma.bookingAssignment.create({ data: { bookingId: ids.booking, sitterId: ids.sitter, type: "REPLACEMENT", status: "OFFERED", payoutPaise: 7_000 } })).rejects.toMatchObject({ code: "P2002" });
  });

  it("holds the booking, enforces review and corrective action, then resumes care", async () => {
    const reported = await reportBookingIncident(ids.booking, { id: ids.customer, roles: ["CUSTOMER"] }, { category: "INJURY", severity: "HIGH", description: "Milo developed a visible paw injury during the active care handover." });
    ids.incident = reported.incident.id;
    expect(reported.bookingHeld).toBe(true);
    expect((await prisma.booking.findUniqueOrThrow({ where: { id: ids.booking } })).status).toBe("INCIDENT_HOLD");
    const customerNotice = await prisma.incidentNotification.findFirstOrThrow({ where: { incidentId: ids.incident, recipientRef: ids.customer }, select: { notificationId: true, status: true, sentAt: true, acknowledgedAt: true } });
    expect(customerNotice).toMatchObject({ status: "QUEUED", sentAt: null, acknowledgedAt: null });
    await expect(prisma.incidentNotification.create({ data: { incidentId: ids.incident, recipientType: "CUSTOMER", recipientRef: ids.customer, channel: "IN_APP", notificationId: customerNotice.notificationId! } })).rejects.toMatchObject({ code: "P2002" });
    await prisma.$transaction((tx) => syncIncidentNotificationStatus(tx, customerNotice.notificationId!, "SENDING"));
    await prisma.$transaction((tx) => syncIncidentNotificationStatus(tx, customerNotice.notificationId!, "SENT"));
    await prisma.$transaction((tx) => syncIncidentNotificationStatus(tx, customerNotice.notificationId!, "READ"));
    const acknowledgedNotice = await prisma.incidentNotification.findFirstOrThrow({ where: { notificationId: customerNotice.notificationId }, select: { status: true, sentAt: true, acknowledgedAt: true } });
    expect(acknowledgedNotice).toMatchObject({ status: "READ" });
    expect(acknowledgedNotice.sentAt).toBeInstanceOf(Date);
    expect(acknowledgedNotice.acknowledgedAt).toBeInstanceOf(Date);
    await expect(prisma.incident.update({ where: { id: ids.incident }, data: { status: "CLOSED" } })).rejects.toThrow("incidents_closure_metadata_check");

    const safety = { id: ids.safety, roles: ["SAFETY_ADMIN"] as const };
    await transitionIncident(ids.incident, { id: safety.id, roles: [...safety.roles] }, { toState: "TRIAGING", details: "Safety triage started and the pet location was confirmed.", eventType: "TRIAGE_NOTE" });
    await recordIncidentEvent(ids.incident, { id: safety.id, roles: [...safety.roles] }, { type: "OWNER_CONTACTED", details: "Owner reached by the recorded number and the current condition was confirmed." });
    await transitionIncident(ids.incident, { id: safety.id, roles: [...safety.roles] }, { toState: "ACTIVE_RESPONSE", details: "Immediate response owner assigned and care instructions confirmed.", eventType: "TRIAGE_NOTE" });
    await transitionIncident(ids.incident, { id: safety.id, roles: [...safety.roles] }, { toState: "IMMEDIATE_RISK_RESOLVED", details: "Immediate risk contained and Milo is stable with the owner.", eventType: "MONITORING_UPDATE" });
    await transitionIncident(ids.incident, { id: safety.id, roles: [...safety.roles] }, { toState: "REVIEW_PENDING", details: "Response evidence reviewed; preventive follow-up is required.", eventType: "REVIEW_NOTE" });
    const action = await createIncidentCorrectiveAction(ids.incident, { id: safety.id, roles: [...safety.roles] }, { title: "Review handover paw-check procedure with the assigned Saathi", dueAt: new Date(Date.now() + 24 * 60 * 60_000) });
    ids.correctiveAction = action.id;
    await expect(prisma.correctiveAction.update({ where: { id: action.id }, data: { completedAt: new Date() } })).rejects.toThrow("corrective_actions_completion_evidence_check");
    await expect(transitionIncident(ids.incident, { id: safety.id, roles: [...safety.roles] }, { toState: "CLOSED", details: "Attempted closure before preventive work completed.", eventType: "CLOSURE_NOTE", bookingResolution: "CONFIRMED" })).rejects.toBeInstanceOf(IncidentWorkflowError);
    await completeIncidentCorrectiveAction(ids.incident, action.id, { id: safety.id, roles: [...safety.roles] }, "Procedure reviewed, acknowledgement recorded and follow-up spot check scheduled.");
    const closed = await transitionIncident(ids.incident, { id: safety.id, roles: [...safety.roles] }, { toState: "CLOSED", details: "Owner communication, review and corrective evidence are complete.", eventType: "CLOSURE_NOTE", bookingResolution: "CONFIRMED" });
    expect(closed).toMatchObject({ incident: { status: "CLOSED" }, bookingStatus: "CONFIRMED" });
    expect((await prisma.capacityReservation.findUniqueOrThrow({ where: { bookingId: ids.booking } })).status).toBe("HELD");
  });

  it("records a verified no-show and preserves payment and capacity for replacement", async () => {
    await prisma.booking.update({ where: { id: ids.booking }, data: { scheduledStart: new Date(Date.now() - 5 * 60_000) } });
    const recovered = await markSitterNoShow(ids.booking, { id: ids.safety, roles: ["OPERATIONS_ADMIN"] }, "Operations called the Saathi twice after the scheduled start and confirmed no arrival.");
    expect(recovered).toMatchObject({ status: "REPLACEMENT_REQUIRED", assignmentStatus: "NO_SHOW", capacityRetained: true });
    expect(await prisma.bookingAssignment.findUniqueOrThrow({ where: { id: ids.assignment } })).toMatchObject({ status: "NO_SHOW" });
    expect(await prisma.payment.findUniqueOrThrow({ where: { id: ids.payment } })).toMatchObject({ status: "CAPTURED", signatureVerified: true });
    expect(await prisma.capacityReservation.findUniqueOrThrow({ where: { bookingId: ids.booking } })).toMatchObject({ status: "HELD" });
    expect((await prisma.capacityLimit.findUniqueOrThrow({ where: { id: ids.capacity } })).reserved).toBe(1);
  });

  it("approves a replacement with the original captured payment and no second charge", async () => {
    const replacement = await prisma.bookingAssignment.create({ data: { bookingId: ids.booking, sitterId: ids.sitter, type: "REPLACEMENT", status: "ACCEPTED", respondedAt: new Date(), payoutPaise: 7_000 } });
    ids.replacementAssignment = replacement.id;
    await prisma.booking.update({ where: { id: ids.booking }, data: { status: "CUSTOMER_APPROVAL_PENDING" } });
    const approved = await approveCustomerAssignment(ids.booking, replacement.id, ids.customer);
    expect(approved).toMatchObject({ next: "confirmed", paymentReused: true, bookingStatus: "CONFIRMED" });
    expect(await prisma.bookingAssignment.findUniqueOrThrow({ where: { id: replacement.id } })).toMatchObject({ status: "CUSTOMER_APPROVED", type: "REPLACEMENT" });
    expect(await prisma.payment.count({ where: { bookingId: ids.booking } })).toBe(1);
    expect(await prisma.payment.findUniqueOrThrow({ where: { id: ids.payment } })).toMatchObject({ status: "CAPTURED", signatureVerified: true });
  });
});
