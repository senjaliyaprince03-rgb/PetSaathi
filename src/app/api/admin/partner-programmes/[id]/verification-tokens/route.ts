import { NextResponse } from "next/server";
import { z } from "zod";

import { logger } from "@/lib/logger";
import { adminResourceIdSchema } from "@/modules/admin/mutation";
import { authorizeApi } from "@/modules/auth/authorization";
import {
  issueProgrammeVerificationToken,
  ProgrammeVerificationError,
} from "@/modules/b2b/programme-verification";
import { consumeRateLimit } from "@/modules/security/rate-limit";

const allowedRoles = ["PARTNER_MANAGER", "SUPER_ADMIN"] as const;
const inputSchema = z.object({
  membershipId: z.string().uuid(),
  expiresInMinutes: z.number().int().min(5).max(1_440).default(30),
  maxAttempts: z.number().int().min(1).max(10).default(5),
}).strict();

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const authorization = await authorizeApi(allowedRoles);
  if (!authorization.authorized) return authorization.response;

  const programmeId = adminResourceIdSchema.safeParse(
    (await context.params).id,
  );
  const input = inputSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!programmeId.success || !input.success) {
    return NextResponse.json(
      {
        error: "invalid_request",
        ...(!input.success ? { issues: input.error.flatten() } : {}),
      },
      { status: 422 },
    );
  }

  const rate = await consumeRateLimit(
    "admin-programme-verification-token",
    authorization.identity.id,
    20,
    60 * 60_000,
  );
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "too_many_requests" },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      },
    );
  }

  try {
    const issued = await issueProgrammeVerificationToken({
      programmeId: programmeId.data,
      membershipId: input.data.membershipId,
      expiresInMinutes: input.data.expiresInMinutes,
      maxAttempts: input.data.maxAttempts,
      actor: authorization.identity,
    });
    return NextResponse.json(
      {
        token: issued.token,
        tokenId: issued.id,
        membershipId: issued.membershipId,
        expiresAt: issued.expiresAt,
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
          Pragma: "no-cache",
        },
      },
    );
  } catch (error) {
    if (error instanceof ProgrammeVerificationError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: error.status, headers: { "Cache-Control": "no-store" } },
      );
    }
    logger.error(
      error instanceof Error ? error : "ProgrammeVerificationIssuanceError",
      {
        event: "admin.programme_verification_token.issue_failed",
        actorId: authorization.identity.id,
        programmeId: programmeId.data,
      },
    );
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
