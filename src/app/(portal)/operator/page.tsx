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
import { getCurrentIdentity } from "@/modules/auth/session";
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

  const hasAccess =
    identity.roles.includes("OPERATOR") ||
    identity.roles.includes("CITY_MANAGER") ||
    identity.roles.includes("SUPER_ADMIN");

  if (!hasAccess) {
    return (
      <PortalShell mode="operator" displayName={identity.displayName}>
        <div className="mt-5 max-w-3xl">
          <h1 className="font-display text-4xl font-semibold tracking-[-0.04em] text-coral">Access Denied</h1>
          <p className="mt-3 text-sm leading-6 text-ink/60">
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
      });

  // Fetch city-level summary stats scoped to the operator's territory
  const scopedCities = scope.unrestricted
    ? await prisma.city.findMany({ take: 20, orderBy: { name: "asc" } })
    : await prisma.city.findMany({
        where: { id: { in: scope.cityIds } },
        orderBy: { name: "asc" },
      });

  // Fetch latest financial records for scoped cities
  const financialRecords = await prisma.cityFinancialRecord.findMany({
    where: {
      cityId: { in: scopedCities.map((c) => c.id) },
    },
    orderBy: [{ periodYear: "desc" }, { periodMonth: "desc" }],
    distinct: ["cityId"],
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
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/50">
              <Building2 className="h-3 w-3" />
              {scope.unrestricted ? "Central Operations" : "Operator Portal"}
            </span>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Operations Dashboard</h1>
            <p className="mt-3 text-sm leading-6 text-ink/60">
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
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/40">Data Scope</div>
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
                  <div className="mt-1 text-sm text-ink/60">
                    {t.city.name}, {t.city.state}
                  </div>
                  {t.serviceZone && (
                    <div className="mt-2 text-xs font-medium text-ink/50">
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
                            : "bg-ink/10 text-ink/60"
                      }`}
                    >
                      {t.territoryType}
                    </span>
                    {t.agreedRevShareBps > 0 && (
                      <span className="text-xs font-medium text-ink/50">
                        Rev share: {(t.agreedRevShareBps / 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

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
              <p className="text-sm font-medium text-ink/60">
                No cities assigned to your territory.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-4xl border border-indigo/10 bg-paper shadow-lifted">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-indigo/10 bg-cream/30">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">City</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.16em] text-ink/50">GBV</th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.16em] text-ink/50">CM2</th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Bookings</th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Health</th>
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
                          <td className="px-6 py-5 text-right font-mono text-sm text-ink/75">
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
                              <span className="text-ink/30">—</span>
                            )}
                          </td>
                          <td className="px-6 py-5 text-right font-mono text-sm text-ink/75">
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
                              <span className="text-ink/30">—</span>
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
