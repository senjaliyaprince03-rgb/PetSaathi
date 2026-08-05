import { BadgeCheck, Building2, CalendarClock, Handshake, History, PawPrint } from "lucide-react";
import { redirect } from "next/navigation";

import { DashboardEmptyState, DashboardHeading, DashboardPanel, MetricCard, StatusPill } from "@/components/portal/dashboard-ui";
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
    prisma.partnerOrder.findMany({ where: { customerId: identity.id }, orderBy: { updatedAt: "desc" }, take: 25, select: { id: true, reference: true, status: true, scheduledAt: true, updatedAt: true, partnerService: { select: { serviceCode: true, partner: { select: { displayName: true } } } }, pet: { select: { name: true } } } }),
  ]);
  const requestServices = services.map((service) => ({ id: service.id, serviceCode: service.serviceCode, partnerName: service.partner.displayName }));
  const providerCount = new Set(services.map((service) => service.partner.displayName)).size;
  const openOrders = orders.filter((order) => !["COMPLETED", "CANCELLED", "REJECTED"].includes(order.status)).length;

  return (
    <PortalShell mode="customer" displayName={identity.displayName} showSummaryCards={false}>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <MetricCard icon={BadgeCheck} label="Verified providers" value={`${providerCount} available`} hint="Operationally approved partners" tone="leaf" />
        <MetricCard icon={Handshake} label="Service options" value={`${services.length} approved`} hint="Marketplace requests currently open" />
        <MetricCard icon={History} label="Requests" value={`${openOrders} active`} hint="Partner review in progress" tone="coral" />
      </div>

      <DashboardPanel className="mt-5">
        <DashboardHeading eyebrow="Curated local marketplace" title="Specialist help, without losing oversight." description="Partner services remain separate from PetSaathi care bookings and open only after provider verification and operational approval." />
        {services.length ? <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{services.slice(0, 6).map((service) => <article key={service.id} className="rounded-[1.5rem] border border-ink/[0.07] bg-cream/40 p-5 transition hover:-translate-y-1 hover:border-indigo/20 hover:bg-paper hover:shadow-lifted"><div className="flex items-start justify-between gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo/10 text-indigo"><Building2 className="h-5 w-5" /></span><BadgeCheck className="h-5 w-5 text-leaf" /></div><h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.035em] capitalize">{service.serviceCode.replaceAll("_", " ").toLowerCase()}</h3><p className="mt-1 text-xs text-ink/42">Provided by {service.partner.displayName}</p><p className="mt-4 flex items-center gap-2 text-[0.68rem] font-bold text-leaf"><BadgeCheck className="h-3.5 w-3.5" />Verification passed</p></article>)}</div> : null}
        {enabled && requestServices.length ? <PartnerOrderForm services={requestServices} pets={pets} /> : <PartnerMarketplaceUnavailable />}
      </DashboardPanel>

      <DashboardPanel className="mt-5" tone="lavender">
        <DashboardHeading eyebrow="Request history" title="Every partner request stays reviewable." description="Availability, timing and status remain visible without presenting an unconfirmed request as a booking." />
        {orders.length ? <div className="mt-7 grid gap-3">{orders.map((order) => <article key={order.id} className="rounded-[1.5rem] border border-ink/[0.06] bg-paper/90 p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-coral">{order.reference}</p><h3 className="mt-2 font-display text-2xl font-semibold">{order.partnerService.partner.displayName}</h3><p className="mt-1 text-sm capitalize text-ink/48">{order.partnerService.serviceCode.replaceAll("_", " ").toLowerCase()}</p><div className="mt-3 flex flex-wrap gap-4 text-xs text-ink/42"><span className="flex items-center gap-1.5"><PawPrint className="h-3.5 w-3.5 text-indigo" />{order.pet?.name ?? "No pet selected"}</span><span className="flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5 text-indigo" />{order.scheduledAt ? order.scheduledAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Timing under review"}</span></div></div><StatusPill status={order.status} /></div></article>)}</div> : <div className="mt-7"><DashboardEmptyState icon={Handshake} title="No partner requests yet." description="When the marketplace is open, select a verified service and submit a controlled request for review." /></div>}
      </DashboardPanel>
    </PortalShell>
  );
}
