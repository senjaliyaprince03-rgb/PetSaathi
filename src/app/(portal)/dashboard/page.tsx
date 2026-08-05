import Link from "next/link";
import type { Route } from "next";
import { redirect } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  ClipboardCheck,
  Handshake,
  Headphones,
  HeartPulse,
  Inbox,
  MessageCircleMore,
  PawPrint,
  ShieldCheck,
  Sparkles,
  UserRoundPlus,
  WalletCards,
} from "lucide-react";

import { PortalShell } from "@/components/portal/portal-shell";
import { cn } from "@/lib/cn";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

const workspaceLinks: Array<{
  label: string;
  description: string;
  href: Route;
  icon: LucideIcon;
  tone: string;
}> = [
  { label: "My pets", description: "Passports, health and routines", href: "/pets", icon: PawPrint, tone: "bg-indigo/10 text-indigo" },
  { label: "Request care", description: "Create a protected booking", href: "/book", icon: CalendarDays, tone: "bg-coral/10 text-coral" },
  { label: "Care protocols", description: "Follow every care journey", href: "/customer/protocols" as Route, icon: ClipboardCheck, tone: "bg-leaf/10 text-leaf" },
  { label: "Loyalty & rewards", description: "Credits and reward history", href: "/customer/loyalty" as Route, icon: Sparkles, tone: "bg-saffron/25 text-ink" },
  { label: "Service wallet", description: "Partner benefit balances", href: "/customer/wallet" as Route, icon: WalletCards, tone: "bg-indigo/10 text-indigo" },
  { label: "Protocol inbox", description: "Care notices and support threads", href: "/customer/inbox" as Route, icon: Inbox, tone: "bg-coral/10 text-coral" },
  { label: "Partner services", description: "Verified local providers", href: "/partners" as Route, icon: Handshake, tone: "bg-leaf/10 text-leaf" },
  { label: "Refer a friend", description: "Invitations and earned rewards", href: "/customer/referrals" as Route, icon: UserRoundPlus, tone: "bg-saffron/25 text-ink" },
];

