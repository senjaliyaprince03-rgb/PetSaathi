import webpush from "web-push";
import { prisma } from "@/lib/db";

// Configure VAPID credentials once
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

interface PushPayload {
  title: string;
  body: string;
  url?: string;
  actions?: Array<{ action: string; title: string }>;
}

export async function sendPushToUser(userId: string, payload: PushPayload): Promise<void> {
  // Find all active push subscriptions for this user
  const subscriptions = await prisma.notificationOutbox.findMany({
    where: {
      userId,
      channel: "PUSH",
      templateKey: "push_subscription",
      status: "QUEUED",
    },
  });

  for (const sub of subscriptions) {
    const pushSubscription = JSON.parse(sub.payload as string);
    try {
      await webpush.sendNotification(
        pushSubscription,
        JSON.stringify(payload)
      );
    } catch (error: any) {
      if (error.statusCode === 410) {
        // 410 = subscription expired — mark as failed
        await prisma.notificationOutbox.update({
          where: { id: sub.id },
          data: { status: "FAILED", lastError: "Subscription expired" },
        });
      }
    }
  }
}