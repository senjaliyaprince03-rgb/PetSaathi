import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { createServicePriceSchema } from "@/modules/pricing/input";
import { consumeRateLimit } from "@/modules/security/rate-limit";

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["FINANCE_ADMIN", "SUPER_ADMIN"])) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const rate = await consumeRateLimit("admin-service-price-write", identity.id, 50, 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const parsed = createServicePriceSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const servicePrice = await prisma.$transaction(async (tx) => {
        const service = await tx.serviceType.findUnique({ where: { code: parsed.data.serviceCode }, select: { id: true, code: true, name: true } });
        if (!service) throw new PriceError(404, "service_not_found", "The service does not exist.");
        const serviceAreaId = parsed.data.serviceAreaId ?? null;
        if (serviceAreaId) {
          const area = await tx.serviceArea.findFirst({ where: { id: serviceAreaId, status: "ACTIVE", city: { status: "PUBLIC_LIMITED" } }, select: { id: true } });
          if (!area) throw new PriceError(409, "service_area_inactive", "Area-specific prices require an active city and service area.");
        }
        const latest = await tx.servicePrice.findFirst({ where: { serviceTypeId: service.id, variantId: null, serviceAreaId }, orderBy: { version: "desc" }, select: { version: true } });
        const created = await tx.servicePrice.create({ data: { serviceTypeId: service.id, variantId: null, serviceAreaId, version: (latest?.version ?? 0) + 1, amountPaise: parsed.data.amountPaise, sitterPaise: parsed.data.sitterPaise, taxBasisPoints: parsed.data.taxBasisPoints, currency: "INR", effectiveAt: new Date(parsed.data.effectiveAt), expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null, approvedBy: identity.id } });
        await tx.auditLog.create({ data: { actorId: identity.id, actorRole: identity.roles.includes("SUPER_ADMIN") ? "SUPER_ADMIN" : "FINANCE_ADMIN", action: "service_price.approved", resourceType: "service_price", resourceId: created.id, after: { serviceCode: service.code, serviceAreaId, version: created.version, amountPaise: created.amountPaise, sitterPaise: created.sitterPaise, taxBasisPoints: created.taxBasisPoints, effectiveAt: created.effectiveAt.toISOString(), expiresAt: created.expiresAt?.toISOString() }, reason: parsed.data.reason } });
        return created;
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return NextResponse.json({ servicePrice }, { status: 201, headers: { "Cache-Control": "no-store" } });
    } catch (error) {
      if (error instanceof PriceError) return NextResponse.json({ error: error.code, message: error.message }, { status: error.status });
      if (error instanceof Prisma.PrismaClientKnownRequestError && ["P2002", "P2034"].includes(error.code) && attempt < 2) continue;
      logger.exception("service_price.create_failed", error, {
        actorId: identity.id,
      });
      return NextResponse.json({ error: "service_price_failed", message: "The immutable price version could not be approved safely." }, { status: 500 });
    }
  }
  return NextResponse.json({ error: "service_price_conflict", message: "Another price version was approved concurrently. Try again." }, { status: 409 });
}

class PriceError extends Error { constructor(public readonly status: number, public readonly code: string, message: string) { super(message); } }
