import { ArrowLeft, Building2, Mail, MapPin, Phone, ShieldAlert, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { StatusPill } from "@/components/portal/dashboard-ui";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

import { PartnerStatusActions } from "./partner-status-actions";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Partner Detail | PetSaathi Admin" };

async function getPartner(id: string) {
  if (!isDatabaseConfigured() || !id) return null;
  try {
    return await prisma.partner.findUnique({
      where: { id },
      include: {
        verifications: { orderBy: { createdAt: "desc" } },
        services: true,
        locations: true,
      },
    });
  } catch {
    return null;
  }
}

function addressSummary(address: unknown): string {
  if (address && typeof address === "object" && !Array.isArray(address)) {
    const parts = Object.values(address as Record<string, unknown>)
      .filter((value): value is string => typeof value === "string" && value.length > 0)
      .slice(0, 3);
    if (parts.length) return parts.join(", ");
  }
  return "Address on file";
}

export default async function AdminPartnerDetailPage({ params }: Props) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["OPERATIONS_ADMIN", "SUPER_ADMIN"])) {
    redirect("/login?returnTo=/admin/partners");
  }

  const { id } = await params;
  const partner = await getPartner(id);
  if (!partner) notFound();

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="max-w-6xl pb-12">
        <Link href="/admin/partners" className="inline-flex items-center gap-2 text-sm font-bold text-indigo hover:underline">
          <ArrowLeft className="h-4 w-4" /> Partner Directory
        </Link>

        <div className="mt-5 flex flex-col gap-5 border-b border-ink/10 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] bg-saffron/20 text-saffron">
              <Building2 className="h-7 w-7" />
            </span>
            <div>
              <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">{partner.displayName}</h1>
              <p className="mt-1 text-sm text-ink/80">{partner.legalName}</p>
              <p className="mt-3 flex flex-wrap items-center gap-3 text-sm text-ink/80">
                <span className="rounded-full bg-indigo/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo">{partner.category.replaceAll("_", " ")}</span>
                <StatusPill status={partner.status} />
              </p>
            </div>
          </div>
          <PartnerStatusActions partnerId={partner.id} status={partner.status} />
        </div>

        <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink/80">
          {partner.contactEmail ? <span className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-coral" />{partner.contactEmail}</span> : null}
          {partner.contactPhone ? <span className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-coral" />{partner.contactPhone}</span> : null}
          {!partner.contactEmail && !partner.contactPhone ? <span>No contact details recorded.</span> : null}
        </p>

        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
            <p className="flex items-center gap-2 text-sm font-bold"><ShieldCheck className="h-5 w-5 text-leaf" />Verifications</p>
            <div className="mt-5 grid gap-2">
              {partner.verifications.length ? (
                partner.verifications.map((verification) => (
                  <div key={verification.id} className="flex items-center justify-between rounded-2xl bg-cream/55 p-4">
                    <div>
                      <p className="text-sm font-bold">{verification.type.replaceAll("_", " ")}</p>
                      <p className="mt-1 text-xs text-ink/80">{verification.verifiedAt ? `Verified ${verification.verifiedAt.toLocaleDateString("en-IN")}` : "Review pending"}{verification.expiresAt ? ` · expires ${verification.expiresAt.toLocaleDateString("en-IN")}` : ""}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[0.62rem] font-bold ${verification.status === "PASSED" ? "bg-leaf/10 text-leaf" : verification.status === "FAILED" || verification.status === "REVOKED" ? "bg-coral/10 text-coral" : "bg-saffron/20 text-ink"}`}>{verification.status}</span>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-ink/15 p-4 text-sm text-ink/80">No verifications recorded yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
            <p className="flex items-center gap-2 text-sm font-bold"><ShieldAlert className="h-5 w-5 text-saffron" />Marketplace services</p>
            <div className="mt-5 grid gap-2">
              {partner.services.length ? (
                partner.services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between rounded-2xl bg-cream/55 p-4">
                    <p className="text-sm font-bold">{service.serviceCode.replaceAll("_", " ")}</p>
                    <span className="rounded-full bg-indigo/10 px-3 py-1 text-[0.62rem] font-bold text-indigo">{service.status}</span>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-ink/15 p-4 text-sm text-ink/80">No marketplace services enabled.</p>
              )}
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
          <p className="flex items-center gap-2 text-sm font-bold"><MapPin className="h-5 w-5 text-coral" />Locations</p>
          {partner.locations.length ? (
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {partner.locations.map((location) => (
                <li key={location.id} className="rounded-2xl bg-cream/55 p-4 text-sm">
                  <p className="font-bold">{location.name}</p>
                  <p className="mt-1 text-xs text-ink/80">{addressSummary(location.address)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 rounded-2xl border border-dashed border-ink/15 p-4 text-sm text-ink/80">No service locations recorded.</p>
          )}
        </section>
      </div>
    </PortalShell>
  );
}
