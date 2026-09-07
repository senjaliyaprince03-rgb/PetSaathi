import { describe, it, expect, beforeAll, afterAll } from "vitest";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { prisma } from "@/lib/db";
import { POST } from "@/app/api/saathi/assignments/[id]/response/route";

describe("Concurrency: Double-Accept Assignment", () => {
  let bookingId: string;
  const assignmentIds: { assignmentId: string; sitterUserId: string }[] = [];
  const createdBookingIds: string[] = [];

  beforeAll(async () => {
    const customer = await prisma.user.findFirst({
      where: { roles: { some: { role: "CUSTOMER" } }, pets: { some: {} }, addresses: { some: {} } },
      include: { pets: true, addresses: true }
    });
    if (!customer) throw new Error("No customer with pet and address found");

    const serviceType = await prisma.serviceType.findFirst({ where: { active: true } });
    if (!serviceType) throw new Error("No active service type found");

    const sitters = await prisma.sitterProfile.findMany({
      where: {
        status: "APPROVED",
        user: { status: "ACTIVE", roles: { some: { role: "SITTER" } } }
      },
      include: { user: true },
      take: 10
    });
    if (sitters.length < 2) throw new Error("Need at least 2 approved Saathis for concurrency test");

    const scheduledStart = new Date(Date.now() + 2 * 3600 * 1000);
    const scheduledEnd = new Date(scheduledStart.getTime() + 30 * 60 * 1000);
    const pet = customer.pets[0];
    const address = customer.addresses[0];
    if (!pet || !address) throw new Error("Customer pet or address missing");
    const riskAssessment = await prisma.petRiskAssessment.create({
      data: {
        petId: pet.id,
        serviceCode: serviceType.code as any,
        suggestedLevel: "GREEN",
        finalLevel: "GREEN",
        factorSnapshot: { score: 0, notes: "concurrency test" }
      }
    });
    createdRiskAssessmentId = riskAssessment.id;

    const booking = await prisma.booking.create({
      data: {
        reference: `BK-CONCUR-ACC-${Date.now().toString().slice(-6)}`,
        customerId: customer.id,
        petId: pet.id,
        addressId: address.id,
        serviceTypeId: serviceType.id,
        status: "SITTER_PROPOSED",
        scheduledStart,
        scheduledEnd,
        quoteAmountPaise: 29900,
        currency: "INR"
      }
    });
    bookingId = booking.id;
    createdBookingIds.push(booking.id);

    for (const sitter of sitters) {
      await prisma.sitterServicePermission.upsert({
        where: { sitterId_serviceTypeId: { sitterId: sitter.id, serviceTypeId: serviceType.id } },
        update: { status: "ACTIVE" },
        create: {
          sitterId: sitter.id,
          serviceTypeId: serviceType.id,
          status: "ACTIVE",
          riskLimit: "RED"
        }
      });

      const assignment = await prisma.bookingAssignment.create({
        data: {
          bookingId: booking.id,
          sitterId: sitter.id,
          type: "BACKUP",
          status: "OFFERED",
          payoutPaise: 21000
        }
      });

      assignmentIds.push({
        assignmentId: assignment.id,
        sitterUserId: sitter.user.id
      });
    }
  }, 30000);

  let createdRiskAssessmentId: string | undefined;

  afterAll(async () => {
    if (createdRiskAssessmentId) {
      await prisma.petRiskAssessment.delete({ where: { id: createdRiskAssessmentId } }).catch(() => {});
    }
    for (const item of assignmentIds) {
      await prisma.notificationOutbox.deleteMany({ where: { idempotencyKey: `assignment-accepted:${item.assignmentId}:customer` } }).catch(() => {});
    }
    for (const bId of createdBookingIds) {
      await prisma.auditLog.deleteMany({ where: { resourceId: { in: assignmentIds.map(a => a.assignmentId) } } }).catch(() => {});
      await prisma.bookingStatusHistory.deleteMany({ where: { bookingId: bId } }).catch(() => {});
      await prisma.bookingAssignment.deleteMany({ where: { bookingId: bId } }).catch(() => {});
      await prisma.booking.delete({ where: { id: bId } }).catch(() => {});
    }
  }, 30000);

  it("ensures exactly ONE Saathi can accept even under simultaneous fire", async () => {
    const totalRequests = assignmentIds.length;
    expect(totalRequests).toBeGreaterThanOrEqual(2);

    let releaseBarrier: () => void;
    const barrier = new Promise<void>((resolve) => {
      releaseBarrier = resolve;
    });

    const fireRequest = async (item: typeof assignmentIds[0]) => {
      await barrier;
      const req = new Request(`http://localhost:3000/api/saathi/assignments/${item.assignmentId}/response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-test-user-id": item.sitterUserId
        },
        body: JSON.stringify({ action: "ACCEPT" })
      });
      const res = await POST(req, { params: Promise.resolve({ id: item.assignmentId }) });
      const json = await res.json().catch(() => ({}));
      return { status: res.status, sitterUserId: item.sitterUserId, assignmentId: item.assignmentId, data: json };
    };

    const promises = assignmentIds.map(item => fireRequest(item));
    releaseBarrier!();

    const results = await Promise.all(promises);

    const successful = results.filter(r => r.status === 200);
    const conflicts = results.filter(r => r.status === 409);

    console.log(`\nDouble-Accept Results: Total=${results.length}, 200s=${successful.length}, 409s=${conflicts.length}`);
    console.log("Full results detail:", results);

    expect(successful).toHaveLength(1);
    expect(conflicts).toHaveLength(totalRequests - 1);

    const dbAssignments = await prisma.bookingAssignment.findMany({
      where: { bookingId }
    });
    const acceptedInDb = dbAssignments.filter(a => a.status === "ACCEPTED");
    expect(acceptedInDb).toHaveLength(1);
    const firstAccepted = acceptedInDb[0];
    const firstSuccess = successful[0];
    expect(firstAccepted).toBeDefined();
    expect(firstSuccess).toBeDefined();
    expect(firstAccepted?.id).toBe(firstSuccess?.assignmentId);

    const winningAssignment = await prisma.bookingAssignment.findUnique({
      where: { id: firstSuccess!.assignmentId },
      include: { sitter: true }
    });
    expect(winningAssignment?.sitter?.userId).toBe(firstSuccess!.sitterUserId);

    const dbBooking = await prisma.booking.findUnique({ where: { id: bookingId } });
    expect(dbBooking?.status).toBe("CUSTOMER_APPROVAL_PENDING");
  });
});
