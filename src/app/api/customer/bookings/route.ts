import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { consumeCredits } from "@/modules/credits/credit-ledger";

const createBookingSchema = z.object({
  petId: z.string().uuid(),
  serviceTypeId: z.string().uuid(),
  scheduledStart: z.string().datetime(),
  scheduledEnd: z.string().datetime(),
  useCredits: z.boolean().default(false),
  idempotencyKey: z.string(),
});

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = createBookingSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });

  const { petId, serviceTypeId, scheduledStart, scheduledEnd, useCredits, idempotencyKey } = parsed.data;

  // Pricing placeholder (would be calculated via pricing engine in production)
  const pricePaise = 25000; // ₹250

  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Create the booking as REQUESTED
      const booking = await tx.booking.create({
        data: {
          reference: `BK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          customerId: identity.id,
          petId,
          serviceTypeId,
          scheduledStart: new Date(scheduledStart),
          scheduledEnd: new Date(scheduledEnd),
          timezone: "Asia/Kolkata",
          status: "REQUESTED",
          quoteAmountPaise: pricePaise,
          addressId: "00000000-0000-0000-0000-000000000000", // Placeholder for actual logic
        },
      });

      // 2. Consume credits if requested
      if (useCredits) {
        try {
          await consumeCredits({
            userId: identity.id,
            amountPaise: pricePaise,
            reason: "Payment for booking",
            referenceType: "booking",
            referenceId: booking.id,
            idempotencyKey: `pay_${booking.id}_${idempotencyKey}`,
          });
        } catch (error: unknown) {
          if (error instanceof Error && error.name === "InsufficientCreditsError") {
            throw new Error("INSUFFICIENT_CREDITS");
          }
          throw error;
        }

        // If paid with credits, transition to MATCHING directly
        await tx.booking.update({
          where: { id: booking.id },
          data: { status: "MATCHING" },
        });
      }

      return NextResponse.json({
        id: booking.id,
        reference: booking.reference,
        status: useCredits ? "MATCHING" : "PAYMENT_PENDING",
      }, { status: 201 });
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "INSUFFICIENT_CREDITS") {
      return NextResponse.json({ error: "insufficient_credits", message: "Not enough service credits to complete this booking." }, { status: 402 });
    }
    console.error("Booking error:", error);
    return NextResponse.json({ error: "internal_server_error" }, { status: 500 });
  }
}
