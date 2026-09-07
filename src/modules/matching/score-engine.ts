import type { AvailabilityRule, RiskLevel } from "@prisma/client";

import { prisma } from "@/lib/db";
import { fetchFastAPI } from "@/lib/fastapi";

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

  // ── Prepare Data for Python Scoring Microservice ──
  const candidatesPayload = eligibleSitters.flatMap((sitter) => {
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
    
    const locality = scoreLocality(sitter.serviceLocality, booking.address.locality);

    return {
      sitterId: sitter.id,
      sitterName: sitter.user.displayName,
      completedWithPet,
      reliabilityScore: sitter.reliabilityScore ? Number(sitter.reliabilityScore) : 50,
      ratings: sitterRatings.get(sitter.id) ?? [],
      localityScore: locality.score,
      localityExplanation: locality.explanation,
      availabilityScore: availability.score,
      availabilityExplanation: availability.explanation,
    };
  });
  
  if (candidatesPayload.length === 0) return [];

  try {
    // ── Score each candidate in FastAPI ──
    const scored = await fetchFastAPI("/api/score-candidates", {
      method: "POST",
      body: JSON.stringify({
        bookingId,
        candidates: candidatesPayload,
        riskReasons
      })
    });

    return scored as MatchCandidate[];
  } catch {
    // FastAPI unavailable (single-node deploys, CI, local dev): fall back to
    // the deterministic in-process implementation of the exact same formula
    // served by api-service/main.py (/api/score-candidates), so ranking
    // degrades instead of silently returning an empty field.
    return scoreCandidatesLocally(candidatesPayload, riskReasons);
  }
}

type LocalCandidateInput = {
  sitterId: string;
  sitterName: string;
  completedWithPet: number;
  reliabilityScore: number;
  ratings: number[];
  localityScore: number;
  localityExplanation: string;
  availabilityScore: number;
  availabilityExplanation: string;
};

/**
 * TypeScript mirror of api-service/main.py `score_candidates`.
 * Keep both implementations in sync when weights change.
 */
export function scoreCandidatesLocally(
  candidates: LocalCandidateInput[],
  riskReasons: string[],
): MatchCandidate[] {
  const FACTOR_WEIGHTS_LOCAL = { history: 0.30, reliability: 0.25, quality: 0.20, locality: 0.15, availability: 0.10 } as const;

  const scored = candidates.map((candidate) => {
    const approvalReasons = [...riskReasons];
    const factors: MatchFactor[] = [];

    const historyScore = Math.min(candidate.completedWithPet / 10.0, 1.0);
    factors.push({
      name: "history",
      score: historyScore,
      weight: FACTOR_WEIGHTS_LOCAL.history,
      explanation:
        candidate.completedWithPet > 0
          ? `Completed ${candidate.completedWithPet} service(s) with this pet`
          : "No prior history with this pet",
    });

    const reliabilityScore = candidate.reliabilityScore ?? 50;
    factors.push({
      name: "reliability",
      score: Math.min(reliabilityScore / 100.0, 1.0),
      weight: FACTOR_WEIGHTS_LOCAL.reliability,
      explanation:
        candidate.reliabilityScore != null
          ? `${reliabilityScore}% reliability score`
          : "Reliability data not yet available",
    });

    const averageRating =
      candidate.ratings.length > 0
        ? candidate.ratings.reduce((sum, rating) => sum + rating, 0) / candidate.ratings.length
        : 3.0;
    factors.push({
      name: "quality",
      score: (averageRating - 1) / 4.0,
      weight: FACTOR_WEIGHTS_LOCAL.quality,
      explanation:
        candidate.ratings.length > 0
          ? `${averageRating.toFixed(1)} avg rating from ${candidate.ratings.length} review(s)`
          : "No reviews yet",
    });

    if (candidate.localityScore < 1.0) approvalReasons.push(candidate.localityExplanation);
    factors.push({
      name: "locality",
      score: candidate.localityScore,
      weight: FACTOR_WEIGHTS_LOCAL.locality,
      explanation: candidate.localityExplanation,
    });

    factors.push({
      name: "availability",
      score: candidate.availabilityScore,
      weight: FACTOR_WEIGHTS_LOCAL.availability,
      explanation: candidate.availabilityExplanation,
    });

    return {
      sitterId: candidate.sitterId,
      sitterName: candidate.sitterName,
      totalScore: factors.reduce((sum, factor) => sum + factor.score * factor.weight, 0),
      rank: 0,
      factors,
      requiresHumanApproval: approvalReasons.length > 0,
      approvalReasons,
    } satisfies MatchCandidate;
  });

  scored.sort((left, right) => right.totalScore - left.totalScore || left.sitterId.localeCompare(right.sitterId));
  return scored.map((candidate, index) => ({ ...candidate, rank: index + 1 }));
}