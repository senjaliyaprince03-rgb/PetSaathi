import { NextResponse } from "next/server";
import { z } from "zod";

import { logger } from "@/lib/logger";
import { getCurrentIdentity } from "@/modules/auth/session";
import { cancelBookingBeforePayment, CancellationError } from "@/modules/bookings/cancel-booking";
import { consumeRateLimit } from "@/modules/security/rate-limit";

const cancelSchema = z.object({ reason: z.string().trim().min(5).max(500) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return problem(401, "unauthorized", "Sign in as the booking owner to cancel it.");
  const rate = await consumeRateLimit("booking-cancel-user", identity.id, 10, 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests", message: "Too many cancellation attempts. Try again later." }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const parsed = cancelSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await params;

  try {
    const booking = await cancelBookingBeforePayment(id, identity.id, parsed.data.reason);
    return NextResponse.json({ booking }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof CancellationError) return problem(error.status, error.code, error.message);
    logger.exception("booking.cancel_failed", error, {
      bookingId: id,
      customerId: identity.id,
    });
    return problem(500, "cancellation_failed", "Cancellation could not be committed safely. No status was changed.");
  }
}

function problem(status: number, error: string, message: string) {
  return NextResponse.json({ error, message }, { status, headers: { "Cache-Control": "no-store" } });
}
