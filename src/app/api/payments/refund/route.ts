import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getCurrentIdentity } from "@/modules/auth/session";
import { cancelConfirmedBookingWithRefund, CancellationError } from "@/modules/bookings/cancel-booking";
import { processRefund } from "@/modules/payments/refunds";

const inputSchema = z.object({ bookingId: z.string().uuid(), reason: z.string().trim().min(5).max(500) });

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 422 });
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      // Canonical transaction serializes cancellations and releases service resources.
      const result = await cancelConfirmedBookingWithRefund(parsed.data.bookingId, identity.id, parsed.data.reason, new Date(), true);
      const processing = result.refundId ? await processRefund(result.refundId) : null;
      return NextResponse.json({ success: true, refundId: result.refundId, tier: result.policyTier,
        refundAmountPaise: result.refundAmountPaise, status: processing?.refund?.status ?? "NO_REFUND_DUE",
        reconciliationRequired: processing?.uncertain ?? false }, { status: processing?.uncertain ? 202 : 200 });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034" && attempt < 2) continue;
      if (error instanceof CancellationError) return NextResponse.json({ error: error.code, message: error.message }, { status: error.status });
      return NextResponse.json({ error: "refund_reconciliation_required" }, { status: 503 });
    }
  }
  return NextResponse.json({ error: "refund_changed_concurrently" }, { status: 409 });
}
