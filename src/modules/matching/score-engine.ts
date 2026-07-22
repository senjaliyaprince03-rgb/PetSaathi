import { prisma } from "@/lib/db";

// ──────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────

export interface MatchFactor {
  name: string;
  score: number;
  weight: number;
  explanation: string;
}

export interface MatchCandidate {
  sitterId: string;
  sitterName: string;
  totalScore: number;
  rank: number;
  factors: MatchFactor[];
  requiresHumanApproval: boolean;
  approvalReasons: string[];
}

const FACTOR_WEIGHTS = {
  history: 0.30,
  reliability: 0.25,
  quality: 0.20,
  locality: 0.15,
  availability: 0.10,
} as const;

// ──────────────────────────────────────────────────────────
// Hard eligibility filters → Soft scoring → Ranking
// ──────────────────────────────────────────────────────────

export async function rankCandidates(bookingId: string): Promise<MatchCandidate[]> {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    select: {
      id: true,
      petId: true,
      serviceTypeId: true,
      pet: { select: { name: true, riskAssessments: true, medications: { where: { active: true } } } },
      serviceType: { select: { code: true } },
    },
  });

  // Determine high-risk flags for this booking
  const riskReasons: string[] = [];
  if (booking.pet.riskAssessments.length > 0) riskReasons.push("Pet has risk assessments on record");
  if (booking.pet.medications.length > 0) riskReasons.push("Pet requires active medication");
  if (booking.serviceType.code === "BOARDING_BETA") riskReasons.push("Boarding request — manual review required");

  const previousIncidents = await prisma.incident.count({
    where: { booking: { petId: booking.petId } },
  });
  if (previousIncidents > 0) riskReasons.push(`Pet involved in ${previousIncidents} previous incident(s)`);

  const requiresHumanApproval = riskReasons.length > 0;

  // ── Hard filters: only APPROVED sitters with no active holds ──
  const eligibleSitters = await prisma.sitterProfile.findMany({
    where: {
      status: "APPROVED",
      holds: { none: { status: "ACTIVE" } },
      permissions: { some: { serviceTypeId: booking.serviceTypeId, status: "ACTIVE" } },
    },
    select: {
      id: true,
      reliabilityScore: true,
      user: { select: { id: true, displayName: true } },
      assignments: {
        where: { booking: { petId: booking.petId }, status: "COMPLETED" },
        select: { id: true },
      },
    },
  });

  // Fetch reviews for eligible sitters via their completed booking assignments
  const sitterIds = eligibleSitters.map((s) => s.id);
  const reviewsByAssignment = await prisma.review.findMany({
    where: { booking: { assignments: { some: { sitterId: { in: sitterIds }, status: "COMPLETED" } } } },
    select: { rating: true, booking: { select: { assignments: { where: { status: "COMPLETED" }, select: { sitterId: true } } } } },
  });

  // Build a map of sitterId → ratings
  const sitterRatings = new Map<string, number[]>();
  for (const review of reviewsByAssignment) {
    for (const assignment of review.booking.assignments) {
      const existing = sitterRatings.get(assignment.sitterId) ?? [];
      existing.push(review.rating);
      sitterRatings.set(assignment.sitterId, existing);
    }
  }

  // ── Score each candidate ──
  const scored = eligibleSitters.map((sitter) => {
    const factors: MatchFactor[] = [];

    // 1. History with this pet
    const completedWithPet = sitter.assignments.length;
    const historyScore = Math.min(completedWithPet / 10, 1);
    factors.push({
      name: "history",
      score: historyScore,
      weight: FACTOR_WEIGHTS.history,
      explanation: completedWithPet > 0 ? `Completed ${completedWithPet} service(s) with this pet` : "No prior history with this pet",
    });

    // 2. Reliability
    const relScore = sitter.reliabilityScore ? Number(sitter.reliabilityScore) : 50;
    const reliabilityNorm = Math.min(relScore / 100, 1);
    factors.push({
      name: "reliability",
      score: reliabilityNorm,
      weight: FACTOR_WEIGHTS.reliability,
      explanation: sitter.reliabilityScore ? `${relScore}% reliability score` : "Reliability data not yet available",
    });

    // 3. Quality (review ratings)
    const ratings = sitterRatings.get(sitter.id) ?? [];
    const avgRating = ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 3;
    const qualityScore = (avgRating - 1) / 4; // normalise 1-5 → 0-1
    factors.push({
      name: "quality",
      score: qualityScore,
      weight: FACTOR_WEIGHTS.quality,
      explanation: ratings.length > 0 ? `${avgRating.toFixed(1)} avg rating from ${ratings.length} review(s)` : "No reviews yet",
    });

    // 4. Locality match (placeholder — would use PostGIS in production)
    const localityScore = 0.5;
    factors.push({
      name: "locality",
      score: localityScore,
      weight: FACTOR_WEIGHTS.locality,
      explanation: "Locality proximity estimated",
    });

    // 5. Availability alignment (placeholder — would check AvailabilityRule)
    const availabilityScore = 0.7;
    factors.push({
      name: "availability",
      score: availabilityScore,
      weight: FACTOR_WEIGHTS.availability,
      explanation: "Schedule alignment estimated",
    });

    const totalScore = factors.reduce((sum, f) => sum + f.score * f.weight, 0);

    return {
      sitterId: sitter.id,
      sitterName: sitter.user.displayName,
      totalScore,
      rank: 0,
      factors,
      requiresHumanApproval,
      approvalReasons: riskReasons,
    } satisfies MatchCandidate;
  });

  // Sort by totalScore descending and assign ranks
  scored.sort((a, b) => b.totalScore - a.totalScore);
  scored.forEach((c, i) => { c.rank = i + 1; });

  return scored;
}
