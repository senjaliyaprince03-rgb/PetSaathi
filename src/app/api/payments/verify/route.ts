import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { validRazorpayCheckoutSignature } from "@/modules/payments/signature";

const verifySchema = z.object({ orderId: z.string().min(8).max(100), paymentId: z.string().min(8).max(100), signature: z.string().regex(/^[a-f0-9]{64}$/i) });

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return NextResponse.json({ error: "payments_not_configured" }, { status: 503 });

  const parsed = verifySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { orderId, paymentId, signature } = parsed.data;

  const payment = await prisma.payment.findFirst({
    where: { providerOrderId: orderId, booking: { customerId: identity.id } },
    select: { id: true, status: true, bookingId: true, booking: { select: { id: true, status: true } } }
  });
  if (!payment) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!validRazorpayCheckoutSignature(orderId, paymentId, signature, secret)) return NextResponse.json({ error: "invalid_signature" }, { status: 400 });

  if (payment.status !== "CAPTURED") {
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { providerPaymentId: paymentId, signatureVerified: true, status: "CAPTURED", capturedAt: new Date() }
      }),
      prisma.booking.update({
        where: { id: payment.bookingId },
        data: {
          status: "CONFIRMED",
          statusHistory: {
            create: {
              fromState: payment.booking.status,
              toState: "CONFIRMED",
              actorId: identity.id,
              reason: "Verified Razorpay client payment signature"
            }
          }
        }
      }),
      prisma.bookingAssignment.updateMany({
        where: { bookingId: payment.bookingId, status: "CUSTOMER_APPROVED" },
        data: { status: "ACTIVE" }
      })
    ]);

    // Optional MyGate visitor registration if society gate integration is active
    try {
      const confirmedBooking = await prisma.booking.findUnique({
        where: { id: payment.bookingId },
        include: {
          address: true,
          assignments: {
            where: { status: "ACTIVE" },
            take: 1,
            include: { sitter: { include: { user: true } } },
          },
        },
      });

      if (confirmedBooking?.assignments[0]?.sitter?.user) {
        const sitterUser = confirmedBooking.assignments[0].sitter.user;
        const { registerMygateVisitor } = await import("@/lib/mygate");
        await registerMygateVisitor({
          societyGateId: confirmedBooking.addressId,
          visitorName: sitterUser.displayName,
          visitorPhone: sitterUser.phoneE164 || "",
          purposeOfVisit: `PetSaathi care service for booking ${confirmedBooking.reference}`,
          scheduledEntryTime: confirmedBooking.scheduledStart,
          scheduledExitTime: confirmedBooking.scheduledEnd,
          unitNumber: confirmedBooking.address.line1,
        });
      }
    } catch (mygateErr) {
      console.error("[MyGate] Pre-approval registration notice:", mygateErr);
    }

    // Dispatch Booking Confirmation & Payment Receipt emails (fire-and-forget)
    void (async () => {
      try {
        const fullBooking = await prisma.booking.findUnique({
          where: { id: payment.bookingId },
          include: {
            customer: true,
            pet: true,
            serviceType: true,
            payments: { where: { id: payment.id } },
          },
        });

        if (fullBooking?.customer?.email) {
          const { dispatchTransactionalEmail } = await import("@/lib/email/dispatcher");
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://petsaathi.in";
          const formattedDate = fullBooking.scheduledStart.toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const formattedTime = `${fullBooking.scheduledStart.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} – ${fullBooking.scheduledEnd.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;

          // 1. Booking Confirmation Email
          await dispatchTransactionalEmail(
            fullBooking.customerId,
            fullBooking.customer.email,
            "BOOKING_CONFIRMED",
            {
              customerName: fullBooking.customer.displayName || "Pet Parent",
              petName: fullBooking.pet.name,
              serviceName: fullBooking.serviceType.name,
              bookingId: fullBooking.reference,
              bookingDate: formattedDate,
              bookingTime: formattedTime,
              amount: `₹${(fullBooking.quoteAmountPaise / 100).toFixed(0)}`,
              dashboardUrl: `${appUrl}/bookings/${fullBooking.id}`,
            }
          );

          // 2. Payment Receipt Email
          await dispatchTransactionalEmail(
            fullBooking.customerId,
            fullBooking.customer.email,
            "PAYMENT_RECEIPT",
            {
              customerName: fullBooking.customer.displayName || "Pet Parent",
              amount: `₹${((fullBooking.payments[0]?.amountPaise ?? fullBooking.quoteAmountPaise) / 100).toFixed(0)}`,
              bookingId: fullBooking.reference,
              paymentId: paymentId,
              dashboardUrl: `${appUrl}/bookings/${fullBooking.id}`,
            }
          );
        }
      } catch (emailErr) {
        console.error("[EMAIL] Transactional confirmation failed:", emailErr);
      }
    })();
  }
  return NextResponse.json({ verified: true, settlement: "captured" });
}
