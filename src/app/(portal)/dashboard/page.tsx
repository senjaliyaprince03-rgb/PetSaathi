import Link from "next/link";
import type { Route } from "next";
import { redirect } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Gift,
  Handshake,
  Headphones,
  HeartPulse,
  Inbox,
  LayoutGrid,
  MessageCircleMore,
  PawPrint,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRoundPlus,
  WalletCards,
  Zap,
} from "lucide-react";

import { PortalShell } from "@/components/portal/portal-shell";
import { ScrollReveal } from "@/components/3d/scroll-reveal";
import { ScrollStaggerContainer, ScrollStaggerItem } from "@/components/effects/animos-motion";
import { cn } from "@/lib/cn";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

const quickServices: Array<{
  title: string;
  subtitle: string;
  tag: string;
  icon: string;
  href: Route;
  accent: string;
  badgeTone: string;
}> = [
  {
    title: "Dog Walking",
    subtitle: "GPS-tracked walks with verified Saathis",
    tag: "From ₹249",
    icon: "🐕",
    href: "/book",
    accent: "hover:border-indigo/40 hover:bg-indigo/[0.03]",
    badgeTone: "bg-indigo/10 text-indigo",
  },
  {
    title: "Pet Sitting",
    subtitle: "Loving in-home sitting & overnight stays",
    tag: "From ₹499",
    icon: "🏠",
    href: "/book",
    accent: "hover:border-coral/40 hover:bg-coral/[0.03]",
    badgeTone: "bg-coral/10 text-coral",
  },
  {
    title: "Grooming at Home",
    subtitle: "Baths, styling & hygiene protocols",
    tag: "Spa Care",
    icon: "✂️",
    href: "/customer/grooming" as Route,
    accent: "hover:border-emerald-500/40 hover:bg-emerald-500/[0.03]",
    badgeTone: "bg-emerald-500/10 text-emerald-700",
  },
  {
    title: "Vet On-Demand",
    subtitle: "Teleconsultation & in-person clinic visits",
    tag: "Certified",
    icon: "🏥",
    href: "/customer/vet" as Route,
    accent: "hover:border-amber-500/40 hover:bg-amber-500/[0.03]",
    badgeTone: "bg-amber-500/10 text-amber-700",
  },
];

const workspaceLinks: Array<{
  label: string;
  description: string;
  href: Route;
  icon: LucideIcon;
  tone: string;
  category: string;
}> = [
  { label: "Pet Passports", description: "Health records, diet plans and vaccination logs", href: "/pets", icon: PawPrint, tone: "bg-indigo/10 text-indigo border-indigo/20", category: "Core" },
  { label: "Request Care", description: "Create and schedule a protected care booking", href: "/book", icon: CalendarDays, tone: "bg-coral/10 text-coral border-coral/20", category: "Booking" },
  { label: "Care Protocols", description: "Live session telemetry, reports & GPS logs", href: "/customer/protocols" as Route, icon: ClipboardCheck, tone: "bg-leaf/10 text-leaf border-leaf/20", category: "Journey" },
  { label: "Loyalty & Rewards", description: "Redeem credits, coins & service perks", href: "/customer/loyalty" as Route, icon: Gift, tone: "bg-saffron/25 text-ink border-saffron/40", category: "Perks" },
  { label: "Service Wallet", description: "Manage balance, coupons and billing history", href: "/customer/wallet" as Route, icon: WalletCards, tone: "bg-indigo/10 text-indigo border-indigo/20", category: "Finance" },
  { label: "Protocol Inbox", description: "Real-time updates and caregiver chat", href: "/customer/inbox" as Route, icon: Inbox, tone: "bg-coral/10 text-coral border-coral/20", category: "Inbox" },
  { label: "Partner Services", description: "Verified local clinics, trainers & daycare", href: "/partners" as Route, icon: Handshake, tone: "bg-leaf/10 text-leaf border-leaf/20", category: "Network" },
  { label: "Refer a Friend", description: "Share your invite link & earn ₹500 credits", href: "/customer/referrals" as Route, icon: UserRoundPlus, tone: "bg-saffron/25 text-ink border-saffron/40", category: "Rewards" },
];

