import { timingSafeEqual } from "node:crypto";

import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { syncIncidentNotificationStatus } from "@/modules/notifications/incident-delivery";
import { sendProviderMessage } from "@/modules/notifications/providers";
import { retryDelayMs } from "@/modules/notifications/state-machine";

export const dynamic = "force-dynamic";

const DELIVERY_LEASE_MS = 2 * 60_000;
const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
  return processNotifications(request);
}

export async function GET(request: Request) {
  return processNotifications(request);
}

async function processNotifications(request: Request) {
  const secret = process.env.CRON_SECRET;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!secret || !token || !sameSecret(secret, token)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const now = new Date();
  const candidates = await prisma.notificationOutbox.findMany({
    where: {
      scheduledAt: { lte: now },
      status: { in: ["QUEUED", "SENDING"] },
    },
    orderBy: { scheduledAt: "asc" },
    take: 10,
  });
  let sent = 0;
  let failed = 0;
  for (const candidate of candidates) {
    if (candidate.attempts >= MAX_ATTEMPTS) {
      const exhausted = await prisma.$transaction(async (tx) => {
        const update = await tx.notificationOutbox.updateMany({
          where: {
            id: candidate.id,
            status: candidate.status,
            attempts: { gte: MAX_ATTEMPTS },
          },
          data: {
            status: "FAILED",
            lastError: "Delivery lease expired after the final attempt",
          },
        });
        if (update.count === 1) {
          await syncIncidentNotificationStatus(tx, candidate.id, "FAILED");
        }
        return update;
      });
      if (exhausted.count === 1) failed += 1;
      continue;
    }

    const claimed = await prisma.$transaction(async (tx) => {
      const claim = await tx.notificationOutbox.updateMany({
        where: {
          id: candidate.id,
          status: candidate.status,
          scheduledAt: { lte: now },
        },
        data: {
          status: "SENDING",
          attempts: { increment: 1 },
          scheduledAt: new Date(Date.now() + DELIVERY_LEASE_MS),
        },
      });
      if (claim.count !== 1) return false;
      await syncIncidentNotificationStatus(tx, candidate.id, "SENDING");
      return true;
    });
    if (!claimed) continue;
    try {
      const provider = await sendProviderMessage({
        channel: candidate.channel,
        destination: candidate.destination,
        templateKey: candidate.templateKey,
        payload: candidate.payload,
        idempotencyKey: candidate.idempotencyKey,
      });
      await prisma.$transaction(async (tx) => {
        const sentAt = new Date();
        await tx.notificationOutbox.update({
          where: { id: candidate.id },
          data: { status: "SENT", sentAt, lastError: null },
        });
        await tx.notificationDelivery.create({ data: { notificationId: candidate.id, providerMessageId: provider.providerMessageId, status: "SENT", providerPayload: provider.providerPayload as Prisma.InputJsonValue } });
        await syncIncidentNotificationStatus(tx, candidate.id, "SENT", sentAt);
      });
      sent += 1;
    } catch {
      const nextAttempt = candidate.attempts + 1;
      const finalFailure = nextAttempt >= MAX_ATTEMPTS;
      const status = finalFailure ? "FAILED" : "QUEUED";
      await prisma.$transaction(async (tx) => {
        await tx.notificationOutbox.update({
          where: { id: candidate.id },
          data: {
            status,
            scheduledAt: new Date(Date.now() + retryDelayMs(nextAttempt)),
            lastError: "Provider delivery failed",
          },
        });
        await syncIncidentNotificationStatus(tx, candidate.id, status);
      });
      failed += 1;
    }
  }
  return NextResponse.json({ processed: sent + failed, sent, failed });
}

function sameSecret(expected: string, received: string) { const expectedBytes = Buffer.from(expected); const receivedBytes = Buffer.from(received); return expectedBytes.length === receivedBytes.length && timingSafeEqual(expectedBytes, receivedBytes); }
