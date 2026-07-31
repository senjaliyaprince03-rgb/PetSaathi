import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { listProgrammes } from "@/modules/b2b/programmes";

export const dynamic = "force-dynamic";

export default async function ProgrammesPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["PARTNER_MANAGER", "SUPER_ADMIN"])) {
    redirect("/login?returnTo=/admin/b2b/programmes");
  }

  const result = await listProgrammes({ page: 1, pageSize: 50 });

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="mt-5">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">Active Programmes</h1>
        
        <div className="mt-8 overflow-hidden rounded-4xl border border-indigo/10 bg-paper shadow-lifted">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-indigo/10 bg-cream/30">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Programme Name</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Type / Method</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/50">Members</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo/5">
                {result.items.map((prog) => (
                  <tr key={prog.id} className="transition-colors hover:bg-cream/20">
                    <td className="px-6 py-5">
                      <div className="font-semibold text-ink">{prog.name}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs font-bold text-ink/50">/{prog.slug}</span>
                        <span className="text-xs text-ink/40">•</span>
                        <span className="text-xs text-ink/60">{prog.organization.displayName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-medium text-ink/75">{prog.programmeType.replace(/_/g, " ")}</div>
                      <div className="mt-1 text-xs text-ink/50">{prog.eligibilityMethod.replace(/_/g, " ")}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        prog.status === "ACTIVE_PROGRAMME" ? "bg-leaf/10 text-leaf" : "bg-ink/10 text-ink/60"
                      }`}>
                        {prog.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="rounded-full bg-indigo/5 px-3 py-1 text-sm font-semibold text-indigo">
                        {prog._count.memberships}
                      </span>
                    </td>
                  </tr>
                ))}
                {result.items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm font-medium text-ink/60">
                      No programmes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
