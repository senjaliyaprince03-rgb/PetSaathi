import "server-only";

import { Prisma, type AssignmentType } from "@prisma/client";

import { prisma } from "@/lib/db";
import { authorizedActorRole } from "@/modules/auth/authorization";
import type { AppIdentity } from "@/modules/auth/session";
import { refreshMatchScores } from "@/modules/matching/persist-scores";
import { sitterEligibility } from "@/modules/sitters/eligibility";

const operationsRoles = ["OPERATIONS_ADMIN", "SUPER_ADMIN"] as const;

type OfferAssignmentInput = {
  bookingId: string;
  sitterId: string;
  actor: Pick<AppIdentity, "id" | "roles">;
};

export async function offerRankedAssignment(input: OfferAssignmentInput) {
  const actorRole = authorizedActorRole(input.actor, operationsRoles);
  if (!actorRole) {
    throw new AssignmentOfferError(
      403,
      "forbidden",
      "Operations authority is required.",
    );
  }

  const existing = await findIdempotentOffer(
    input.bookingId,
    input.sitterId,
  );
  if (existing) return { assignment: existing, created: false };

  let candidates;
  try {
    candidates = await refreshMatchScores(input.bookingId, input.actor);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new AssignmentOfferError(
        404,
        "not_found",
        "The booking was not found.",
      );
    }
    throw error;
  }

  const candidate = candidates.find(
    (item) => item.sitterId === input.sitterId,
  );
  if (!candidate) {
    throw new AssignmentOfferError(
      409,
      "sitter_ineligible",
      "The Saathi is not in the current eligible ranking.",
    );
  }
  if (
    candidate.requiresHumanApproval &&
    candidate.status !== "APPROVED"
  ) {
    throw new AssignmentOfferError(
      409,
      candidate.status === "REJECTED"
        ? "match_rejected"
        : "human_approval_required",
      candidate.status === "REJECTED"
        ? "This ranked match was rejected by Operations."
        : "This ranked match requires Operations approval before an offer.",
      {
        scoreId: candidate.scoreId,
        reasons: candidate.approvalReasons,
      },
    );
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const result = await prisma.$transaction(
        async (tx) => {
          const booking = await tx.booking.findUnique({
            where: { id: input.bookingId },
            include: {
              serviceType: { select: { id: true, code: true } },
              priceQuotes: {
                where: { acceptedAt: { not: null } },
                orderBy: { acceptedAt: "desc" },
                take: 1,
                select: {
                  totalPaise: true,
                  servicePrice: { select: { sitterPaise: true } },
                },
              },
            },
          });
          if (!booking) {
            throw new AssignmentOfferError(
              404,
              "not_found",
              "The booking was not found.",
            );
          }

          if (booking.status === "SITTER_PROPOSED") {
            const duplicate = await tx.bookingAssignment.findFirst({
              where: {
                bookingId: booking.id,
                sitterId: input.sitterId,
                type: { in: ["PRIMARY", "REPLACEMENT"] },
                status: "OFFERED",
              },
              orderBy: { offeredAt: "desc" },
            });
            if (duplicate) {
              return { assignment: duplicate, created: false as const };
            }
          }
          if (
            booking.status !== "MATCHING" &&
            booking.status !== "REPLACEMENT_REQUIRED"
          ) {
            throw new AssignmentOfferError(
              409,
              "invalid_booking_state",
              "The booking is not accepting assignment offers.",
            );
          }

          const score = await tx.matchScore.findUnique({
            where: {
              bookingId_sitterId: {
                bookingId: booking.id,
                sitterId: input.sitterId,
              },
            },
            select: {
              id: true,
              status: true,
              requiresHumanApproval: true,
            },
          });
          if (!score) {
            throw new AssignmentOfferError(
              409,
              "match_score_missing",
              "Refresh the ranked candidates before offering an assignment.",
            );
          }
          if (
            score.requiresHumanApproval &&
            score.status !== "APPROVED"
          ) {
            throw new AssignmentOfferError(
              409,
              score.status === "REJECTED"
                ? "match_rejected"
                : "human_approval_required",
              "The ranked candidate is not approved for an offer.",
            );
          }

          const acceptedQuote = booking.priceQuotes[0];
          if (
            !acceptedQuote?.servicePrice ||
            acceptedQuote.totalPaise !== booking.quoteAmountPaise
          ) {
            throw new AssignmentOfferError(
              409,
              "payout_policy_not_configured",
              "The accepted immutable quote is missing its approved Saathi amount.",
            );
          }

          const now = new Date();
          const sitter = await tx.sitterProfile.findUnique({
            where: { id: input.sitterId },
            select: {
              id: true,
              status: true,
              userId: true,
              holds: {
                where: {
                  status: "ACTIVE",
                  OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
                },
                take: 1,
                select: { id: true },
              },
              permissions: {
                where: {
                  serviceTypeId: booking.serviceType.id,
                  status: "ACTIVE",
                  OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
                },
                take: 1,
                select: {
                  status: true,
                  expiresAt: true,
                  riskLimit: true,
                },
              },
            },
          });
          const permission = sitter?.permissions[0];
          if (!sitter || !permission) {
            throw new AssignmentOfferError(
              409,
              "sitter_not_permitted",
              "The Saathi does not have an active service permission.",
            );
          }

          const activeRisk = await tx.petRiskAssessment.findFirst({
            where: {
              petId: booking.petId,
              serviceCode: booking.serviceType.code,
              OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
            },
            orderBy: { createdAt: "desc" },
            select: { finalLevel: true },
          });
          const conflictCount = await tx.bookingAssignment.count({
            where: {
              sitterId: sitter.id,
              status: {
                in: ["OFFERED", "ACCEPTED", "CUSTOMER_APPROVED", "ACTIVE"],
              },
              bookingId: { not: booking.id },
              booking: {
                scheduledStart: { lt: booking.scheduledEnd },
                scheduledEnd: { gt: booking.scheduledStart },
              },
            },
          });
          const eligibility = sitterEligibility({
            sitterStatus: sitter.status,
            permissionStatus: permission.status,
            permissionExpiresAt: permission.expiresAt,
            riskLimit: permission.riskLimit,
            petRisk: activeRisk?.finalLevel ?? "UNASSESSED",
            hasScheduleConflict: conflictCount > 0,
            hasActiveHold: sitter.holds.length > 0,
          });
          if (!eligibility.eligible) {
            throw new AssignmentOfferError(
              409,
              "sitter_ineligible",
              "The Saathi failed the current eligibility checks.",
              { reasons: eligibility.reasons },
            );
          }

          const assignmentType: AssignmentType =
            booking.status === "REPLACEMENT_REQUIRED"
              ? "REPLACEMENT"
              : "PRIMARY";
          const changed = await tx.booking.updateMany({
            where: {
              id: booking.id,
              status: booking.status,
            },
            data: { status: "SITTER_PROPOSED" },
          });
          if (changed.count !== 1) {
            throw new AssignmentOfferError(
              409,
              "booking_changed",
              "The booking was changed by another operator.",
            );
          }

          const created = await tx.bookingAssignment.create({
            data: {
              bookingId: booking.id,
              sitterId: sitter.id,
              type: assignmentType,
              payoutPaise: acceptedQuote.servicePrice.sitterPaise,
              responseDueAt: new Date(now.getTime() + 30 * 60_000),
            },
          });
          await tx.bookingStatusHistory.create({
            data: {
              bookingId: booking.id,
              fromState: booking.status,
              toState: "SITTER_PROPOSED",
              actorId: input.actor.id,
              reason:
                assignmentType === "REPLACEMENT"
                  ? "Eligible replacement Saathi offered by operations"
                  : "Eligible Saathi offered by operations",
              metadata: {
                assignmentId: created.id,
                assignmentType,
                matchScoreId: score.id,
              },
            },
          });
          await tx.auditLog.create({
            data: {
              actorId: input.actor.id,
              actorRole,
              action: "booking.assignment_offered",
              resourceType: "booking_assignment",
              resourceId: created.id,
              before: { bookingStatus: booking.status },
              after: {
                bookingStatus: "SITTER_PROPOSED",
                sitterId: sitter.id,
                assignmentType,
                payoutPaise: created.payoutPaise,
                matchScoreId: score.id,
                humanApprovalRequired: score.requiresHumanApproval,
              },
              reason: score.requiresHumanApproval
                ? "Server eligibility checks and human match approval passed"
                : "Server eligibility checks passed",
            },
          });
          await tx.notificationOutbox.create({
            data: {
              userId: sitter.userId,
              channel: "IN_APP",
              templateKey:
                assignmentType === "REPLACEMENT"
                  ? "assignment.replacement_offered"
                  : "assignment.offered",
              destination: sitter.userId,
              payload: {
                assignmentId: created.id,
                bookingId: booking.id,
                assignmentType,
                responseDueAt: created.responseDueAt?.toISOString(),
              },
              idempotencyKey: `assignment-offered:${created.id}`,
            },
          });

          return { assignment: created, created: true as const };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 5_000,
          timeout: 15_000,
        },
      );
      return result;
    } catch (error) {
      if (error instanceof AssignmentOfferError) throw error;
      const retryable =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034";
      if (retryable && attempt < 2) continue;

      const uniqueConflict =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002";
      if (uniqueConflict) {
        // The database partial unique index is the final concurrency guard.
        const duplicate = await findIdempotentOffer(
          input.bookingId,
          input.sitterId,
        );
        if (duplicate) return { assignment: duplicate, created: false };
        throw new AssignmentOfferError(
          409,
          "assignment_conflict",
          "Another active assignment offer already exists.",
        );
      }
      throw error;
    }
  }

  throw new Error("Assignment-offer transaction retries were exhausted.");
}

async function findIdempotentOffer(bookingId: string, sitterId: string) {
  return prisma.bookingAssignment.findFirst({
    where: {
      bookingId,
      sitterId,
      type: { in: ["PRIMARY", "REPLACEMENT"] },
      status: "OFFERED",
      booking: { status: "SITTER_PROPOSED" },
    },
    orderBy: { offeredAt: "desc" },
  });
}

export class AssignmentOfferError extends Error {
  constructor(
    public readonly status: 403 | 404 | 409,
    public readonly code: string,
    message: string,
    public readonly details?: {
      scoreId?: string;
      reasons?: string[];
    },
  ) {
    super(message);
    this.name = "AssignmentOfferError";
  }
}
