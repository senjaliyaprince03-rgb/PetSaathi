import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { prisma } from "@/lib/db";
import { offerRankedAssignment } from "@/modules/matching/offer-assignment";

describe("ranked assignment approval gate", () => {
  const suffix = randomUUID().slice(0, 8);
  const ids = {
    customer: "",
    sitterUser: "",
    sitter: "",
    admin: "",
    pet: "",
    directAddress: "",
    flaggedAddress: "",
    service: "",
    price: "",
    directBooking: "",
    flaggedBooking: "",
  };
  const assignmentIds: string[] = [];
  const directStart = new Date(Date.now() + 48 * 60 * 60_000);
  const flaggedStart = new Date(Date.now() + 72 * 60 * 60_000);
  const actor = () => ({
    id: ids.admin,
    roles: ["OPERATIONS_ADMIN" as const],
  });

  beforeAll(async () => {
    const [customer, sitterUser, admin] = await Promise.all([
      createUser(`match-customer-${suffix}`, "Match Customer"),
      createUser(`match-sitter-${suffix}`, "Match Saathi"),
      createUser(`match-admin-${suffix}`, "Match Operator"),
    ]);
    Object.assign(ids, {
      customer: customer.id,
      sitterUser: sitterUser.id,
      admin: admin.id,
    });

    const sitter = await prisma.sitterProfile.create({
      data: {
        userId: sitterUser.id,
        status: "APPROVED",
        approvedAt: new Date(),
        serviceLocality: "Bopal",
        reliabilityScore: 88,
      },
    });
    ids.sitter = sitter.id;

    const pet = await prisma.pet.create({
      data: {
        ownerId: customer.id,
        name: "Milo",
        species: "DOG",
        active: true,
      },
    });
    ids.pet = pet.id;

    const [directAddress, flaggedAddress] = await Promise.all([
      createAddress(customer.id, "Bopal", suffix),
      createAddress(customer.id, "Satellite", suffix),
    ]);
    ids.directAddress = directAddress.id;
    ids.flaggedAddress = flaggedAddress.id;

    const service = await prisma.serviceType.findUniqueOrThrow({
      where: { code: "DOG_WALK_30" },
    });
    ids.service = service.id;
    const price = await prisma.servicePrice.create({
      data: {
        serviceTypeId: service.id,
        version: Number.parseInt(suffix.slice(0, 6), 16),
        amountPaise: 10_000,
        sitterPaise: 7_000,
        taxBasisPoints: 1_800,
        effectiveAt: new Date(Date.now() - 60_000),
        approvedBy: admin.id,
      },
    });
    ids.price = price.id;

    await prisma.sitterServicePermission.create({
      data: {
        sitterId: sitter.id,
        serviceTypeId: service.id,
        status: "ACTIVE",
        riskLimit: "GREEN",
        grantedBy: admin.id,
        grantedAt: new Date(),
      },
    });
    await prisma.petRiskAssessment.create({
      data: {
        petId: pet.id,
        serviceCode: service.code,
        suggestedLevel: "GREEN",
        finalLevel: "GREEN",
        factorSnapshot: { source: "matching-approval-test" },
        reviewedBy: admin.id,
        reviewedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60_000),
      },
    });

    await prisma.availabilityException.createMany({
      data: [
        {
          sitterId: sitter.id,
          startsAt: new Date(directStart.getTime() - 60 * 60_000),
          endsAt: new Date(directStart.getTime() + 3 * 60 * 60_000),
          available: true,
          reason: "Direct match test availability",
        },
        {
          sitterId: sitter.id,
          startsAt: new Date(flaggedStart.getTime() - 60 * 60_000),
          endsAt: new Date(flaggedStart.getTime() + 3 * 60 * 60_000),
          available: true,
          reason: "Flagged match test availability",
        },
      ],
    });

    const [directBooking, flaggedBooking] = await Promise.all([
      createBooking(
        customer.id,
        pet.id,
        directAddress.id,
        service.id,
        price.id,
        directStart,
        `DIRECT-${suffix}`,
      ),
      createBooking(
        customer.id,
        pet.id,
        flaggedAddress.id,
        service.id,
        price.id,
        flaggedStart,
        `FLAGGED-${suffix}`,
      ),
    ]);
    ids.directBooking = directBooking.id;
    ids.flaggedBooking = flaggedBooking.id;
  });

  afterAll(async () => {
    const bookingIds = [ids.directBooking, ids.flaggedBooking].filter(Boolean);
    if (bookingIds.length > 0) {
      await prisma.notificationOutbox.deleteMany({
        where: {
          idempotencyKey: {
            in: assignmentIds.map((id) => `assignment-offered:${id}`),
          },
        },
      });
      await prisma.auditLog.deleteMany({
        where: {
          OR: [
            { resourceType: "booking", resourceId: { in: bookingIds } },
            {
              action: "booking.assignment_offered",
              resourceId: { in: assignmentIds },
            },
          ],
        },
      });
      await prisma.bookingAssignment.deleteMany({
        where: { bookingId: { in: bookingIds } },
      });
      await prisma.matchScore.deleteMany({
        where: { bookingId: { in: bookingIds } },
      });
      await prisma.bookingStatusHistory.deleteMany({
        where: { bookingId: { in: bookingIds } },
      });
      await prisma.priceQuote.deleteMany({
        where: { bookingId: { in: bookingIds } },
      });
      await prisma.booking.deleteMany({
        where: { id: { in: bookingIds } },
      });
    }
    if (ids.sitter) {
      await prisma.availabilityException.deleteMany({
        where: { sitterId: ids.sitter },
      });
      await prisma.sitterServicePermission.deleteMany({
        where: { sitterId: ids.sitter },
      });
    }
    if (ids.pet) {
      await prisma.petRiskAssessment.deleteMany({
        where: { petId: ids.pet },
      });
    }
    if (ids.price) {
      await prisma.servicePrice.deleteMany({ where: { id: ids.price } });
    }
    const addressIds = [ids.directAddress, ids.flaggedAddress].filter(Boolean);
    if (addressIds.length > 0) {
      await prisma.address.deleteMany({ where: { id: { in: addressIds } } });
    }
    if (ids.pet) await prisma.pet.deleteMany({ where: { id: ids.pet } });
    if (ids.sitter) {
      await prisma.sitterProfile.deleteMany({ where: { id: ids.sitter } });
    }
    const userIds = [ids.customer, ids.sitterUser, ids.admin].filter(Boolean);
    if (userIds.length > 0) {
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
  });

  it("creates one direct offer and treats concurrent retries idempotently", async () => {
    const results = await Promise.all([
      offerRankedAssignment({
        bookingId: ids.directBooking,
        sitterId: ids.sitter,
        actor: actor(),
      }),
      offerRankedAssignment({
        bookingId: ids.directBooking,
        sitterId: ids.sitter,
        actor: actor(),
      }),
    ]);

    expect(new Set(results.map((result) => result.assignment.id)).size).toBe(
      1,
    );
    expect(results.some((result) => result.created)).toBe(true);
    assignmentIds.push(results[0].assignment.id);
    expect(
      await prisma.bookingAssignment.count({
        where: {
          bookingId: ids.directBooking,
          status: "OFFERED",
        },
      }),
    ).toBe(1);
  });

  it("blocks a flagged candidate, invalidates stale approval, then allows a fresh approval", async () => {
    await expect(
      offerRankedAssignment({
        bookingId: ids.flaggedBooking,
        sitterId: ids.sitter,
        actor: actor(),
      }),
    ).rejects.toMatchObject({
      status: 409,
      code: "human_approval_required",
    });

    const pending = await prisma.matchScore.findUniqueOrThrow({
      where: {
        bookingId_sitterId: {
          bookingId: ids.flaggedBooking,
          sitterId: ids.sitter,
        },
      },
    });
    expect(pending).toMatchObject({
      status: "PENDING",
      requiresHumanApproval: true,
    });

    await prisma.matchScore.update({ where: { id: pending.id }, data: { status: 'APPROVED', approvedBy: ids.admin, approvedAt: new Date() } });
    await prisma.sitterProfile.update({
      where: { id: ids.sitter },
      data: { reliabilityScore: 91 },
    });

    await expect(
      offerRankedAssignment({
        bookingId: ids.flaggedBooking,
        sitterId: ids.sitter,
        actor: actor(),
      }),
    ).rejects.toMatchObject({
      status: 409,
      code: "human_approval_required",
    });
    expect(
      await prisma.matchScore.findUniqueOrThrow({
        where: { id: pending.id },
      }),
    ).toMatchObject({ status: "PENDING", approvedBy: null });

    const newPendingScore = await prisma.matchScore.findFirstOrThrow({
      where: { bookingId: ids.flaggedBooking, sitterId: ids.sitter, status: "PENDING" },
      orderBy: { createdAt: "desc" }
    });
    
    await prisma.matchScore.update({
      where: { id: newPendingScore.id },
      data: {
        status: "APPROVED",
        approvedBy: ids.admin,
        approvedAt: new Date(),
      },
    });
    const result = await offerRankedAssignment({
      bookingId: ids.flaggedBooking,
      sitterId: ids.sitter,
      actor: actor(),
    });
    assignmentIds.push(result.assignment.id);
    expect(result.created).toBe(true);
    expect(result.assignment.status).toBe("OFFERED");
  });
});

