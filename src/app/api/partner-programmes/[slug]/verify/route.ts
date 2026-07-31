import { NextResponse } from "next/server";
import { z } from "zod";

import { logger } from "@/lib/logger";
import { authorizeApi } from "@/modules/auth/authorization";
import {
  consumeProgrammeVerificationToken,
  ProgrammeVerificationError,
} from "@/modules/b2b/programme-verification";
import {
  consumeRateLimit,
  requestIp,
} from "@/modules/security/rate-limit";

export const dynamic = "force-dynamic";

const inputSchema = z.object({
  token: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
}).strict();
const slugSchema = z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120);

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const authorization = await authorizeApi(["CUSTOMER"]);
  if (!authorization.authorized) return authorization.response;

  const slug = slugSchema.safeParse((await context.params).slug);
  const input = inputSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!slug.success || !input.success) {
    return NextResponse.json(
      { error: "invalid_request" },
      { status: 422, headers: { "Cache-Control": "no-store" } },
    );
  }

  const [identityRate, ipRate] = await Promise.all([
    consumeRateLimit(
      "programme-verification-identity",
      authorization.identity.id,
      10,
      15 * 60_000,
    ),
    consumeRateLimit(
      "programme-verification-ip",
      requestIp(request),
      30,
      15 * 60_000,
    ),
  ]);
  if (!identityRate.allowed || !ipRate.allowed) {
    return NextResponse.json(
      { error: "too_many_attempts" },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(
              identityRate.retryAfterSeconds,
              ipRate.retryAfterSeconds,
            ),
          ),
          "Cache-Control": "no-store",
        },
      },
    );
  }

  try {
    const verified = await consumeProgrammeVerificationToken({
      programmeSlug: slug.data,
      token: input.data.token,
      actor: authorization.identity,
    });
    return NextResponse.json(
      verified,
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof ProgrammeVerificationError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: error.status, headers: { "Cache-Control": "no-store" } },
      );
    }
    logger.error(
      error instanceof Error ? error : "ProgrammeVerificationConsumeError",
      {
        event: "programme_verification.consume_failed",
        actorId: authorization.identity.id,
        programmeSlug: slug.data,
      },
    );
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
