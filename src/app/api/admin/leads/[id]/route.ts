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
import { canTransitionLead } from "@/modules/leads/state-machine";

const allowedRoles = [
  "OPERATIONS_ADMIN",
  "SUPER_ADMIN",
] as const;

const inputSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "PILOT_PROPOSED", "CONVERTED", "DISQUALIFIED"]),
  reason: z.string().trim().min(5).max(1_000),
}).strict();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authorization = await authorizeApi(allowedRoles);
  if (!authorization.authorized) return authorization.response;

  const idResult = adminResourceIdSchema.safeParse((await params).id);
  if (!idResult.success) {
    return NextResponse.json(
      { error: "invalid_resource_id" },
      { status: 422, headers: { "Cache-Control": "no-store" } },
    );
  }

  const parsed = inputSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", issues: parsed.error.flatten() },
      { status: 422, headers: { "Cache-Control": "no-store" } },
    );
  }

  const { identity, actorRole } = authorization;
  const { status, reason } = parsed.data;
  const id = idResult.data;

  try {
    const lead = await prisma.$transaction(async (tx) => {
      const previous = await tx.lead.findUnique({ where: { id } });
      if (!previous) {
        throw new AdminMutationError(
          404,
          "lead_not_found",
          "The lead does not exist.",
        );
      }
      if (!canTransitionLead(previous.status, status)) {
        throw new AdminMutationError(
          409,
          "invalid_lead_transition",
          `A lead cannot move from ${previous.status} to ${status}.`,
        );
      }

      const changed = await tx.lead.updateMany({
        where: { id, status: previous.status },
        data: { status, assignedTo: identity.id },
      });
      if (changed.count !== 1) {
        throw new AdminMutationError(
          409,
          "lead_transition_conflict",
          "The lead was changed by another reviewer.",
        );
      }

      const updated = await tx.lead.findUniqueOrThrow({ where: { id } });

      await tx.auditLog.create({
        data: {
          actorId: identity.id,
          actorRole,
          action: "lead.transition",
          resourceType: "lead",
          resourceId: id,
          before: {
            status: previous.status,
            assignedTo: previous.assignedTo,
          },
          after: {
            status: updated.status,
            assignedTo: updated.assignedTo,
          },
          reason,
          requestId: request.headers.get("x-request-id"),
        },
      });

      return updated;
    });

    return NextResponse.json(
      { lead },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const expected = adminMutationErrorResponse(error);
    if (expected) return expected;
    logger.error(error instanceof Error ? error : "AdminLeadMutationError", {
      event: "admin.lead.mutation_failed",
      resourceId: id,
      actorId: identity.id,
    });
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
