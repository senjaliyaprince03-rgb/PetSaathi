import type { Metadata } from "next";

import { BookingWizard } from "@/components/forms/booking-wizard";
import { AuthenticatedBookingForm } from "@/components/forms/authenticated-booking-form";
import { PageIntro, PublicShell } from "@/components/marketing/public-shell";
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
  return <PublicShell><PageIntro eyebrow="private care protocol" title="Let’s plan their care." description="Only approved prices and open service-area capacity can become a confirmed request." /><div className="container-shell"><CareProtocolGuide /><AuthenticatedBookingForm pets={pets} addresses={addressOptions} services={activeServices} prices={priceOptions} initialService={initialService} /></div></PublicShell>;
}

function CareProtocolGuide() {
  const steps = [["01", "Care type", "Choose the service that fits the day."], ["02", "Pet & place", "Share only the context needed for care."], ["03", "Time & quote", "Review availability and the server-approved price."], ["04", "Human match", "Approve the proposed verified Saathi."]];
  return <section className="mb-6 grid gap-3 rounded-4xl border border-indigo/10 bg-paper/75 p-4 shadow-lifted backdrop-blur sm:grid-cols-2 sm:p-5 lg:grid-cols-4">{steps.map(([number, title, copy]) => <article key={number} className="rounded-3xl bg-gradient-to-br from-cream to-paper p-4"><p className="font-display text-2xl font-semibold text-coral">{number}</p><h2 className="mt-3 text-sm font-bold">{title}</h2><p className="mt-1 text-xs leading-5 text-ink/48">{copy}</p></article>)}</section>;
}
