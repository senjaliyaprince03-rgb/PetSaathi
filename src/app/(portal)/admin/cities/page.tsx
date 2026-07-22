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
      <div className="space-y-6 max-w-5xl mx-auto p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">City Network Command Center</h1>
          <p className="text-gray-400">Manage city lifecycle stages and zone capacities.</p>
        </div>

        <div className="grid gap-6">
          {cities.map((city) => (
            <div key={city.id} className="rounded-xl border border-white/10 bg-black p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{city.name}</h2>
                  <p className="text-sm text-gray-400">{city.state}</p>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20 bg-blue-500/10 text-blue-400">
                  {city.status}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-300 border-b border-white/5 pb-2">Service Zones</h3>
                  {city.serviceZones.length === 0 ? (
                    <p className="text-sm text-gray-500">No zones configured.</p>
                  ) : (
                    <div className="space-y-2">
                      {city.serviceZones.map(zone => (
                        <div key={zone.id} className="flex justify-between text-sm bg-white/5 p-2 rounded">
                          <span className="text-gray-300">{zone.name}</span>
                          <span className={`text-xs ${zone.status === "ACTIVE" ? "text-emerald-400" : "text-amber-400"}`}>
                            {zone.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-300 border-b border-white/5 pb-2">Service Statuses</h3>
                  {city.cityServiceConfigs.length === 0 ? (
                    <p className="text-sm text-gray-500">No services configured.</p>
                  ) : (
                    <div className="space-y-2">
                      {city.cityServiceConfigs.map(config => (
                        <div key={config.id} className="flex justify-between text-sm bg-white/5 p-2 rounded">
                          <span className="text-gray-300">{config.serviceType.name}</span>
                          <span className={`text-xs ${config.status === "ACTIVE" ? "text-emerald-400" : "text-gray-400"}`}>
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
            <div className="text-center py-12 border border-white/5 border-dashed rounded-xl">
              <p className="text-gray-400">No cities have been configured in the system yet.</p>
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
