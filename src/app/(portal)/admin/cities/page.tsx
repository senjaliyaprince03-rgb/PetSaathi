import type { Role } from "@prisma/client";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

const adminRoles: Role[] = ["OPERATIONS_ADMIN", "SUPER_ADMIN"];

export default async function AdminCitiesPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, adminRoles)) redirect("/login?returnTo=/admin/cities");

  const cities = await prisma.city.findMany({
    include: {
      serviceZones: true,
      cityServiceConfigs: {
        include: { serviceType: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="space-y-6 max-w-5xl p-6">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-[-0.04em] text-ink">City Network Command Center</h1>
          <p className="mt-3 text-sm leading-6 text-ink/60">Manage city lifecycle stages and zone capacities.</p>
        </div>

        <div className="grid gap-6">
          {cities.map((city) => (
            <div key={city.id} className="rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-ink">{city.name}</h2>
                  <p className="text-sm text-ink/60">{city.state}</p>
                </div>
                <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.16em] border border-blue-500/20 bg-blue-500/10 text-blue-700">
                  {city.status}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-ink/45 border-b border-ink/5 pb-2">Service Zones</h3>
                  {city.serviceZones.length === 0 ? (
                    <p className="text-sm text-ink/50">No zones configured.</p>
                  ) : (
                    <div className="space-y-2">
                      {city.serviceZones.map(zone => (
                        <div key={zone.id} className="flex justify-between text-sm bg-cream/30 p-3 rounded-2xl">
                          <span className="text-ink/80 font-medium">{zone.name}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-[0.16em] ${zone.status === "ACTIVE" ? "text-leaf" : "text-saffron"}`}>
                            {zone.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-ink/45 border-b border-ink/5 pb-2">Service Statuses</h3>
                  {city.cityServiceConfigs.length === 0 ? (
                    <p className="text-sm text-ink/50">No services configured.</p>
                  ) : (
                    <div className="space-y-2">
                      {city.cityServiceConfigs.map(config => (
                        <div key={config.id} className="flex justify-between text-sm bg-cream/30 p-3 rounded-2xl">
                          <span className="text-ink/80 font-medium">{config.serviceType.name}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-[0.16em] ${config.status === "ACTIVE" ? "text-leaf" : "text-ink/45"}`}>
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
            <div className="text-center py-12 border border-ink/10 border-dashed rounded-4xl bg-paper">
              <p className="text-sm text-ink/60">No cities have been configured in the system yet.</p>
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
