import Link from "next/link";
import type { Route } from "next";
import { redirect } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  DollarSign,
  Headphones,
  Heart,
  Inbox,
  PawPrint,
  Settings2,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  WalletCards,
  Zap,
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
  category: string;
}> = [
  { label: "Care Assignments", description: "Accept, review and track your scheduled care visits", href: "/saathi/assignments" as Route, icon: Briefcase, tone: "bg-indigo/10 text-indigo border-indigo/20", category: "Tasks" },
  { label: "Availability Calendar", description: "Set your weekly hours, buffers and travel radius", href: "/saathi/availability" as Route, icon: CalendarDays, tone: "bg-coral/10 text-coral border-coral/20", category: "Schedule" },
  { label: "Earnings & Payouts", description: "Transparent fee breakdown and weekly bank deposits", href: "/saathi/earnings" as Route, icon: DollarSign, tone: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20", category: "Finance" },
  { label: "Report Cards", description: "Submit photos, walk GPS and care checklists", href: "/saathi/reports" as Route, icon: ClipboardCheck, tone: "bg-amber-500/10 text-amber-800 border-amber-500/20", category: "Reports" },
  { label: "Client Messages", description: "Real-time communication with pet parents", href: "/saathi/inbox" as Route, icon: Inbox, tone: "bg-indigo/10 text-indigo border-indigo/20", category: "Inbox" },
  { label: "Pro Membership", description: "Exclusive insurance, gear discounts and priority match", href: "/partners/membership" as Route, icon: BadgeCheck, tone: "bg-coral/10 text-coral border-coral/20", category: "Perks" },
  { label: "Caregiver Profile", description: "Edit your bio, experience, skills and pet badges", href: "/saathi/profile" as Route, icon: UserRound, tone: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20", category: "Profile" },
  { label: "24/7 Safety Support", description: "Emergency helpline and on-ground rescue support", href: "/support" as Route, icon: Headphones, tone: "bg-amber-500/10 text-amber-800 border-amber-500/20", category: "Safety" },
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
              },
            },
          },
        }),
      ])
    : [0, 0, 0, []];

  return (
    <PortalShell
      mode="saathi"
      displayName={identity.displayName}
      metrics={[
        `${assignmentsCount} Open Task${assignmentsCount === 1 ? "" : "s"}`,
        `${checks} Verified Check${checks === 1 ? "" : "s"}`,
        `${completed} Completed Service${completed === 1 ? "" : "s"}`,
      ]}
    >
      {/* Schedule & Trust Overview Grid */}
      <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.6fr)]">
        {/* Care Ledger / Assignments */}
        <div className="flex flex-col justify-between rounded-[2.2rem] border border-black/[0.06] bg-white p-6 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.06)] sm:p-8">
          <div>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-indigo animate-pulse" />
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/50">Today&apos;s Rhythm</p>
                </div>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Your Care Schedule
                </h2>
              </div>
              <Link
                href={"/saathi/assignments" as Route}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-[#faf8f5] px-4 py-1.5 text-xs font-bold text-ink transition hover:border-black/20 hover:bg-white"
              >
                All Assignments
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              {recentAssignments.length > 0 ? (
                recentAssignments.map((assignment) => (
                  <Link
                    key={assignment.id}
                    href={`/bookings/${assignment.booking.id}`}
                    className="group flex flex-col justify-between gap-4 rounded-2xl border border-black/[0.05] bg-[#faf8f5] p-4 transition-all duration-200 hover:border-indigo/30 hover:bg-white hover:shadow-sm sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo/10 text-indigo">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink group-hover:text-indigo">
                          {assignment.booking.serviceType.name} · <span className="text-coral">{assignment.booking.pet.name}</span>
                        </p>
                        <p className="mt-0.5 text-xs text-ink/50">
                          Client: <span className="font-medium text-ink/80">{assignment.booking.customer?.displayName || "Customer"}</span> · {assignment.booking.scheduledStart.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <span className="rounded-full bg-coral/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-coral">
                        {assignment.status.replaceAll("_", " ")}
                      </span>
                      <ChevronRight className="h-4 w-4 text-ink/30 transition group-hover:translate-x-1 group-hover:text-indigo" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-black/[0.1] bg-[#faf8f5] p-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo/10 text-indigo">
                    <ClipboardCheck className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-ink">
                    No active assignments right now
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-ink/60">
                    Keep your availability calendar up to date to receive matching requests from pet parents nearby.
                  </p>
                  <Link
                    href={"/saathi/availability" as Route}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-white shadow transition hover:bg-indigo"
                  >
                    Update Availability
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-indigo/20 bg-indigo/[0.04] p-3.5 text-xs text-indigo-900">
            <Sparkles className="h-4 w-4 shrink-0 text-indigo" />
            <span>Complete verified report cards at session end to boost your caregiver trust rank!</span>
          </div>
        </div>

        {/* Professional Standing & Metrics Bento Card */}
        <aside className="relative flex flex-col justify-between overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-[#1c1917] via-[#1e1b4b] to-[#047857] p-6 text-white shadow-[0_20px_50px_-25px_rgba(0,0,0,0.2)] sm:p-8">
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-emerald-300 backdrop-blur shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div className="mt-6">
              <span className="inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-widest text-emerald-300">
                Verified Caregiver
              </span>
              <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Trust Builds By Proof.
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/70">
                Your credentials, client reviews and response score are verified and protected on PetSaathi.
              </p>

              <Link
                href={"/saathi/profile" as Route}
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-500 px-6 text-xs font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-400"
              >
                View Public Profile
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative z-10 mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
            <div className="rounded-2xl bg-white/5 p-3.5">
              <BadgeCheck className="h-4 w-4 text-emerald-400" />
              <p className="mt-2 font-display text-2xl font-bold text-white">{checks}</p>
              <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-white/60">Checks Passed</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-3.5">
              <Briefcase className="h-4 w-4 text-indigo-300" />
              <p className="mt-2 font-display text-2xl font-bold text-white">{completed}</p>
              <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-white/60">Completed</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-3.5">
              <Star className="h-4 w-4 text-saffron" />
              <p className="mt-2 font-display text-2xl font-bold text-white">4.9 ★</p>
              <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-white/60">Parent Rating</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-3.5">
              <Clock3 className="h-4 w-4 text-coral" />
              <p className="mt-2 font-display text-2xl font-bold text-white">&lt; 30m</p>
              <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-white/60">Response Time</p>
            </div>
          </div>
        </aside>
      </section>

      {/* Caregiver Toolkit Matrix */}
      <section className="mt-10 rounded-[2.5rem] border border-black/[0.06] bg-white p-6 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.06)] sm:p-8 lg:p-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo">Workplace Toolkit</p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Everything You Need, Beautifully Organized
          </h2>
          <p className="mt-1 text-xs text-ink/60">
            Manage your schedule, submit report cards, review earnings and access 24/7 emergency caregiver support.
          </p>
        </div>

        <ScrollStaggerContainer className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {toolkitLinks.map(({ label, description, href, icon: Icon, tone, category }) => (
            <ScrollStaggerItem key={href}>
              <Link
                href={href}
                className="group flex h-full flex-col justify-between rounded-[1.6rem] border border-black/[0.06] bg-[#faf8f5] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo/30 hover:bg-white hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl border shadow-sm transition-transform duration-300 group-hover:scale-110", tone)}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[0.62rem] font-bold text-ink/50">
                      {category}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-lg font-bold text-ink transition group-hover:text-indigo">
                    {label}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink/60">
                    {description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-black/[0.04] pt-3 text-xs font-bold text-ink/40 transition group-hover:text-indigo">
                  <span>Open module</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            </ScrollStaggerItem>
          ))}
        </ScrollStaggerContainer>
      </section>
    </PortalShell>
  );
}
