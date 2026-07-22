import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { consumeRateLimit } from "@/modules/security/rate-limit";

const schema = z.object({
  category: z.enum(["CARE_QUALITY", "COMMUNICATION", "NO_SHOW", "PROPERTY", "PAYMENT", "SAFETY", "OTHER"]),
  description: z.string().trim().min(30).max(4000),
  severity: z.enum(["LOW", "MODERATE", "HIGH"])
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;

  const booking = await prisma.booking.findFirst({
    where: { id, customerId: identity.id },
    select: { id: true, assignments: { where: { status: { in: ["CUSTOMER_APPROVED", "ACTIVE", "COMPLETED"] } }, orderBy: { offeredAt: "desc" }, take: 1, select: { sitterId: true } } }
  });
  if (!booking) return NextResponse.json({ error: "booking_not_found" }, { status: 404 });

  const duplicate = await prisma.complaint.findFirst({ where: { bookingId: id, customerId: identity.id, status: { notIn: ["CLOSED", "REJECTED"] } }, select: { reference: true } });
  if (duplicate) return NextResponse.json({ error: "complaint_already_open", reference: duplicate.reference }, { status: 409 });

  const rate = await consumeRateLimit("booking-complaint-user", identity.id, 3, 24 * 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });

  const created = await prisma.complaint.create({
    data: {
      reference: `CP-${randomUUID().slice(0, 8).toUpperCase()}`,
      bookingId: id,
      customerId: identity.id,
      sitterId: booking.assignments[0]?.sitterId,
      category: parsed.data.category,
      description: parsed.data.description,
      severity: parsed.data.severity
    }
  });
  return NextResponse.json({ complaint: { id: created.id, reference: created.reference, status: created.status } }, { status: 201 });
}
