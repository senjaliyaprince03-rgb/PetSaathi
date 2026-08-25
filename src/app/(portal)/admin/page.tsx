import type { Role } from "@prisma/client";
import type { Route } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  Users,
  MapPin,
  DollarSign,
  Shield,
  FileText,
  Settings2,
  Headphones,
  Target,
  Flag,
  Building2,
  Package,
  Briefcase,
  BarChart3,
  Lock,
  Megaphone,
  ArrowUpRight,
  ClipboardCheck,
  UserRound,
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
  href: Route;
  icon: any;
  tone: string;
  dot: string;
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
                label: "Matching decisions",
                value: `${count} waiting`,
                href: "/admin/matching",
                icon: Activity,
                tone: "border-indigo text-indigo",
                dot: "bg-indigo",
              }),
            )
        : null,
      canManageSafety
        ? prisma.incident
            .count({ where: { status: { not: "CLOSED" } } })
            .then(
              (count): DashboardLane => ({
                label: "Safety & incidents",
                value: `${count} open`,
                href: "/admin/safety",
                icon: Shield,
                tone: "border-coral text-coral",
                dot: "bg-coral",
              }),
            )
        : null,
      canManageFinance
        ? prisma.paymentEvent
            .count({ where: { processedAt: null } })
            .then(
              (count): DashboardLane => ({
                label: "Finance events",
                value: `${count} unprocessed`,
                href: "/admin/finance",
                icon: DollarSign,
                tone: "border-leaf text-leaf",
                dot: "bg-leaf",
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
                label: "Verification reviews",
                value: `${count} pending`,
                href: "/admin/verification",
                icon: ClipboardCheck,
                tone: "border-saffron text-saffron",
                dot: "bg-saffron",
              }),
            )
        : null,
      canManageContent
        ? prisma.testimonial
            .count({ where: { status: "IN_REVIEW" } })
            .then(
              (count): DashboardLane => ({
                label: "Content reviews",
                value: `${count} pending`,
                href: "/admin/content/testimonials",
                icon: FileText,
                tone: "border-ink text-ink",
                dot: "bg-ink",
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
    { label: "Total Users", value: totalUsers, icon: Users },
    { label: "Active Saathis", value: activeSaathis, icon: UserRound },
    { label: "Total Bookings", value: totalBookings, icon: Package },
    { label: "Active Cities", value: activeCities, icon: MapPin },
  ];

  const adminTools = [
    { label: "Operations", desc: "Manage fulfillment", href: "/admin/operations" as Route, icon: Settings2 },
    { label: "Partners", desc: "Network providers", href: "/admin/partners" as Route, icon: Building2 }, // Using Building2 as Handshake isn't strictly requested but Partners matches Building2 or Briefcase
    { label: "Cities", desc: "Service areas", href: "/admin/cities" as Route, icon: MapPin },
    { label: "Content", desc: "CMS & approvals", href: "/admin/content" as Route, icon: FileText },
    { label: "Reports", desc: "System metrics", href: "/admin/reports" as Route, icon: BarChart3 },
    { label: "Plans", desc: "Subscriptions", href: "/admin/plans" as Route, icon: Target },
    { label: "Privacy", desc: "Data compliance", href: "/admin/privacy" as Route, icon: Lock },
    { label: "Support", desc: "Escalated cases", href: "/admin/support" as Route, icon: Headphones },
    { label: "Leads", desc: "Sales pipeline", href: "/admin/leads" as Route, icon: Megaphone },
    { label: "Features", desc: "Feature flags", href: "/admin/features" as Route, icon: Flag },
    { label: "B2B", desc: "Society accounts", href: "/admin/b2b" as Route, icon: Building2 }, // I can use Building2 for B2B and something else for partners, e.g. Users
    { label: "Partner Orders", desc: "B2B fulfillment", href: "/admin/partner-orders" as Route, icon: Briefcase },
  ];

  return (
    <PortalShell
      mode="admin"
      displayName={identity.displayName}
      showSummaryCards={false}
    >
      <ScrollReveal direction="up" delay={0.1}>
        <section className="mt-5 rounded-[2rem] bg-gradient-to-r from-[#1c1917] to-[#312e81] p-6 sm:p-8">
          <h1 className="font-display text-3xl font-semibold text-white tracking-[-0.04em]">Command Centre</h1>
          <p className="mt-2 text-white/60">Real-time operations overview</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {lanes.map((lane) => (
              <Link key={lane.href} href={lane.href} className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
                <span className={cn("h-2 w-2 rounded-full", lane.dot)} />
                {lane.label}: <span className="font-normal opacity-80">{lane.value}</span>
              </Link>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.2}>
        <section className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {quickStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="rounded-[1.4rem] border border-ink/[0.06] bg-paper p-5 shadow-sm transition hover:shadow-lifted">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/80">{stat.label}</p>
                  <Icon className="h-4 w-4 text-ink/40" />
                </div>
                <p className="mt-3 font-display text-3xl font-semibold">{stat.value.toLocaleString()}</p>
              </div>
            );
          })}
        </section>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.3}>
        <section className="mt-5 rounded-[2rem] border border-indigo/10 bg-paper p-6 shadow-lifted sm:p-7">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Priority lanes</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em]">
                Command centre
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-ink/80">
              Each queue keeps its own permission boundary and recorded decision trail.
            </p>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {lanes.map(({ label, value, href, icon: Icon, tone }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group flex flex-col justify-between rounded-[1.4rem] border-l-[6px] border-y border-r border-y-indigo/10 border-r-indigo/10 bg-cream/45 p-5 transition hover:-translate-y-1 hover:bg-indigo/[0.05] hover:shadow-lifted",
                  tone.split(' ')[0]
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/80">
                      {label}
                    </p>
                    <Icon className={cn("h-5 w-5", tone.split(' ')[1])} />
                  </div>
                  <p className="mt-3 font-display text-3xl font-semibold">
                    {value}
                  </p>
                </div>
                <p className={cn("mt-5 text-sm font-bold transition", tone.split(' ')[1])}>
                  Open queue →
                </p>
              </Link>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.4}>
        <section className="mt-5 rounded-[2rem] border border-ink/[0.07] bg-paper p-5 shadow-[0_18px_55px_-38px_rgb(var(--ink)/0.32)] sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Administration</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Platform management</h2>
            </div>
          </div>
          <ScrollStaggerContainer className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {adminTools.map(({ label, desc, href, icon: Icon }) => (
              <ScrollStaggerItem key={href}>
                <Link href={href} className="group flex h-full flex-col rounded-[1.4rem] border border-ink/[0.06] bg-cream/35 p-4 transition hover:-translate-y-0.5 hover:border-indigo/20 hover:bg-paper hover:shadow-lifted">
                  <div className="flex items-start justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo/10 text-indigo">
                      <Icon className="h-4 w-4" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-ink/80 transition group-hover:text-coral" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold">{label}</h3>
                  <p className="mt-1 text-xs leading-5 text-ink/80">{desc}</p>
                </Link>
              </ScrollStaggerItem>
            ))}
          </ScrollStaggerContainer>
        </section>
      </ScrollReveal>
    </PortalShell>
  );
}
