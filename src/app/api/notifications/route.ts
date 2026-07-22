import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { syncIncidentNotificationStatus } from "@/modules/notifications/incident-delivery";

const readSchema = z.object({ id: z.string().uuid() });

export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const notifications = await prisma.notificationOutbox.findMany({ where: { userId: identity.id, status: { not: "CANCELLED" } }, orderBy: { scheduledAt: "desc" }, take: 50, select: { id: true, channel: true, templateKey: true, payload: true, status: true, scheduledAt: true, sentAt: true } });
  return NextResponse.json({ notifications }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function PATCH(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = readSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 422 });
  const read = await prisma.$transaction(async (tx) => {
    const updated = await tx.notificationOutbox.updateMany({ where: { id: parsed.data.id, userId: identity.id, status: { in: ["SENT", "DELIVERED"] } }, data: { status: "READ" } });
    if (!updated.count) return false;
    await syncIncidentNotificationStatus(tx, parsed.data.id, "READ");
    return true;
  });
  if (!read) return NextResponse.json({ error: "not_found_or_unreadable" }, { status: 404 });
  return NextResponse.json({ read: true });
}
