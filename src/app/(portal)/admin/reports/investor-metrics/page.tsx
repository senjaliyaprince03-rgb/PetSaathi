import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentIdentity } from "@/modules/auth/session";
import { generateInvestorMetrics } from "@/modules/reporting/investor-metrics";
import {
  BarChart3,
  ShieldCheck,
  Star,
  DollarSign,
  MapPin,
  Calendar,
  PawPrint,
} from "lucide-react";
import { PortalShell } from "@/components/portal/portal-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Investor Metrics | PetSaathi Admin",
  description: "Real-time KPI matrix for investor data room.",
};

function formatPaise(paise: bigint | number): string {
  const num = typeof paise === "bigint" ? Number(paise) : paise;
  return `₹${(num / 100).toLocaleString("en-IN")}`;
}

export default async function InvestorMetricsPage() {
  const identity = await getCurrentIdentity();

  if (!identity) {
    return notFound();
  }

  const isAuthorized =
    identity.roles.includes("SUPER_ADMIN") ||
    identity.roles.includes("FINANCE_ADMIN");

  if (!isAuthorized) {
    return (
      <PortalShell mode="admin" displayName={identity.displayName}>
        <div className="max-w-7xl pb-12">
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] text-coral">Access Denied</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/60 mb-10">
            This report is restricted to senior leadership and finance.
          </p>
        </div>
      </PortalShell>
    );
  }

  const metrics = await generateInvestorMetrics();

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12 space-y-8">
        {/* Header */}
        <div>
          <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/50">
            <BarChart3 className="w-3 h-3" />
            Funding Data Room
          </span>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">
            Investor KPI Dashboard
          </h1>
          <p className="text-sm leading-6 text-ink/60 mt-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Generated: {new Date(metrics.generatedAt).toLocaleString()}
          </p>
        </div>

      {/* Scale */}
      <section className="bg-paper p-6 rounded-4xl shadow-lifted border border-ink/5">
        <h2 className="text-xl font-display font-bold flex items-center gap-2 border-b border-ink/10 pb-4 mb-6">
          <MapPin className="w-5 h-5 text-leaf" />
          Scale
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard label="Total Cities" value={metrics.scale.totalCities} />
          <MetricCard label="Active Cities" value={metrics.scale.activeCities} accent />
          <MetricCard label="Service Zones" value={metrics.scale.totalServiceZones} />
          <MetricCard label="Registered Users" value={metrics.scale.totalRegisteredUsers.toLocaleString()} />
          <MetricCard label="Active Sitters" value={metrics.scale.totalActiveSitters.toLocaleString()} />
          <MetricCard label="Total Bookings" value={metrics.scale.totalBookingsAllTime.toLocaleString()} accent />
        </div>
      </section>

      {/* Economics */}
      <section className="bg-paper p-6 rounded-4xl shadow-lifted border border-ink/5">
        <h2 className="text-xl font-display font-bold flex items-center gap-2 border-b border-ink/10 pb-4 mb-6">
          <DollarSign className="w-5 h-5 text-leaf" />
          Unit Economics (Latest Month)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard label="GBV" value={formatPaise(metrics.economics.latestMonthGbvPaise)} />
          <MetricCard label="Net Revenue" value={formatPaise(metrics.economics.latestMonthNetRevenuePaise)} accent />
          <MetricCard
            label="CM1"
            value={formatPaise(metrics.economics.latestMonthCm1Paise)}
            positive={Number(metrics.economics.latestMonthCm1Paise) >= 0}
          />
          <MetricCard
            label="CM2"
            value={formatPaise(metrics.economics.latestMonthCm2Paise)}
            positive={Number(metrics.economics.latestMonthCm2Paise) >= 0}
          />
          <MetricCard label="Avg CAC" value={formatPaise(metrics.economics.averageCacPaise)} />
          <MetricCard label="AOV" value={formatPaise(metrics.economics.averageOrderValuePaise)} />
        </div>
      </section>

      {/* Demand & Supply */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-paper p-6 rounded-4xl shadow-lifted border border-ink/5">
          <h2 className="text-xl font-display font-bold flex items-center gap-2 border-b border-ink/10 pb-4 mb-6">
            <PawPrint className="w-5 h-5 text-leaf" />
            Demand
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard label="Total Pets" value={metrics.demand.totalPets.toLocaleString()} />
            <MetricCard label="Bookings (30d)" value={metrics.demand.bookingsLast30Days.toLocaleString()} accent />
            <MetricCard label="Bookings (90d)" value={metrics.demand.bookingsLast90Days.toLocaleString()} />
            <MetricCard label="Active Subs" value={metrics.demand.subscriptionCount.toLocaleString()} accent />
          </div>
        </section>

        <section className="bg-paper p-6 rounded-4xl shadow-lifted border border-ink/5">
          <h2 className="text-xl font-display font-bold flex items-center gap-2 border-b border-ink/10 pb-4 mb-6">
            <ShieldCheck className="w-5 h-5 text-leaf" />
            Safety & Quality
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard label="Total Incidents" value={metrics.safety.totalIncidents} />
            <MetricCard
              label="Unresolved Critical"
              value={metrics.safety.unresolvedCritical}
              positive={metrics.safety.unresolvedCritical === 0}
            />
            <MetricCard label="Active Suspensions" value={metrics.safety.activeSuspensions} />
            <MetricCard label="Avg Health Score" value={`${metrics.safety.averageHealthScore}/100`} accent />
          </div>
        </section>
      </div>

      {/* Retention */}
      <section className="bg-paper p-6 rounded-4xl shadow-lifted border border-ink/5">
        <h2 className="text-xl font-display font-bold flex items-center gap-2 border-b border-ink/10 pb-4 mb-6">
          <Star className="w-5 h-5 text-leaf" />
          Retention & Reviews
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Total Reviews" value={metrics.retention.totalReviews.toLocaleString()} />
          <MetricCard label="Avg Rating" value={`${metrics.retention.averageRating.toFixed(2)} / 5`} accent />
        </div>
      </section>
    </div>
    </PortalShell>
  );
}

/* ─── Metric Card Component ────────────────────────────────── */

function MetricCard({
  label,
  value,
  accent,
  positive,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
  positive?: boolean;
}) {
  let textColor = "text-ink";
  if (positive === true) textColor = "text-leaf";
  if (positive === false) textColor = "text-coral";

  return (
    <div className="p-4 bg-cream/50 rounded-2xl text-center">
      <span className="text-xs text-ink/60 uppercase tracking-wider block">
        {label}
      </span>
      <div
        className={`text-lg font-bold font-mono mt-1 ${accent ? "text-leaf" : textColor}`}
      >
        {value}
      </div>
    </div>
  );
}
