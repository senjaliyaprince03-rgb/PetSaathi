import { redirect } from "next/navigation";

import { PartnerMarketplaceUnavailable, PartnerOrderForm } from "@/components/portal/partner-order-form";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { isFeatureEnabled } from "@/modules/features/server";

export const dynamic = "force-dynamic";

export default async function PartnerServicesPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/partners");
  const enabled = await isFeatureEnabled("partner_marketplace");
  const [pets, services, orders] = await Promise.all([
    prisma.pet.findMany({ where: { ownerId: identity.id, active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    enabled ? prisma.partnerService.findMany({ where: { status: "ACTIVE", partner: { status: "ACTIVE", verifications: { some: { status: "PASSED", OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] } } } }, orderBy: { partner: { displayName: "asc" } }, select: { id: true, serviceCode: true, partner: { select: { displayName: true } } } }) : Promise.resolve([]),
    prisma.partnerOrder.findMany({ where: { customerId: identity.id }, orderBy: { updatedAt: "desc" }, take: 25, select: { id: true, reference: true, status: true, scheduledAt: true, updatedAt: true, partnerService: { select: { serviceCode: true, partner: { select: { displayName: true } } } }, pet: { select: { name: true } } } })
  ]);
  const requestServices = services.map((service) => ({ id: service.id, serviceCode: service.serviceCode, partnerName: service.partner.displayName }));
  return <PortalShell mode="customer" displayName={identity.displayName}><section className="mt-5"><p className="eyebrow">verified local partners</p><h2 className="section-title mt-3">Requests that stay under review.</h2><p className="mt-4 max-w-2xl text-lg leading-8 text-ink/60">Partner services are separate from PetSaathi care bookings. They are available only after verification and operational approval.</p>{enabled && requestServices.length ? <PartnerOrderForm services={requestServices} pets={pets} /> : <PartnerMarketplaceUnavailable />}<section className="mt-6 rounded-4xl border border-ink/10 bg-paper p-6"><h2 className="font-display text-3xl font-semibold">Your partner requests</h2><div className="mt-5 grid gap-3">{orders.length ? orders.map((order) => <article key={order.id} className="rounded-3xl bg-cream/50 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/45">{order.reference}</p><p className="mt-2 font-semibold">{order.partnerService.partner.displayName} · {order.partnerService.serviceCode.replaceAll("_", " ")}</p><p className="mt-1 text-sm text-ink/55">{order.pet ? `For ${order.pet.name}` : "No pet selected"}{order.scheduledAt ? ` · ${order.scheduledAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}` : " · Timing under review"}</p></div><span className="rounded-full bg-indigo/10 px-3 py-1 text-xs font-bold text-indigo">{order.status.replaceAll("_", " ")}</span></div></article>) : <p className="text-sm text-ink/50">No partner-service requests yet.</p>}</div></section></section></PortalShell>;
}
