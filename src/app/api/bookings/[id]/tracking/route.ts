import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { isFeatureEnabled } from "@/modules/features/server";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!await isFeatureEnabled("live_walk_tracking")) return NextResponse.json({ error: "tracking_feature_disabled" }, { status: 404 });
  const { id } = await context.params;
  const booking = await prisma.booking.findUnique({ where: { id }, select: { customerId: true, assignments: { where: { status: { in: ["CUSTOMER_APPROVED", "ACTIVE", "COMPLETED"] } }, select: { sitter: { select: { userId: true } } } } } });
  if (!booking) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const allowed = booking.customerId === identity.id || booking.assignments.some(({ sitter }) => sitter.userId === identity.id) || hasAnyRole(identity, ["OPERATIONS_ADMIN", "SAFETY_ADMIN", "SUPER_ADMIN"]);
  if (!allowed) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const session = await prisma.trackingSession.findFirst({ where: { bookingId: id }, orderBy: { startedAt: "desc" }, include: { points: { orderBy: { recordedAt: "desc" }, take: 250 } } });
  if (!session) return NextResponse.json({ session: null }, { headers: { "Cache-Control": "private, no-store" } });
  return NextResponse.json({ session: { id: session.id, status: session.status, startedAt: session.startedAt, endedAt: session.endedAt, expiresAt: session.expiresAt, distanceM: session.distanceM, points: session.points.reverse().map((point) => ({ latitude: Number(point.latitude), longitude: Number(point.longitude), accuracyM: point.accuracyM ? Number(point.accuracyM) : null, recordedAt: point.recordedAt })) } }, { headers: { "Cache-Control": "private, no-store" } });
}
