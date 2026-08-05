import type { Metadata } from "next";
import { BadgeCheck, CalendarDays, MapPin, PawPrint } from "lucide-react";

import { BookingWizard } from "@/components/forms/booking-wizard";
import { AuthenticatedBookingForm } from "@/components/forms/authenticated-booking-form";
import { PageIntro, PublicShell } from "@/components/marketing/public-shell";
import { DashboardHeading, DashboardPanel, MetricCard } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { coreServiceCodes, type CoreServiceCode } from "@/modules/catalog/services";
import { calculateQuote } from "@/modules/pricing/economics";

export const metadata: Metadata = { title: "Find pet care" };

type BookSearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BookPage({ searchParams }: { searchParams: BookSearchParams }) {
  const query = await searchParams;
  const requestedService = firstParam(query.service);
  const requestedPetType = firstParam(query.petType);
  const requestedLocality = firstParam(query.locality)?.trim().slice(0, 120);
  const initialService = coreServiceCodes.includes(requestedService as CoreServiceCode) ? requestedService as CoreServiceCode : undefined;
  const initialPetType = ["DOG", "CAT", "OTHER"].includes(requestedPetType as string) ? requestedPetType as "DOG" | "CAT" | "OTHER" : undefined;
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return <PublicShell><PageIntro eyebrow="care protocol request" title="Let’s plan the right kind of care." description="Start with the service, your pet and the time. A suitable Saathi is proposed only after eligibility and local availability are checked." /><div className="container-shell"><CareProtocolGuide /><BookingWizard initialValues={{ service: initialService, petType: initialPetType, locality: requestedLocality }} /></div></PublicShell>;

  const now = new Date();
  const [pets, addresses, serviceRows, serviceAreas, priceRows] = await Promise.all([
    prisma.pet.findMany({ where: { ownerId: identity.id, active: true }, orderBy: { createdAt: "asc" }, select: { id: true, name: true, species: true } }),
    prisma.address.findMany({ where: { userId: identity.id }, orderBy: { createdAt: "asc" }, select: { id: true, label: true, locality: true, city: true, state: true, postalCode: true } }),
    prisma.serviceType.findMany({ where: { active: true, code: { in: [...coreServiceCodes] } }, orderBy: { name: "asc" }, select: { id: true, code: true, name: true, durationMinutes: true } }),
    prisma.serviceArea.findMany({ where: { status: "ACTIVE", city: { status: "PUBLIC_LIMITED" } }, select: { id: true, postalCodes: true, city: { select: { name: true, state: true } } } }),
    prisma.servicePrice.findMany({ where: { variantId: null, effectiveAt: { lte: now }, OR: [{ expiresAt: null }, { expiresAt: { gt: now } }], serviceType: { active: true, code: { in: [...coreServiceCodes] } } }, orderBy: [{ version: "desc" }, { effectiveAt: "desc" }], select: { id: true, serviceTypeId: true, serviceAreaId: true, version: true, amountPaise: true, taxBasisPoints: true, currency: true } })
  ]);
  const normalize = (value: string) => value.trim().toLocaleLowerCase("en-IN");
  const priceOptions = addresses.flatMap((address) => {
    const area = serviceAreas.find((candidate) => normalize(candidate.city.name) === normalize(address.city) && normalize(candidate.city.state) === normalize(address.state) && candidate.postalCodes.includes(address.postalCode));
    if (!area) return [];
    return serviceRows.flatMap((service) => {
      const candidates = priceRows.filter((price) => price.serviceTypeId === service.id);
      const selected = candidates.find((price) => price.serviceAreaId === area.id) ?? candidates.find((price) => price.serviceAreaId === null);
      if (!selected) return [];
      return [{ addressId: address.id, serviceCode: service.code as CoreServiceCode, servicePriceId: selected.id, ...calculateQuote(selected.amountPaise, selected.taxBasisPoints), currency: selected.currency }];
    });
  });
  const activeServices = serviceRows.map(({ id: _id, ...service }) => ({ ...service, code: service.code as CoreServiceCode }));
  const addressOptions = addresses.map(({ state: _state, postalCode: _postalCode, ...address }) => address);
  return <PortalShell mode="customer" displayName={identity.displayName} showSummaryCards={false}>
    <div className="mt-5 grid gap-4 sm:grid-cols-3">
      <MetricCard icon={PawPrint} label="Pet profiles" value={`${pets.length} ready`} hint="Available for this request" />
      <MetricCard icon={MapPin} label="Care addresses" value={`${addresses.length} saved`} hint="Checked against service areas" tone="leaf" />
      <MetricCard icon={BadgeCheck} label="Approved services" value={`${activeServices.length} open`} hint="Server-priced care options" tone="coral" />
    </div>
    <DashboardPanel className="mt-5">
      <DashboardHeading eyebrow="Private care request" title="Plan care with every safeguard in view." description="A guided workflow reveals only the decisions needed now, while pricing and eligibility remain server controlled." />
      <div className="mt-7 grid gap-5 xl:grid-cols-[0.7fr_1.3fr]">
        <CareProtocolGuide />
        <AuthenticatedBookingForm pets={pets} addresses={addressOptions} services={activeServices} prices={priceOptions} initialService={initialService} />
      </div>
    </DashboardPanel>
  </PortalShell>;
}

function CareProtocolGuide() {
  const steps = [["01", "Care type", "Choose the service that fits the day."], ["02", "Pet & place", "Share only the context needed for care."], ["03", "Time & quote", "Review availability and the server-approved price."], ["04", "Human match", "Approve the proposed verified Saathi."]];
  return <aside className="relative overflow-hidden rounded-[1.75rem] bg-[#281d2b] p-6 text-paper"><div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-coral/20 blur-3xl" /><div className="relative"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-saffron text-ink"><CalendarDays className="h-5 w-5" /></span><p className="mt-7 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-saffron">Four protected gates</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">A request, not a guessing game.</h2><div className="relative mt-7 grid gap-5 before:absolute before:bottom-4 before:left-4 before:top-4 before:w-px before:bg-paper/10">{steps.map(([number, title, copy]) => <article key={number} className="relative flex gap-4"><span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper text-[0.62rem] font-bold text-ink">{number}</span><div><h3 className="text-sm font-bold">{title}</h3><p className="mt-1 text-xs leading-5 text-paper/45">{copy}</p></div></article>)}</div><p className="mt-7 rounded-2xl border border-paper/10 bg-paper/[0.06] p-4 text-xs leading-5 text-paper/50"><BadgeCheck className="mb-2 h-4 w-4 text-saffron" />Payment begins only after you approve a verified Saathi proposal.</p></div></aside>;
}
