import { BookOpen, CalendarClock, GraduationCap, History, PawPrint, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

import { TrainingRequestForm } from "@/components/forms/training-request-form";
import { DashboardEmptyState, DashboardHeading, DashboardPanel, MetricCard, StatusPill } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function CustomerTrainingPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/customer/training");

  const [pets, orders] = await Promise.all([
    prisma.pet.findMany({
      where: { ownerId: identity.id, active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.partnerOrder.findMany({
      where: {
        customerId: identity.id,
        partnerService: { serviceCode: "TRAINING_ASSESSMENT" },
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
        pet: { select: { name: true } },
      },
    }),
  ]);

  const activeCount = orders.filter((o) => !["COMPLETED", "CANCELLED", "REJECTED"].includes(o.status)).length;

  return (
    <PortalShell mode="customer" displayName={identity.displayName} showSummaryCards={false}>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <MetricCard icon={GraduationCap} label="Training requests" value={`${orders.length} total`} hint="Specialist training assessments" tone="indigo" />
        <MetricCard icon={CalendarClock} label="Active requests" value={`${activeCount} pending`} hint="Specialist matching in progress" tone="coral" />
        <MetricCard icon={ShieldCheck} label="Method guarantee" value="100% Positive" hint="Reward-based training only" tone="leaf" />
      </div>

      <TrainingRequestForm pets={pets} />

      <DashboardPanel className="mt-7" tone="lavender">
        <DashboardHeading eyebrow="Training history" title="Session history & reports" description="Track your pet's training journey and specialist progress notes." />
        {orders.length ? (
          <div className="mt-7 grid gap-3">
            {orders.map((order) => (
              <article key={order.id} className="rounded-[1.5rem] border border-ink/[0.06] bg-paper/90 p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-coral">{order.reference}</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold">Training Request</h3>
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
            <DashboardEmptyState icon={History} title="No training history." description="Submit a training assessment or workshop request above." />
          </div>
        )}
      </DashboardPanel>
    </PortalShell>
  );
}
