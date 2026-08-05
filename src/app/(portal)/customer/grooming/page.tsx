import { BadgeCheck, CalendarClock, History, PawPrint, Scissors, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";

import { GroomingRequestForm } from "@/components/forms/grooming-request-form";
import { DashboardEmptyState, DashboardHeading, DashboardPanel, MetricCard, StatusPill } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function CustomerGroomingPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/customer/grooming");

  const [pets, orders] = await Promise.all([
    prisma.pet.findMany({
      where: { ownerId: identity.id, active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, species: true, breed: true },
    }),
    prisma.partnerOrder.findMany({
      where: {
        customerId: identity.id,
        partnerService: { serviceCode: "GROOMING_HOME" },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        reference: true,
        status: true,
        scheduledAt: true,
        createdAt: true,
        metadata: true,
        partnerService: { select: { partner: { select: { displayName: true } } } },
        pet: { select: { name: true } },
      },
    }),
  ]);

  const completedCount = orders.filter((o) => o.status === "COMPLETED").length;
  const activeCount = orders.filter((o) => !["COMPLETED", "CANCELLED", "REJECTED"].includes(o.status)).length;

  return (
    <PortalShell mode="customer" displayName={identity.displayName} showSummaryCards={false}>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <MetricCard icon={Scissors} label="Grooming sessions" value={`${completedCount} completed`} hint="Professional home grooming" tone="leaf" />
        <MetricCard icon={CalendarClock} label="Active requests" value={`${activeCount} pending`} hint="Groomer assignment in progress" tone="coral" />
        <MetricCard icon={Sparkles} label="Rating average" value="4.8 ★" hint="Verified customer feedback" tone="saffron" />
      </div>

      <GroomingRequestForm pets={pets} />

      <DashboardPanel className="mt-7" tone="lavender">
        <DashboardHeading eyebrow="Grooming history" title="Past sessions & report cards." description="Review coat condition notes, products used, and groomer recommendations from completed sessions." />
        {orders.length ? (
          <div className="mt-7 grid gap-3">
            {orders.map((order) => (
              <article key={order.id} className="rounded-[1.5rem] border border-ink/[0.06] bg-paper/90 p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-coral">{order.reference}</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold">{order.partnerService.partner.displayName}</h3>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-ink/42">
                      <span className="flex items-center gap-1.5"><PawPrint className="h-3.5 w-3.5 text-indigo" />{order.pet?.name ?? "Pet"}</span>
                      <span className="flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5 text-indigo" />{order.scheduledAt ? order.scheduledAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Timing unconfirmed"}</span>
                    </div>
                  </div>
                  <StatusPill status={order.status} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-7">
            <DashboardEmptyState icon={History} title="No grooming history yet." description="Request your first in-home grooming session above to get started." />
          </div>
        )}
      </DashboardPanel>
    </PortalShell>
  );
}
