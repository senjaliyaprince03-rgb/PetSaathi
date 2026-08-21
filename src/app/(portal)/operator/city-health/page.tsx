import { Activity } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { resolveTerritoryScope } from "@/modules/rbac/territory-scope";

export default async function OperatorCityHealthPage() {
  const identity = await getCurrentIdentity();
  if (!identity) return redirect("/login");
  if (!hasAnyRole(identity, ["OPERATOR", "CITY_MANAGER", "SUPER_ADMIN"])) {
    return (
      <PortalShell mode="operator" displayName={identity.displayName}>
        <div className="mt-5 max-w-3xl">
          <h1 className="font-display text-4xl font-semibold tracking-[-0.04em] text-coral">Access Denied</h1>
          <p className="mt-3 text-sm leading-6 text-ink/80">This page is only available to operating partners and city managers.</p>
        </div>
      </PortalShell>
    );
  }

  const scope = await resolveTerritoryScope(identity.id, identity.roles);

  const scopedCities = scope.unrestricted
    ? await prisma.city.findMany({ take: 20, orderBy: { name: "asc" } })
    : await prisma.city.findMany({ where: { id: { in: scope.cityIds } }, orderBy: { name: "asc" } });

  const healthScores = await prisma.cityHealthScore.findMany({
    where: { cityId: { in: scopedCities.map((c) => c.id) } },
    orderBy: { periodDate: "desc" },
    distinct: ["cityId"],
  });

  const healthByCity = new Map(healthScores.map((hs) => [hs.cityId, hs]));

  return (
    <PortalShell mode="operator" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/80">operational metrics</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">City Health</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/80 mb-10">Monitor operational health scores across your assigned cities. Scores below 60 require immediate attention.</p>

        {scopedCities.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {scopedCities.map((city) => {
              const health = healthByCity.get(city.id);
              const score = health?.overallScore ?? null;
              const tone = score !== null
                ? score >= 80 ? "bg-leaf/10 text-leaf border-leaf/20"
                : score >= 60 ? "bg-saffron/15 text-saffron-dark border-saffron/20"
                : "bg-coral/10 text-coral border-coral/20"
                : "bg-ink/5 text-ink/80 border-ink/10";

              return (
                <article key={city.id} className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-xl font-semibold">{city.name}</h3>
                      <p className="mt-1 text-sm text-ink/80">{city.state}</p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${tone}`}>
                      {score !== null ? `${score}/100` : "No data"}
                    </span>
                  </div>
                  <div className="mt-5 space-y-2 text-sm text-ink/80">
                    <p>Status: <span className="inline-flex rounded-full bg-leaf/10 px-3 py-1 text-xs font-bold text-leaf">{city.status}</span></p>
                    {health && <p>Last scored: {health.periodDate.toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>}
                    {health?.supplyScore !== undefined && <p>Supply: {health.supplyScore} · Demand: {health.demandScore} · Safety: {health.safetyScore}</p>}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel rounded-5xl p-10 text-center">
            <Activity className="mx-auto h-10 w-10 text-indigo/80" />
            <h2 className="mt-5 font-display text-3xl font-semibold">No cities assigned.</h2>
            <p className="mt-2 text-sm text-ink/80">Health scores will appear once cities are assigned to your territory.</p>
          </div>
        )}
      </div>
    </PortalShell>
  );
}
