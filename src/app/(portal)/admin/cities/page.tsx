import { Building2, CheckCircle2, MapPin, SlidersHorizontal } from "lucide-react";
import type { Role } from "@prisma/client";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { resolveTerritoryScope } from "@/modules/rbac/territory-scope";

const adminRoles: Role[] = ["CITY_MANAGER", "OPERATIONS_ADMIN", "SUPER_ADMIN"];

export default async function AdminCitiesPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, adminRoles)) redirect("/login?returnTo=/admin/cities");

  const scope = await resolveTerritoryScope(identity.id, identity.roles);

  const cities = await prisma.city.findMany({
    where: scope.unrestricted ? undefined : { id: { in: scope.cityIds } },
    include: {
      serviceZones: true,
      cityServiceConfigs: {
        include: { serviceType: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const isCityManager = identity.roles.includes("CITY_MANAGER") && !scope.unrestricted;
  const totalZones = cities.reduce((acc, c) => acc + c.serviceZones.length, 0);
  const activeZones = cities.reduce((acc, c) => acc + c.serviceZones.filter(z => z.status === "ACTIVE").length, 0);

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="space-y-6 max-w-6xl pb-16">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 bg-indigo/5 text-indigo border border-indigo/15 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-indigo" />
              {isCityManager ? "Assigned Territory Scope" : "Global City Network"}
            </span>
            <span className="text-xs text-ink/60 font-semibold hidden sm:inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {cities.length} {cities.length === 1 ? "City" : "Cities"} Under Management
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-ink">
            {isCityManager ? "City Territory Command" : "City Network Command Center"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            {isCityManager
              ? "Oversee operational health, active service zones, and supply capacity for your assigned cities."
              : "Manage nationwide city lifecycle stages, regional service zones, and launch capabilities."}
          </p>
        </div>

        {/* Territory KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Managed Cities</span>
              <Building2 className="w-4 h-4 text-indigo" />
            </div>
            <span className="text-3xl font-bold font-display text-ink block">{cities.length}</span>
            <p className="text-[11px] text-ink/60 mt-1 font-medium">Assigned active markets</p>
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Active Zones</span>
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-3xl font-bold font-display text-emerald-700 block">{activeZones}</span>
            <p className="text-[11px] text-emerald-700 mt-1 font-medium">{totalZones} total zones mapped</p>
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Service Coverage</span>
              <SlidersHorizontal className="w-4 h-4 text-coral" />
            </div>
            <span className="text-3xl font-bold font-display text-ink block">
              {cities.reduce((acc, c) => acc + c.cityServiceConfigs.filter(cfg => cfg.status === "ACTIVE").length, 0)}
            </span>
            <p className="text-[11px] text-ink/60 mt-1 font-medium">Active service lines</p>
          </div>
        </div>

        {/* Cities Grid */}
        <div className="grid gap-6">
          {cities.map((city) => (
            <div key={city.id} className="rounded-3xl border border-ink/10 bg-white p-6 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-ink/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo/10 text-indigo flex items-center justify-center font-bold font-display">
                    {city.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-ink">{city.name}</h2>
                    <p className="text-xs text-ink/60 font-medium">{city.state} • Code: {city.id.substring(0, 8)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                    city.status === "GROWTH" || city.status === "MATURE" || city.status === "VALIDATED" || city.status === "PUBLIC_LIMITED"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-amber-200 bg-amber-50 text-amber-800"
                  }`}>
                    {city.status}
                  </span>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink/70">Service Zones ({city.serviceZones.length})</h3>
                  </div>
                  {city.serviceZones.length === 0 ? (
                    <p className="text-xs text-ink/50 py-3 italic">No zones configured for this territory.</p>
                  ) : (
                    <div className="space-y-2">
                      {city.serviceZones.map(zone => (
                        <div key={zone.id} className="flex justify-between items-center text-xs bg-surface/70 px-3.5 py-2.5 rounded-xl border border-ink/5">
                          <span className="text-ink font-semibold">{zone.name}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            zone.status === "ACTIVE" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
                          }`}>
                            {zone.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink/70">Catalog Availability ({city.cityServiceConfigs.length})</h3>
                  </div>
                  {city.cityServiceConfigs.length === 0 ? (
                    <p className="text-xs text-ink/50 py-3 italic">Standard service catalog active across zones.</p>
                  ) : (
                    <div className="space-y-2">
                      {city.cityServiceConfigs.map(config => (
                        <div key={config.id} className="flex justify-between items-center text-xs bg-surface/70 px-3.5 py-2.5 rounded-xl border border-ink/5">
                          <span className="text-ink font-semibold">{config.serviceType.name}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            config.status === "ACTIVE" ? "bg-emerald-50 text-emerald-800" : "bg-ink/5 text-ink/60"
                          }`}>
                            {config.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {cities.length === 0 && (
            <div className="text-center py-16 border-2 border-ink/10 border-dashed rounded-3xl bg-white p-8">
              <MapPin className="w-10 h-10 text-ink/30 mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold text-ink">No Cities Assigned Yet</h3>
              <p className="text-xs text-ink/60 max-w-md mx-auto mt-1">
                {isCityManager
                  ? "Your City Manager account does not currently have assigned cities in the system. An administrator must link your account in City Manager Assignments."
                  : "No cities have been configured in the system yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
