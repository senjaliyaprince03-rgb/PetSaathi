import { Users, UserCheck, UserX, Search } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export default async function SocietyResidentsPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SOCIETY_MANAGER", "SUPER_ADMIN"])) redirect("/login?returnTo=/society/residents");

  const membership = await prisma.societyMember.findFirst({
    where: { userId: identity.id },
    include: { society: true },
  });

  if (!membership) {
    return (
      <PortalShell mode="society" displayName={identity.displayName}>
        <div className="max-w-7xl pb-12">
          <h1 className="font-display text-4xl font-semibold">Residents</h1>
          <p className="mt-5 rounded-2xl bg-coral/10 p-4 text-coral font-semibold">You are not linked to a society as a manager.</p>
        </div>
      </PortalShell>
    );
  }

  const residents = await prisma.societyMember.findMany({
    where: { societyId: membership.societyId },
    orderBy: { verifiedAt: "desc" },
  });

  const verified = residents.filter((r) => r.verifiedAt);
  const pending = residents.filter((r) => !r.verifiedAt);

  return (
    <PortalShell mode="society" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/80">community management</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Residents</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/80 mb-10">Verified members of {membership.society.name}. Only verified residents can request care services within the society gate protocol.</p>

        <div className="grid gap-5 sm:grid-cols-3 mb-10">
          <div className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
            <Users className="h-5 w-5 text-indigo" />
            <p className="mt-4 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-ink/80">Total residents</p>
            <p className="mt-1 font-display text-3xl font-semibold">{residents.length}</p>
          </div>
          <div className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
            <UserCheck className="h-5 w-5 text-leaf" />
            <p className="mt-4 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-ink/80">Verified</p>
            <p className="mt-1 font-display text-3xl font-semibold">{verified.length}</p>
          </div>
          <div className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
            <UserX className="h-5 w-5 text-saffron" />
            <p className="mt-4 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-ink/80">Pending verification</p>
            <p className="mt-1 font-display text-3xl font-semibold">{pending.length}</p>
          </div>
        </div>

        <div className="rounded-4xl border border-ink/10 bg-paper shadow-lifted overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-indigo/10 bg-cream/30">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/80">User ID</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/80">Unit</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/80">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/80">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo/5">
                {residents.length > 0 ? residents.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-cream/20">
                    <td className="px-6 py-4 font-mono text-sm text-ink/80">{r.userId.slice(0, 8)}…</td>
                    <td className="px-6 py-4 text-sm font-semibold text-ink">{r.unitRef ?? "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${r.status === "VERIFIED" ? "bg-leaf/10 text-leaf" : "bg-saffron/15 text-saffron-dark"}`}>{r.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink/80">{r.verifiedAt ? r.verifiedAt.toLocaleDateString("en-IN", { dateStyle: "medium" }) : "Pending"}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-ink/80">No residents registered yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
