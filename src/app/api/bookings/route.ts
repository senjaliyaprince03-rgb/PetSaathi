import { NextResponse } from "next/server";

import { isDatabaseConfigured, prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { getCurrentIdentity } from "@/modules/auth/session";
import { BookingGateError, createBookingWithQuote } from "@/modules/bookings/create-booking";
import { createBookingSchema } from "@/modules/bookings/input";
import { consumeRateLimit } from "@/modules/security/rate-limit";

export const dynamic = "force-dynamic";

export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return problem(401, "unauthorized", "Sign in as a pet parent to view bookings.");

  const bookings = await prisma.booking.findMany({
    where: { customerId: identity.id },
    orderBy: { scheduledStart: "desc" },
    take: 50,
    select: {
      id: true,
      reference: true,
      status: true,
      scheduledStart: true,
      scheduledEnd: true,
      quoteAmountPaise: true,
      currency: true,
      pet: { select: { id: true, name: true, species: true } },
      serviceType: { select: { code: true, name: true } },
      address: { select: { label: true, locality: true, city: true } }
    }
  });
  return NextResponse.json({ bookings }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) return problem(503, "service_unavailable", "Booking persistence is not configured.");

  const identity = await getCurrentIdentity();
  if (!identity || !identity.roles.includes("CUSTOMER")) return problem(401, "unauthorized", "Sign in as a pet parent to create a booking.");

  const body: unknown = await request.json().catch(() => null);
  const parsed = createBookingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });

  const rate = await consumeRateLimit("booking-create-user", identity.id, 10, 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests", message: "Too many booking attempts. Please try again later." }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  try {
    const booking = await createBookingWithQuote(identity.id, parsed.data);
    return NextResponse.json({ booking }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof BookingGateError) return problem(error.status, error.code, error.message);
    logger.exception("booking.create_failed", error, {
      customerId: identity.id,
    });
    return problem(500, "booking_failed", "The booking could not be committed safely. No capacity was reserved; please try again.");
  }
}

function problem(status: number, error: string, message: string) {
  return NextResponse.json({ error, message }, { status, headers: { "Cache-Control": "no-store" } });
}
