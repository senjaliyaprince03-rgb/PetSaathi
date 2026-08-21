import { PawPrint, ShieldCheck, Clock3 } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export default async function SocietySaathiPoolPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SOCIETY_MANAGER", "SUPER_ADMIN"])) redirect("/login?returnTo=/society/saathi-pool");

  const membership = await prisma.societyMember.findFirst({
    where: { userId: identity.id },
    include: { society: true },
  });

  if (!membership) {
    return (
      <PortalShell mode="society" displayName={identity.displayName}>
        <div className="max-w-7xl pb-12">
          <h1 className="font-display text-4xl font-semibold">Saathi Pool</h1>
          <p className="mt-5 rounded-2xl bg-coral/10 p-4 text-coral font-semibold">You are not linked to a society as a manager.</p>
        </div>
      </PortalShell>
    );
  }

  const poolEntries = await prisma.societySitterPool.findMany({
    where: { societyId: membership.societyId },
    include: {
      sitter: {
        include: {
          user: { select: { displayName: true } },
        },
      },
    },
    orderBy: { approvedAt: "desc" },
  });

  const approved = poolEntries.filter((e) => e.status === "ACTIVE");
  const pending = poolEntries.filter((e) => e.status !== "ACTIVE");

  return (
    <PortalShell mode="society" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/80">caregiver access</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Saathi Pool</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/80 mb-10">Approved caregivers who have gate access to {membership.society.name}. Only pool members can accept bookings within the society.</p>

        <div className="grid gap-5 sm:grid-cols-3 mb-10">
          <div className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
            <PawPrint className="h-5 w-5 text-indigo" />
            <p className="mt-4 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-ink/80">Total pool</p>
            <p className="mt-1 font-display text-3xl font-semibold">{poolEntries.length}</p>
          </div>
          <div className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
            <ShieldCheck className="h-5 w-5 text-leaf" />
            <p className="mt-4 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-ink/80">Approved</p>
            <p className="mt-1 font-display text-3xl font-semibold">{approved.length}</p>
          </div>
          <div className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
            <Clock3 className="h-5 w-5 text-saffron" />
            <p className="mt-4 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-ink/80">Pending / Other</p>
            <p className="mt-1 font-display text-3xl font-semibold">{pending.length}</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {poolEntries.length > 0 ? poolEntries.map((entry) => (
            <article key={entry.id} className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold">{entry.sitter.user.displayName}</h3>
                <span className={`rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest ${entry.status === "ACTIVE" ? "bg-leaf/10 text-leaf" : "bg-saffron/15 text-saffron-dark"}`}>{entry.status}</span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-ink/80">
                {entry.approvedAt && <p>Approved: {entry.approvedAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>}
                {entry.notes && <p className="italic">{entry.notes}</p>}
              </div>
            </article>
          )) : (
            <div className="sm:col-span-2 lg:col-span-3 rounded-4xl border border-dashed border-indigo/15 p-10 text-center">
              <PawPrint className="mx-auto h-10 w-10 text-indigo/80" />
              <h2 className="mt-5 font-display text-3xl font-semibold">No Saathis in the pool yet.</h2>
              <p className="mt-2 text-sm text-ink/80">Approved caregivers will appear here once operations adds them.</p>
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
