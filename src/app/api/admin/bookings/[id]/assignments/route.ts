import { NextResponse } from "next/server";
import { z } from "zod";

import { logger } from "@/lib/logger";
import { authorizeApi } from "@/modules/auth/authorization";
import {
  AssignmentOfferError,
  offerRankedAssignment,
} from "@/modules/matching/offer-assignment";
import { consumeRateLimit } from "@/modules/security/rate-limit";

const operationsRoles = ["OPERATIONS_ADMIN", "SUPER_ADMIN"] as const;
const resourceIdSchema = z.string().uuid();
const inputSchema = z.object({ sitterId: z.string().uuid() }).strict();

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const authorization = await authorizeApi(operationsRoles);
  if (!authorization.authorized) return authorization.response;

  const bookingId = resourceIdSchema.safeParse((await context.params).id);
  const input = inputSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!bookingId.success || !input.success) {
    return NextResponse.json(
      {
        error: "invalid_request",
        ...(!input.success ? { issues: input.error.flatten() } : {}),
      },
      { status: 422, headers: { "Cache-Control": "no-store" } },
    );
  }

  const rate = await consumeRateLimit(
    "admin-assignment-offer",
    authorization.identity.id,
    100,
    60 * 60_000,
  );
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "too_many_requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(rate.retryAfterSeconds),
          "Cache-Control": "no-store",
        },
      },
    );
  }

  try {
    const result = await offerRankedAssignment({
      bookingId: bookingId.data,
      sitterId: input.data.sitterId,
      actor: authorization.identity,
    });
    return NextResponse.json(
      {
        assignment: result.assignment,
        idempotent: !result.created,
      },
      {
        status: result.created ? 201 : 200,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    if (error instanceof AssignmentOfferError) {
      return NextResponse.json(
        {
          error: error.code,
          message: error.message,
          ...error.details,
        },
        {
          status: error.status,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }
    logger.error(
      error instanceof Error ? error : "AssignmentOfferError",
      {
        event: "admin.assignment.offer_failed",
        actorId: authorization.identity.id,
        bookingId: bookingId.data,
        sitterId: input.data.sitterId,
      },
    );
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
