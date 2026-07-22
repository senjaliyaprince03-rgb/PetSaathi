import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // 1. Next booking
  const nextBooking = await prisma.booking.findFirst({
    where: {
      customerId: identity.id,
      status: { in: ["CONFIRMED", "SITTER_EN_ROUTE", "IN_PROGRESS", "REPORT_PENDING"] },
      scheduledEnd: { gt: new Date() },
    },
    orderBy: { scheduledStart: "asc" },
    include: {
      pet: { select: { id: true, name: true, photoPath: true } },
      serviceType: { select: { id: true, name: true, code: true } },
      assignments: {
        where: { status: "ACCEPTED" },
        include: { sitter: { include: { user: { select: { displayName: true } } } } },
      },
      trackingSessions: {
        where: { status: "ACTIVE" },
      },
    },
  });

  // 2. Active Session logic
  let activeSession = null;
  if (nextBooking?.trackingSessions && nextBooking.trackingSessions.length > 0) {
    const session = nextBooking.trackingSessions[0];
    if (session) {
      const latestPoint = await prisma.trackingPoint.findFirst({
        where: { sessionId: session.id },
        orderBy: { recordedAt: "desc" },
      });

      activeSession = {
        id: session.id,
        status: session.status,
        startedAt: session.startedAt,
        distanceM: session.distanceM,
        latestLocation: latestPoint ? { latitude: Number(latestPoint.latitude), longitude: Number(latestPoint.longitude), recordedAt: latestPoint.recordedAt } : null,
      };
    }
  }

  // 3. Service Credits & Loyalty Balance
  const [creditLedger, loyaltyLedger] = await Promise.all([
    prisma.serviceCredit.aggregate({
      where: { userId: identity.id, isActive: true, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
      _sum: { balancePaise: true },
    }),
    prisma.loyaltyLedger.findFirst({
      where: { userId: identity.id },
      orderBy: { createdAt: "desc" },
      select: { balanceAfter: true },
    }),
  ]);

  return NextResponse.json({
    nextBooking: nextBooking ? {
      id: nextBooking.id,
      reference: nextBooking.reference,
      status: nextBooking.status,
      scheduledStart: nextBooking.scheduledStart,
      scheduledEnd: nextBooking.scheduledEnd,
      pet: nextBooking.pet,
      service: nextBooking.serviceType,
      sitter: nextBooking.assignments[0]?.sitter.user.displayName ?? null,
      sitterId: nextBooking.assignments[0]?.sitter.id ?? null,
    } : null,
    activeSession,
    balances: {
      serviceCreditsPaise: creditLedger._sum.balancePaise ?? 0,
      loyaltyCreditsPaise: loyaltyLedger?.balanceAfter ?? 0,
    },
  });
}
