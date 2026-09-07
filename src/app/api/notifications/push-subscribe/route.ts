import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

const subscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export async function POST(request: NextRequest) {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = subscriptionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_subscription" }, { status: 422 });

  const subscription = parsed.data;

  // Upsert using idempotencyKey as unique identifier (endpoint)
  await prisma.notificationOutbox.upsert({
    where: {
      idempotencyKey: `push_sub:${subscription.endpoint}`,
    },
    create: {
      userId: identity.id,
      channel: "PUSH",
      templateKey: "push_subscription",
      destination: subscription.endpoint,
      payload: JSON.stringify(subscription),
      status: "QUEUED",
      idempotencyKey: `push_sub:${subscription.endpoint}`,
    },
    update: {
      payload: JSON.stringify(subscription),
      status: "QUEUED",
    },
  });

  return NextResponse.json({ success: true });
}