import { PrismaClient, BookingStatus, RiskLevel, PermissionStatus, SitterStatus, AssignmentStatus } from "@prisma/client";

const prisma = new PrismaClient();

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
    include: {
      sitter: {
        include: {
          user: true
        }
      }
    }
  });

  console.log("Permissions found:", permissions.length);
  // Filter and score sitters
  const scoredSitters = permissions
    .filter(p => {
      // Must have active profile
      if (p.sitter.status !== SitterStatus.APPROVED) {
        console.log("Sitter not active", p.sitter.status);
        return false;
      }
      // Must meet risk limit
      if (RiskLevelOrder[p.riskLimit] < requiredRiskValue) {
        console.log("Risk limit too low", p.riskLimit, requiredRiskValue);
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
  return await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking || (booking.status !== BookingStatus.REQUESTED && booking.status !== BookingStatus.MATCHING)) {
      throw new MatchingError("invalid_booking", "Booking not ready for sitter proposal");
    }

    const sitter = await tx.sitterProfile.findUnique({
      where: { id: sitterId, status: SitterStatus.APPROVED }
    });

    if (!sitter) {
      throw new MatchingError("invalid_sitter", "Sitter is invalid or inactive");
    }

    await tx.bookingAssignment.create({
      data: {
        bookingId,
        sitterId,
        status: AssignmentStatus.OFFERED,
        payoutPaise: 15000
      }
    });

    const updatedBooking = await tx.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.SITTER_PROPOSED }
    });

    // Audit log
    await tx.auditLog.create({
      data: {
        actorId: adminId,
        actorRole: "OPERATIONS_ADMIN",
        action: "PROPOSE_SITTER",
        resourceType: "BOOKING",
        resourceId: bookingId,
        after: { sitterId }
      }
    });

    return updatedBooking;
  });
}
