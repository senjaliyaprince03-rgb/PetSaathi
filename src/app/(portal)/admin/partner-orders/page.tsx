import { Handshake } from "lucide-react";
import { redirect } from "next/navigation";

import { PartnerOrderWorkflowActions } from "@/components/portal/partner-order-workflow-actions";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function PartnerOrdersPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["PARTNER_MANAGER", "SUPER_ADMIN"])) redirect("/login?returnTo=/admin/partner-orders");
  const orders = await prisma.partnerOrder.findMany({ where: { status: { notIn: ["CANCELLED", "COMPLETED"] } }, orderBy: { updatedAt: "asc" }, take: 100, select: { id: true, reference: true, status: true, scheduledAt: true, instructions: true, customer: { select: { displayName: true } }, pet: { select: { name: true } }, partnerService: { select: { serviceCode: true, partner: { select: { displayName: true } } } } } });
  return <main className="min-h-screen bg-cream/50 py-10"><div className="container-shell"><p className="eyebrow">request-only fulfilment</p><h1 className="section-title mt-4">Partner service queue</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-ink/60">No prices or payment actions are available here. Managers coordinate only verified, feature-gated service requests until the final commercial policy is approved.</p><div className="mt-8 grid gap-4">{orders.length ? orders.map((order) => <article key={order.id} className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/45">{order.reference}</p><h2 className="mt-2 font-display text-2xl font-semibold">{order.partnerService.partner.displayName} · {order.partnerService.serviceCode.replaceAll("_", " ")}</h2><p className="mt-2 text-sm text-ink/60">{order.customer.displayName}{order.pet ? ` · ${order.pet.name}` : ""}{order.scheduledAt ? ` · ${order.scheduledAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}` : ""}</p></div><span className="rounded-full bg-saffron/15 px-3 py-1 text-xs font-bold">{order.status.replaceAll("_", " ")}</span></div>{order.instructions && <p className="mt-4 rounded-2xl bg-cream/50 p-3 text-sm leading-6 text-ink/65">{order.instructions}</p>}<PartnerOrderWorkflowActions id={order.id} status={order.status} /></article>) : <div className="rounded-4xl border border-dashed border-ink/15 bg-paper p-10 text-center"><Handshake className="mx-auto h-8 w-8 text-leaf" /><p className="mt-4 text-sm text-ink/55">No partner requests require action.</p></div>}</div></div></main>;
}
