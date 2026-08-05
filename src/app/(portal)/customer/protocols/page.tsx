import { CalendarDays, ChevronRight, ClipboardCheck, Clock3, FileCheck2, PawPrint, Route } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardEmptyState, DashboardHeading, DashboardPanel, MetricCard, StatusPill } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

const activeStates = ["REQUESTED", "RISK_REVIEW", "MATCHING", "SITTER_PROPOSED", "CUSTOMER_APPROVAL_PENDING", "PAYMENT_PENDING", "CONFIRMED", "SITTER_EN_ROUTE", "IN_PROGRESS", "REPORT_PENDING", "COMPLETED"] as const;
const journeyStages = ["REQUESTED", "MATCHING", "CUSTOMER_APPROVAL_PENDING", "PAYMENT_PENDING", "CONFIRMED", "IN_PROGRESS", "REPORT_PENDING", "COMPLETED", "CLOSED"];

export default async function CareProtocolsPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/customer/protocols");

  const bookings = await prisma.booking.findMany({
    where: { customerId: identity.id },
    orderBy: { scheduledStart: "desc" },
    take: 40,
    select: {
      id: true,
      reference: true,
      status: true,
      scheduledStart: true,
      serviceType: { select: { name: true } },
      pet: { select: { name: true, species: true } },
      reports: { select: { id: true } },
      assignments: { where: { status: { in: ["CUSTOMER_APPROVED", "ACTIVE", "COMPLETED"] } }, take: 1, select: { sitter: { select: { user: { select: { displayName: true } } } } } },
    },
  });

  const active = bookings.filter((item) => (activeStates as readonly string[]).includes(item.status)).length;
  const completed = bookings.filter((item) => ["COMPLETED", "CLOSED"].includes(item.status)).length;
  const reports = bookings.reduce((sum, item) => sum + item.reports.length, 0);

  return (
    <PortalShell mode="customer" displayName={identity.displayName} showSummaryCards={false}>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <MetricCard icon={Route} label="In motion" value={`${active} active`} hint="Requests moving through care gates" />
        <MetricCard icon={ClipboardCheck} label="Completed" value={`${completed} protocols`} hint="Finished or safely closed" tone="leaf" />
        <MetricCard icon={FileCheck2} label="Care evidence" value={`${reports} reports`} hint="Submitted care report cards" tone="coral" />
      </div>

      <DashboardPanel className="mt-5">
        <DashboardHeading
          eyebrow="Care journey timeline"
          title="Every decision, in the right order."
          description="The timeline keeps matching, payment, care milestones and evidence attached to one accountable protocol."
          action={<Link href="/book" className={buttonVariants({ variant: "accent" })}>Request new care</Link>}
        />

        {bookings.length ? (
          <div className="relative mt-8 grid gap-4 before:absolute before:bottom-8 before:left-[1.28rem] before:top-8 before:w-px before:bg-gradient-to-b before:from-coral/40 before:via-indigo/20 before:to-transparent sm:before:left-[1.53rem]">
            {bookings.map((booking) => {
              const rawIndex = journeyStages.indexOf(booking.status);
              const progress = rawIndex < 0 ? 18 : Math.max(8, Math.round(((rawIndex + 1) / journeyStages.length) * 100));
              return (
                <article key={booking.id} className="relative pl-12 sm:pl-14" data-motion="rise">
                  <span className="absolute left-2 top-6 z-10 flex h-7 w-7 items-center justify-center rounded-full border-4 border-[#f5f1ec] bg-coral shadow-sm sm:left-3"><span className="h-1.5 w-1.5 rounded-full bg-paper" /></span>
                  <Link href={`/bookings/${booking.id}`} className="group block rounded-[1.75rem] border border-ink/[0.07] bg-cream/40 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-indigo/20 hover:bg-paper hover:shadow-lifted sm:p-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2"><p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-coral">{booking.reference}</p><StatusPill status={booking.status} /></div>
                        <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">{booking.serviceType.name} for {booking.pet.name}</h3>
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink/45">
                          <span className="flex items-center gap-1.5"><PawPrint className="h-3.5 w-3.5 text-indigo" />{booking.pet.species.toLowerCase()}</span>
                          <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-indigo" />{booking.scheduledStart.toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                          <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-indigo" />{booking.scheduledStart.toLocaleTimeString("en-IN", { timeStyle: "short" })}</span>
                          {booking.assignments[0] ? <span>{booking.assignments[0].sitter.user.displayName}</span> : null}
                        </div>
                      </div>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper text-ink/30 shadow-sm transition group-hover:bg-indigo group-hover:text-paper"><ChevronRight className="h-5 w-5" /></span>
                    </div>
                    <div className="mt-5">
                      <div className="flex items-center justify-between text-[0.62rem] font-bold uppercase tracking-[0.12em] text-ink/35"><span>Protocol progress</span><span>{progress}%</span></div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/[0.06]"><div className="h-full rounded-full bg-gradient-to-r from-coral via-indigo to-leaf transition-all" style={{ width: `${progress}%` }} /></div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-7"><DashboardEmptyState icon={ClipboardCheck} title="No care protocols yet." description="Your first request will open a traceable journey for matching, payment, milestones, reports and support." action={<Link href="/book" className={buttonVariants({ variant: "accent" })}>Plan first care</Link>} /></div>
        )}
      </DashboardPanel>
    </PortalShell>
  );
}
