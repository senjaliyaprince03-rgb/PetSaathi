import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { consumeRateLimit } from "@/modules/security/rate-limit";

const schema = z.object({
  emailCare: z.boolean(),
  whatsappCare: z.boolean(),
  pushCare: z.boolean()
});

const channels = ["EMAIL", "WHATSAPP", "PUSH"] as const;

export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const rows = await prisma.communicationPreference.findMany({ where: { userId: identity.id, purpose: "CARE_UPDATES" }, select: { channel: true, enabled: true, quietHours: true } });
  return NextResponse.json({ preferences: rows }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function PUT(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const rate = await consumeRateLimit("communication-preferences", identity.id, 20, 24 * 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });

  const enabled = [parsed.data.emailCare, parsed.data.whatsappCare, parsed.data.pushCare];
  await prisma.$transaction([
    ...channels.map((channel, index) => prisma.communicationPreference.upsert({
      where: { userId_channel_purpose: { userId: identity.id, channel, purpose: "CARE_UPDATES" } },
      update: { enabled: enabled[index] },
      create: { userId: identity.id, channel, purpose: "CARE_UPDATES", enabled: enabled[index] }
    })),
    prisma.communicationPreference.upsert({
      where: { userId_channel_purpose: { userId: identity.id, channel: "IN_APP", purpose: "CARE_UPDATES" } },
      update: { enabled: true },
      create: { userId: identity.id, channel: "IN_APP", purpose: "CARE_UPDATES", enabled: true }
    }),
    prisma.auditLog.create({ data: { actorId: identity.id, actorRole: identity.roles[0], action: "communication_preferences.updated", resourceType: "user", resourceId: identity.id, after: { purpose: "CARE_UPDATES", enabledChannels: channels.filter((_, index) => enabled[index]) } } })
  ]);
  return NextResponse.json({ updated: true });
}
