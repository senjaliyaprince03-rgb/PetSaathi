import type { AvailabilityRule, RiskLevel } from "@prisma/client";

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

const riskRank: Record<RiskLevel, number> = {
  UNASSESSED: 0,
  GREEN: 1,
  YELLOW: 2,
  RED: 3,
};

type AvailabilityInput = {
  rules: Pick<AvailabilityRule, "weekday" | "startTime" | "endTime" | "timezone" | "active">[];
  exceptions: { startsAt: Date; endsAt: Date; available: boolean }[];
  conflicts: { booking: { scheduledStart: Date; scheduledEnd: Date } }[];
  scheduledStart: Date;
  scheduledEnd: Date;
  timezone: string;
};

function normaliseLocality(value: string | null | undefined) {
  return value?.trim().toLocaleLowerCase("en-IN").replace(/\s+/g, " ") ?? "";
}

function intervalsOverlap(startA: Date, endA: Date, startB: Date, endB: Date) {
  return startA < endB && endA > startB;
}

function parseClock(value: string) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function zonedDayAndMinute(date: Date, timezone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  );
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    parts.weekday ?? "",
  );
  const hour = Number(parts.hour);
  const minute = Number(parts.minute);
  if (weekday < 0 || !Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  return { weekday, minuteOfDay: hour * 60 + minute };
}

export function isRiskWithinPermission(requested: RiskLevel, limit: RiskLevel) {
  if (requested === "UNASSESSED") return true;
  return riskRank[requested] <= riskRank[limit];
}

export function scoreAvailability(input: AvailabilityInput) {
  const conflict = input.conflicts.some(({ booking }) =>
    intervalsOverlap(
      input.scheduledStart,
      input.scheduledEnd,
      booking.scheduledStart,
      booking.scheduledEnd,
    ),
  );
  if (conflict) {
    return { score: 0, explanation: "Conflicts with another active assignment" };
  }

  const overlappingExceptions = input.exceptions.filter((exception) =>
    intervalsOverlap(
      input.scheduledStart,
      input.scheduledEnd,
      exception.startsAt,
      exception.endsAt,
    ),
  );
  if (overlappingExceptions.some((exception) => !exception.available)) {
    return { score: 0, explanation: "Marked unavailable for this time" };
  }
  if (
    overlappingExceptions.some(
      (exception) =>
        exception.available &&
        exception.startsAt <= input.scheduledStart &&
        exception.endsAt >= input.scheduledEnd,
    )
  ) {
    return { score: 1, explanation: "Explicit availability exception covers the booking" };
  }

  const start = zonedDayAndMinute(input.scheduledStart, input.timezone);
  const end = zonedDayAndMinute(input.scheduledEnd, input.timezone);
  if (!start || !end || start.weekday !== end.weekday) {
    return { score: 0, explanation: "Booking crosses an unsupported availability boundary" };
  }

  const matchingRule = input.rules.some((rule) => {
    if (!rule.active || rule.weekday !== start.weekday) return false;
    const ruleStart = parseClock(rule.startTime);
    const ruleEnd = parseClock(rule.endTime);
    return (
      ruleStart !== null &&
      ruleEnd !== null &&
      start.minuteOfDay >= ruleStart &&
      end.minuteOfDay <= ruleEnd
    );
  });

  return matchingRule
    ? { score: 1, explanation: "Weekly availability covers the full booking" }
    : { score: 0, explanation: "No availability rule covers the full booking" };
}

export function scoreLocality(sitterLocality: string | null, bookingLocality: string) {
  const sitter = normaliseLocality(sitterLocality);
  const booking = normaliseLocality(bookingLocality);
  if (!sitter) return { score: 0, explanation: "Service locality is not configured" };
  if (sitter === booking) return { score: 1, explanation: "Exact locality match" };
  return {
    score: 0.25,
    explanation: "Different locality; Operations must verify travel feasibility",
  };
}

// ──────────────────────────────────────────────────────────
// Hard eligibility filters → Soft scoring → Ranking
// ──────────────────────────────────────────────────────────

