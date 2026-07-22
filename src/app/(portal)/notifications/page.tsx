import type { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

import { NotificationList } from "@/components/portal/notification-list";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login?returnTo=/notifications");
  const mode = identity.roles.includes("SUPER_ADMIN") || identity.roles.includes("OPERATIONS_ADMIN") || identity.roles.includes("SAFETY_ADMIN") ? "admin" : identity.roles.includes("SITTER") ? "saathi" : "customer";
  const notifications = await prisma.notificationOutbox.findMany({
    where: { userId: identity.id, status: { not: "CANCELLED" } },
    orderBy: { scheduledAt: "desc" },
    take: 50,
    select: { id: true, templateKey: true, status: true, scheduledAt: true, payload: true }
  });
  const serialized = notifications.map((item) => ({ ...item, scheduledAt: item.scheduledAt.toISOString(), payload: readPayload(item.payload) }));
  return <PortalShell mode={mode} displayName={identity.displayName}><section className="mt-5 rounded-4xl border border-ink/10 bg-cream/35 p-5 sm:p-7"><p className="eyebrow">Notification centre</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">Your care updates</h2><p className="mb-6 mt-2 max-w-2xl text-sm leading-6 text-ink/55">Only updates connected to your authenticated account are shown here.</p><NotificationList notifications={serialized} /></section></PortalShell>;
}

function readPayload(value: Prisma.JsonValue): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : null;
}
