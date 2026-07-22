import type { NotificationStatus } from "@prisma/client";

export const notificationTransitions: Record<NotificationStatus, readonly NotificationStatus[]> = {
  QUEUED: ["SENDING", "CANCELLED"],
  SENDING: ["QUEUED", "SENT", "FAILED", "CANCELLED"],
  SENT: ["DELIVERED", "READ"],
  DELIVERED: ["READ"],
  READ: [],
  FAILED: ["QUEUED", "CANCELLED"],
  CANCELLED: []
};

export function canTransitionNotification(from: NotificationStatus, to: NotificationStatus) { return notificationTransitions[from].includes(to); }
export function retryDelayMs(attempt: number) { return Math.min(60 * 60_000, 30_000 * 2 ** Math.max(0, attempt - 1)); }
