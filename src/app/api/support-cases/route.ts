import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { consumeRateLimit } from "@/modules/security/rate-limit";

const schema = z.object({
  category: z.enum(["ACCOUNT", "BOOKING", "PAYMENT", "SAFETY", "TECHNICAL", "OTHER"]),
  subject: z.string().trim().min(5).max(120),
  description: z.string().trim().min(20).max(3000),
  bookingId: z.string().uuid().optional(),
  priority: z.enum(["LOW", "MODERATE", "HIGH"]).default("LOW")
});

export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const cases = await prisma.supportCase.findMany({
    where: { userId: identity.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, reference: true, category: true, subject: true, priority: true, status: true, resolution: true, createdAt: true, updatedAt: true, resolvedAt: true }
  });
  return NextResponse.json({ cases }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });

  const rate = await consumeRateLimit("support-case-user", identity.id, 5, 24 * 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });

  if (parsed.data.bookingId) {
    const booking = await prisma.booking.findFirst({ where: { id: parsed.data.bookingId, customerId: identity.id }, select: { id: true } });
    if (!booking) return NextResponse.json({ error: "booking_not_found" }, { status: 404 });
  }

  const created = await prisma.supportCase.create({
    data: {
      reference: `SC-${randomUUID().slice(0, 8).toUpperCase()}`,
      userId: identity.id,
      bookingId: parsed.data.bookingId,
      category: parsed.data.category,
      subject: parsed.data.subject,
      description: parsed.data.description,
      priority: parsed.data.priority
    }
  });
  return NextResponse.json({ case: { id: created.id, reference: created.reference, status: created.status } }, { status: 201 });
}
