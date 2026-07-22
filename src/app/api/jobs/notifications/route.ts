import { timingSafeEqual } from "node:crypto";

import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { syncIncidentNotificationStatus } from "@/modules/notifications/incident-delivery";
import { sendProviderMessage } from "@/modules/notifications/providers";
import { retryDelayMs } from "@/modules/notifications/state-machine";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!secret || !token || !sameSecret(secret, token)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const candidates = await prisma.notificationOutbox.findMany({ where: { status: "QUEUED", scheduledAt: { lte: new Date() } }, orderBy: { scheduledAt: "asc" }, take: 25 });
  let sent = 0;
  let failed = 0;
  for (const candidate of candidates) {
    const claimed = await prisma.$transaction(async (tx) => {
      const claim = await tx.notificationOutbox.updateMany({ where: { id: candidate.id, status: "QUEUED" }, data: { status: "SENDING" } });
      if (claim.count !== 1) return false;
      await syncIncidentNotificationStatus(tx, candidate.id, "SENDING");
      return true;
    });
    if (!claimed) continue;
    try {
      const provider = await sendProviderMessage({ channel: candidate.channel, destination: candidate.destination, templateKey: candidate.templateKey, payload: candidate.payload });
      await prisma.$transaction(async (tx) => {
        const sentAt = new Date();
        await tx.notificationOutbox.update({ where: { id: candidate.id }, data: { status: "SENT", sentAt, attempts: { increment: 1 }, lastError: null } });
        await tx.notificationDelivery.create({ data: { notificationId: candidate.id, providerMessageId: provider.providerMessageId, status: "SENT", providerPayload: provider.providerPayload as Prisma.InputJsonValue } });
        await syncIncidentNotificationStatus(tx, candidate.id, "SENT", sentAt);
      });
      sent += 1;
    } catch {
      const nextAttempt = candidate.attempts + 1;
      const finalFailure = nextAttempt >= 5;
      const status = finalFailure ? "FAILED" : "QUEUED";
      await prisma.$transaction(async (tx) => {
        await tx.notificationOutbox.update({ where: { id: candidate.id }, data: { status, attempts: nextAttempt, scheduledAt: new Date(Date.now() + retryDelayMs(nextAttempt)), lastError: "Provider delivery failed" } });
        await syncIncidentNotificationStatus(tx, candidate.id, status);
      });
      failed += 1;
    }
  }
  return NextResponse.json({ processed: sent + failed, sent, failed });
}

function sameSecret(expected: string, received: string) { const expectedBytes = Buffer.from(expected); const receivedBytes = Buffer.from(received); return expectedBytes.length === receivedBytes.length && timingSafeEqual(expectedBytes, receivedBytes); }
