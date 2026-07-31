import { FileLock2 } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { PrivacyAdminActions } from "@/components/portal/privacy-admin-actions";
import { prisma } from "@/lib/db";
import { maskEmail, maskPhone } from "@/lib/pii";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminPrivacyPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SUPER_ADMIN"])) redirect("/login?returnTo=/admin/privacy");
  const requests = await prisma.accountRequest.findMany({ where: { status: { notIn: ["FULFILLED", "REJECTED", "CANCELLED"] } }, orderBy: { requestedAt: "asc" }, take: 100, include: { user: { select: { displayName: true, email: true, phoneE164: true } } } });
  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/50">identity-verified rights workflow</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Privacy request queue</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/60 mb-10">Correction, export and deletion requests move through explicit states. Deletion cannot be executed from this review screen.</p>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">{requests.length ? requests.map((request) => <article key={request.id} className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted"><div className="flex items-center justify-between gap-3"><FileLock2 className="h-6 w-6 text-indigo" /><span className="rounded-full bg-indigo/10 px-3 py-1 text-xs font-bold text-indigo">{request.status}</span></div><p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-coral">{request.reference} · {request.type}</p><h2 className="mt-2 font-display text-3xl font-semibold">{request.user.displayName}</h2><p className="mt-2 text-xs text-ink/40">{maskEmail(request.user.email) ?? maskPhone(request.user.phoneE164)}</p><pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-6 text-ink/60">{JSON.stringify(request.details, null, 2)}</pre><PrivacyAdminActions id={request.id} status={request.status} type={request.type} /></article>) : <div className="rounded-5xl border border-dashed border-ink/15 bg-paper p-10 text-center lg:col-span-2"><FileLock2 className="mx-auto h-10 w-10 text-leaf" /><h2 className="mt-4 font-display text-3xl font-semibold">No privacy requests need review.</h2></div>}</div>
      </div>
    </PortalShell>
  );
}
