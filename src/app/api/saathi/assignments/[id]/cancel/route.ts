import { NextResponse } from "next/server";
import { z } from "zod";

import { logger } from "@/lib/logger";
import { getCurrentIdentity } from "@/modules/auth/session";
import { BookingRecoveryError, cancelConfirmedAssignment } from "@/modules/bookings/recovery";
import { consumeRateLimit } from "@/modules/security/rate-limit";

const inputSchema = z.object({ reason: z.string().trim().min(10).max(1000) });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) return problem(403, "forbidden", "A Saathi account is required.");
  const rate = await consumeRateLimit("sitter-assignment-cancel", identity.id, 10, 24 * 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  try {
    const recovery = await cancelConfirmedAssignment(id, identity.id, parsed.data.reason);
    return NextResponse.json({ recovery }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof BookingRecoveryError) return problem(error.status, error.code, error.message);
    logger.exception("assignment.cancel_failed", error, {
      assignmentId: id,
      sitterUserId: identity.id,
    });
    return problem(500, "assignment_cancel_failed", "The replacement request could not be committed safely.");
  }
}

function problem(status: number, error: string, message: string) { return NextResponse.json({ error, message }, { status, headers: { "Cache-Control": "no-store" } }); }
