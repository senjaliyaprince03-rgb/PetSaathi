import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import {
  AdminMutationError,
  adminMutationErrorResponse,
  adminResourceIdSchema,
} from "@/modules/admin/mutation";
import { authorizeApi } from "@/modules/auth/authorization";

const allowedRoles = [
  "SOCIETY_MANAGER",
  "OPERATIONS_ADMIN",
  "SUPER_ADMIN",
] as const;

const inputSchema = z.object({
  action: z.enum(["APPROVED", "REJECTED"]),
  reason: z.string().trim().min(5).max(1_000).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authorization = await authorizeApi(allowedRoles);
  if (!authorization.authorized) return authorization.response;

  const idResult = adminResourceIdSchema.safeParse((await params).id);
  if (!idResult.success) {
    return NextResponse.json(
      { error: "invalid_resource_id" },
      { status: 422 },
    );
  }

  const parsed = inputSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { identity, actorRole } = authorization;
  const { action, reason } = parsed.data;
  const id = idResult.data;

  try {
    const membership = await prisma.$transaction(async (tx) => {
      const previous = await tx.communityMembership.findUnique({
        where: { id },
      });
      if (!previous) {
        throw new AdminMutationError(
          404,
          "membership_not_found",
          "The membership does not exist.",
        );
      }
      if (previous.status !== "PENDING") {
        throw new AdminMutationError(
          409,
          "membership_already_decided",
          "Only pending memberships can be approved or rejected.",
        );
      }

      const changed = await tx.communityMembership.updateMany({
        where: { id, status: "PENDING" },
        data: {
          status: action,
          joinedAt: action === "APPROVED" ? new Date() : null,
        },
      });
      if (changed.count !== 1) {
        throw new AdminMutationError(
          409,
          "membership_decision_conflict",
          "The membership was changed by another reviewer.",
        );
      }

      const updated = await tx.communityMembership.findUniqueOrThrow({
        where: { id },
      });

      await tx.auditLog.create({
        data: {
          actorId: identity.id,
          actorRole,
          action:
            action === "APPROVED"
              ? "community_membership.approved"
              : "community_membership.rejected",
          resourceType: "community_membership",
          resourceId: id,
          before: { status: previous.status },
          after: {
            status: updated.status,
            joinedAt: updated.joinedAt?.toISOString() ?? null,
          },
          reason:
            reason ??
            `Membership ${action.toLowerCase()} through the moderation queue`,
          requestId: request.headers.get("x-request-id"),
        },
      });

      return updated;
    });

    return NextResponse.json(
      { membership },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const expected = adminMutationErrorResponse(error);
    if (expected) return expected;
    logger.error(error instanceof Error ? error : "AdminMembershipMutationError", {
      event: "admin.community_membership.mutation_failed",
      resourceId: id,
      actorId: identity.id,
    });
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
