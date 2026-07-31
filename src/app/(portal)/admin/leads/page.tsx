import { Inbox, MapPin } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { LeadActions } from "@/components/portal/lead-actions";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login?returnTo=/admin/leads");
  if (!hasAnyRole(identity, ["OPERATIONS_ADMIN", "SUPER_ADMIN"])) notFound();
  const leads = await prisma.lead.findMany({ where: { status: { not: "CONVERTED" } }, orderBy: { createdAt: "asc" }, take: 100 });
  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/50">consented enquiries only</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Qualification queue</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/60 mb-10">Website enquiries become controlled records with an explicit contact basis and an audited qualification state.</p>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">{leads.length ? leads.map((lead) => <article key={lead.id} className="rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted"><div className="flex items-center justify-between gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo/10 text-indigo"><Inbox className="h-5 w-5" /></span><span className="rounded-full bg-saffron/15 px-3 py-1 text-[10px] uppercase font-bold">{lead.status}</span></div><p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-coral">{lead.type.replaceAll("_", " ")}</p><h2 className="mt-2 font-display text-3xl font-semibold">{lead.organisationName ?? lead.name}</h2>{lead.organisationName && <p className="mt-1 text-sm font-semibold text-ink/55">Contact: {lead.name}</p>}<p className="mt-3 flex items-center gap-2 text-sm text-ink/50"><MapPin className="h-4 w-4 text-leaf" />{[lead.locality, lead.city].filter(Boolean).join(", ")}</p><p className="mt-4 text-sm leading-6 text-ink/60">{lead.message}</p><p className="mt-3 text-xs text-ink/40">{lead.email ?? lead.phoneE164} · {lead.createdAt.toLocaleString("en-IN")}</p><LeadActions id={lead.id} status={lead.status} /></article>) : <div className="rounded-5xl border border-dashed border-indigo/15 bg-paper p-10 text-center lg:col-span-2"><Inbox className="mx-auto h-10 w-10 text-leaf" /><h2 className="mt-4 font-display text-3xl font-semibold text-ink">No enquiries need qualification.</h2></div>}</div>
      </div>
    </PortalShell>
  );
}
