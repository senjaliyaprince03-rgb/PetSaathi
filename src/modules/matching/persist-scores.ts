import "server-only";

import { Prisma, type MatchStatus, type Role } from "@prisma/client";

import { prisma } from "@/lib/db";
import { authorizedActorRole } from "@/modules/auth/authorization";
import type { AppIdentity } from "@/modules/auth/session";
import {
  rankCandidates,
  type MatchCandidate,
} from "@/modules/matching/score-engine";

const operationsRoles = ["OPERATIONS_ADMIN", "SUPER_ADMIN"] as const;

export type PersistedMatchCandidate = MatchCandidate & {
  scoreId: string;
  status: MatchStatus;
};

export async function refreshMatchScores(
  bookingId: string,
  actor: Pick<AppIdentity, "id" | "roles">,
) {
  const actorRole = authorizedActorRole(actor, operationsRoles);
  if (!actorRole) {
    throw new MatchScoreRefreshError(
      403,
      "forbidden",
      "Operations authority is required to refresh match scores.",
    );
  }

  const candidates = await rankCandidates(bookingId);
  return persistRankedMatchScores(
    bookingId,
    candidates,
    actor.id,
    actorRole,
  );
}

async function persistRankedMatchScores(
  bookingId: string,
  candidates: MatchCandidate[],
  actorId: string,
  actorRole: Role,
): Promise<PersistedMatchCandidate[]> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const existing = await tx.matchScore.findMany({
            where: { bookingId },
          });
          const existingBySitter = new Map(
            existing.map((score) => [score.sitterId, score]),
          );
          let changedCount = 0;
          let invalidatedApprovalCount = 0;

          for (const candidate of candidates) {
            const current = existingBySitter.get(candidate.sitterId);
            const snapshotUnchanged =
              current !== undefined &&
              scoreSnapshotMatches(current, candidate);
            const canPreserveStatus =
              current !== undefined &&
              (candidate.requiresHumanApproval
                ? ["PENDING", "APPROVED", "REJECTED"].includes(
                    current.status,
                  )
                : current.status === "RECOMMENDED");

            if (snapshotUnchanged && canPreserveStatus) continue;

            const nextStatus: MatchStatus =
              candidate.requiresHumanApproval ? "PENDING" : "RECOMMENDED";
            const data = {
              totalScore: candidate.totalScore,
              factors:
                candidate.factors as unknown as Prisma.InputJsonValue,
              rank: candidate.rank,
              requiresHumanApproval: candidate.requiresHumanApproval,
              approvalReasons: candidate.approvalReasons,
              status: nextStatus,
              approvedBy: null,
              approvedAt: null,
            };

            if (current) {
              if (current.status === "APPROVED") {
                invalidatedApprovalCount += 1;
              }
              await tx.matchScore.update({
                where: { id: current.id },
                data,
              });
            } else {
              await tx.matchScore.create({
                data: {
                  bookingId,
                  sitterId: candidate.sitterId,
                  ...data,
                },
              });
            }
            changedCount += 1;
          }

          const candidateIds = new Set(
            candidates.map((candidate) => candidate.sitterId),
          );
          const staleScores = existing.filter(
            (score) =>
              !candidateIds.has(score.sitterId) &&
              score.status !== "EXPIRED",
          );
          if (staleScores.length > 0) {
            await tx.matchScore.updateMany({
              where: { id: { in: staleScores.map((score) => score.id) } },
              data: {
                status: "EXPIRED",
                approvedBy: null,
                approvedAt: null,
              },
            });
            changedCount += staleScores.length;
            invalidatedApprovalCount += staleScores.filter(
              (score) => score.status === "APPROVED",
            ).length;
          }

          if (changedCount > 0) {
            await tx.auditLog.create({
              data: {
                actorId,
                actorRole,
                action: "match_scores.refreshed",
                resourceType: "booking",
                resourceId: bookingId,
                before: {
                  candidateCount: existing.length,
                  approvedCount: existing.filter(
                    (score) => score.status === "APPROVED",
                  ).length,
                },
                after: {
                  candidateCount: candidates.length,
                  humanReviewCount: candidates.filter(
                    (candidate) => candidate.requiresHumanApproval,
                  ).length,
                  changedCount,
                  invalidatedApprovalCount,
                },
                reason:
                  "Deterministic server-side candidate ranking refreshed",
              },
            });
          }

          const persisted = await tx.matchScore.findMany({
            where: {
              bookingId,
              sitterId: {
                in: candidates.map((candidate) => candidate.sitterId),
              },
            },
            select: { id: true, sitterId: true, status: true },
          });
          const persistedBySitter = new Map(
            persisted.map((score) => [score.sitterId, score]),
          );

          return candidates.map((candidate) => {
            const score = persistedBySitter.get(candidate.sitterId);
            if (!score) {
              throw new Error("Persisted match score was not found.");
            }
            return {
              ...candidate,
              scoreId: score.id,
              status: score.status,
            };
          });
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 5_000,
          timeout: 15_000,
        },
      );
    } catch (error) {
      const retryable =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === "P2002" || error.code === "P2034");
      if (!retryable || attempt === 2) throw error;
    }
  }

  throw new Error("Match-score refresh retries were exhausted.");
}

function scoreSnapshotMatches(
  current: {
    totalScore: number;
    factors: Prisma.JsonValue;
    rank: number;
    requiresHumanApproval: boolean;
    approvalReasons: string[];
  },
  candidate: MatchCandidate,
) {
  return (
    Math.abs(current.totalScore - candidate.totalScore) < 1e-5 &&
    current.rank === candidate.rank &&
    current.requiresHumanApproval === candidate.requiresHumanApproval &&
    arraysEqual(current.approvalReasons, candidate.approvalReasons) &&
    stableJson(current.factors) === stableJson(candidate.factors)
  );
}

function arraysEqual(left: readonly string[], right: readonly string[]) {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function stableJson(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableJson).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`)
    .join(",")}}`;
}

export class MatchScoreRefreshError extends Error {
  constructor(
    public readonly status: 403,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "MatchScoreRefreshError";
  }
}
