import "server-only";

import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import {
  isEligibilityMethodImplemented,
  isProgrammeCurrentlyAvailable,
} from "@/modules/b2b/programme-policy";

export async function getCurrentProgrammeEntitlement(
  programmeSlug: string,
  customerId: string,
) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const result = await prisma.$transaction(
        async (tx) => {
          const now = new Date();
          const programme = await tx.partnerProgramme.findUnique({
            where: { slug: programmeSlug },
            select: {
              id: true,
              programmeType: true,
              eligibilityMethod: true,
              status: true,
              startDate: true,
              endDate: true,
            },
          });
          if (
            !programme ||
            !isProgrammeCurrentlyAvailable(programme, now) ||
            !isEligibilityMethodImplemented(programme.eligibilityMethod)
          ) {
            return {
              entitled: false as const,
              status: 404 as const,
              code: "programme_not_found",
              message: "The programme is not currently available.",
            };
          }

          let membership = await tx.programmeMembership.findUnique({
            where: {
              programmeId_customerId: {
                programmeId: programme.id,
                customerId,
              },
            },
            include: { wallet: true },
          });
          if (!membership) {
            return {
              entitled: false as const,
              status: 404 as const,
              code: "membership_not_found",
              message: "No programme membership was found.",
            };
          }
          if (!membership.active) {
            return {
              entitled: false as const,
              status: 403 as const,
              code: "membership_inactive",
              message: "The programme membership is inactive.",
            };
          }

          if (
            membership.verificationStatus === "VERIFIED" &&
            membership.eligibilityExpiry &&
            membership.eligibilityExpiry <= now
          ) {
            const changed = await tx.programmeMembership.updateMany({
              where: {
                id: membership.id,
                active: true,
                verificationStatus: "VERIFIED",
                eligibilityExpiry: { lte: now },
              },
              data: { verificationStatus: "EXPIRED_VERIFICATION" },
            });
            if (changed.count === 1) {
              await tx.auditLog.create({
                data: {
                  actorId: customerId,
                  actorRole: "CUSTOMER",
                  action: "programme_membership.expired",
                  resourceType: "programme_membership",
                  resourceId: membership.id,
                  before: { verificationStatus: "VERIFIED" },
                  after: {
                    verificationStatus: "EXPIRED_VERIFICATION",
                    eligibilityExpiry:
                      membership.eligibilityExpiry.toISOString(),
                  },
                  reason:
                    "Expired eligibility was enforced during benefit access",
                },
              });
            }
            return {
              entitled: false as const,
              status: 403 as const,
              code: "eligibility_expired",
              message: "Programme eligibility has expired.",
            };
          }
          if (membership.verificationStatus !== "VERIFIED") {
            return {
              entitled: false as const,
              status: 403 as const,
              code: "membership_not_verified",
              message: "Verified programme eligibility is required.",
            };
          }

          if (
            programme.programmeType === "CORPORATE_WALLET" &&
            !membership.wallet
          ) {
            const wallet = await tx.benefitWallet.create({
              data: {
                programmeMembershipId: membership.id,
                status: "ACTIVE_WALLET",
                expiresAt: membership.eligibilityExpiry,
              },
            });
            await tx.auditLog.create({
              data: {
                actorId: customerId,
                actorRole: "CUSTOMER",
                action: "benefit_wallet.provisioned",
                resourceType: "benefit_wallet",
                resourceId: wallet.id,
                after: {
                  programmeMembershipId: membership.id,
                  status: wallet.status,
                  expiresAt: wallet.expiresAt?.toISOString() ?? null,
                },
                reason: "Current verified programme entitlement was accessed",
              },
            });
            membership = { ...membership, wallet };
          }

          return {
            entitled: true as const,
            programme,
            membership,
          };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 5_000,
          timeout: 15_000,
        },
      );

      if (!result.entitled) {
        throw new ProgrammeEntitlementError(
          result.status,
          result.code,
          result.message,
        );
      }
      return result;
    } catch (error) {
      if (error instanceof ProgrammeEntitlementError) throw error;
      const retryable =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === "P2002" || error.code === "P2034");
      if (!retryable || attempt === 2) throw error;
    }
  }

  throw new Error("Programme entitlement retries were exhausted.");
}

export class ProgrammeEntitlementError extends Error {
  constructor(
    public readonly status: 403 | 404,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ProgrammeEntitlementError";
  }
}
