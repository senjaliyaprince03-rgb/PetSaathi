import { randomUUID } from "node:crypto";

import type { Role } from "@prisma/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { prisma } from "@/lib/db";
import {
  consumeProgrammeVerificationToken,
  issueProgrammeVerificationToken,
} from "@/modules/b2b/programme-verification";

describe("partner programme verification", () => {
  const ids = {
    adminId: "",
    customerId: "",
    otherCustomerId: "",
    organizationId: "",
    programmeId: "",
    membershipId: "",
  };

  beforeEach(async () => {
    const [admin, customer, otherCustomer] = await Promise.all([
      createUser("Partner Admin"),
      createUser("Programme Customer"),
      createUser("Other Customer"),
    ]);
    ids.adminId = admin.id;
    ids.customerId = customer.id;
    ids.otherCustomerId = otherCustomer.id;

    const organization = await prisma.organization.create({
      data: {
        legalName: "Verification Test Organization",
        displayName: "Verification Test",
        organizationType: "CORPORATE",
        status: "ACTIVE",
      },
    });
    ids.organizationId = organization.id;

    const programme = await prisma.partnerProgramme.create({
      data: {
        organizationId: organization.id,
        name: "Secure Verification Programme",
        slug: `secure-verification-${randomUUID()}`,
        programmeType: "CORPORATE_ACCESS",
        cityScope: ["Ahmedabad"],
        eligibilityMethod: "INVITATION_TOKEN",
        status: "ACTIVE_PROGRAMME",
        startDate: new Date(Date.now() - 60_000),
        endDate: new Date(Date.now() + 24 * 60 * 60_000),
      },
    });
    ids.programmeId = programme.id;

    const membership = await prisma.programmeMembership.create({
      data: {
        programmeId: programme.id,
        customerId: customer.id,
        verificationMethod: "INVITATION_TOKEN",
        verificationStatus: "PENDING_VERIFICATION",
      },
    });
    ids.membershipId = membership.id;
  });

  afterEach(async () => {
    if (ids.membershipId) {
      await prisma.auditLog.deleteMany({
        where: {
          resourceType: "programme_membership",
          resourceId: ids.membershipId,
        },
      });
      await prisma.programmeVerificationToken.deleteMany({
        where: { membershipId: ids.membershipId },
      });
      await prisma.programmeMembership.deleteMany({
        where: { id: ids.membershipId },
      });
    }
    if (ids.programmeId) {
      await prisma.partnerProgramme.deleteMany({
        where: { id: ids.programmeId },
      });
    }
    if (ids.organizationId) {
      await prisma.organization.deleteMany({
        where: { id: ids.organizationId },
      });
    }
    await prisma.user.deleteMany({
      where: {
        id: {
          in: [ids.adminId, ids.customerId, ids.otherCustomerId].filter(
            Boolean,
          ),
        },
      },
    });
  });

  it("consumes a bound token once and audits verification", async () => {
    const issued = await issueProgrammeVerificationToken({
      programmeId: ids.programmeId,
      membershipId: ids.membershipId,
      expiresInMinutes: 30,
      maxAttempts: 5,
      actor: actor(ids.adminId, ["PARTNER_MANAGER"]),
    });
    const programme = await prisma.partnerProgramme.findUniqueOrThrow({
      where: { id: ids.programmeId },
      select: { slug: true },
    });

    const verified = await consumeProgrammeVerificationToken({
      programmeSlug: programme.slug,
      token: issued.token,
      actor: actor(ids.customerId, ["CUSTOMER"]),
    });
    expect(verified.verificationStatus).toBe("VERIFIED");

    const [membership, token, audit] = await Promise.all([
      prisma.programmeMembership.findUniqueOrThrow({
        where: { id: ids.membershipId },
      }),
      prisma.programmeVerificationToken.findUniqueOrThrow({
        where: { id: issued.id },
      }),
      prisma.auditLog.findFirst({
        where: {
          action: "programme_membership.verified",
          resourceType: "programme_membership",
          resourceId: ids.membershipId,
        },
      }),
    ]);
    expect(membership.verificationStatus).toBe("VERIFIED");
    expect(token.consumedAt).toBeInstanceOf(Date);
    expect(token.tokenHash).not.toBe(issued.token);
    expect(audit?.actorId).toBe(ids.customerId);

    await expect(
      consumeProgrammeVerificationToken({
        programmeSlug: programme.slug,
        token: issued.token,
        actor: actor(ids.customerId, ["CUSTOMER"]),
      }),
    ).rejects.toMatchObject({
      status: 400,
      code: "invalid_or_expired_verification",
    });
  });

  it("rejects a token presented by a different customer", async () => {
    const issued = await issueProgrammeVerificationToken({
      programmeId: ids.programmeId,
      membershipId: ids.membershipId,
      expiresInMinutes: 30,
      maxAttempts: 5,
      actor: actor(ids.adminId, ["SUPER_ADMIN"]),
    });
    const programme = await prisma.partnerProgramme.findUniqueOrThrow({
      where: { id: ids.programmeId },
      select: { slug: true },
    });

    await expect(
      consumeProgrammeVerificationToken({
        programmeSlug: programme.slug,
        token: issued.token,
        actor: actor(ids.otherCustomerId, ["CUSTOMER"]),
      }),
    ).rejects.toMatchObject({
      status: 400,
      code: "invalid_or_expired_verification",
    });

    const membership = await prisma.programmeMembership.findUniqueOrThrow({
      where: { id: ids.membershipId },
    });
    expect(membership.verificationStatus).toBe("PENDING_VERIFICATION");
  });

  it("rejects an expired token without verifying the membership", async () => {
    const issued = await issueProgrammeVerificationToken({
      programmeId: ids.programmeId,
      membershipId: ids.membershipId,
      expiresInMinutes: 30,
      maxAttempts: 5,
      actor: actor(ids.adminId, ["PARTNER_MANAGER"]),
    });
    await prisma.programmeVerificationToken.update({
      where: { id: issued.id },
      data: { 
        createdAt: new Date(Date.now() - 2_000),
        expiresAt: new Date(Date.now() - 1_000) 
      },
    });
    const programme = await prisma.partnerProgramme.findUniqueOrThrow({
      where: { id: ids.programmeId },
      select: { slug: true },
    });

    await expect(
      consumeProgrammeVerificationToken({
        programmeSlug: programme.slug,
        token: issued.token,
        actor: actor(ids.customerId, ["CUSTOMER"]),
      }),
    ).rejects.toMatchObject({
      status: 400,
      code: "invalid_or_expired_verification",
    });
    const membership = await prisma.programmeMembership.findUniqueOrThrow({
      where: { id: ids.membershipId },
    });
    expect(membership.verificationStatus).toBe("PENDING_VERIFICATION");
  });
});

async function createUser(displayName: string) {
  return prisma.user.create({
    data: {
      email: `${randomUUID()}@example.test`,
      displayName,
      status: "ACTIVE",
    },
  });
}

function actor(id: string, roles: Role[]) {
  return { id, roles };
}
