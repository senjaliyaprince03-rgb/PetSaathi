import "server-only";

import { createHash, randomBytes } from "node:crypto";

import { Prisma, type Role } from "@prisma/client";

import { prisma } from "@/lib/db";

const TOKEN_BYTES = 32;

type VerificationActor = {
  id: string;
  roles: Role[];
};

type IssueVerificationTokenInput = {
  programmeId: string;
  membershipId: string;
  expiresInMinutes: number;
  maxAttempts: number;
  actor: VerificationActor;
};

type ConsumeVerificationTokenInput = {
  programmeSlug: string;
  token: string;
  actor: VerificationActor;
};

export function generateProgrammeVerificationToken() {
  return randomBytes(TOKEN_BYTES).toString("base64url");
}

export function hashProgrammeVerificationToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export async function issueProgrammeVerificationToken(
  input: IssueVerificationTokenInput,
) {
  const actorRole = input.actor.roles.includes("SUPER_ADMIN")
    ? "SUPER_ADMIN"
    : input.actor.roles.includes("PARTNER_MANAGER")
      ? "PARTNER_MANAGER"
      : null;
  if (!actorRole) {
    throw new ProgrammeVerificationError(
      403,
      "forbidden",
      "Partner-management authority is required.",
    );
  }
  if (
    !Number.isInteger(input.expiresInMinutes) ||
    input.expiresInMinutes < 5 ||
    input.expiresInMinutes > 1_440 ||
    !Number.isInteger(input.maxAttempts) ||
    input.maxAttempts < 1 ||
    input.maxAttempts > 10
  ) {
    throw new ProgrammeVerificationError(
      400,
      "invalid_token_policy",
      "The verification-token policy is invalid.",
    );
  }

  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + input.expiresInMinutes * 60_000,
  );
  const token = generateProgrammeVerificationToken();
  const tokenHash = hashProgrammeVerificationToken(token);

  const record = await prisma.$transaction(
    async (tx) => {
      const membership = await tx.programmeMembership.findFirst({
        where: {
          id: input.membershipId,
          programmeId: input.programmeId,
          active: true,
        },
        include: {
          programme: {
            select: {
              status: true,
              startDate: true,
              endDate: true,
              eligibilityMethod: true,
            },
          },
        },
      });
      if (!membership) {
        throw new ProgrammeVerificationError(
          404,
          "membership_not_found",
          "The programme membership does not exist.",
        );
      }
      assertProgrammeAvailable(membership.programme, now);
      if (
        membership.programme.eligibilityMethod !== "INVITATION_TOKEN"
      ) {
        throw new ProgrammeVerificationError(
          409,
          "verification_method_not_supported",
          "This programme requires its configured eligibility workflow.",
        );
      }
      if (membership.verificationStatus === "VERIFIED") {
        throw new ProgrammeVerificationError(
          409,
          "membership_already_verified",
          "The membership is already verified.",
        );
      }
      if (membership.verificationStatus === "REJECTED_VERIFICATION") {
        throw new ProgrammeVerificationError(
          409,
          "membership_rejected",
          "A rejected membership requires a new eligibility review.",
        );
      }

      await tx.programmeVerificationToken.updateMany({
        where: {
          membershipId: membership.id,
          consumedAt: null,
          revokedAt: null,
        },
        data: { revokedAt: now },
      });

      if (membership.verificationStatus === "EXPIRED_VERIFICATION") {
        await tx.programmeMembership.update({
          where: { id: membership.id },
          data: {
            verificationStatus: "PENDING_VERIFICATION",
            verifiedAt: null,
          },
        });
      }

      const created = await tx.programmeVerificationToken.create({
        data: {
          programmeId: input.programmeId,
          membershipId: membership.id,
          tokenHash,
          expiresAt,
          maxAttempts: input.maxAttempts,
          issuedBy: input.actor.id,
        },
        select: { id: true, membershipId: true, programmeId: true, expiresAt: true },
      });

      await tx.auditLog.create({
        data: {
          actorId: input.actor.id,
          actorRole,
          action: "programme_verification_token.issued",
          resourceType: "programme_membership",
          resourceId: membership.id,
          before: { verificationStatus: membership.verificationStatus },
          after: {
            verificationStatus: "PENDING_VERIFICATION",
            tokenId: created.id,
            expiresAt: created.expiresAt.toISOString(),
            maxAttempts: input.maxAttempts,
          },
          reason: "Authorized programme eligibility verification",
        },
      });

      return created;
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      maxWait: 5_000,
      timeout: 15_000,
    },
  );

  return { ...record, token };
}

