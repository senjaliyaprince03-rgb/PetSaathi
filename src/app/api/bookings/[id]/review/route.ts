import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

const reviewSchema = z.object({ rating: z.number().int().min(1).max(5), body: z.string().trim().max(1500).optional(), publishPublicly: z.boolean().default(false), publicationConsent: z.boolean().default(false) }).superRefine(({ publishPublicly, publicationConsent }, context) => { if (publishPublicly && !publicationConsent) context.addIssue({ code: z.ZodIssueCode.custom, path: ["publicationConsent"], message: "Separate publication consent is required" }); });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = reviewSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  const booking = await prisma.booking.findFirst({ where: { id, customerId: identity.id }, select: { id: true, status: true, review: { select: { id: true } } } });
  if (!booking) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!["COMPLETED", "CLOSED"].includes(booking.status)) return NextResponse.json({ error: "booking_not_completed" }, { status: 409 });
  if (booking.review) return NextResponse.json({ error: "review_exists" }, { status: 409 });

  const review = await prisma.review.create({ data: { bookingId: booking.id, customerId: identity.id, rating: parsed.data.rating, body: parsed.data.body, public: parsed.data.publishPublicly, consentedAt: parsed.data.publishPublicly ? new Date() : undefined } });
  return NextResponse.json({ review: { id: review.id, rating: review.rating, public: review.public } }, { status: 201 });
}
