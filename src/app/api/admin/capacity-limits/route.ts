import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { indiaServiceDate, serviceDateFromInput } from "@/modules/pricing/economics";
import { upsertCapacityLimitSchema } from "@/modules/pricing/input";
import { consumeRateLimit } from "@/modules/security/rate-limit";

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["OPERATIONS_ADMIN", "SUPER_ADMIN"])) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const rate = await consumeRateLimit("admin-capacity-write", identity.id, 100, 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const parsed = upsertCapacityLimitSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const serviceDate = serviceDateFromInput(parsed.data.serviceDate);
  if (serviceDate < indiaServiceDate(new Date())) return NextResponse.json({ error: "past_service_date", message: "Capacity cannot be opened for a past India service date." }, { status: 422 });

  try {
    const capacityLimit = await prisma.$transaction(async (tx) => {
      const [area, service, current] = await Promise.all([
        tx.serviceArea.findFirst({ where: { id: parsed.data.serviceAreaId, status: "ACTIVE", city: { status: "PUBLIC_LIMITED" } }, select: { id: true } }),
        tx.serviceType.findFirst({ where: { code: parsed.data.serviceCode, active: true }, select: { code: true } }),
        tx.capacityLimit.findUnique({ where: { serviceAreaId_serviceCode_serviceDate: { serviceAreaId: parsed.data.serviceAreaId, serviceCode: parsed.data.serviceCode, serviceDate } } })
      ]);
      if (!area) throw new CapacityError(409, "service_area_inactive", "Capacity requires an active city and service area.");
      if (!service) throw new CapacityError(409, "service_inactive", "Capacity can only open for an active service.");
      if (current && parsed.data.maximum < current.reserved) throw new CapacityError(409, "below_reserved_capacity", `Maximum cannot be below ${current.reserved} existing reservation${current.reserved === 1 ? "" : "s"}.`);
      const saved = current ? await tx.capacityLimit.update({ where: { id: current.id }, data: { maximum: parsed.data.maximum, reason: parsed.data.reason } }) : await tx.capacityLimit.create({ data: { serviceAreaId: area.id, serviceCode: service.code, serviceDate, maximum: parsed.data.maximum, reason: parsed.data.reason } });
      await tx.auditLog.create({ data: { actorId: identity.id, actorRole: identity.roles.includes("SUPER_ADMIN") ? "SUPER_ADMIN" : "OPERATIONS_ADMIN", action: current ? "capacity_limit.updated" : "capacity_limit.created", resourceType: "capacity_limit", resourceId: saved.id, before: current ? { maximum: current.maximum, reserved: current.reserved, reason: current.reason } : Prisma.JsonNull, after: { serviceAreaId: saved.serviceAreaId, serviceCode: saved.serviceCode, serviceDate: parsed.data.serviceDate, maximum: saved.maximum, reserved: saved.reserved }, reason: parsed.data.reason } });
      return saved;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    return NextResponse.json({ capacityLimit }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof CapacityError) return NextResponse.json({ error: error.code, message: error.message }, { status: error.status });
    console.error("capacity_limit.write_failed", { actorId: identity.id, error });
    return NextResponse.json({ error: "capacity_limit_failed", message: "The capacity limit could not be saved safely." }, { status: 500 });
  }
}

class CapacityError extends Error { constructor(public readonly status: number, public readonly code: string, message: string) { super(message); } }
