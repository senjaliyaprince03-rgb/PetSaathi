import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { canTransitionBooking, type BookingStatus } from "@/modules/bookings/state-machine";
import { consumeRateLimit } from "@/modules/security/rate-limit";

const eventSchema = z.object({
  type: z.enum(["EN_ROUTE", "CHECK_IN", "CARE_UPDATE", "CHECK_OUT"]),
  notes: z.string().trim().min(2).max(1000).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional()
});

const eventTransitions: Partial<Record<z.infer<typeof eventSchema>["type"], BookingStatus>> = { EN_ROUTE: "SITTER_EN_ROUTE", CHECK_IN: "IN_PROGRESS", CHECK_OUT: "REPORT_PENDING" };

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const rate = await consumeRateLimit("sitter-service-event", identity.id, 250, 24 * 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const parsed = eventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  const assignment = await prisma.bookingAssignment.findFirst({ where: { id, sitter: { userId: identity.id } }, include: { booking: { select: { id: true, status: true } } } });
  if (!assignment) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!["CUSTOMER_APPROVED", "ACTIVE"].includes(assignment.status)) return NextResponse.json({ error: "assignment_not_active" }, { status: 409 });

  const toState = eventTransitions[parsed.data.type];
  if (toState && !canTransitionBooking(assignment.booking.status, toState)) return NextResponse.json({ error: "invalid_booking_transition" }, { status: 409 });
  if (!toState && assignment.booking.status !== "IN_PROGRESS") return NextResponse.json({ error: "service_not_in_progress" }, { status: 409 });

  const serviceEvent = await prisma.$transaction(async (tx) => {
    const created = await tx.serviceEvent.create({ data: { bookingId: assignment.booking.id, actorId: identity.id, type: parsed.data.type, notes: parsed.data.notes, latitude: parsed.data.latitude, longitude: parsed.data.longitude } });
    if (toState) await tx.booking.update({ where: { id: assignment.booking.id }, data: { status: toState, statusHistory: { create: { fromState: assignment.booking.status, toState, actorId: identity.id, reason: `Sitter recorded ${parsed.data.type.toLowerCase().replaceAll("_", " ")}` } } } });
    if (parsed.data.type === "CHECK_IN") await tx.bookingAssignment.update({ where: { id: assignment.id }, data: { status: "ACTIVE", activatedAt: new Date() } });
    if (parsed.data.type === "CHECK_OUT") await tx.trackingSession.updateMany({ where: { bookingId: assignment.booking.id, status: "ACTIVE", endedAt: null }, data: { status: "ENDED", endedAt: new Date() } });
    await tx.auditLog.create({ data: { actorId: identity.id, actorRole: "SITTER", action: "booking.service_event_recorded", resourceType: "service_event", resourceId: created.id, before: { bookingStatus: assignment.booking.status }, after: { bookingStatus: toState ?? assignment.booking.status, eventType: created.type }, reason: parsed.data.notes } });
    return created;
  });
  return NextResponse.json({ event: { id: serviceEvent.id, type: serviceEvent.type, occurredAt: serviceEvent.occurredAt }, bookingStatus: toState ?? assignment.booking.status }, { status: 201 });
}
