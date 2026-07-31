import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { listOrganizations } from "@/modules/b2b/organizations";

export const dynamic = "force-dynamic";

export default async function OrganizationsPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["PARTNER_MANAGER", "SUPER_ADMIN"])) {
    redirect("/login?returnTo=/admin/b2b/organizations");
  }

  const result = await listOrganizations({ page: 1, pageSize: 50 });

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="mt-5">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">Organizations</h1>
        
        <div className="mt-8 overflow-hidden rounded-4xl border border-indigo/10 bg-paper shadow-lifted">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-indigo/10 bg-cream/30">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Name</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Type</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo/5">
                {result.items.map((org) => (
                  <tr key={org.id} className="transition-colors hover:bg-cream/20">
                    <td className="px-6 py-5">
                      <div className="font-semibold text-ink">{org.displayName}</div>
                      <div className="mt-1 text-sm text-ink/60">{org.legalName}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-ink/75">{org.organizationType}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-full bg-indigo/10 px-3 py-1 text-xs font-bold text-indigo">
                        {org.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {result.items.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-sm font-medium text-ink/60">
                      No organizations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex flex-col divide-y divide-indigo/5 md:hidden">
            {result.items.map((org) => (
              <div key={org.id} className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink">{org.displayName}</span>
                  <span className="inline-flex rounded-full bg-indigo/10 px-3 py-1 text-[10px] font-bold text-indigo">
                    {org.status}
                  </span>
                </div>
                <div className="mt-1 text-sm text-ink/60">{org.legalName}</div>
                <div className="mt-4 text-xs font-medium text-ink/75">
                  Type: {org.organizationType}
                </div>
              </div>
            ))}
            {result.items.length === 0 && (
              <div className="p-10 text-center text-sm font-medium text-ink/60">
                No organizations found.
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
