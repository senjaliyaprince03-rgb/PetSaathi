import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import type {
  ProgrammeType,
  ProgrammeStatus,
  MemberVerificationStatus,
} from "@prisma/client";
import {
  isEligibilityMethodImplemented,
  isProgrammeCurrentlyAvailable,
} from "@/modules/b2b/programme-policy";

export async function getProgrammeBySlug(slug: string) {
  const programme = await prisma.partnerProgramme.findUnique({
    where: { slug },
    include: {
      organization: {
        select: {
          displayName: true,
          organizationType: true,
        },
      },
      _count: {
        select: {
          memberships: true,
        },
      },
    },
  });

  if (!programme) {
    throw new ProgrammeLookupError(
      404,
      "programme_not_found",
      "The programme does not exist.",
    );
  }

  return programme;
}

export async function getAvailableProgrammeBySlug(
  slug: string,
  now = new Date(),
) {
  const programme = await getProgrammeBySlug(slug);
  if (
    !isProgrammeCurrentlyAvailable(programme, now) ||
    !isEligibilityMethodImplemented(programme.eligibilityMethod)
  ) {
    throw new ProgrammeLookupError(
      404,
      "programme_not_found",
      "The programme is not currently available.",
    );
  }
  return programme;
}

export async function enrollMember(programmeId: string, customerId: string) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const now = new Date();
          const programme = await tx.partnerProgramme.findUnique({
            where: { id: programmeId },
            select: {
              id: true,
              programmeType: true,
              eligibilityMethod: true,
              status: true,
              startDate: true,
              endDate: true,
            },
          });

          if (!programme) {
            throw new ProgrammeEnrollmentError(
              404,
              "programme_not_found",
              "The programme does not exist.",
            );
          }
          if (!isProgrammeCurrentlyAvailable(programme, now)) {
            throw new ProgrammeEnrollmentError(
              409,
              "programme_not_available",
              "The programme is not currently accepting enrollments.",
            );
          }
          if (!isEligibilityMethodImplemented(programme.eligibilityMethod)) {
            throw new ProgrammeEnrollmentError(
              409,
              "eligibility_method_unavailable",
              "This programme eligibility method is not available.",
            );
          }

          let existing = await tx.programmeMembership.findUnique({
            where: {
              programmeId_customerId: { programmeId, customerId },
            },
          });
          if (existing) {
            if (!existing.active) {
              throw new ProgrammeEnrollmentError(
                409,
                "membership_inactive",
                "The existing membership is inactive and requires partner support.",
              );
            }

            const eligibilityExpired =
              existing.verificationStatus === "VERIFIED" &&
              existing.eligibilityExpiry !== null &&
              existing.eligibilityExpiry <= now;
            if (
              programme.eligibilityMethod === "OPEN_ACCESS" &&
              (eligibilityExpired ||
                existing.verificationStatus === "EXPIRED_VERIFICATION" ||
                existing.verificationStatus === "PENDING_VERIFICATION")
            ) {
              const beforeStatus = existing.verificationStatus;
              existing = await tx.programmeMembership.update({
                where: { id: existing.id },
                data: {
                  verificationMethod: "OPEN_ACCESS",
                  verificationStatus: "VERIFIED",
                  verifiedAt: now,
                  eligibilityExpiry: programme.endDate,
                },
              });
              await tx.auditLog.create({
                data: {
                  actorId: customerId,
                  actorRole: "CUSTOMER",
                  action: "programme_membership.open_access_renewed",
                  resourceType: "programme_membership",
                  resourceId: existing.id,
                  before: { verificationStatus: beforeStatus },
                  after: {
                    verificationStatus: existing.verificationStatus,
                    eligibilityExpiry:
                      existing.eligibilityExpiry?.toISOString() ?? null,
                  },
                  reason:
                    "Active open-access programme eligibility was renewed",
                },
              });
            } else if (eligibilityExpired) {
              existing = await tx.programmeMembership.update({
                where: { id: existing.id },
                data: { verificationStatus: "EXPIRED_VERIFICATION" },
              });
              await tx.auditLog.create({
                data: {
                  actorId: customerId,
                  actorRole: "CUSTOMER",
                  action: "programme_membership.expired",
                  resourceType: "programme_membership",
                  resourceId: existing.id,
                  before: { verificationStatus: "VERIFIED" },
                  after: {
                    verificationStatus: "EXPIRED_VERIFICATION",
                    eligibilityExpiry:
                      existing.eligibilityExpiry?.toISOString() ?? null,
                  },
                  reason: "Programme eligibility window expired",
                },
              });
            }

            await provisionWalletIfEligible(
              tx,
              programme.programmeType,
              existing,
              customerId,
            );
            return { membership: existing, created: false };
          }

          const isAccessOpen = programme.eligibilityMethod === "OPEN_ACCESS";
          const membership = await tx.programmeMembership.create({
            data: {
              programmeId,
              customerId,
              verificationMethod: programme.eligibilityMethod,
              verificationStatus: isAccessOpen
                ? "VERIFIED"
                : "PENDING_VERIFICATION",
              verifiedAt: isAccessOpen ? now : null,
              eligibilityExpiry: isAccessOpen ? programme.endDate : null,
              active: true,
            },
          });

          await tx.auditLog.create({
            data: {
              actorId: customerId,
              actorRole: "CUSTOMER",
              action: "programme_membership.enrolled",
              resourceType: "programme_membership",
              resourceId: membership.id,
              after: {
                programmeId,
                verificationMethod: membership.verificationMethod,
                verificationStatus: membership.verificationStatus,
              },
              reason: isAccessOpen
                ? "Customer enrolled in an active open-access programme"
                : "Customer requested eligibility verification",
            },
          });

          await provisionWalletIfEligible(
            tx,
            programme.programmeType,
            membership,
            customerId,
          );

          return { membership, created: true };
        },
        {
          maxWait: 5_000,
          timeout: 15_000,
        },
      );
    } catch (error) {
      if (error instanceof ProgrammeEnrollmentError) {
        throw error;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const existing = await prisma.programmeMembership.findUnique({
          where: {
            programmeId_customerId: { programmeId, customerId },
          },
        });
        if (existing?.active) {
          return { membership: existing, created: false };
        }
        if (existing) {
          throw new ProgrammeEnrollmentError(
            409,
            "membership_inactive",
            "The existing membership is inactive and requires partner support.",
          );
        }
      }

      const isRetryableTransactionConflict =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034";
      if (!isRetryableTransactionConflict || attempt === 2) {
        throw error;
      }
    }
  }

  throw new Error("Programme enrollment transaction retries were exhausted.");
}

