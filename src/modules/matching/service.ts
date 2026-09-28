import { BookingStatus, RiskLevel, PermissionStatus, SitterStatus, AssignmentStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { offerRankedAssignment, AssignmentOfferError } from "./offer-assignment";

export class MatchingError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "MatchingError";
  }
}

const RiskLevelOrder: Record<RiskLevel, number> = {
  UNASSESSED: 0,
  GREEN: 1,
  YELLOW: 2,
  RED: 3,
};

export async function findEligibleSitters(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      pet: {
        include: { riskAssessments: { orderBy: { createdAt: 'desc' }, take: 1 } }
      }
    }
  });

  if (!booking) {
    throw new MatchingError("booking_not_found", "Booking not found");
  }

  if (booking.status !== BookingStatus.REQUESTED && booking.status !== BookingStatus.MATCHING) {
    throw new MatchingError("invalid_status", "Booking is not in a valid state for matching");
  }

  // Determine required risk limit
  const petRisk = booking.pet.riskAssessments[0]?.finalLevel || RiskLevel.GREEN;
  const requiredRiskValue = RiskLevelOrder[petRisk];

  // Find permissions that are ACTIVE for this service type
  const permissions = await prisma.sitterServicePermission.findMany({
    where: {
      serviceTypeId: booking.serviceTypeId,
      status: PermissionStatus.ACTIVE,
    },
    take: 100,
    include: {
      sitter: {
        include: {
          user: true
        }
      }
    }
  });

  logger.info("Matching search permissions retrieved", {
    bookingId,
    permissionsCount: permissions.length,
  });

  // Filter and score sitters
  const scoredSitters = permissions
    .filter(p => {
      // Must have active profile
      if (p.sitter.status !== SitterStatus.APPROVED) {
        return false;
      }
      // Must meet risk limit
      if (RiskLevelOrder[p.riskLimit] < requiredRiskValue) {
        return false;
      }
      return true;
    })
    .map(p => {
      // Basic scoring based on reliability and experience
      let score = 0;
      score += p.sitter.yearsExperience * 5;
      score += (p.sitter.reliabilityScore ?? 0) * 10;
      
      return {
        sitterId: p.sitter.id,
        sitterName: p.sitter.user.displayName,
        score,
        reliabilityScore: p.sitter.reliabilityScore,
        yearsExperience: p.sitter.yearsExperience,
        riskLimit: p.riskLimit
      };
    })
    .sort((a, b) => b.score - a.score);

  // Note: Overlapping booking checks would ideally go here, but excluded for MVP

  return scoredSitters;
}

export async function proposeSitter(bookingId: string, sitterId: string, adminId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { id: true, status: true }
  });

  if (!booking) {
    throw new MatchingError("invalid_booking", "Booking not found");
  }

  if (booking.status === BookingStatus.REQUESTED) {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.MATCHING,
        statusHistory: {
          create: {
            fromState: BookingStatus.REQUESTED,
            toState: BookingStatus.MATCHING,
            actorId: adminId,
            reason: "Advanced to MATCHING for assignment offer",
          },
        },
      },
    });
  }

  try {
    await offerRankedAssignment({
      bookingId,
      sitterId,
      actor: { id: adminId, roles: ["OPERATIONS_ADMIN"] },
    });

    return await prisma.booking.findUnique({
      where: { id: bookingId },
    });
  } catch (error) {
    if (error instanceof AssignmentOfferError) {
      throw new MatchingError(error.code, error.message);
    }
    throw error;
  }
}