export default async function CustomerDashboardPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login?returnTo=/dashboard");
  if (!identity.roles.includes("CUSTOMER")) {
    if (identity.roles.includes("SITTER")) redirect("/saathi");
    if (identity.roles.includes("SUPER_ADMIN")) redirect("/admin");
    redirect("/login");
  }

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

  const nextStep =
    pets === 0
      ? {
          title: "Complete First Pet Passport",
          copy: "Adding medical notes and routine details unlocks instant verified matching.",
          label: "Add Pet Profile",
          href: "/pets/new" as Route,
          icon: PawPrint,
        }
      : activeBookings === 0
      ? {
          title: "Schedule Your Next Care Session",
          copy: "Select verified services with doorstep pickup and verified Saathi assignment.",
          label: "Book Care Now",
          href: "/book" as Route,
          icon: CalendarDays,
        }
      : {
          title: "Care Protocol in Progress",
          copy: "Open your active protocol for live milestones, GPS path and session evidence.",
          label: "View Care Protocol",
          href: "/customer/protocols" as Route,
          icon: ClipboardCheck,
        };

  const NextStepIcon = nextStep.icon;

  return (
    <PortalShell
      mode="customer"
      displayName={identity.displayName}
      metrics={[
        `${activeBookings} Active Service${activeBookings === 1 ? "" : "s"}`,
        `${pets} Pet Passport${pets === 1 ? "" : "s"}`,
        `${reports} Care Stor${reports === 1 ? "y" : "ies"}`,
      ]}
    >
      {/* Quick Services Bento Grid */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo">Instant On-Demand</p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Explore Pet Services
            </h2>
          </div>
          <Link
            href={"/customer/services" as Route}
            className="group hidden items-center gap-1.5 text-xs font-bold text-ink/70 transition hover:text-indigo sm:inline-flex"
          >
            All Services
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickServices.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-[1.8rem] border border-black/[0.06] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
                service.accent
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{service.icon}</span>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold", service.badgeTone)}>
                    {service.tag}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-ink transition-colors group-hover:text-indigo">
                  {service.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-ink/60">
                  {service.subtitle}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-black/[0.04] pt-3 text-xs font-bold text-ink">
                <span>Book now</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.04] text-ink transition group-hover:bg-indigo group-hover:text-white">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Center: Care Timeline & Intelligence Action Center */}
      <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.6fr)]">
        {/* Care Timeline Card */}
        <div className="flex flex-col justify-between rounded-[2.2rem] border border-black/[0.06] bg-white p-6 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.06)] sm:p-8">
          <div>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/50">Live Protocol Trail</p>
                </div>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Recent Care Sessions
                </h2>
              </div>
              <Link
                href={"/customer/protocols" as Route}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-[#faf8f5] px-4 py-1.5 text-xs font-bold text-ink transition hover:border-black/20 hover:bg-white"
              >
                View all protocols
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/bookings/${booking.id}`}
                    className="group flex flex-col justify-between gap-4 rounded-2xl border border-black/[0.05] bg-[#faf8f5] p-4 transition-all duration-200 hover:border-indigo/30 hover:bg-white hover:shadow-sm sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo/10 text-indigo">
                        <HeartPulse className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink group-hover:text-indigo">
                          {booking.serviceType.name} · <span className="text-coral">{booking.pet.name}</span>
                        </p>
                        <p className="mt-0.5 text-xs text-ink/50">
                          Ref: <span className="font-mono text-ink/70">{booking.reference}</span> · {booking.scheduledStart.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-emerald-700">
                        {booking.status.replaceAll("_", " ")}
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
                    No care requests active
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-ink/60">
                    Book trusted walking, sitting or grooming services. Real-time updates and photo reports will appear here.
                  </p>
                  <Link
                    href="/book"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-white shadow transition hover:bg-indigo"
                  >
                    Schedule Care Now
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3.5 text-xs text-emerald-800">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>All sessions are backed by our verified Saathi guarantee and 24/7 safety oversight.</span>
          </div>
        </div>

        {/* Intelligence Action Center / Next Step */}
        <aside className="relative flex flex-col justify-between overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-[#1c1917] via-[#241c2c] to-[#312e81] p-6 text-white shadow-[0_20px_50px_-25px_rgba(0,0,0,0.2)] sm:p-8">
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-coral/20 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-saffron backdrop-blur shadow-sm">
              <NextStepIcon className="h-6 w-6" />
            </div>

            <div className="mt-6">
              <span className="inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-widest text-saffron">
                Priority Action
              </span>
              <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {nextStep.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/70">
                {nextStep.copy}
              </p>

              <Link
                href={nextStep.href}
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-coral px-6 text-xs font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-coral/90"
              >
                {nextStep.label}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative z-10 mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
            <Link
              href="/notifications"
              className="group rounded-2xl bg-white/5 p-3.5 transition hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <Bell className="h-4 w-4 text-coral" />
                <span className="h-1.5 w-1.5 rounded-full bg-coral" />
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-white">{unreadNotices}</p>
              <p className="text-[0.65rem] font-semibold text-white/60">Unread Notices</p>
            </Link>

            <Link
              href="/support"
              className="group rounded-2xl bg-white/5 p-3.5 transition hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <Headphones className="h-4 w-4 text-indigo-300" />
                <ArrowUpRight className="h-3 w-3 text-white/40 transition group-hover:text-white" />
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-white">{openCases}</p>
              <p className="text-[0.65rem] font-semibold text-white/60">Support Tickets</p>
            </Link>
          </div>
        </aside>
      </section>

      {/* Workspace Grid */}
      <section className="mt-10 rounded-[2.5rem] border border-black/[0.06] bg-white p-6 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.06)] sm:p-8 lg:p-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo">Platform Modules</p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Your Pet Care Command Matrix
            </h2>
            <p className="mt-1 text-xs text-ink/60">
              Access your digital passports, rewards ledger, wallet balances and customer services.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/settings/notifications"
              aria-label="Communication preferences"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.08] bg-[#faf8f5] text-ink transition hover:bg-indigo hover:text-white"
            >
              <MessageCircleMore className="h-4 w-4" />
            </Link>
            <Link
              href="/safety"
              aria-label="Trust and safety"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.08] bg-[#faf8f5] text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
            >
              <ShieldCheck className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <ScrollStaggerContainer className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {workspaceLinks.map(({ label, description, href, icon: Icon, tone, category }) => (
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
                  <span>Open workspace</span>
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
