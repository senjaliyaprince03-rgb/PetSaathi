import { BookOpen, CalendarPlus, Dog, GraduationCap, History } from "lucide-react";
import { redirect } from "next/navigation";

import { TrainingRequestForm } from "@/components/forms/training-request-form";
import { DashboardEmptyState, DashboardHeading, DashboardPanel, MetricCard, StatusPill } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

const WORKSHOPS = [
  { title: "Puppy Foundation", desc: "Start right with basic manners, socialization, and potty training." },
  { title: "Leash Manners", desc: "Stop pulling and make walks enjoyable for both of you." },
  { title: "Recall Basics", desc: "Reliable recall for safe off-leash freedom." },
  { title: "Society Etiquette", desc: "Polite greetings and calm behavior in public spaces." },
];

export default async function CustomerTrainingPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/customer/training");

  const [dbPets, dbOrders] = await Promise.all([
    prisma.pet.findMany({ where: { ownerId: identity.id, active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.partnerOrder.findMany({ 
      where: { customerId: identity.id, partnerService: { serviceCode: "TRAINING_ASSESSMENT" } }, 
      orderBy: { createdAt: "desc" }, 
      take: 20, 
      select: { id: true, reference: true, status: true, scheduledAt: true, metadata: true, pet: { select: { name: true } } } 
    }),
  ]);

  const pets = dbPets.length > 0 ? dbPets : [{ id: "bruno-passport", name: "Bruno" }];

  const orders = dbOrders.length > 0 ? dbOrders : [
    {
      id: "ord-train-1",
      reference: "TRN-5012",
      status: "COMPLETED",
      scheduledAt: new Date(Date.now() - 12 * 24 * 3600 * 1000),
      metadata: { serviceType: "WORKSHOP" },
      pet: { name: "Bruno" }
    }
  ];

  const workshopCount = orders.filter(o => (o.metadata as any)?.serviceType === "WORKSHOP").length;
  const inProgress = orders.some(o => o.status === "IN_PROGRESS" && (o.metadata as any)?.serviceType === "PROGRAMME");

  return (
    <PortalShell mode="customer" displayName={identity.displayName} showSummaryCards={false}>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <MetricCard icon={GraduationCap} label="Total Sessions" value={orders.length.toString()} hint="Workshops & Individual" tone="indigo" />
        <MetricCard icon={BookOpen} label="Workshops" value={workshopCount.toString()} hint="Attended or scheduled" tone="leaf" />
        <MetricCard icon={Dog} label="Programme" value={inProgress ? "Active" : "None"} hint="Structured training" tone={inProgress ? "saffron" : "indigo"} />
      </div>

      <DashboardPanel className="mt-5" tone="cream">
        <DashboardHeading eyebrow="Learn Together" title="Available Workshops" description="Join our society-wide workshops designed to solve common behavioral challenges." />
        <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WORKSHOPS.map(w => (
            <article key={w.title} className="rounded-2xl border border-ink/10 bg-paper p-5 transition hover:-translate-y-1 hover:border-indigo/20 hover:shadow-lifted">
              <BookOpen className="w-6 h-6 text-indigo mb-3" />
              <h4 className="font-semibold text-lg">{w.title}</h4>
              <p className="mt-2 text-xs text-ink/80 leading-relaxed">{w.desc}</p>
            </article>
          ))}
        </div>
      </DashboardPanel>

      <DashboardPanel className="mt-5">
        <DashboardHeading eyebrow="Booking" title="Request Training Services" description="Book a spot in an upcoming workshop, or request an individual assessment." />
        <TrainingRequestForm pets={pets} />
      </DashboardPanel>

      <DashboardPanel className="mt-5" tone="lavender">
        <DashboardHeading eyebrow="Records" title="Training History" />
        {orders.length ? (
          <div className="mt-7 grid gap-3">
            {orders.map((order) => {
              const meta = order.metadata as any;
              return (
                <article key={order.id} className="rounded-2xl border border-ink/[0.06] bg-paper/90 p-5">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-coral">{order.reference}</p>
                      <h3 className="mt-2 font-display text-xl font-semibold capitalize">
                        {meta?.serviceType?.toLowerCase() || "Training Request"}
                        {meta?.serviceType === "WORKSHOP" && meta?.workshopType && ` - ${meta.workshopType}`}
                      </h3>
                      <p className="mt-1 text-sm text-ink/80">For {order.pet?.name ?? "Unknown pet"}</p>
                      {order.scheduledAt && (
                        <p className="mt-3 text-xs font-semibold text-ink/80 flex items-center gap-1.5">
                          <CalendarPlus className="h-3.5 w-3.5 text-indigo" />
                          {order.scheduledAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                        </p>
                      )}
                    </div>
                    <StatusPill status={order.status} />
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-7">
            <DashboardEmptyState icon={History} title="No training records" description="When you book a workshop or training session, it will appear here." compact />
          </div>
        )}
      </DashboardPanel>
    </PortalShell>
  );
}
