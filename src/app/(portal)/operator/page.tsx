/* eslint-disable */
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import {
  resolveTerritoryScope,
  cityWhereFilter,
} from "@/modules/rbac/territory-scope";
import {
  MapPin,
  BarChart3,
  Building2,
  Lock,
} from "lucide-react";

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
      <div className="container-shell p-8">
        <h1 className="section-title text-coral">Access Denied</h1>
        <p className="text-ink/60">
          This dashboard is only available to operating partners and city managers.
        </p>
      </div>
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
    <div className="container-shell p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <span className="eyebrow flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            {scope.unrestricted ? "Central Operations" : "Operator Portal"}
          </span>
          <h1 className="section-title font-display mt-2">Operations Dashboard</h1>
          <p className="text-ink/60 mt-2">
            {scope.unrestricted
              ? "Full platform view — all cities and territories."
              : `Viewing ${scope.cityIds.length} assigned ${scope.cityIds.length === 1 ? "city" : "cities"}.`}
          </p>
        </div>

        {!scope.unrestricted && (
          <div className="bg-cream/50 p-4 rounded-4xl shadow-lifted border border-ink/5 flex items-center gap-3">
            <Lock className="w-5 h-5 text-ink/40" />
            <div>
              <div className="text-xs text-ink/50 uppercase tracking-wider">Data Scope</div>
              <div className="font-semibold text-sm text-ink">
                Territory-Restricted
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Territory Assignments (for operators) */}
      {territories.length > 0 && (
        <section className="bg-paper p-6 rounded-4xl shadow-lifted border border-ink/5">
          <h2 className="text-xl font-display font-bold flex items-center gap-2 border-b border-ink/10 pb-4 mb-6">
            <MapPin className="w-5 h-5 text-leaf" />
            Your Territories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {territories.map((t) => (
              <div
                key={t.id}
                className="p-4 bg-cream/50 rounded-2xl border border-ink/5"
              >
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-ink/60 mt-1">
                  {t.city.name}, {t.city.state}
                </div>
                {t.serviceZone && (
                  <div className="text-xs text-ink/50 mt-1">
                    Zone: {t.serviceZone.name}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      t.territoryType === "EXCLUSIVE"
                        ? "bg-leaf/10 text-leaf"
                        : t.territoryType === "MANAGED"
                          ? "bg-blue-500/10 text-blue-600"
                          : "bg-ink/10 text-ink/60"
                    }`}
                  >
                    {t.territoryType}
                  </span>
                  {t.agreedRevShareBps > 0 && (
                    <span className="text-xs text-ink/50">
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
      <section className="bg-paper p-6 rounded-4xl shadow-lifted border border-ink/5">
        <h2 className="text-xl font-display font-bold flex items-center gap-2 border-b border-ink/10 pb-4 mb-6">
          <BarChart3 className="w-5 h-5 text-leaf" />
          City Performance
        </h2>

        {scopedCities.length === 0 ? (
          <p className="text-ink/50 text-center py-8">
            No cities assigned to your territory.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left text-ink/50 uppercase tracking-wider text-xs">
                  <th className="pb-3 pr-4">City</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4 text-right">GBV</th>
                  <th className="pb-3 pr-4 text-right">CM2</th>
                  <th className="pb-3 pr-4 text-right">Bookings</th>
                  <th className="pb-3 text-right">Health</th>
                </tr>
              </thead>
              <tbody>
                {scopedCities.map((city) => {
                  const fin = financialByCity.get(city.id);
                  const health = healthByCity.get(city.id);
                  return (
                    <tr
                      key={city.id}
                      className="border-b border-ink/5 hover:bg-cream/30 transition-colors"
                    >
                      <td className="py-3 pr-4 font-semibold">{city.name}</td>
                      <td className="py-3 pr-4">
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-leaf/10 text-leaf">
                          {city.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right font-mono">
                        {fin
                          ? `₹${(Number(fin.gbvPaise) / 100).toLocaleString()}`
                          : "—"}
                      </td>
                      <td className="py-3 pr-4 text-right font-mono">
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
                          "—"
                        )}
                      </td>
                      <td className="py-3 pr-4 text-right font-mono">
                        {fin ? fin.totalBookings.toLocaleString() : "—"}
                      </td>
                      <td className="py-3 text-right">
                        {health ? (
                          <span
                            className={`font-bold ${
                              health.overallScore >= 80
                                ? "text-leaf"
                                : health.overallScore >= 60
                                  ? "text-yellow-600"
                                  : "text-coral"
                            }`}
                          >
                            {health.overallScore}/100
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