export async function consumeProgrammeVerificationToken(
  input: ConsumeVerificationTokenInput,
) {
  if (!input.actor.roles.includes("CUSTOMER")) {
    throw new ProgrammeVerificationError(
      403,
      "forbidden",
      "A customer identity is required.",
    );
  }

  const now = new Date();
  const tokenHash = hashProgrammeVerificationToken(input.token);

  const result = await prisma.$transaction(
    async (tx) => {
      const tokenRecord = await tx.programmeVerificationToken.findUnique({
        where: { tokenHash },
        include: {
          programme: {
            select: {
              id: true,
              slug: true,
              status: true,
              startDate: true,
              endDate: true,
            },
          },
          membership: {
            select: {
              id: true,
              customerId: true,
              active: true,
              verificationStatus: true,
              verifiedAt: true,
            },
          },
        },
      });

      if (!tokenRecord) return { verified: false as const };

      const tokenIsUsable =
        tokenRecord.programme.slug === input.programmeSlug &&
        tokenRecord.membership.customerId === input.actor.id &&
        tokenRecord.membership.active &&
        tokenRecord.membership.verificationStatus ===
          "PENDING_VERIFICATION" &&
        !tokenRecord.consumedAt &&
        !tokenRecord.revokedAt &&
        tokenRecord.expiresAt > now &&
        tokenRecord.attemptCount < tokenRecord.maxAttempts;

      if (!tokenIsUsable) {
        if (
          !tokenRecord.consumedAt &&
          !tokenRecord.revokedAt &&
          tokenRecord.attemptCount < tokenRecord.maxAttempts
        ) {
          await tx.programmeVerificationToken.updateMany({
            where: {
              id: tokenRecord.id,
              attemptCount: tokenRecord.attemptCount,
              consumedAt: null,
              revokedAt: null,
            },
            data: { attemptCount: { increment: 1 } },
          });
        }
        return { verified: false as const };
      }

      assertProgrammeAvailable(tokenRecord.programme, now);

      const consumed = await tx.programmeVerificationToken.updateMany({
        where: {
          id: tokenRecord.id,
          attemptCount: tokenRecord.attemptCount,
          consumedAt: null,
          revokedAt: null,
          expiresAt: { gt: now },
        },
        data: {
          attemptCount: { increment: 1 },
          consumedAt: now,
        },
      });
      if (consumed.count !== 1) return { verified: false as const };

      const verified = await tx.programmeMembership.updateMany({
        where: {
          id: tokenRecord.membership.id,
          programmeId: tokenRecord.programme.id,
          customerId: input.actor.id,
          active: true,
          verificationStatus: "PENDING_VERIFICATION",
        },
        data: {
          verificationStatus: "VERIFIED",
          verifiedAt: now,
          eligibilityExpiry: tokenRecord.programme.endDate,
        },
      });
      if (verified.count !== 1) throw invalidToken();

      await tx.programmeVerificationToken.updateMany({
        where: {
          membershipId: tokenRecord.membership.id,
          id: { not: tokenRecord.id },
          consumedAt: null,
          revokedAt: null,
        },
        data: { revokedAt: now },
      });

      await tx.auditLog.create({
        data: {
          actorId: input.actor.id,
          actorRole: "CUSTOMER",
          action: "programme_membership.verified",
          resourceType: "programme_membership",
          resourceId: tokenRecord.membership.id,
          before: {
            verificationStatus:
              tokenRecord.membership.verificationStatus,
            verifiedAt:
              tokenRecord.membership.verifiedAt?.toISOString() ?? null,
          },
          after: {
            verificationStatus: "VERIFIED",
            verifiedAt: now.toISOString(),
            verificationTokenId: tokenRecord.id,
          },
          reason: "Valid one-time programme verification token consumed",
        },
      });

      return {
        verified: true as const,
        value: {
          membershipId: tokenRecord.membership.id,
          programmeId: tokenRecord.programme.id,
          verificationStatus: "VERIFIED" as const,
          verifiedAt: now,
        },
      };
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      maxWait: 5_000,
      timeout: 15_000,
    },
  );

  if (!result.verified) throw invalidToken();
  return result.value;
}

function assertProgrammeAvailable(
  programme: {
    status: string;
    startDate: Date | null;
    endDate: Date | null;
  },
  now: Date,
) {
  if (
    programme.status !== "ACTIVE_PROGRAMME" ||
    (programme.startDate && programme.startDate > now) ||
    (programme.endDate && programme.endDate <= now)
  ) {
    throw new ProgrammeVerificationError(
      409,
      "programme_not_available",
      "The programme is not currently available for verification.",
    );
  }
}

function invalidToken() {
  return new ProgrammeVerificationError(
    400,
    "invalid_or_expired_verification",
    "The verification token is invalid, expired, consumed, or unavailable.",
  );
}

export class ProgrammeVerificationError extends Error {
  constructor(
    public readonly status: 400 | 403 | 404 | 409,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ProgrammeVerificationError";
  }
}
