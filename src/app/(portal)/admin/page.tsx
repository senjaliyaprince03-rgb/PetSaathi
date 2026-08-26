import type { Role } from "@prisma/client";
import type { Route } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  DollarSign,
  FileLock2,
  FileText,
  Flag,
  Headphones,
  Inbox,
  Lock,
  MapPin,
  Megaphone,
  Package,
  Settings2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  Users,
  Zap,
} from "lucide-react";

import { PortalShell } from "@/components/portal/portal-shell";
import { ScrollReveal } from "@/components/3d/scroll-reveal";
import { ScrollStaggerContainer, ScrollStaggerItem } from "@/components/effects/animos-motion";
import { cn } from "@/lib/cn";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

const adminRoles = [
  "OPERATIONS_ADMIN",
  "VERIFICATION_ADMIN",
  "SAFETY_ADMIN",
  "FINANCE_ADMIN",
  "CONTENT_ADMIN",
  "SUPER_ADMIN",
] as const satisfies readonly Role[];

type DashboardLane = {
  label: string;
  value: string;
  count: number;
  href: Route;
  icon: any;
  tone: string;
  badgeTone: string;
  dot: string;
  category: string;
};

export default async function AdminDashboardPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login?returnTo=/admin");
  if (!hasAnyRole(identity, adminRoles)) redirect("/");

  const canManageMatching = hasAnyRole(identity, [
    "OPERATIONS_ADMIN",
    "SUPER_ADMIN",
  ]);
  const canManageSafety = hasAnyRole(identity, [
    "SAFETY_ADMIN",
    "OPERATIONS_ADMIN",
    "SUPER_ADMIN",
  ]);
  const canManageFinance = hasAnyRole(identity, [
    "FINANCE_ADMIN",
    "SUPER_ADMIN",
  ]);
  const canManageVerification = hasAnyRole(identity, [
    "VERIFICATION_ADMIN",
    "SUPER_ADMIN",
  ]);
  const canManageContent = hasAnyRole(identity, [
    "CONTENT_ADMIN",
    "SUPER_ADMIN",
  ]);

  const [lanesData, totalUsers, activeSaathis, totalBookings, activeCities] = await Promise.all([
    Promise.all([
      canManageMatching
        ? prisma.booking
            .count({
              where: {
                status: {
                  in: [
                    "REQUESTED",
                    "RISK_REVIEW",
                    "MATCHING",
                    "REPLACEMENT_REQUIRED",
                  ],
                },
              },
            })
            .then(
              (count): DashboardLane => ({
                label: "Matching Decisions",
                value: `${count} waiting`,
                count,
                href: "/admin/matching",
                icon: Activity,
                tone: "border-indigo/20 bg-indigo/[0.03] hover:border-indigo/40",
                badgeTone: "bg-indigo/10 text-indigo",
                dot: "bg-indigo",
                category: "Operations",
              }),
            )
        : null,
      canManageSafety
        ? prisma.incident
            .count({ where: { status: { not: "CLOSED" } } })
            .then(
              (count): DashboardLane => ({
                label: "Safety & Incidents",
                value: `${count} open`,
                count,
                href: "/admin/safety",
                icon: ShieldAlert,
                tone: "border-coral/20 bg-coral/[0.03] hover:border-coral/40",
                badgeTone: "bg-coral/10 text-coral",
                dot: "bg-coral",
                category: "Trust & Risk",
              }),
            )
        : null,
      canManageFinance
        ? prisma.paymentEvent
            .count({ where: { processedAt: null } })
            .then(
              (count): DashboardLane => ({
                label: "Finance & Webhooks",
                value: `${count} unprocessed`,
                count,
                href: "/admin/finance",
                icon: DollarSign,
                tone: "border-emerald-500/20 bg-emerald-500/[0.03] hover:border-emerald-500/40",
                badgeTone: "bg-emerald-500/10 text-emerald-700",
                dot: "bg-emerald-500",
                category: "Commerce",
              }),
            )
        : null,
      canManageVerification
        ? prisma.sitterProfile
            .count({
              where: { status: { in: ["APPLICANT", "UNDER_REVIEW"] } },
            })
            .then(
              (count): DashboardLane => ({
                label: "Verification Reviews",
                value: `${count} pending`,
                count,
                href: "/admin/verification",
                icon: ClipboardCheck,
                tone: "border-amber-500/20 bg-amber-500/[0.03] hover:border-amber-500/40",
                badgeTone: "bg-amber-500/10 text-amber-800",
                dot: "bg-amber-500",
                category: "Caregivers",
              }),
            )
        : null,
      canManageContent
        ? prisma.testimonial
            .count({ where: { status: "IN_REVIEW" } })
            .then(
              (count): DashboardLane => ({
                label: "Content Approvals",
                value: `${count} pending`,
                count,
                href: "/admin/content/testimonials",
                icon: FileText,
                tone: "border-black/[0.08] bg-black/[0.02] hover:border-black/20",
                badgeTone: "bg-black/10 text-ink",
                dot: "bg-ink",
                category: "Moderation",
              }),
            )
        : null,
    ]),
    prisma.user.count(),
    prisma.sitterProfile.count({ where: { status: "APPROVED" } }),
    prisma.booking.count(),
    prisma.city.count({ where: { launchedAt: { not: null } } }),
  ]);

  const lanes = lanesData.filter((lane): lane is DashboardLane => lane !== null);

  const quickStats = [
    { label: "Total Platform Users", value: totalUsers, icon: Users, hint: "All registered accounts", trend: "+12.4% MoM", tone: "bg-indigo/10 text-indigo" },
    { label: "Verified Saathis", value: activeSaathis, icon: UserRound, hint: "Active approved sitters", trend: "100% Verified", tone: "bg-emerald-500/10 text-emerald-700" },
    { label: "Total Bookings", value: totalBookings, icon: Package, hint: "Cumulative care orders", trend: "Live Protocol", tone: "bg-coral/10 text-coral" },
    { label: "Active Cities", value: activeCities, icon: MapPin, hint: "Launched metro zones", trend: "Expanding", tone: "bg-amber-500/10 text-amber-700" },
  ];

  const adminTools = [
    { label: "Operations", desc: "Live match monitor & fulfillment queues", href: "/admin/operations" as Route, icon: Settings2, category: "Core" },
    { label: "Partner Network", desc: "Clinics, shelters and partner orgs", href: "/admin/partners" as Route, icon: Building2, category: "Network" },
    { label: "Active Cities", desc: "Territory management and geo zones", href: "/admin/cities" as Route, icon: MapPin, category: "Expansion" },
    { label: "Content & CMS", desc: "Testimonials, guides & marketing assets", href: "/admin/content" as Route, icon: FileText, category: "Content" },
    { label: "System Reports", desc: "Telemetry analytics & audit exports", href: "/admin/reports" as Route, icon: BarChart3, category: "Audits" },
    { label: "Plan Versions", desc: "Subscription tiers and pricing schemes", href: "/admin/plans" as Route, icon: Target, category: "Commerce" },
    { label: "Privacy & GDPR", desc: "Erasure requests & audit compliance", href: "/admin/privacy" as Route, icon: Lock, category: "Compliance" },
    { label: "Escalated Support", desc: "High-priority customer support cases", href: "/admin/support" as Route, icon: Headphones, category: "Support" },
    { label: "Sales & Leads", desc: "Inbound partner & franchise pipeline", href: "/admin/leads" as Route, icon: Megaphone, category: "Growth" },
    { label: "Feature Flags", desc: "System switches & canary deployments", href: "/admin/features" as Route, icon: Flag, category: "System" },
    { label: "Society B2B", desc: "Gated community & RWA contracts", href: "/admin/b2b" as Route, icon: Building2, category: "B2B" },
    { label: "Partner Orders", desc: "Fulfillment tracking for bulk B2B care", href: "/admin/partner-orders" as Route, icon: Briefcase, category: "Fulfillment" },
  ];

  return (
    <PortalShell
      mode="admin"
      displayName={identity.displayName}
      showSummaryCards={false}
    >
      {/* Real-time Operations HUD Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#18181b] via-[#241c2c] to-[#312e81] p-7 text-white shadow-[0_25px_60px_-30px_rgba(0,0,0,0.3)] sm:p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-20 right-1/3 h-64 w-64 rounded-full bg-coral/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-saffron">
                Live Operations Pulse
              </span>
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Platform Command Center
            </h1>
            <p className="mt-1 text-sm text-white/70">
              Real-time synchronization across multi-city care queues, trust verification and payment webhooks.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {lanes.map((lane) => (
              <Link
                key={lane.href}
                href={lane.href}
                className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20 hover:border-white/30"
              >
                <span className={cn("h-2 w-2 rounded-full", lane.dot)} />
                <span>{lane.label}:</span>
                <span className="font-semibold text-saffron group-hover:underline">
                  {lane.value}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* KPI Bento Grid */}
      <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article
              key={stat.label}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl border shadow-sm", stat.tone)}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-black/[0.04] px-2.5 py-0.5 text-[0.65rem] font-bold text-ink/60">
                    {stat.trend}
                  </span>
                </div>

                <div className="mt-6">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-ink/50">
                    {stat.label}
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-black/[0.04] pt-3">
                <p className="text-xs text-ink/60">{stat.hint}</p>
              </div>
            </article>
          );
        })}
      </section>

      {/* Priority Action Queues */}
      <section className="mt-10 rounded-[2.5rem] border border-black/[0.06] bg-white p-6 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.06)] sm:p-8 lg:p-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">Action Required</p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Priority Operational Queues
            </h2>
            <p className="mt-1 text-xs text-ink/60">
              Decision requests are isolated by strict security roles with recorded audit trails.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {lanes.map(({ label, value, count, href, icon: Icon, tone, badgeTone }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-[1.8rem] border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
                tone
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold", badgeTone)}>
                    {value}
                  </span>
                  <Icon className="h-5 w-5 text-ink/60 transition group-hover:scale-110" />
                </div>

                <h3 className="mt-6 font-display text-xl font-bold text-ink">
                  {label}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-ink/60">
                  {count > 0 ? "Items require manual review and verification." : "Queue clear. No immediate escalations."}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-black/[0.04] pt-4 text-xs font-bold text-ink">
                <span>Open decision queue</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.04] text-ink transition group-hover:bg-ink group-hover:text-white">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Platform Management Matrix */}
      <section className="mt-10 rounded-[2.5rem] border border-black/[0.06] bg-white p-6 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.06)] sm:p-8 lg:p-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo">Platform Suite</p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Administrative Control Modules
          </h2>
          <p className="mt-1 text-xs text-ink/60">
            Fulfill operations, partner integrations, CMS updates and financial ledger reconciliation.
          </p>
        </div>

        <ScrollStaggerContainer className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {adminTools.map(({ label, desc, href, icon: Icon, category }) => (
            <ScrollStaggerItem key={href}>
              <Link
                href={href}
                className="group flex h-full flex-col justify-between rounded-[1.6rem] border border-black/[0.06] bg-[#faf8f5] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo/30 hover:bg-white hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo/10 text-indigo shadow-sm transition group-hover:scale-110">
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
                    {desc}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-black/[0.04] pt-3 text-xs font-bold text-ink/40 transition group-hover:text-indigo">
                  <span>Manage</span>
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
