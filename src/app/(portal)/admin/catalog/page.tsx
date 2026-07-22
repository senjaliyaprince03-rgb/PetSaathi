import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { CatalogAdmin } from "@/components/portal/catalog-admin";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminCatalogPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["OPERATIONS_ADMIN", "FINANCE_ADMIN", "SUPER_ADMIN"])) redirect("/login?returnTo=/admin/catalog");
  const today = new Date(); today.setUTCHours(0, 0, 0, 0);
  const [serviceRows, areaRows, priceRows, capacityRows] = await Promise.all([
    prisma.serviceType.findMany({ orderBy: { name: "asc" }, select: { code: true, name: true, active: true } }),
    prisma.serviceArea.findMany({ where: { status: { not: "ARCHIVED" } }, orderBy: [{ city: { name: "asc" } }, { name: "asc" }], select: { id: true, name: true, status: true, postalCodes: true, city: { select: { name: true, state: true } } } }),
    prisma.servicePrice.findMany({ orderBy: [{ createdAt: "desc" }], take: 100, select: { id: true, version: true, amountPaise: true, sitterPaise: true, taxBasisPoints: true, effectiveAt: true, expiresAt: true, serviceType: { select: { name: true } }, serviceArea: { select: { name: true, city: { select: { name: true } } } } } }),
    prisma.capacityLimit.findMany({ where: { serviceDate: { gte: today } }, orderBy: [{ serviceDate: "asc" }, { serviceCode: "asc" }], take: 100, select: { id: true, serviceCode: true, serviceDate: true, maximum: true, reserved: true, reason: true, serviceArea: { select: { name: true, city: { select: { name: true } } } } } })
  ]);
  const services = serviceRows.map(({ code, ...service }) => ({ ...service, code: String(code) }));
  const areas = areaRows.map(({ city, ...area }) => ({ ...area, status: String(area.status), city: city.name, state: city.state }));
  const prices = priceRows.map(({ serviceType, serviceArea, effectiveAt, expiresAt, ...price }) => ({ ...price, serviceName: serviceType.name, areaName: serviceArea ? `${serviceArea.name}, ${serviceArea.city.name}` : "Global fallback", effectiveAt: effectiveAt.toISOString(), expiresAt: expiresAt?.toISOString() ?? null }));
  const capacities = capacityRows.map(({ serviceArea, serviceDate, serviceCode, ...capacity }) => ({ ...capacity, areaName: `${serviceArea.name}, ${serviceArea.city.name}`, serviceCode: String(serviceCode), serviceDate: serviceDate.toISOString().slice(0, 10) }));
  return <main className="min-h-screen bg-cream/50 py-10"><div className="container-shell"><Link href="/admin" className={buttonVariants({ variant: "ghost", size: "sm" })}><ArrowLeft className="h-4 w-4" />Admin overview</Link><p className="eyebrow mt-6">controlled commerce catalog</p><h1 className="section-title mt-5">Areas, immutable prices and capacity</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-ink/60">Customer booking fails closed until each required business record is explicitly approved. Role separation keeps market activation, money and daily operations independently accountable.</p><CatalogAdmin services={services} areas={areas} prices={prices} capacities={capacities} canManageAreas={identity.roles.includes("SUPER_ADMIN")} canManagePrices={hasAnyRole(identity, ["FINANCE_ADMIN", "SUPER_ADMIN"])} canManageCapacity={hasAnyRole(identity, ["OPERATIONS_ADMIN", "SUPER_ADMIN"])} /></div></main>;
}
