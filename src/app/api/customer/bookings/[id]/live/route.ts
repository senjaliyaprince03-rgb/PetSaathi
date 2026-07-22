import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await context.params;

  const booking = await prisma.booking.findUnique({
    where: { id, customerId: identity.id },
    select: { id: true, status: true },
  });

  if (!booking) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const session = await prisma.trackingSession.findFirst({
    where: { bookingId: booking.id, status: { in: ["ACTIVE", "ENDED"] } },
    orderBy: { startedAt: "desc" },
    include: {
      points: {
        orderBy: { recordedAt: "asc" },
        select: { latitude: true, longitude: true, recordedAt: true },
      },
    },
  });

  if (!session) return NextResponse.json({ live: false });

  return NextResponse.json({
    live: session.status === "ACTIVE",
    session: {
      id: session.id,
      status: session.status,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      distanceM: session.distanceM,
      points: session.points.map((p) => ({
        lat: Number(p.latitude),
        lng: Number(p.longitude),
        time: p.recordedAt,
      })),
    },
  });
}
