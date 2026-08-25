import Link from "next/link";
import type { Route } from "next";
import { redirect } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BadgeCheck,
  Bell,
  Briefcase,
  CalendarDays,
  ClipboardCheck,
  Clock3,
  DollarSign,
  Headphones,
  Inbox,
  Settings2,
  Shield,
  Star,
} from "lucide-react";

import { PortalShell } from "@/components/portal/portal-shell";
import { ScrollReveal } from "@/components/3d/scroll-reveal";
import { ScrollStaggerContainer, ScrollStaggerItem } from "@/components/effects/animos-motion";
import { cn } from "@/lib/cn";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

const toolkitLinks: Array<{
  label: string;
  description: string;
  href: Route;
  icon: LucideIcon;
  tone: string;
}> = [
  { label: "Assignments", description: "View and manage tasks", href: "/saathi/assignments" as Route, icon: Briefcase, tone: "bg-indigo/10 text-indigo" },
  { label: "Schedule", description: "Your availability calendar", href: "/saathi/schedule" as Route, icon: CalendarDays, tone: "bg-coral/10 text-coral" },
  { label: "Earnings", description: "Payouts and ledger", href: "/saathi/earnings" as Route, icon: DollarSign, tone: "bg-leaf/10 text-leaf" },
  { label: "Verification", description: "Documents and checks", href: "/saathi/verification" as Route, icon: BadgeCheck, tone: "bg-saffron/25 text-ink" },
  { label: "Inbox", description: "Messages from clients", href: "/saathi/inbox" as Route, icon: Inbox, tone: "bg-indigo/10 text-indigo" },
  { label: "Settings", description: "Profile preferences", href: "/settings" as Route, icon: Settings2, tone: "bg-coral/10 text-coral" },
  { label: "Notifications", description: "Alerts and updates", href: "/notifications" as Route, icon: Bell, tone: "bg-leaf/10 text-leaf" },
  { label: "Support", description: "Get help from team", href: "/support" as Route, icon: Headphones, tone: "bg-saffron/25 text-ink" },
];

