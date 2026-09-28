import webpush from "web-push";
import { prisma } from "@/lib/db";

interface PushPayload {
  title: string;
  body: string;
  url?: string;
  actions?: Array<{ action: string; title: string }>;
}

export async function sendPushToUser(userId: string, payload: PushPayload): Promise<void> {
  const { VAPID_SUBJECT, NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
  if (!VAPID_SUBJECT || !NEXT_PUBLIC_VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) throw new Error("Push provider is not configured");
  webpush.setVapidDetails(VAPID_SUBJECT, NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  // Find all active push subscriptions for this user
  const subscriptions = await prisma.notificationOutbox.findMany({
    where: {
      userId,
      channel: "PUSH",
      templateKey: "push_subscription",
      status: "QUEUED",
    },
    take: 20,
  });

  if (!subscriptions.length) throw new Error("No active push subscription");
  let accepted = 0;
  for (const sub of subscriptions) {
    const pushSubscription = JSON.parse(sub.payload as string);
    try {
      await webpush.sendNotification(
        pushSubscription,
        JSON.stringify(payload),
        { timeout: 10_000, TTL: 300 }
      );
      accepted++;
    } catch (error: any) {
      if (error.statusCode === 410 || error.statusCode === 404) {
        // 410 = subscription expired — mark as failed
        await prisma.notificationOutbox.update({
          where: { id: sub.id },
          data: { status: "FAILED", lastError: "Subscription expired" },
        });
      }
    }
  }
  if (!accepted) throw new Error("Push delivery was not accepted");
}
