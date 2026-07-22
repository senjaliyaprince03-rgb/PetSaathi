import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { readServerEnv } from "@/lib/env";

export async function POST(request: Request) {
  const env = readServerEnv();
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!env.CRON_SECRET || !token || !sameSecret(env.CRON_SECRET, token)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const now = new Date();
  const cutoff = new Date(now.getTime() - env.TRACKING_RETENTION_DAYS * 24 * 60 * 60_000);
  const [expired, deleted] = await prisma.$transaction([
    prisma.trackingSession.updateMany({ where: { status: "ACTIVE", endedAt: null, expiresAt: { lte: now } }, data: { status: "EXPIRED", endedAt: now } }),
    prisma.trackingPoint.deleteMany({ where: { recordedAt: { lt: cutoff } } })
  ]);
  return NextResponse.json({ expiredSessions: expired.count, deletedPoints: deleted.count, cutoff });
}

function sameSecret(expected: string, received: string) { const expectedBytes = Buffer.from(expected); const receivedBytes = Buffer.from(received); return expectedBytes.length === receivedBytes.length && timingSafeEqual(expectedBytes, receivedBytes); }