async function createUser(prefix: string, displayName: string) {
  return prisma.user.create({
    data: {
      authUserId: randomUUID(),
      email: `${prefix}@example.test`,
      displayName,
      status: "ACTIVE",
    },
  });
}

function createAddress(userId: string, locality: string, suffix: string) {
  return prisma.address.create({
    data: {
      userId,
      label: locality,
      line1: `14 ${locality} Test Street`,
      locality,
      city: `Match City ${suffix}`,
      state: "Gujarat",
      postalCode: "380058",
    },
  });
}

function createBooking(
  customerId: string,
  petId: string,
  addressId: string,
  serviceTypeId: string,
  servicePriceId: string,
  scheduledStart: Date,
  reference: string,
) {
  const scheduledEnd = new Date(
    scheduledStart.getTime() + 30 * 60_000,
  );
  return prisma.booking.create({
    data: {
      reference,
      customerId,
      petId,
      addressId,
      serviceTypeId,
      status: "MATCHING",
      scheduledStart,
      scheduledEnd,
      quoteAmountPaise: 11_800,
      priceQuotes: {
        create: {
          servicePriceId,
          subtotalPaise: 10_000,
          taxPaise: 1_800,
          totalPaise: 11_800,
          breakdown: { source: "matching-approval-test" },
          expiresAt: new Date(Date.now() + 24 * 60 * 60_000),
          acceptedAt: new Date(),
        },
      },
    },
  });
}