export default async function CustomerDashboardPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/dashboard");

  const [activeBookings, pets, reports, recentBookings, unreadNotices, openCases] = await Promise.all([
    prisma.booking.count({ where: { customerId: identity.id, status: { notIn: ["CLOSED", "DECLINED", "CUSTOMER_CANCELLED", "NO_SHOW"] } } }),
    prisma.pet.count({ where: { ownerId: identity.id, active: true } }),
    prisma.bookingReport.count({ where: { booking: { customerId: identity.id } } }),
    prisma.booking.findMany({
      where: { customerId: identity.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        reference: true,
        status: true,
        scheduledStart: true,
        pet: { select: { name: true } },
        serviceType: { select: { name: true } },
      },
    }),
    prisma.notificationOutbox.count({ where: { userId: identity.id, status: { in: ["QUEUED", "SENDING"] } } }),
    prisma.supportCase.count({ where: { userId: identity.id, status: { not: "CLOSED" } } }),
  ]);

  const nextStep = pets === 0
    ? { title: "Create the first pet passport", copy: "A current pet profile unlocks safer matching and care requests.", label: "Add a pet", href: "/pets/new" as Route, icon: PawPrint }
    : activeBookings === 0
      ? { title: "Plan the next care request", copy: "Choose a pet, approved service, place and schedule in one guided flow.", label: "Request care", href: "/book" as Route, icon: CalendarDays }
      : { title: "Review care in progress", copy: "Open the latest protocol for its match, timing, updates and report trail.", label: "Open protocols", href: "/customer/protocols" as Route, icon: ClipboardCheck };
  const NextStepIcon = nextStep.icon;

  return (
    <PortalShell
      mode="customer"
      displayName={identity.displayName}
      metrics={[
        `${activeBookings} active booking${activeBookings === 1 ? "" : "s"}`,
        `${pets} pet passport${pets === 1 ? "" : "s"}`,
        `${reports} care stor${reports === 1 ? "y" : "ies"}`,
      ]}
    >
      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.65fr)]">
        <div className="rounded-[2rem] border border-ink/[0.07] bg-paper p-5 shadow-[0_18px_55px_-38px_rgb(var(--ink)/0.32)] sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Care timeline</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Recent care, without the noise.</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-ink/48">Every request opens as a complete protocol with status, schedule and service evidence.</p>
            </div>
            <Link href="/customer/protocols" className="inline-flex items-center gap-2 text-sm font-bold text-coral transition hover:text-indigo">View all care<ArrowUpRight className="h-4 w-4" /></Link>
          </div>

          <div className="mt-6 grid gap-3">
            {recentBookings.length > 0 ? recentBookings.map((booking) => (
              <Link key={booking.id} href={`/bookings/${booking.id}`} className="group flex flex-col justify-between gap-4 rounded-[1.4rem] border border-ink/[0.06] bg-cream/45 p-4 transition hover:border-indigo/20 hover:bg-paper hover:shadow-lifted sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo/10 text-indigo"><HeartPulse className="h-4 w-4" /></span>
                  <div><p className="font-bold">{booking.serviceType.name} · {booking.pet.name}</p><p className="mt-1 text-xs text-ink/42">{booking.reference} · {booking.scheduledStart.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p></div>
                </div>
                <div className="flex items-center gap-3"><span className="rounded-full bg-coral/10 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-coral">{booking.status.replaceAll("_", " ")}</span><ArrowUpRight className="h-4 w-4 text-ink/20 transition group-hover:text-coral" /></div>
              </Link>
            )) : (
              <div className="rounded-[1.6rem] border border-dashed border-indigo/15 bg-cream/25 p-8 text-center">
                <ClipboardCheck className="mx-auto h-9 w-9 text-indigo/30" />
                <p className="mt-4 font-display text-2xl font-semibold">Your first care timeline will appear here.</p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/45">Create a protected request when you are ready; nothing is invented to make this page look busy.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#efe4f4] via-paper to-[#fff0e7] p-6 shadow-[0_18px_55px_-38px_rgb(var(--ink)/0.32)] sm:p-7">
          <div className="absolute -right-14 -top-16 h-44 w-44 rounded-full bg-coral/15 blur-3xl" />
          <div className="relative">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#281d2b] text-saffron"><NextStepIcon className="h-5 w-5" /></span>
            <p className="mt-8 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-indigo/55">Recommended next step</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">{nextStep.title}</h2>
            <p className="mt-3 text-sm leading-6 text-ink/50">{nextStep.copy}</p>
            <Link href={nextStep.href} className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-coral px-5 text-sm font-bold text-paper shadow-lifted transition hover:-translate-y-0.5 hover:bg-indigo">{nextStep.label}<ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div className="relative mt-7 grid grid-cols-2 gap-3 border-t border-ink/[0.07] pt-5">
            <Link href="/notifications" className="rounded-2xl bg-paper/65 p-3 transition hover:bg-paper"><Bell className="h-4 w-4 text-coral" /><p className="mt-3 text-xl font-bold">{unreadNotices}</p><p className="text-[0.62rem] font-semibold text-ink/40">Pending updates</p></Link>
            <Link href="/support" className="rounded-2xl bg-paper/65 p-3 transition hover:bg-paper"><Headphones className="h-4 w-4 text-indigo" /><p className="mt-3 text-xl font-bold">{openCases}</p><p className="text-[0.62rem] font-semibold text-ink/40">Open cases</p></Link>
          </div>
        </aside>
      </section>

      <section className="mt-5 rounded-[2rem] border border-ink/[0.07] bg-paper p-5 shadow-[0_18px_55px_-38px_rgb(var(--ink)/0.32)] sm:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="eyebrow">Your workspace</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Everything has a proper place.</h2><p className="mt-2 text-sm leading-6 text-ink/48">Each destination opens as a complete page with its own data, actions and empty states.</p></div>
          <div className="flex gap-2"><Link href="/settings/notifications" aria-label="Communication preferences" className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo/10 text-indigo transition hover:bg-indigo hover:text-paper"><MessageCircleMore className="h-4 w-4" /></Link><Link href="/safety" aria-label="Trust and safety" className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf/10 text-leaf transition hover:bg-leaf hover:text-paper"><ShieldCheck className="h-4 w-4" /></Link></div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {workspaceLinks.map(({ label, description, href, icon: Icon, tone }) => (
            <Link key={href} href={href} className="group rounded-[1.4rem] border border-ink/[0.06] bg-cream/35 p-4 transition hover:-translate-y-0.5 hover:border-indigo/20 hover:bg-paper hover:shadow-lifted">
              <div className="flex items-start justify-between"><span className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", tone)}><Icon className="h-4 w-4" /></span><ArrowUpRight className="h-4 w-4 text-ink/18 transition group-hover:text-coral" /></div>
              <h3 className="mt-5 font-display text-xl font-semibold">{label}</h3><p className="mt-1 text-xs leading-5 text-ink/42">{description}</p>
            </Link>
          ))}
        </div>
      </section>
    </PortalShell>
  );
}
