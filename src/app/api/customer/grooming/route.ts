import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { consumeRateLimit } from "@/modules/security/rate-limit";
import { randomUUID } from "node:crypto";

const createSchema = z.object({
  petId: z.string().uuid(),
  packageType: z.string().min(2),
  scheduledAt: z.coerce.date().min(new Date()),
  notes: z.string().optional(),
  assessment: z.object({
    coatCondition: z.string(),
    lastGrooming: z.string().optional(),
    skinIssues: z.boolean(),
    aggressionHistory: z.boolean(),
    allergies: z.string().optional(),
  }),
});

export async function GET(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const orders = await prisma.partnerOrder.findMany({
    where: {
      customerId: identity.id,
      partnerService: {
        serviceCode: "GROOMING_HOME",
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      partnerService: {
        select: {
          partner: {
            select: { displayName: true },
          },
        },
      },
    },
  });

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const json = await request.json().catch(() => ({}));
  const parsed = createSchema.safeParse(json);
  
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  }

  const rate = await consumeRateLimit("grooming-order-create", identity.id, 5, 24 * 60 * 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  }

  const { petId, packageType, scheduledAt, notes, assessment } = parsed.data;

  // Verify pet ownership
  const pet = await prisma.pet.findFirst({
    where: { id: petId, ownerId: identity.id, active: true },
  });

  if (!pet) {
    return NextResponse.json({ error: "pet_not_found" }, { status: 404 });
  }

  // Find an active grooming partner service
  const groomingService = await prisma.partnerService.findFirst({
    where: {
      serviceCode: "GROOMING_HOME",
      status: "ACTIVE",
      partner: { status: "ACTIVE" },
    },
  });

  if (!groomingService) {
    return NextResponse.json({ error: "service_unavailable", message: "Grooming service is currently unavailable in your area." }, { status: 503 });
  }

  try {
    const reference = `GRM-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${randomUUID().slice(0, 6).toUpperCase()}`;
    
    const order = await prisma.partnerOrder.create({
      data: {
        reference,
        partnerServiceId: groomingService.id,
        customerId: identity.id,
        petId,
        scheduledAt,
        instructions: notes,
        metadata: {
          packageType,
          assessment,
          commercialStatus: "REQUEST_ONLY",
          paymentStatus: "NOT_COLLECTED",
        },
      },
    });

    return NextResponse.json({ order: { id: order.id, reference: order.reference, status: order.status } }, { status: 201 });
  } catch (error) {
    console.error("[GROOMING_ORDER_CREATE_ERROR]", error);
    return NextResponse.json({ error: "failed_to_create_order" }, { status: 500 });
  }
}