export async function rankCandidates(bookingId: string): Promise<MatchCandidate[]> {
  const now = new Date();
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    select: {
      id: true,
      petId: true,
      serviceTypeId: true,
      scheduledStart: true,
      scheduledEnd: true,
      address: { select: { locality: true, city: true } },
      timezone: true,
      pet: {
        select: {
          name: true,
          riskAssessments: {
            orderBy: { createdAt: "desc" },
            select: { serviceCode: true, finalLevel: true, expiresAt: true },
          },
          medications: { where: { active: true } },
        },
      },
      serviceType: { select: { code: true } },
    },
  });

  const activeRiskAssessment = booking.pet.riskAssessments.find(
    (assessment) =>
      assessment.serviceCode === booking.serviceType.code &&
      (!assessment.expiresAt || assessment.expiresAt > now),
  );
  const requestedRisk = activeRiskAssessment?.finalLevel ?? "UNASSESSED";

  // A current GREEN assessment is the normal direct-offer path. Only missing
  // or elevated risk signals require an Operations approval.
  const riskReasons: string[] = [];
  if (requestedRisk === "UNASSESSED") {
    riskReasons.push("Service-specific risk has not been assessed");
  } else if (requestedRisk !== "GREEN") {
    riskReasons.push(`Service-specific risk is ${requestedRisk.toLowerCase()}`);
  }
  if (booking.pet.medications.length > 0) riskReasons.push("Pet requires active medication");
  if (booking.serviceType.code === "BOARDING_BETA") riskReasons.push("Boarding request — manual review required");

  const previousIncidents = await prisma.incident.count({
    where: { booking: { petId: booking.petId } },
  });
  if (previousIncidents > 0) riskReasons.push(`Pet involved in ${previousIncidents} previous incident(s)`);

  // ── Hard filters: only APPROVED sitters with no active holds ──
  const eligibleSitters = await prisma.sitterProfile.findMany({
    where: {
      status: "APPROVED",
      holds: {
        none: {
          status: "ACTIVE",
          OR: [
            { expiresAt: null },
            { expiresAt: { isSet: false } },
            { expiresAt: { gt: now } },
          ],
        },
      },
      permissions: {
        some: {
          serviceTypeId: booking.serviceTypeId,
          status: "ACTIVE",
          OR: [
            { expiresAt: null },
            { expiresAt: { isSet: false } },
            { expiresAt: { gt: now } },
          ],
        },
      },
    },
    select: {
      id: true,
      reliabilityScore: true,
      serviceLocality: true,
      availabilityRules: true,
      availabilityExceptions: {
        where: {
          startsAt: { lt: booking.scheduledEnd },
          endsAt: { gt: booking.scheduledStart },
        },
        select: { startsAt: true, endsAt: true, available: true },
      },
      permissions: {
        where: {
          serviceTypeId: booking.serviceTypeId,
          status: "ACTIVE",
          OR: [
            { expiresAt: null },
            { expiresAt: { isSet: false } },
            { expiresAt: { gt: now } },
          ],
        },
        select: { riskLimit: true, expiresAt: true },
      },
      user: { select: { id: true, displayName: true } },
      assignments: {
        where: {
          OR: [
            { booking: { petId: booking.petId }, status: "COMPLETED" },
            {
              bookingId: { not: booking.id },
              status: { in: ["OFFERED", "ACCEPTED", "CUSTOMER_APPROVED", "ACTIVE"] },
              booking: {
                scheduledStart: { lt: booking.scheduledEnd },
                scheduledEnd: { gt: booking.scheduledStart },
              },
            },
          ],
        },
        select: {
          id: true,
          status: true,
          booking: {
            select: { petId: true, scheduledStart: true, scheduledEnd: true },
          },
        },
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
  const scored = eligibleSitters.flatMap((sitter) => {
    const permission = sitter.permissions[0];
    if (
      !permission ||
      (permission.expiresAt && permission.expiresAt <= now) ||
      !isRiskWithinPermission(requestedRisk, permission.riskLimit)
    ) {
      return [];
    }

    const completedWithPet = sitter.assignments.filter(
      (assignment) =>
        assignment.status === "COMPLETED" && assignment.booking.petId === booking.petId,
    ).length;
    const conflicts = sitter.assignments.filter((assignment) =>
      ["OFFERED", "ACCEPTED", "CUSTOMER_APPROVED", "ACTIVE"].includes(
        assignment.status,
      ),
    );
    const availability = scoreAvailability({
      rules: sitter.availabilityRules,
      exceptions: sitter.availabilityExceptions,
      conflicts,
      scheduledStart: booking.scheduledStart,
      scheduledEnd: booking.scheduledEnd,
      timezone: booking.timezone,
    });
    if (availability.score === 0) return [];

    const factors: MatchFactor[] = [];
    const candidateApprovalReasons = [...riskReasons];

    // 1. History with this pet
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

    // 4. Locality match. The schema has no verified sitter coordinates, so a
    // different locality is deliberately low-scored and sent to Operations.
    const locality = scoreLocality(sitter.serviceLocality, booking.address.locality);
    if (locality.score < 1) candidateApprovalReasons.push(locality.explanation);
    factors.push({
      name: "locality",
      score: locality.score,
      weight: FACTOR_WEIGHTS.locality,
      explanation: locality.explanation,
    });

    // 5. Availability alignment
    factors.push({
      name: "availability",
      score: availability.score,
      weight: FACTOR_WEIGHTS.availability,
      explanation: availability.explanation,
    });

    const totalScore = factors.reduce((sum, f) => sum + f.score * f.weight, 0);

    return {
      sitterId: sitter.id,
      sitterName: sitter.user.displayName,
      totalScore,
      rank: 0,
      factors,
      requiresHumanApproval: candidateApprovalReasons.length > 0,
      approvalReasons: candidateApprovalReasons,
    } satisfies MatchCandidate;
  });

  // Sort by totalScore descending and assign ranks
  scored.sort(
    (a, b) => b.totalScore - a.totalScore || a.sitterId.localeCompare(b.sitterId),
  );
  scored.forEach((c, i) => { c.rank = i + 1; });

  return scored;
}