export async function listProgrammeMembers(
  programmeId: string,
  filters?: { status?: MemberVerificationStatus; page?: number; pageSize?: number }
) {
  const page = boundedInteger(filters?.page, 1, 10_000, 1);
  const pageSize = boundedInteger(filters?.pageSize, 1, 100, 10);
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = { programmeId };
  if (filters?.status) {
    where.verificationStatus = filters.status;
  }

  const [items, total] = await Promise.all([
    prisma.programmeMembership.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        customer: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.programmeMembership.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function listProgrammes(
  filters: { organizationId?: string; status?: ProgrammeStatus; type?: ProgrammeType; page?: number; pageSize?: number }
) {
  const page = boundedInteger(filters.page, 1, 10_000, 1);
  const pageSize = boundedInteger(filters.pageSize, 1, 100, 10);
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};
  if (filters.organizationId) {
    where.organizationId = filters.organizationId;
  }
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.type) {
    where.programmeType = filters.type;
  }

  const [items, total] = await Promise.all([
    prisma.partnerProgramme.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        organization: {
          select: {
            displayName: true,
          },
        },
        _count: {
          select: {
            memberships: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.partnerProgramme.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

async function provisionWalletIfEligible(
  tx: Prisma.TransactionClient,
  programmeType: ProgrammeType,
  membership: {
    id: string;
    verificationStatus: MemberVerificationStatus;
    eligibilityExpiry: Date | null;
  },
  actorId: string,
) {
  if (
    programmeType !== "CORPORATE_WALLET" ||
    membership.verificationStatus !== "VERIFIED"
  ) {
    return;
  }

  const existing = await tx.benefitWallet.findUnique({
    where: { programmeMembershipId: membership.id },
    select: { id: true },
  });
  if (existing) return;

  const wallet = await tx.benefitWallet.create({
    data: {
      programmeMembershipId: membership.id,
      status: "ACTIVE_WALLET",
      expiresAt: membership.eligibilityExpiry,
    },
    select: { id: true },
  });
  await tx.auditLog.create({
    data: {
      actorId,
      actorRole: "CUSTOMER",
      action: "benefit_wallet.provisioned",
      resourceType: "benefit_wallet",
      resourceId: wallet.id,
      after: {
        programmeMembershipId: membership.id,
        status: "ACTIVE_WALLET",
        expiresAt: membership.eligibilityExpiry?.toISOString() ?? null,
      },
      reason: "Verified corporate-wallet membership became eligible",
    },
  });
}

function boundedInteger(
  value: number | undefined,
  minimum: number,
  maximum: number,
  fallback: number,
) {
  return Number.isInteger(value)
    ? Math.min(maximum, Math.max(minimum, value as number))
    : fallback;
}

export class ProgrammeEnrollmentError extends Error {
  constructor(
    public readonly status: 404 | 409,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ProgrammeEnrollmentError";
  }
}

export class ProgrammeLookupError extends Error {
  constructor(
    public readonly status: 404,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ProgrammeLookupError";
  }
}
