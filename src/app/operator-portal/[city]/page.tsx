// src/app/operator-portal/[city]/page.tsx
// Renders the operating partner dashboard scoped to a specific city

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { PortalShell } from "@/components/portal/portal-shell";
import { MapPin, Building2, ShieldCheck } from "lucide-react";

export default async function OperatorCityPortal({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;

  // Look up city record
  const cityRecord = await prisma.city.findFirst({
    where: { slug: city.toLowerCase() },
  });

  if (!cityRecord) return notFound();

  // Fetch service areas belonging to this city
  const areas = await prisma.serviceArea.findMany({
    where: { cityId: cityRecord.id },
  });

  // Fetch territories belonging to this city
  const territories = await prisma.territory.findMany({
    where: { cityId: cityRecord.id },
  });

  // Fetch operating partner if configured
  const partner = await prisma.operatingPartner.findFirst({
    where: { status: "ACTIVE_OP" },
  });

  return (
    <PortalShell mode="operator" displayName={`${cityRecord.name} Operations`}>
      <div className="mx-auto max-w-6xl pb-16">
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-coral">
            <MapPin className="h-4 w-4" /> Local Franchise Operations
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">
            {cityRecord.name} Operations Hub
          </h1>
          <p className="text-sm leading-6 text-ink/80">
            Dedicated territory portal for {cityRecord.name}, {cityRecord.state}. Real-time local demand, caregiver pools, and safety metrics.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-3xl border border-ink/10 bg-paper p-6 shadow-lifted">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Service Areas</span>
              <Building2 className="h-5 w-5 text-indigo" />
            </div>
            <p className="mt-3 font-display text-3xl font-semibold">{areas.length}</p>
            <p className="mt-1 text-xs text-ink/70">Configured urban service areas</p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-paper p-6 shadow-lifted">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Territories</span>
              <MapPin className="h-5 w-5 text-coral" />
            </div>
            <p className="mt-3 font-display text-3xl font-semibold">{territories.length}</p>
            <p className="mt-1 text-xs text-ink/70">Active franchise territories</p>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-paper p-6 shadow-lifted">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Partner Status</span>
              <ShieldCheck className="h-5 w-5 text-leaf" />
            </div>
            <p className="mt-3 font-display text-2xl font-semibold text-leaf">
              {partner ? partner.displayName : "Direct Platform"}
            </p>
            <p className="mt-1 text-xs text-ink/70">Territory operating license</p>
          </div>
        </div>

        <div className="mt-10 rounded-4xl border border-ink/10 bg-paper p-8 shadow-soft">
          <h2 className="font-display text-2xl font-semibold">Active Local Areas</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {areas.map((area) => (
              <span
                key={area.id}
                className="rounded-full bg-cream/70 px-4 py-2 text-sm font-semibold text-ink shadow-xs"
              >
                {area.name} ({area.postalCodes.join(", ")})
              </span>
            ))}
            {areas.length === 0 && (
              <p className="text-sm text-ink/60">No service areas registered yet.</p>
            )}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
