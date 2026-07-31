"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { authorizedActorRole } from "@/modules/auth/authorization";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { refreshMatchScores } from "@/modules/matching/persist-scores";

const operationsRoles = ["OPERATIONS_ADMIN", "SUPER_ADMIN"] as const;
const resourceIdSchema = z.string().uuid();
const matchActionSchema = z.enum(["approve", "reject"]);

export async function reviewMatch(matchId: string, action: "approve" | "reject") {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, operationsRoles)) {
    throw new Error("Unauthorized");
  }

  const parsedId = resourceIdSchema.safeParse(matchId);
  const parsedAction = matchActionSchema.safeParse(action);
  if (!parsedId.success || !parsedAction.success) {
    throw new Error("Invalid match review request");
  }

  const actorRole = authorizedActorRole(identity, operationsRoles);
  if (!actorRole) throw new Error("Unauthorized");

  try {
    const target = await prisma.matchScore.findUnique({
      where: { id: parsedId.data },
      select: { bookingId: true },
    });
    if (!target) throw new QueueActionError("Match not found");

    // Re-ranking invalidates stale approvals before a reviewer can act.
    await refreshMatchScores(target.bookingId, identity);
    await prisma.$transaction(async (tx) => {
      const match = await tx.matchScore.findUnique({
        where: { id: parsedId.data },
        select: {
          id: true,
          bookingId: true,
          sitterId: true,
          status: true,
          requiresHumanApproval: true,
          approvalReasons: true,
          booking: { select: { status: true } },
        },
      });
      if (!match) throw new QueueActionError("Match not found");
      if (
        match.booking.status !== "MATCHING" &&
        match.booking.status !== "REPLACEMENT_REQUIRED"
      ) {
        throw new QueueActionError(
          "The booking is no longer accepting match reviews",
        );
      }
      if (match.status !== "PENDING" || !match.requiresHumanApproval) {
        throw new QueueActionError("This match no longer requires review");
      }

      const nextStatus =
        parsedAction.data === "approve" ? "APPROVED" : "REJECTED";
      const changed = await tx.matchScore.updateMany({
        where: {
          id: match.id,
          status: "PENDING",
          requiresHumanApproval: true,
        },
        data: {
          status: nextStatus,
          approvedBy: identity.id,
          approvedAt: new Date(),
        },
      });
      if (changed.count !== 1) {
        throw new QueueActionError(
          "The match was changed by another reviewer",
        );
      }

      await tx.auditLog.create({
        data: {
          actorId: identity.id,
          actorRole,
          action: `match.${nextStatus.toLowerCase()}`,
          resourceType: "match_score",
          resourceId: match.id,
          before: {
            status: match.status,
            requiresHumanApproval: match.requiresHumanApproval,
          },
          after: {
            status: nextStatus,
            requiresHumanApproval: true,
            bookingId: match.bookingId,
            sitterId: match.sitterId,
          },
          reason:
            match.approvalReasons.join("; ") ||
            "Manual match review completed",
        },
      });
    });
  } catch (error) {
    if (error instanceof QueueActionError) throw error;
    logger.error(error instanceof Error ? error : "MatchReviewError", {
      event: "admin.match.review_failed",
      resourceId: parsedId.data,
      actorId: identity.id,
    });
    throw new Error("Match review failed");
  }

  revalidatePath("/admin/operations/queue");
}

export async function advanceBookingToMatching(bookingId: string) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, operationsRoles)) {
    throw new Error("Unauthorized");
  }

  const parsedId = resourceIdSchema.safeParse(bookingId);
  if (!parsedId.success) throw new Error("Invalid booking request");

  const actorRole = authorizedActorRole(identity, operationsRoles);
  if (!actorRole) throw new Error("Unauthorized");

  try {
    await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: parsedId.data },
        select: { id: true, status: true },
      });
      if (!booking) throw new QueueActionError("Booking not found");
      if (booking.status !== "REQUESTED") {
        throw new QueueActionError(
          "Only requested bookings can be advanced to matching",
        );
      }

      const changed = await tx.booking.updateMany({
        where: { id: booking.id, status: "REQUESTED" },
        data: { status: "MATCHING" },
      });
      if (changed.count !== 1) {
        throw new QueueActionError(
          "The booking was changed by another operator",
        );
      }

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: booking.id,
          fromState: "REQUESTED",
          toState: "MATCHING",
          actorId: identity.id,
          reason: "Operations advanced a stalled request to matching",
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: identity.id,
          actorRole,
          action: "booking.advanced_to_matching",
          resourceType: "booking",
          resourceId: booking.id,
          before: { status: booking.status },
          after: { status: "MATCHING" },
          reason: "Operations advanced a stalled request to matching",
        },
      });
    });
  } catch (error) {
    if (error instanceof QueueActionError) throw error;
    logger.error(error instanceof Error ? error : "BookingQueueActionError", {
      event: "admin.booking.advance_to_matching_failed",
      resourceId: parsedId.data,
      actorId: identity.id,
    });
    throw new Error("Booking intervention failed");
  }

  revalidatePath("/admin/operations/queue");
}

class QueueActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QueueActionError";
  }
}
