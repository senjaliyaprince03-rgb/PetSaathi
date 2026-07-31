import { NextResponse } from "next/server";
import { z } from "zod";

import { logger } from "@/lib/logger";
import { authorizeApi } from "@/modules/auth/authorization";
import {
  enrollMember,
  getAvailableProgrammeBySlug,
  ProgrammeEnrollmentError,
  ProgrammeLookupError,
} from "@/modules/b2b/programmes";
import { consumeRateLimit } from "@/modules/security/rate-limit";

export const dynamic = "force-dynamic";

const slugSchema = z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120);
const inputSchema = z.object({}).strict();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const authorization = await authorizeApi(["CUSTOMER"]);
  if (!authorization.authorized) return authorization.response;

  const slug = slugSchema.safeParse((await params).slug);
  const rawBody = await request.text();
  let body: unknown = {};
  if (rawBody.trim()) {
    try {
      body = JSON.parse(rawBody) as unknown;
    } catch {
      body = null;
    }
  }
  const input = inputSchema.safeParse(body);
  if (!slug.success || !input.success) {
    return NextResponse.json(
      { error: "invalid_request" },
      { status: 422, headers: { "Cache-Control": "no-store" } },
    );
  }

  const rate = await consumeRateLimit(
    "programme-enrollment",
    authorization.identity.id,
    10,
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
    const programme = await getAvailableProgrammeBySlug(slug.data);
    const result = await enrollMember(
      programme.id,
      authorization.identity.id,
    );
    return NextResponse.json(
      {
        membershipId: result.membership.id,
        verificationStatus: result.membership.verificationStatus,
        created: result.created,
      },
      {
        status: result.created ? 201 : 200,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    if (error instanceof ProgrammeLookupError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: error.status, headers: { "Cache-Control": "no-store" } },
      );
    }
    if (error instanceof ProgrammeEnrollmentError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: error.status, headers: { "Cache-Control": "no-store" } },
      );
    }
    logger.error(
      error instanceof Error ? error : "ProgrammeEnrollmentError",
      {
        event: "programme.enrollment_failed",
        actorId: authorization.identity.id,
        programmeSlug: slug.data,
      },
    );
    return NextResponse.json(
      { error: "enrollment_failed" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
