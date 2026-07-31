import { Headphones, MessageSquareWarning } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { SupportWorkflowActions } from "@/components/portal/support-workflow-actions";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminSupportPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["OPERATIONS_ADMIN", "SAFETY_ADMIN", "SUPER_ADMIN"])) redirect("/login?returnTo=/admin/support");
  const [cases, complaints] = await Promise.all([
    prisma.supportCase.findMany({ where: { status: { not: "CLOSED" } }, orderBy: [{ priority: "desc" }, { createdAt: "asc" }], take: 100, include: { user: { select: { displayName: true } }, booking: { select: { reference: true } } } }),
    prisma.complaint.findMany({ where: { status: { not: "CLOSED" } }, orderBy: [{ severity: "desc" }, { createdAt: "asc" }], take: 100, include: { customer: { select: { displayName: true } }, booking: { select: { reference: true } } } })
  ]);

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/50">audited customer resolution</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Support and complaints</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/70 mb-10">General support and booking complaints follow separate state machines. Safety concerns remain visible to the safety role and every decision records its reason.</p>
        <div className="mt-10 grid gap-8 xl:grid-cols-2">
          <section><div className="flex items-center gap-3"><Headphones className="h-7 w-7 text-indigo" /><h2 className="font-display text-3xl font-semibold">Support cases</h2></div><div className="mt-5 grid gap-4">{cases.length ? cases.map((item) => <article key={item.id} className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted"><div className="flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/60">{item.reference}</p><span className="rounded-full bg-indigo/10 px-3 py-1 text-xs font-bold text-indigo">{item.status.replaceAll("_", " ")}</span></div><p className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-coral">{item.priority} · {item.category}</p><h3 className="mt-2 font-display text-2xl font-semibold">{item.subject}</h3><p className="mt-3 text-sm leading-6 text-ink/70">{item.description}</p><p className="mt-3 text-xs text-ink/55">{item.user?.displayName ?? "Unlinked user"}{item.booking ? ` · ${item.booking.reference}` : ""}</p><SupportWorkflowActions id={item.id} status={item.status} kind="support" /></article>) : <Empty label="No open support cases." />}</div></section>
          <section><div className="flex items-center gap-3"><MessageSquareWarning className="h-7 w-7 text-coral" /><h2 className="font-display text-3xl font-semibold">Booking complaints</h2></div><div className="mt-5 grid gap-4">{complaints.length ? complaints.map((item) => <article key={item.id} className="rounded-4xl border border-coral/15 bg-paper p-6 shadow-lifted"><div className="flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/60">{item.reference}</p><span className="rounded-full bg-coral/10 px-3 py-1 text-xs font-bold text-coral">{item.status.replaceAll("_", " ")}</span></div><p className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-coral">{item.severity} · {item.category.replaceAll("_", " ")}</p><p className="mt-3 text-sm leading-6 text-ink/70">{item.description}</p><p className="mt-3 text-xs text-ink/55">{item.customer.displayName}{item.booking ? ` · ${item.booking.reference}` : ""}</p><SupportWorkflowActions id={item.id} status={item.status} kind="complaint" /></article>) : <Empty label="No open booking complaints." />}</div></section>
        </div>
      </div>
    </PortalShell>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="rounded-4xl border border-dashed border-ink/15 bg-paper p-8 text-center text-sm text-ink/65">{label}</div>;
}
