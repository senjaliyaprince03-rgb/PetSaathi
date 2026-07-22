import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { isFeatureEnabled } from "@/modules/features/server";
import { distanceMetres } from "@/modules/tracking/distance";

const trackingSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("START"), latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180), accuracyM: z.number().positive().max(1000).optional() }),
  z.object({ action: z.literal("POINT"), sessionId: z.string().uuid(), latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180), accuracyM: z.number().positive().max(1000).optional() }),
  z.object({ action: z.literal("STOP"), sessionId: z.string().uuid() })
]);

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!await isFeatureEnabled("live_walk_tracking")) return NextResponse.json({ error: "tracking_feature_disabled" }, { status: 404 });
  const parsed = trackingSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  const assignment = await prisma.bookingAssignment.findFirst({ where: { id, sitter: { userId: identity.id } }, include: { booking: { select: { id: true, status: true, scheduledEnd: true } } } });
  if (!assignment) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (assignment.status !== "ACTIVE" || assignment.booking.status !== "IN_PROGRESS") return NextResponse.json({ error: "tracking_not_available" }, { status: 409 });

  if (parsed.data.action === "START") {
    const active = await prisma.trackingSession.findFirst({ where: { bookingId: assignment.booking.id, status: "ACTIVE", endedAt: null, expiresAt: { gt: new Date() } } });
    if (active) return NextResponse.json({ session: { id: active.id, status: active.status, expiresAt: active.expiresAt } });
    const now = new Date();
    const serviceExpiry = new Date(assignment.booking.scheduledEnd.getTime() + 2 * 60 * 60_000);
    const hardExpiry = new Date(now.getTime() + 12 * 60 * 60_000);
    const expiresAt = serviceExpiry < hardExpiry ? serviceExpiry : hardExpiry;
    const session = await prisma.trackingSession.create({ data: { bookingId: assignment.booking.id, startedAt: now, expiresAt, consentBasis: "SERVICE_FULFILMENT_BROWSER_PERMISSION", status: "ACTIVE", points: { create: { latitude: parsed.data.latitude, longitude: parsed.data.longitude, accuracyM: parsed.data.accuracyM, recordedAt: now } } } });
    return NextResponse.json({ session: { id: session.id, status: session.status, expiresAt: session.expiresAt } }, { status: 201 });
  }

  const session = await prisma.trackingSession.findFirst({ where: { id: parsed.data.sessionId, bookingId: assignment.booking.id, status: "ACTIVE", endedAt: null } });
  if (!session) return NextResponse.json({ error: "active_tracking_session_not_found" }, { status: 404 });
  if (session.expiresAt <= new Date()) {
    await prisma.trackingSession.update({ where: { id: session.id }, data: { status: "EXPIRED", endedAt: new Date() } });
    return NextResponse.json({ error: "tracking_session_expired" }, { status: 410 });
  }
  if (parsed.data.action === "STOP") {
    await prisma.trackingSession.update({ where: { id: session.id }, data: { status: "ENDED", endedAt: new Date() } });
    return NextResponse.json({ stopped: true });
  }

  const previous = await prisma.trackingPoint.findFirst({ where: { sessionId: session.id }, orderBy: { recordedAt: "desc" } });
  const now = new Date();
  if (previous && now.getTime() - previous.recordedAt.getTime() < 10_000) return NextResponse.json({ accepted: false, reason: "rate_limited" }, { status: 429 });
  const addedDistance = previous ? distanceMetres(Number(previous.latitude), Number(previous.longitude), parsed.data.latitude, parsed.data.longitude) : 0;
  await prisma.$transaction([
    prisma.trackingPoint.create({ data: { sessionId: session.id, latitude: parsed.data.latitude, longitude: parsed.data.longitude, accuracyM: parsed.data.accuracyM, recordedAt: now } }),
    prisma.trackingSession.update({ where: { id: session.id }, data: { distanceM: { increment: Math.round(addedDistance) } } })
  ]);
  return NextResponse.json({ accepted: true, recordedAt: now });
}
