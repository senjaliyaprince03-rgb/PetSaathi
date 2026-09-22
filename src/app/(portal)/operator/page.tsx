import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  MapPin,
  BarChart3,
  Building2,
  Lock,
} from "lucide-react";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import {
  resolveTerritoryScope,
  cityWhereFilter,
} from "@/modules/rbac/territory-scope";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Operator Dashboard | PetSaathi",
  description: "Manage your assigned territories, bookings, and local operations.",
};

export default async function OperatorDashboard() {
  const identity = await getCurrentIdentity();

  if (!identity) {
    return redirect("/login");
  }

  if (!identity || !hasAnyRole(identity, ["OPERATOR", "CITY_MANAGER", "SUPER_ADMIN"])) {
    return (
      <PortalShell mode="operator" displayName={identity.displayName}>
        <div className="mt-5 max-w-3xl">
          <h1 className="font-display text-4xl font-semibold tracking-[-0.04em] text-coral">Access Denied</h1>
          <p className="mt-3 text-sm leading-6 text-ink/80">
            This dashboard is only available to operating partners and city managers.
          </p>
        </div>
      </PortalShell>
    );
  }

  const scope = await resolveTerritoryScope(identity.id, identity.roles);

  // Fetch assigned territories (operators only)
  const territories = scope.unrestricted
    ? []
    : await prisma.territory.findMany({
        where: {
          isActive: true,
          ...cityWhereFilter(scope),
        },
        include: {
          city: true,
          serviceZone: true,
          operatingPartner: true,
        },
        orderBy: { city: { name: "asc" } },
        take: 50,
      });

  // Fetch city-level summary stats scoped to the operator's territory
  const scopedCities = scope.unrestricted
    ? await prisma.city.findMany({ take: 20, orderBy: { name: "asc" } })
    : await prisma.city.findMany({
        where: { id: { in: scope.cityIds } },
        orderBy: { name: "asc" },
        take: 50,
      });

  // Fetch latest financial records for scoped cities
  const financialRecords = await prisma.cityFinancialRecord.findMany({
    where: {
      cityId: { in: scopedCities.map((c) => c.id) },
    },
    orderBy: [{ periodYear: "desc" }, { periodMonth: "desc" }],
    distinct: ["cityId"],
    take: 50,
  });

  const financialByCity = new Map(
    financialRecords.map((fr) => [fr.cityId, fr]),
  );

  // Fetch latest health scores
  const healthScores = await prisma.cityHealthScore.findMany({
    where: {
      cityId: { in: scopedCities.map((c) => c.id) },
    },
    orderBy: { periodDate: "desc" },
    distinct: ["cityId"],
    take: 50,
  });

  const healthByCity = new Map(
    healthScores.map((hs) => [hs.cityId, hs]),
  );

  return (
    <PortalShell mode="operator" displayName={identity.displayName}>
      <div className="mt-5 space-y-12 pb-12">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/80">
              <Building2 className="h-3 w-3" />
              {scope.unrestricted ? "Central Operations" : "Operator Portal"}
            </span>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Operations Dashboard</h1>
            <p className="mt-3 text-sm leading-6 text-ink/80">
              {scope.unrestricted
                ? "Full platform view — all cities and territories."
                : `Viewing ${scope.cityIds.length} assigned ${scope.cityIds.length === 1 ? "city" : "cities"}.`}
            </p>
          </div>

          {!scope.unrestricted && (
            <div className="flex items-center gap-4 rounded-3xl border border-indigo/10 bg-paper p-4 shadow-lifted">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo/5 text-indigo">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/80">Data Scope</div>
                <div className="text-sm font-semibold text-ink">Territory-Restricted</div>
              </div>
            </div>
          )}
        </div>

        {/* Territory Assignments (for operators) */}
        {territories.length > 0 && (
          <section>
            <div className="flex items-center gap-3 border-b border-indigo/5 pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf/10 text-leaf">
                <MapPin className="h-5 w-5" />
              </span>
              <h2 className="font-display text-2xl font-semibold text-ink">
                Your Territories
              </h2>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {territories.map((t) => (
                <div
                  key={t.id}
                  className="rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted"
                >
                  <div className="font-semibold text-ink">{t.name}</div>
                  <div className="mt-1 text-sm text-ink/80">
                    {t.city.name}, {t.city.state}
                  </div>
                  {t.serviceZone && (
                    <div className="mt-2 text-xs font-medium text-ink/80">
                      Zone: {t.serviceZone.name}
                    </div>
                  )}
                  <div className="mt-6 flex items-center gap-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        t.territoryType === "EXCLUSIVE"
                          ? "bg-leaf/10 text-leaf"
                          : t.territoryType === "MANAGED"
                            ? "bg-indigo/10 text-indigo"
                            : "bg-ink/10 text-ink/80"
                      }`}
                    >
                      {t.territoryType}
                    </span>
                    {t.agreedRevShareBps > 0 && (
                      <span className="text-xs font-medium text-ink/80">
                        Rev share: {(t.agreedRevShareBps / 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Territory Heatmaps & Fulfillment Monitoring */}
        <section className="grid lg:grid-cols-2 gap-6 mt-12">
          {/* Heatmaps */}
          <div className="rounded-4xl border border-indigo/10 bg-white p-6 shadow-lifted">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="eyebrow">Capacity Planning</p>
                <h3 className="font-display text-2xl font-semibold text-ink mt-1">Territory Heatmaps</h3>
              </div>
              <span className="text-[10px] font-bold uppercase bg-indigo/5 text-indigo px-2 py-1 rounded-md">Live Clusters</span>
            </div>
            <div className="space-y-4">
              {[
                { city: "Bangalore", zone: "Koramangala", demand: 92, supply: 45, status: "Critical Shortage" },
                { city: "Pune", zone: "Kalyani Nagar", demand: 65, supply: 60, status: "Balanced" },
                { city: "Ahmedabad", zone: "Vastrapur", demand: 40, supply: 85, status: "Over-supplied" }
              ].map((h, i) => (
                <div key={i} className="p-4 border border-ink/5 rounded-2xl bg-surface/50">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-bold text-sm text-ink">{h.zone}</h4>
                      <p className="text-[10px] text-ink/60">{h.city}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                      h.status === 'Critical Shortage' ? 'bg-coral/10 text-coral' : 
                      h.status === 'Balanced' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>{h.status}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] w-12 text-ink/60">Demand</span>
                      <div className="flex-1 h-1.5 bg-ink/5 rounded-full overflow-hidden">
                        <div className="h-full bg-coral rounded-full" style={{ width: `${h.demand}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] w-12 text-ink/60">Supply</span>
                      <div className="flex-1 h-1.5 bg-ink/5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo rounded-full" style={{ width: `${h.supply}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fulfillment Queue */}
          <div className="rounded-4xl border border-indigo/10 bg-white p-6 shadow-lifted">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="eyebrow">Active Routing</p>
                <h3 className="font-display text-2xl font-semibold text-ink mt-1">Fulfillment Monitoring</h3>
              </div>
              <span className="text-[10px] font-bold uppercase bg-coral/10 text-coral animate-pulse px-2 py-1 rounded-md">3 Unassigned</span>
            </div>
            
            <div className="space-y-3">
              {[
                { time: "In 45 mins", type: "60-min Walk", loc: "HSR Layout", pet: "Leo (Golden Ret.)" },
                { time: "In 2 hours", type: "Home Sitting", loc: "Indiranagar", pet: "Bella (Indie)" },
                { time: "Tomorrow", type: "Grooming", loc: "Koramangala", pet: "Max (Beagle)" }
              ].map((q, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-coral/20 rounded-2xl bg-coral/5">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-coral mt-1.5 animate-pulse" />
                    <div>
                      <p className="text-xs font-bold text-ink">{q.type} • {q.pet}</p>
                      <p className="text-[10px] text-ink/70 mt-0.5">{q.loc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-coral">{q.time}</p>
                    <button className="text-[10px] font-bold text-indigo mt-1 hover:underline">Force Route</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 border-2 border-dashed border-ink/10 text-xs font-bold text-ink/60 rounded-xl hover:bg-surface">View All Queues</button>
          </div>
        </section>

        {/* City Economics Grid */}
        <section>
          <div className="flex items-center gap-3 border-b border-indigo/5 pb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf/10 text-leaf">
              <BarChart3 className="h-5 w-5" />
            </span>
            <h2 className="font-display text-2xl font-semibold text-ink">
              City Performance
            </h2>
          </div>

          {scopedCities.length === 0 ? (
            <div className="mt-6 rounded-4xl border border-indigo/10 bg-paper py-12 text-center shadow-lifted">
              <p className="text-sm font-medium text-ink/80">
                No cities assigned to your territory.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-4xl border border-indigo/10 bg-paper shadow-lifted">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-indigo/10 bg-cream/30">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/80">City</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/80">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.16em] text-ink/80">GBV</th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.16em] text-ink/80">CM2</th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.16em] text-ink/80">Bookings</th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.16em] text-ink/80">Health</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo/5">
                    {scopedCities.map((city) => {
                      const fin = financialByCity.get(city.id);
                      const health = healthByCity.get(city.id);
                      return (
                        <tr
                          key={city.id}
                          className="transition-colors hover:bg-cream/20"
                        >
                          <td className="px-6 py-5 font-semibold text-ink">{city.name}</td>
                          <td className="px-6 py-5">
                            <span className="inline-flex rounded-full bg-leaf/10 px-3 py-1 text-xs font-bold text-leaf">
                              {city.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right font-mono text-sm text-ink/80">
                            {fin
                              ? `₹${(Number(fin.gbvPaise) / 100).toLocaleString()}`
                              : "—"}
                          </td>
                          <td className="px-6 py-5 text-right font-mono text-sm">
                            {fin ? (
                              <span
                                className={
                                  Number(fin.cm2Paise) >= 0
                                    ? "text-leaf"
                                    : "text-coral"
                                }
                              >
                                ₹{(Number(fin.cm2Paise) / 100).toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-ink/80">—</span>
                            )}
                          </td>
                          <td className="px-6 py-5 text-right font-mono text-sm text-ink/80">
                            {fin ? fin.totalBookings.toLocaleString() : "—"}
                          </td>
                          <td className="px-6 py-5 text-right">
                            {health ? (
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                                  health.overallScore >= 80
                                    ? "bg-leaf/10 text-leaf"
                                    : health.overallScore >= 60
                                      ? "bg-saffron/20 text-saffron-dark"
                                      : "bg-coral/10 text-coral"
                                }`}
                              >
                                {health.overallScore}/100
                              </span>
                            ) : (
                              <span className="text-ink/80">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </PortalShell>
  );
}
