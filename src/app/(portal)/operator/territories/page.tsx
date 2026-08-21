import { MapPin, Lock } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { resolveTerritoryScope, cityWhereFilter } from "@/modules/rbac/territory-scope";

export default async function OperatorTerritoriesPage() {
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

  const territories = scope.unrestricted
    ? await prisma.territory.findMany({
        where: { isActive: true },
        include: { city: true, serviceZone: true, operatingPartner: true },
        orderBy: { city: { name: "asc" } },
        take: 50,
      })
    : await prisma.territory.findMany({
        where: { isActive: true, ...cityWhereFilter(scope) },
        include: { city: true, serviceZone: true, operatingPartner: true },
        orderBy: { city: { name: "asc" } },
      });

  return (
    <PortalShell mode="operator" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/80">territory management</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Your Territories</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/80 mb-10">
          {scope.unrestricted
            ? "Full platform view — all active territories."
            : `Viewing territories across ${scope.cityIds.length} assigned ${scope.cityIds.length === 1 ? "city" : "cities"}.`}
        </p>

        {territories.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {territories.map((t) => (
              <article key={t.id} className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-xl font-semibold">{t.name}</h3>
                    <p className="mt-1 text-sm text-ink/80">{t.city.name}, {t.city.state}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest ${
                    t.territoryType === "EXCLUSIVE" ? "bg-leaf/10 text-leaf"
                    : t.territoryType === "MANAGED" ? "bg-indigo/10 text-indigo"
                    : "bg-ink/10 text-ink/80"
                  }`}>{t.territoryType}</span>
                </div>
                <div className="mt-5 space-y-2 text-sm text-ink/80">
                  {t.serviceZone && <p>Zone: <span className="font-semibold text-ink/80">{t.serviceZone.name}</span></p>}
                  {t.agreedRevShareBps > 0 && <p>Rev share: <span className="font-semibold text-ink/80">{(t.agreedRevShareBps / 100).toFixed(1)}%</span></p>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-5xl p-10 text-center">
            <MapPin className="mx-auto h-10 w-10 text-indigo/80" />
            <h2 className="mt-5 font-display text-3xl font-semibold">No territories assigned.</h2>
            <p className="mt-2 text-sm text-ink/80">Contact the operations team to request territory assignments.</p>
          </div>
        )}
      </div>
    </PortalShell>
  );
}
