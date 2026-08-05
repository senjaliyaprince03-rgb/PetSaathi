import type { Prisma } from "@prisma/client";
import { BellRing, CheckCheck, Clock3 } from "lucide-react";
import { redirect } from "next/navigation";

import { DashboardHeading, DashboardPanel, MetricCard } from "@/components/portal/dashboard-ui";
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
    select: { id: true, templateKey: true, status: true, scheduledAt: true, payload: true },
  });
  const serialized = notifications.map((item) => ({ ...item, scheduledAt: item.scheduledAt.toISOString(), payload: readPayload(item.payload) }));
  const read = notifications.filter((item) => item.status === "READ").length;
  const queued = notifications.filter((item) => item.status === "QUEUED" || item.status === "SENDING").length;
  const unread = notifications.length - read;

  return (
    <PortalShell mode={mode} displayName={identity.displayName} showSummaryCards={false}>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <MetricCard icon={BellRing} label="Needs attention" value={`${unread} unread`} hint="New authenticated account updates" tone="coral" />
        <MetricCard icon={CheckCheck} label="Reviewed" value={`${read} read`} hint="Updates already acknowledged" tone="leaf" />
        <MetricCard icon={Clock3} label="Delivery queue" value={`${queued} pending`} hint="Scheduled or currently sending" />
      </div>
      <DashboardPanel className="mt-5">
        <DashboardHeading eyebrow="Notification centre" title="Important updates, easy to scan." description="Care, payment, report and safety events are grouped into a focused inbox with clear read state and delivery status." />
        <div className="mt-7"><NotificationList notifications={serialized} /></div>
      </DashboardPanel>
    </PortalShell>
  );
}

function readPayload(value: Prisma.JsonValue): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : null;
}