export default async function SaathiDashboardPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) redirect("/login?returnTo=/saathi");

  const sitter = await prisma.sitterProfile.findUnique({ where: { userId: identity.id }, select: { id: true } });

  const [assignmentsCount, checks, completed, recentAssignments] = sitter
    ? await Promise.all([
        prisma.bookingAssignment.count({ where: { sitterId: sitter.id, status: { in: ["OFFERED", "ACCEPTED", "CUSTOMER_APPROVED", "ACTIVE"] } } }),
        prisma.sitterVerification.count({ where: { sitterId: sitter.id, status: "PASSED" } }),
        prisma.bookingAssignment.count({ where: { sitterId: sitter.id, status: "COMPLETED" } }),
        prisma.bookingAssignment.findMany({
          where: { sitterId: sitter.id },
          orderBy: { offeredAt: "desc" },
          take: 5,
          include: {
            booking: {
              select: {
                id: true,
                scheduledStart: true,
                pet: { select: { name: true } },
                customer: { select: { displayName: true } },
                serviceType: { select: { name: true } },
              }
            }
          }
        }),
      ])
    : [0, 0, 0, []];

  return (
    <PortalShell
      mode="saathi"
      displayName={identity.displayName}
      metrics={[
        `${assignmentsCount} open assignment${assignmentsCount === 1 ? "" : "s"}`,
        `${checks} passed check${checks === 1 ? "" : "s"}`,
        `${completed} completed service${completed === 1 ? "" : "s"}`
      ]}
    >
      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.65fr)]">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="rounded-[2rem] border border-ink/[0.07] bg-paper p-5 shadow-[0_18px_55px_-38px_rgb(var(--ink)/0.32)] sm:p-7 h-full">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow">Today’s rhythm</p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Your care ledger</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-ink/80">Offers, accepted services and active care appear in one verified queue. Nothing is published or accepted automatically.</p>
              </div>
              <Link href="/saathi/assignments" className="inline-flex items-center gap-2 text-sm font-bold text-coral transition hover:text-indigo">Review assignments<ArrowUpRight className="h-4 w-4" /></Link>
            </div>

            <div className="mt-6 grid gap-3">
              {recentAssignments.length > 0 ? recentAssignments.map((assignment) => (
                <Link key={assignment.id} href={`/bookings/${assignment.booking.id}`} className="group flex flex-col justify-between gap-4 rounded-[1.4rem] border border-ink/[0.06] bg-cream/45 p-4 transition hover:border-indigo/20 hover:bg-paper hover:shadow-lifted sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo/10 text-indigo"><Briefcase className="h-4 w-4" /></span>
                    <div>
                      <p className="font-bold">{assignment.booking.serviceType.name} · {assignment.booking.pet.name}</p>
                      <p className="mt-1 text-xs text-ink/80">{assignment.booking.customer?.displayName || "Customer"} · {assignment.booking.scheduledStart.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-coral/10 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-coral">{assignment.status.replaceAll("_", " ")}</span>
                    <ArrowUpRight className="h-4 w-4 text-ink/80 transition group-hover:text-coral" />
                  </div>
                </Link>
              )) : (
                <div className="rounded-[1.6rem] border border-dashed border-indigo/15 bg-cream/25 p-8 text-center">
                  <ClipboardCheck className="mx-auto h-9 w-9 text-indigo/80" />
                  <p className="mt-4 font-display text-2xl font-semibold">No recent assignments.</p>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/80">Your upcoming and active services will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <aside className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#efe4f4] via-paper to-[#fff0e7] p-6 shadow-[0_18px_55px_-38px_rgb(var(--ink)/0.32)] sm:p-7 h-full">
            <div className="absolute -right-14 -top-16 h-44 w-44 rounded-full bg-coral/15 blur-3xl" />
            <div className="relative">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#281d2b] text-emerald-400"><Shield className="h-5 w-5" /></span>
              <p className="mt-8 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-indigo/80">Professional standing</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">Trust grows by proof.</h2>
              <p className="mt-3 text-sm leading-6 text-ink/80">Your track record is verified and backed by the platform.</p>
              <Link href="/saathi/profile" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-bold text-paper shadow-lifted transition hover:-translate-y-0.5 hover:bg-emerald-700">View full profile<ArrowUpRight className="h-4 w-4" /></Link>
            </div>
            <div className="relative mt-7 grid grid-cols-2 gap-3 border-t border-ink/[0.07] pt-5">
              <div className="rounded-2xl bg-paper/65 p-3">
                <BadgeCheck className="h-4 w-4 text-emerald-600" />
                <p className="mt-3 text-xl font-bold">{checks}</p>
                <p className="text-[0.62rem] font-semibold text-ink/80 uppercase tracking-widest">Checks Passed</p>
              </div>
              <div className="rounded-2xl bg-paper/65 p-3">
                <Briefcase className="h-4 w-4 text-indigo" />
                <p className="mt-3 text-xl font-bold">{completed}</p>
                <p className="text-[0.62rem] font-semibold text-ink/80 uppercase tracking-widest">Completed</p>
              </div>
              <div className="rounded-2xl bg-paper/65 p-3">
                <Star className="h-4 w-4 text-saffron" />
                <p className="mt-3 text-xl font-bold">4.8</p>
                <p className="text-[0.62rem] font-semibold text-ink/80 uppercase tracking-widest">Rating</p>
              </div>
              <div className="rounded-2xl bg-paper/65 p-3">
                <Clock3 className="h-4 w-4 text-coral" />
                <p className="mt-3 text-xl font-bold">{"<"} 1hr</p>
                <p className="text-[0.62rem] font-semibold text-ink/80 uppercase tracking-widest">Response Time</p>
              </div>
            </div>
          </aside>
        </ScrollReveal>
      </section>

      <ScrollReveal direction="up" delay={0.3}>
        <section className="mt-5 rounded-[2rem] border border-ink/[0.07] bg-paper p-5 shadow-[0_18px_55px_-38px_rgb(var(--ink)/0.32)] sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Your toolkit</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Everything you need, organized.</h2>
            </div>
          </div>
          <ScrollStaggerContainer className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {toolkitLinks.map(({ label, description, href, icon: Icon, tone }) => (
              <ScrollStaggerItem key={href}>
                <Link href={href} className="group flex flex-col h-full rounded-[1.4rem] border border-ink/[0.06] bg-cream/35 p-4 transition hover:-translate-y-0.5 hover:border-indigo/20 hover:bg-paper hover:shadow-lifted">
                  <div className="flex items-start justify-between">
                    <span className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", tone)}><Icon className="h-4 w-4" /></span>
                    <ArrowUpRight className="h-4 w-4 text-ink/80 transition group-hover:text-coral" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold">{label}</h3>
                  <p className="mt-1 text-xs leading-5 text-ink/80">{description}</p>
                </Link>
              </ScrollStaggerItem>
            ))}
          </ScrollStaggerContainer>
        </section>
      </ScrollReveal>
    </PortalShell>
  );
}
