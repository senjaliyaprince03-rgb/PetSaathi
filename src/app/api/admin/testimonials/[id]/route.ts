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
import { hasBoundTestimonialConsent } from "@/modules/marketing/testimonials";

const allowedRoles = ["CONTENT_ADMIN", "SUPER_ADMIN"] as const;

const inputSchema = z.object({
  action: z.enum(["APPROVED", "PUBLISHED", "REJECTED"]),
  reason: z.string().trim().min(5).max(1_000).optional(),
}).strict();

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
    const testimonial = await prisma.$transaction(async (tx) => {
      const previous = await tx.testimonial.findUnique({
        where: { id },
        include: {
          consent: true,
          booking: {
            select: {
              customerId: true,
              status: true,
            },
          },
        },
      });
      if (!previous) {
        throw new AdminMutationError(
          404,
          "testimonial_not_found",
          "The testimonial does not exist.",
        );
      }

      const now = new Date();
      const nextStatus =
        action === "REJECTED" ? "ARCHIVED" : action;
      const allowed =
        (action === "APPROVED" &&
          ["DRAFT", "IN_REVIEW"].includes(previous.status)) ||
        (action === "PUBLISHED" && previous.status === "APPROVED") ||
        (action === "REJECTED" &&
          ["DRAFT", "IN_REVIEW", "APPROVED"].includes(previous.status));
      if (!allowed) {
        throw new AdminMutationError(
          409,
          "invalid_testimonial_transition",
          `A testimonial cannot move from ${previous.status} to ${nextStatus}.`,
        );
      }

      if (
        action === "PUBLISHED" &&
        !hasBoundTestimonialConsent({
          userId: previous.userId,
          bookingId: previous.bookingId,
          quote: previous.quote,
          consent: previous.consent,
          booking: previous.booking,
          now,
        })
      ) {
        throw new AdminMutationError(
          409,
          "bound_testimonial_consent_required",
          "Publishing requires active consent bound to this customer, completed booking, and exact testimonial copy.",
        );
      }

      const changed = await tx.testimonial.updateMany({
        where: { id, status: previous.status },
        data: {
          status: nextStatus,
          publishedAt: action === "PUBLISHED" ? now : null,
        },
      });
      if (changed.count !== 1) {
        throw new AdminMutationError(
          409,
          "testimonial_transition_conflict",
          "The testimonial was changed by another reviewer.",
        );
      }

      const updated = await tx.testimonial.findUniqueOrThrow({
        where: { id },
      });

      await tx.auditLog.create({
        data: {
          actorId: identity.id,
          actorRole,
          action: `testimonial.${nextStatus.toLowerCase()}`,
          resourceType: "testimonial",
          resourceId: id,
          before: {
            status: previous.status,
            publishedAt: previous.publishedAt?.toISOString() ?? null,
          },
          after: {
            status: updated.status,
            publishedAt: updated.publishedAt?.toISOString() ?? null,
          },
          reason:
            reason ??
            `Testimonial ${nextStatus.toLowerCase()} through the moderation queue`,
          requestId: request.headers.get("x-request-id"),
        },
      });

      return updated;
    });

    return NextResponse.json(
      { testimonial },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const expected = adminMutationErrorResponse(error);
    if (expected) return expected;
    logger.error(
      error instanceof Error ? error : "AdminTestimonialMutationError",
      {
        event: "admin.testimonial.mutation_failed",
        resourceId: id,
        actorId: identity.id,
      },
    );
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
