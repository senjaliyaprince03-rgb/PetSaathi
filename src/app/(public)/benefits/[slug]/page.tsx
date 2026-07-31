import {
  BadgeCheck,
  Building2,
  CalendarRange,
  MapPinned,
  ShieldCheck,
} from "lucide-react";
import { notFound } from "next/navigation";

import { ProgrammeEnrollment } from "@/components/b2b/programme-enrollment";
import { PublicShell } from "@/components/marketing/public-shell";
import { logger } from "@/lib/logger";
import { getAvailableProgrammeBySlug } from "@/modules/b2b/programmes";
import { recordProgrammePageView } from "@/modules/b2b/reporting";

export const dynamic = "force-dynamic";

export default async function CompanyBenefitProgrammePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const programme = await getAvailableProgrammeBySlug(slug).catch(() => null);
  if (!programme) notFound();

  await recordProgrammePageView(programme.id).catch((error: unknown) => {
    logger.warn("partner_programme.page_view_failed", {
      programmeId: programme.id,
      error,
    });
  });

  const eligibilityLabel = programme.eligibilityMethod
    .replaceAll("_", " ")
    .toLowerCase();

  return (
    <PublicShell>
      <section className="relative overflow-hidden border-b border-indigo/10 bg-cream pb-20 pt-32 sm:pt-40">
        <div className="pointer-events-none absolute -right-24 top-12 h-80 w-80 rounded-full bg-saffron/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-indigo/10 blur-3xl" />
        <div className="container-shell relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-leaf/20 bg-leaf/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-leaf">
              <ShieldCheck className="h-4 w-4" /> Active partner programme
            </span>
            <p className="mt-7 flex items-center gap-2 text-sm font-bold text-coral">
              <Building2 className="h-4 w-4" />
              {programme.organization.displayName}
            </p>
            <h1 className="mt-3 max-w-[12ch] font-display text-5xl font-semibold tracking-[-0.055em] sm:text-7xl">
              {programme.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-ink/62">
              Controlled access to PetSaathi services through an authenticated,
              auditable eligibility workflow. Enrollment never bypasses service
              permissions, capacity, safety review, or verified pricing.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <ProgrammeFact
                icon={BadgeCheck}
                label="Programme type"
                value={programme.programmeType.replaceAll("_", " ")}
              />
              <ProgrammeFact
                icon={MapPinned}
                label="City scope"
                value={
                  programme.cityScope.length
                    ? programme.cityScope.join(", ")
                    : "Configured by programme"
                }
              />
              <ProgrammeFact
                icon={CalendarRange}
                label="Access window"
                value={
                  programme.endDate
                    ? `Until ${programme.endDate.toLocaleDateString("en-IN", { dateStyle: "medium" })}`
                    : "While programme is active"
                }
              />
            </div>
          </div>

          <ProgrammeEnrollment
            slug={slug}
            eligibilityLabel={eligibilityLabel}
            openAccess={programme.eligibilityMethod === "OPEN_ACCESS"}
          />
        </div>
      </section>
    </PublicShell>
  );
}

function ProgrammeFact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BadgeCheck;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-paper/80 bg-paper/85 p-4 shadow-sm backdrop-blur">
      <Icon className="h-5 w-5 text-indigo" />
      <p className="mt-3 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-ink/40">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold capitalize text-ink">{value}</p>
    </div>
  );
}
