import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { resolveTerritoryScope } from "@/modules/rbac/territory-scope";
import { PortalShell } from "@/components/portal/portal-shell";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Users,
  MapPin,
  Calendar,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "City Health Dashboard | PetSaathi Admin",
  description: "Monitor city economics and trust & safety metrics",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CityHealthPage({ params }: PageProps) {
  const idResult = z.string().uuid().safeParse((await params).id);
  if (!idResult.success) notFound();
  const id = idResult.data;
  const identity = await getCurrentIdentity();

  if (!identity) {
    redirect(
      `/login?returnTo=${encodeURIComponent(`/admin/operations/cities/${id}/health`)}`,
    );
  }

  const isAuthorized =
    identity.roles.includes("SUPER_ADMIN") ||
    identity.roles.includes("OPERATIONS_ADMIN") ||
    identity.roles.includes("CITY_MANAGER");

  if (!isAuthorized) notFound();

  const scope = await resolveTerritoryScope(identity.id, identity.roles);
  if (!scope.unrestricted && !scope.cityIds.includes(id)) notFound();

  const city = await prisma.city.findUnique({
    where: { id },
    include: {
      healthScores: {
        orderBy: { periodDate: "desc" },
        take: 1,
      },
      financialRecords: {
        orderBy: { periodYear: "desc", periodMonth: "desc" },
        take: 1,
      },
      cityManagers: {
        where: { status: "ACTIVE" },
        include: {
          user: true,
        },
      },
    },
  });

  if (!city) {
    return notFound();
  }

  const currentHealth = city.healthScores[0];
  const currentFinance = city.financialRecords[0];

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/50">
              <MapPin className="w-3 h-3" />
              {city.state}
            </span>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">{city.name} Health</h1>
            <p className="text-ink/60 mt-2 text-sm">
              Status: <span className="font-semibold text-ink">{city.status}</span>
            </p>
          </div>
          <div className="bg-cream/50 p-4 rounded-4xl shadow-lifted border border-ink/5">
            <h3 className="text-sm font-semibold text-ink/60 flex items-center gap-2">
              <Users className="w-4 h-4" />
              City Leadership
            </h3>
            <div className="mt-2 space-y-1">
              {city.cityManagers.length > 0 ? (
                city.cityManagers.map((cm: { id: string; user: { displayName: string } }) => (
                  <div key={cm.id} className="text-ink font-medium">
                    {cm.user.displayName}
                  </div>
                ))
              ) : (
                <span className="text-coral text-sm">No active manager</span>
              )}
            </div>
          </div>
        </div>

        {/* Critical Alerts Layer */}
        {currentHealth?.hasUnresolvedSevere && (
          <div className="bg-coral/10 border border-coral/30 p-4 rounded-4xl flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-coral shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-coral">Severe Incident Unresolved</h3>
              <p className="text-coral/80 text-sm mt-1">
                This city has an open critical incident. Operational launch criteria or scale expansion may be restricted.
              </p>
            </div>
          </div>
        )}

        {currentHealth?.cm2Deterioration && (
          <div className="bg-coral/10 border border-coral/30 p-4 rounded-4xl flex items-start gap-3">
            <TrendingUp className="w-6 h-6 text-coral shrink-0 mt-0.5 rotate-180" />
            <div>
              <h3 className="font-semibold text-coral">CM2 Deterioration Alert</h3>
              <p className="text-coral/80 text-sm mt-1">
                Contribution Margin 2 has materially declined. A corrective action plan is required.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Operational Health Scorecard */}
          <section className="bg-paper p-6 rounded-4xl shadow-lifted space-y-6 border border-ink/5">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <h2 className="text-xl font-display font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-leaf" />
                Health Scorecard
              </h2>
              {currentHealth && (
                <span className="text-sm text-ink/50 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {currentHealth.periodDate.toLocaleDateString()}
                </span>
              )}
            </div>

            {currentHealth ? (
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-ink">Overall Score</span>
                    <span className="font-bold">{currentHealth.overallScore}/100</span>
                  </div>
                  <div className="h-2 w-full bg-cream rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        currentHealth.overallScore >= 80 ? "bg-leaf" : currentHealth.overallScore >= 60 ? "bg-yellow-500" : "bg-coral"
                      }`}
                      style={{ width: `${currentHealth.overallScore}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-cream/50 rounded-2xl">
                    <span className="text-xs text-ink/60 uppercase tracking-wider block">Safety</span>
                    <div className="text-lg font-semibold flex items-center gap-2 mt-1">
                      {currentHealth.safetyScore}
                      {currentHealth.safetyScore >= 90 ? <CheckCircle className="w-4 h-4 text-leaf" /> : <AlertTriangle className="w-4 h-4 text-coral" />}
                    </div>
                  </div>
                  <div className="p-3 bg-cream/50 rounded-2xl">
                    <span className="text-xs text-ink/60 uppercase tracking-wider block">Supply</span>
                    <div className="text-lg font-semibold flex items-center gap-2 mt-1">
                      {currentHealth.supplyScore}
                    </div>
                  </div>
                  <div className="p-3 bg-cream/50 rounded-2xl">
                    <span className="text-xs text-ink/60 uppercase tracking-wider block">Demand</span>
                    <div className="text-lg font-semibold flex items-center gap-2 mt-1">
                      {currentHealth.demandScore}
                    </div>
                  </div>
                  <div className="p-3 bg-cream/50 rounded-2xl">
                    <span className="text-xs text-ink/60 uppercase tracking-wider block">Operations</span>
                    <div className="text-lg font-semibold flex items-center gap-2 mt-1">
                      {currentHealth.operationsScore}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-ink/50">No health data available for this period.</div>
            )}
          </section>

          {/* Financial Economics */}
          <section className="bg-paper p-6 rounded-4xl shadow-lifted space-y-6 border border-ink/5">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <h2 className="text-xl font-display font-bold flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-leaf" />
                City P&L Economics
              </h2>
              {currentFinance && (
                <span className="text-sm text-ink/50 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {currentFinance.periodMonth}/{currentFinance.periodYear}
                </span>
              )}
            </div>

            {currentFinance ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-ink/5">
                  <span className="text-ink/70">Gross Booking Value (GBV)</span>
                  <span className="font-semibold font-mono text-lg">₹{(Number(currentFinance.gbvPaise) / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-ink/5">
                  <span className="text-ink/70">Net Revenue</span>
                  <span className="font-semibold font-mono text-lg">₹{(Number(currentFinance.netRevenuePaise) / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-ink/5">
                  <span className="text-ink/70">CM1 (Contribution Margin 1)</span>
                  <span className={`font-semibold font-mono text-lg ${Number(currentFinance.cm1Paise) >= 0 ? "text-leaf" : "text-coral"}`}>
                    ₹{(Number(currentFinance.cm1Paise) / 100).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-ink/5">
                  <span className="text-ink/70">CM2 (Contribution Margin 2)</span>
                  <span className={`font-semibold font-mono text-lg ${Number(currentFinance.cm2Paise) >= 0 ? "text-leaf" : "text-coral"}`}>
                    ₹{(Number(currentFinance.cm2Paise) / 100).toLocaleString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 pt-2">
                  <div className="p-3 bg-cream/50 rounded-2xl text-center">
                    <span className="text-xs text-ink/60 uppercase tracking-wider block">Blended CAC</span>
                    <div className="text-lg font-semibold mt-1 font-mono text-coral">
                      ₹{(currentFinance.blendedCacPaise / 100).toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3 bg-cream/50 rounded-2xl text-center">
                    <span className="text-xs text-ink/60 uppercase tracking-wider block">Active Customers</span>
                    <div className="text-lg font-semibold mt-1 font-mono text-ink">
                      {currentFinance.activeCustomers.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-ink/50">No financial data available for this period.</div>
            )}
          </section>
        </div>
      </div>
    </PortalShell>
  );
}
