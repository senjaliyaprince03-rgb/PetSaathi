import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { createServiceAreaSchema } from "@/modules/pricing/input";
import { toSlug } from "@/modules/pricing/economics";
import { consumeRateLimit } from "@/modules/security/rate-limit";

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SUPER_ADMIN"])) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const rate = await consumeRateLimit("admin-service-area-write", identity.id, 30, 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const parsed = createServiceAreaSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const citySlug = toSlug(`${parsed.data.cityName}-${parsed.data.state}`);
  const localitySlug = toSlug(parsed.data.localityName);
  if (!citySlug || !localitySlug) return NextResponse.json({ error: "invalid_slug", message: "City and locality must contain letters or numbers." }, { status: 422 });

  try {
    const serviceArea = await prisma.$transaction(async (tx) => {
      const existingCity = await tx.city.findUnique({ where: { slug: citySlug } });
      if (existingCity && existingCity.state.toLocaleLowerCase("en-IN") !== parsed.data.state.toLocaleLowerCase("en-IN")) throw new CatalogError(409, "city_conflict", "The city slug already belongs to a different state.");
      const city = existingCity ? await tx.city.update({ where: { id: existingCity.id }, data: { name: parsed.data.cityName, status: parsed.data.cityStatus, launchedAt: parsed.data.cityStatus === "PUBLIC_LIMITED" ? existingCity.launchedAt ?? new Date() : existingCity.launchedAt } }) : await tx.city.create({ data: { slug: citySlug, name: parsed.data.cityName, state: parsed.data.state, status: parsed.data.cityStatus, launchedAt: parsed.data.cityStatus === "PUBLIC_LIMITED" ? new Date() : null } });
      const current = await tx.serviceArea.findUnique({ where: { cityId_slug: { cityId: city.id, slug: localitySlug } } });
      const overlap = await tx.serviceArea.findFirst({ where: { cityId: city.id, id: current ? { not: current.id } : undefined, status: { notIn: ["CLOSED", "ARCHIVED"] }, postalCodes: { hasSome: parsed.data.postalCodes } }, select: { name: true, postalCodes: true } });
      if (overlap) throw new CatalogError(409, "postal_code_overlap", `Postal codes overlap with ${overlap.name}. Active service areas must be unambiguous.`);
      const area = current ? await tx.serviceArea.update({ where: { id: current.id }, data: { name: parsed.data.localityName, postalCodes: parsed.data.postalCodes, status: parsed.data.status } }) : await tx.serviceArea.create({ data: { cityId: city.id, slug: localitySlug, name: parsed.data.localityName, postalCodes: parsed.data.postalCodes, status: parsed.data.status } });
      await tx.auditLog.create({ data: { actorId: identity.id, actorRole: "SUPER_ADMIN", action: current ? "service_area.updated" : "service_area.created", resourceType: "service_area", resourceId: area.id, before: current ? { name: current.name, postalCodes: current.postalCodes, status: current.status } : Prisma.JsonNull, after: { cityId: city.id, city: city.name, state: city.state, name: area.name, postalCodes: area.postalCodes, status: area.status }, reason: parsed.data.reason } });
      return area;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    return NextResponse.json({ serviceArea }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof CatalogError) return NextResponse.json({ error: error.code, message: error.message }, { status: error.status });
    console.error("service_area.write_failed", { actorId: identity.id, error });
    return NextResponse.json({ error: "service_area_failed", message: "The service area could not be saved safely." }, { status: 500 });
  }
}

class CatalogError extends Error { constructor(public readonly status: number, public readonly code: string, message: string) { super(message); } }
