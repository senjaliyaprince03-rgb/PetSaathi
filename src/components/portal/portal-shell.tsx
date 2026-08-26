import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  DollarSign,
  FileLock2,
  Flag,
  Gift,
  Handshake,
  Headphones,
  Heart,
  Home,
  Inbox,
  LayoutGrid,
  LogOut,
  MapPin,
  Megaphone,
  PawPrint,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";

import { PetSaathiLogo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { PortalMobileNav } from "@/components/portal/portal-mobile-nav";
import { GlobalChatWidget } from "@/components/ai/GlobalChatWidget";

type PortalMode = "customer" | "saathi" | "admin" | "society" | "operator";

const portalCopy: Record<
  PortalMode,
  {
    eyebrow: string;
    badge: string;
    title: string;
    description: string;
    primary: string;
    href: Route;
    secondary?: { label: string; href: Route };
  }
> = {
  customer: {
    eyebrow: "Pet Parent Command Hub",
    badge: "Verified Protocol",
    title: "Compassionate care, calmly orchestrated.",
    description:
      "Your pet passports, live walk telemetry, vetted Saathis, and immutable session receipts seamlessly united in one intelligent workspace.",
    primary: "Book Care Now",
    href: "/book",
    secondary: { label: "My Pet Passports", href: "/pets" },
  },
  saathi: {
    eyebrow: "Saathi Mission Control",
    badge: "Certified Caregiver",
    title: "Your daily care rhythm, perfected.",
    description:
      "Manage assigned visits, verify daily routines, submit verified session report cards, and track earnings with automated weekly payouts.",
    primary: "Active Assignments",
    href: "/saathi/assignments",
    secondary: { label: "Availability", href: "/saathi/availability" as Route },
  },
  admin: {
    eyebrow: "Operations Command Center",
    badge: "System Authority",
    title: "Total clarity for every operational pulse.",
    description:
      "Live matching algorithms, multi-city capacity controls, safety escalation queues, and audited telemetry logs across the platform.",
    primary: "Operations Queue",
    href: "/admin/operations",
    secondary: { label: "Matching Monitor", href: "/admin/matching" },
  },
  society: {
    eyebrow: "Residential Community Hub",
    badge: "Society Access",
    title: "A safer, happier society for every resident pet.",
    description:
      "Track registered community animals, manage resident gate permissions, and schedule community pet vaccination camps.",
    primary: "Community Directory",
    href: "/society" as Route,
    secondary: { label: "Gate Logs", href: "/society/gate-protocol" as Route },
  },
  operator: {
    eyebrow: "Regional Territory Control",
    badge: "Territory Operator",
    title: "Hyperlocal pet care ecosystems at scale.",
    description:
      "Monitor city economic performance, match velocity, safety SLAs, and caregiver capacity utilization in your zones.",
    primary: "City Operations",
    href: "/operator" as Route,
  },
};

const cards: Record<
  PortalMode,
  Array<{
    label: string;
    value: string;
    hint: string;
    icon: LucideIcon;
    tone: string;
    badge?: string;
  }>
> = {
  customer: [
    {
      label: "Care Protocol Status",
      value: "No active care",
      hint: "Your next confirmed appointment will display live here",
      icon: CalendarDays,
      tone: "bg-indigo/10 text-indigo border-indigo/20",
      badge: "Real-time",
    },
    {
      label: "Digital Passports",
      value: "Essential Records",
      hint: "Vaccinations, dietary habits & emergency contacts",
      icon: PawPrint,
      tone: "bg-coral/10 text-coral border-coral/20",
      badge: "Verified",
    },
    {
      label: "Verified Care Stories",
      value: "Photo Milestones",
      hint: "GPS logs, timeline updates & caregiver notes",
      icon: Heart,
      tone: "bg-leaf/10 text-leaf border-leaf/20",
      badge: "Secure",
    },
  ],
  saathi: [
    {
      label: "Today's Schedule",
      value: "0 Pending Visits",
      hint: "Eligible service requests appear in real time",
      icon: Clock3,
      tone: "bg-indigo/10 text-indigo border-indigo/20",
      badge: "Live Queue",
    },
    {
      label: "Trust & Safety Level",
      value: "Level 1 Verified",
      hint: "Background check, KYC and skill assessment status",
      icon: ShieldCheck,
      tone: "bg-leaf/10 text-leaf border-leaf/20",
      badge: "Passed",
    },
    {
      label: "Care Performance",
      value: "100% On-Time",
      hint: "Completed report cards build parent trust",
      icon: Heart,
      tone: "bg-coral/10 text-coral border-coral/20",
      badge: "Top Rated",
    },
  ],
  admin: [
    {
      label: "Matching Decision Queue",
      value: "Algorithm Active",
      hint: "Prioritised by urgency, distance & verified credentials",
      icon: UserRound,
      tone: "bg-indigo/10 text-indigo border-indigo/20",
      badge: "Auto-Routing",
    },
    {
      label: "Safety & Incident Feed",
      value: "0 High Severity",
      hint: "Immediate triage with recorded audio & photo evidence",
      icon: ShieldCheck,
      tone: "bg-leaf/10 text-leaf border-leaf/20",
      badge: "24/7 Shield",
    },
    {
      label: "Payment & Webhook Ledger",
      value: "Reconciliation Ready",
      hint: "Razorpay webhooks idempotently processed",
      icon: CheckCircle2,
      tone: "bg-saffron/25 text-ink border-saffron/40",
      badge: "Idempotent",
    },
  ],
  society: [
    {
      label: "Verified Residents",
      value: "Resident Directory",
      hint: "Active pet owners in the community",
      icon: Users,
      tone: "bg-indigo/10 text-indigo border-indigo/20",
    },
    {
      label: "Approved Saathi Pool",
      value: "Pre-screened Sitters",
      hint: "Dedicated caregivers with society gate pass",
      icon: PawPrint,
      tone: "bg-saffron/25 text-ink border-saffron/40",
    },
    {
      label: "Community Events",
      value: "0 Upcoming Events",
      hint: "Vaccination camps and play sessions",
      icon: CalendarDays,
      tone: "bg-coral/10 text-coral border-coral/20",
    },
  ],
  operator: [
    {
      label: "Assigned Territories",
      value: "Active Clusters",
      hint: "Coverage zones and capacity ceilings",
      icon: MapPin,
      tone: "bg-indigo/10 text-indigo border-indigo/20",
    },
    {
      label: "City Operational Health",
      value: "Nominal 99.8%",
      hint: "Fulfillment velocity and customer satisfaction",
      icon: Activity,
      tone: "bg-leaf/10 text-leaf border-leaf/20",
    },
    {
      label: "Platform Economics",
      value: "Live Settlement",
      hint: "Gross booking volume & margin tracking",
      icon: DollarSign,
      tone: "bg-saffron/25 text-ink border-saffron/40",
    },
  ],
};

const portalNavigation: Record<
  PortalMode,
  Array<{
    icon: LucideIcon;
    iconName: string;
    label: string;
    href: Route;
    badge?: string;
    section?: string;
  }>
> = {
  customer: [
    { icon: Home, iconName: "Home", label: "Overview", href: "/dashboard", section: "Main" },
    { icon: PawPrint, iconName: "PawPrint", label: "My Pets", href: "/pets", section: "Main" },
    { icon: CalendarDays, iconName: "CalendarDays", label: "Book Care", href: "/book", section: "Main", badge: "Instant" },
    { icon: ClipboardCheck, iconName: "ClipboardCheck", label: "Care Protocols", href: "/customer/protocols" as Route, section: "Care Journeys" },
    { icon: Inbox, iconName: "Inbox", label: "Protocol Inbox", href: "/customer/inbox" as Route, section: "Care Journeys" },
    { icon: LayoutGrid, iconName: "LayoutGrid", label: "Services Hub", href: "/customer/services" as Route, section: "Care Journeys" },
    { icon: Gift, iconName: "Gift", label: "Loyalty & Rewards", href: "/customer/loyalty" as Route, section: "Finance & Benefits" },
    { icon: WalletCards, iconName: "WalletCards", label: "Service Wallet", href: "/customer/wallet" as Route, section: "Finance & Benefits" },
    { icon: WalletCards, iconName: "WalletCards", label: "Subscriptions", href: "/customer/subscriptions" as Route, section: "Finance & Benefits" },
    { icon: Handshake, iconName: "Handshake", label: "Partner Services", href: "/partners" as Route, section: "Network" },
    { icon: Handshake, iconName: "Handshake", label: "Refer a Friend", href: "/customer/referrals" as Route, section: "Network" },
    { icon: Bell, iconName: "Bell", label: "Notifications", href: "/notifications", section: "Preferences" },
    { icon: Settings2, iconName: "Settings2", label: "Settings", href: "/settings/notifications", section: "Preferences" },
    { icon: Headphones, iconName: "Headphones", label: "Help & Support", href: "/support", section: "Preferences" },
    { icon: ShieldCheck, iconName: "ShieldCheck", label: "Trust & Safety", href: "/safety", section: "Preferences" },
  ],
  saathi: [
    { icon: Home, iconName: "Home", label: "Overview", href: "/saathi", section: "Workplace" },
    { icon: PawPrint, iconName: "PawPrint", label: "Assignments", href: "/saathi/assignments", section: "Workplace", badge: "Live" },
    { icon: CalendarDays, iconName: "CalendarDays", label: "Availability", href: "/saathi/availability" as Route, section: "Workplace" },
    { icon: Inbox, iconName: "Inbox", label: "Client Messages", href: "/saathi/inbox" as Route, section: "Workplace" },
    { icon: ClipboardCheck, iconName: "ClipboardCheck", label: "Report Cards", href: "/saathi/reports" as Route, section: "Performance" },
    { icon: WalletCards, iconName: "WalletCards", label: "Earnings & Payouts", href: "/saathi/earnings" as Route, section: "Performance" },
    { icon: BadgeCheck, iconName: "BadgeCheck", label: "Pro Membership", href: "/partners/membership" as Route, section: "Performance" },
    { icon: UserRound, iconName: "UserRound", label: "My Profile", href: "/saathi/profile" as Route, section: "Account" },
    { icon: Bell, iconName: "Bell", label: "Notifications", href: "/notifications", section: "Account" },
    { icon: Headphones, iconName: "Headphones", label: "Caregiver Support", href: "/support", section: "Account" },
    { icon: ShieldCheck, iconName: "ShieldCheck", label: "Safety Protocols", href: "/safety", section: "Account" },
  ],
  admin: [
    { icon: Home, iconName: "Home", label: "Overview", href: "/admin", section: "Command" },
    { icon: Clock3, iconName: "Clock3", label: "Operations Monitor", href: "/admin/operations", section: "Command", badge: "Live" },
    { icon: UserRound, iconName: "UserRound", label: "Matching Engine", href: "/admin/matching", section: "Command" },
    { icon: ShieldCheck, iconName: "ShieldCheck", label: "Safety Queue", href: "/admin/safety", section: "Risk & Trust", badge: "Alerts" },
    { icon: BadgeCheck, iconName: "BadgeCheck", label: "Verification Review", href: "/admin/verification", section: "Risk & Trust" },
    { icon: FileLock2, iconName: "FileLock2", label: "Privacy Compliance", href: "/admin/privacy", section: "Risk & Trust" },
    { icon: WalletCards, iconName: "WalletCards", label: "Finance & Webhooks", href: "/admin/finance", section: "Commerce" },
    { icon: DollarSign, iconName: "DollarSign", label: "Plan Versions", href: "/admin/plans" as Route, section: "Commerce" },
    { icon: SlidersHorizontal, iconName: "SlidersHorizontal", label: "Service Catalog", href: "/admin/catalog", section: "Platform" },
    { icon: Flag, iconName: "Flag", label: "City Expansion", href: "/admin/cities" as Route, section: "Platform" },
    { icon: Handshake, iconName: "Handshake", label: "Partner Network", href: "/admin/partners" as Route, section: "Platform" },
    { icon: ClipboardCheck, iconName: "ClipboardCheck", label: "Care Reports", href: "/admin/reports", section: "Auditing" },
    { icon: BookOpen, iconName: "BookOpen", label: "Content & Reviews", href: "/admin/content", section: "Auditing" },
    { icon: Headphones, iconName: "Headphones", label: "Support Cases", href: "/admin/support", section: "Auditing" },
  ],
  society: [
    { icon: Home, iconName: "Home", label: "Overview", href: "/society" as Route },
    { icon: Users, iconName: "Users", label: "Residents", href: "/society/residents" as Route },
    { icon: PawPrint, iconName: "PawPrint", label: "Saathi Pool", href: "/society/saathi-pool" as Route },
    { icon: Megaphone, iconName: "Megaphone", label: "Events & Camps", href: "/society/events" as Route },
    { icon: ShieldCheck, iconName: "ShieldCheck", label: "Gate Protocol", href: "/society/gate-protocol" as Route },
    { icon: ShieldCheck, iconName: "ShieldCheck", label: "Safety Center", href: "/safety" },
    { icon: Headphones, iconName: "Headphones", label: "Support", href: "/support" },
  ],
  operator: [
    { icon: Home, iconName: "Home", label: "Overview", href: "/operator" as Route },
    { icon: MapPin, iconName: "MapPin", label: "Territories", href: "/operator/territories" as Route },
    { icon: Activity, iconName: "Activity", label: "City Health", href: "/operator/city-health" as Route },
    { icon: DollarSign, iconName: "DollarSign", label: "Economics", href: "/operator/economics" as Route },
    { icon: Settings2, iconName: "Settings2", label: "Settings", href: "/settings/notifications" as Route },
  ],
};

function getSerializableLinks(mode: PortalMode) {
  return portalNavigation[mode].map(({ iconName, label, href }) => ({
    iconName,
    label,
    href,
  }));
}

export function PortalShell({
  mode,
  displayName,
  metrics,
  showSummaryCards = true,
  children,
}: {
  mode: PortalMode;
  displayName: string;
  metrics?: readonly [string, string, string];
  showSummaryCards?: boolean;
  children?: ReactNode;
}) {
  const copy = portalCopy[mode];
  const firstName = displayName.trim().split(/\s+/)[0] || "there";
  const userInitials = displayName
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] antialiased">
      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/80 backdrop-blur-xl transition-all">
        <div className="container-shell flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <PortalMobileNav links={getSerializableLinks(mode)} mode={mode} />
            <PetSaathiLogo />
            <div className="hidden items-center gap-2 border-l border-black/10 pl-3.5 md:flex">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Network
              </span>
              <span className="rounded-full bg-indigo/10 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-indigo">
                {mode} portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href={copy.href}
              className="hidden items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo hover:shadow sm:inline-flex"
            >
              <Sparkles className="h-3.5 w-3.5 text-saffron" />
              {copy.primary}
            </Link>

            <Link
              href="/notifications"
              aria-label="Notifications"
              className="group relative flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.08] bg-white shadow-sm transition hover:border-coral/40 hover:bg-coral/[0.04] hover:text-coral"
            >
              <Bell className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-coral ring-2 ring-white" />
            </Link>

            <div className="flex items-center gap-2.5 rounded-2xl border border-black/[0.08] bg-white p-1.5 pr-3 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo to-[#4338ca] text-xs font-bold text-white shadow-sm">
                {userInitials || "PS"}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-bold leading-none text-ink">{displayName}</p>
                <p className="mt-0.5 text-[0.62rem] font-semibold uppercase tracking-wider text-ink/50">
                  {mode === "admin" ? "Super Admin" : mode === "saathi" ? "Caregiver" : "Pet Parent"}
                </p>
              </div>
              <Link
                href={"/api/auth/signout" as Route}
                aria-label="Sign out"
                title="Sign out of account"
                className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg text-ink/40 transition hover:bg-black/[0.06] hover:text-coral"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container-shell grid gap-8 py-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:py-10">
        <aside className="hidden rounded-[2.2rem] border border-black/[0.06] bg-white p-4 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.06)] lg:flex lg:min-h-[calc(100vh-9rem)] lg:flex-col">
          <div className="relative overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-[#1c1917] to-[#2e1065] p-5 text-white shadow-md">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-500/20 blur-xl" />
            <div className="relative">
              <span className="inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-saffron backdrop-blur">
                {copy.badge}
              </span>
              <h2 className="mt-2.5 font-display text-xl font-bold tracking-tight">
                Hey, {firstName} 👋
              </h2>
              <p className="mt-1 text-xs text-white/60">Ready to orchestrate world-class pet care.</p>
            </div>
          </div>

          <nav className="mt-5 flex-1 space-y-1 overflow-y-auto pr-1" aria-label="Workspace navigation">
            {portalNavigation[mode].map(({ icon: NavIcon, label, href, badge }, index) => {
              const isOverview = index === 0;
              return (
                <Link
                  key={label}
                  href={href}
                  className={cn(
                    "group flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                    isOverview
                      ? "bg-ink text-white shadow-[0_10px_25px_-10px_rgba(0,0,0,0.5)]"
                      : "text-ink/70 hover:bg-black/[0.04] hover:text-ink hover:translate-x-1"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110",
                        isOverview ? "bg-white/15 text-white" : "bg-black/[0.04] text-ink/70 group-hover:bg-indigo/10 group-hover:text-indigo"
                      )}
                    >
                      <NavIcon className="h-4 w-4" />
                    </span>
                    <span className="truncate">{label}</span>
                  </div>
                  {badge && (
                    <span className="rounded-full bg-coral/10 px-2 py-0.5 text-[0.6rem] font-bold text-coral">
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 rounded-2xl border border-black/[0.06] bg-[#faf8f5] p-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Immutable Ledger</span>
            </div>
            <p className="mt-1 text-[0.68rem] leading-relaxed text-ink/60">
              Zero telemetry leaks. Role-governed session audits active.
            </p>
          </div>
        </aside>

        <main className="min-w-0">
          <nav
            className="mb-6 flex gap-2 overflow-x-auto pb-1 no-scrollbar lg:hidden"
            aria-label="Mobile workspace navigation"
          >
            {portalNavigation[mode].slice(0, 6).map(({ icon: NavIcon, label, href }, index) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold shadow-sm transition",
                  index === 0
                    ? "border-ink bg-ink text-white"
                    : "border-black/[0.08] bg-white text-ink/70 hover:bg-black/[0.03]"
                )}
              >
                <NavIcon className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
          </nav>

          <section className="relative overflow-hidden rounded-[2.5rem] border border-black/[0.06] bg-gradient-to-br from-white via-[#fcfaf7] to-[#f4eeff] p-7 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.08)] sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-indigo/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-coral/10 blur-3xl" />
            <div className="pointer-events-none absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-saffron/15 blur-3xl" />

            <div className="relative z-10 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full bg-indigo/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-indigo">
                  {copy.eyebrow}
                </span>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700">
                  ● Systems Nominal
                </span>
              </div>

              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-ink sm:text-5xl lg:text-6xl">
                {copy.title}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70 sm:text-base lg:text-lg">
                {copy.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href={copy.href}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-bold text-white shadow-[0_15px_30px_-10px_rgba(0,0,0,0.4)] transition hover:-translate-y-0.5 hover:bg-indigo hover:shadow-lg"
                >
                  {copy.primary}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>

                {copy.secondary && (
                  <Link
                    href={copy.secondary.href}
                    className="inline-flex min-h-12 items-center gap-2 rounded-full border border-black/[0.1] bg-white/80 px-6 text-sm font-bold text-ink shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:border-black/20"
                  >
                    {copy.secondary.label}
                    <ChevronRight className="h-4 w-4 text-ink/40" />
                  </Link>
                )}
              </div>
            </div>
          </section>

          {showSummaryCards && (
            <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
              {cards[mode].map(({ label, hint, icon: Icon, tone, badge }, index) => {
                const metricValue = metrics ? metrics[index] : undefined;
                return (
                  <article
                    key={label}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white p-6 shadow-[0_15px_35px_-20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo/30 hover:shadow-[0_25px_50px_-25px_rgba(0,0,0,0.12)]"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm transition-transform duration-300 group-hover:scale-110",
                            tone
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        {badge && (
                          <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[0.65rem] font-bold text-ink/60 group-hover:bg-indigo/10 group-hover:text-indigo">
                            {badge}
                          </span>
                        )}
                      </div>

                      <div className="mt-6">
                        <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-ink/50">
                          {label}
                        </p>
                        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                          {metricValue ?? <span className="text-ink/30">—</span>}
                        </h2>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-black/[0.04] pt-4">
                      <p className="text-xs leading-relaxed text-ink/60">
                        {metricValue ? hint : "Live data links as soon as activity occurs."}
                      </p>
                    </div>
                  </article>
                );
              })}
            </section>
          )}

          <div className="mt-6">{children}</div>
        </main>
      </div>

      <GlobalChatWidget />
    </div>
  );
}
