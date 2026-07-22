import type { NotificationStatus, Prisma } from "@prisma/client";

/** Mirrors the outbox lifecycle on the immutable incident-notification record. */
export async function syncIncidentNotificationStatus(
  tx: Prisma.TransactionClient,
  notificationId: string,
  status: NotificationStatus,
  occurredAt = new Date()
) {
  await tx.incidentNotification.updateMany({
    where: { notificationId },
    data: {
      status,
      ...(status === "SENT" ? { sentAt: occurredAt } : {}),
      ...(status === "READ" ? { acknowledgedAt: occurredAt } : {})
    }
  });
}
