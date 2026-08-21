import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

const schema = z.object({
  tripType: z.enum(["OWNER_ACCOMPANIED", "HANDLER_ACCOMPANIED", "UNACCOMPANIED"]),
  petId: z.string().uuid(),
  pickup: z.string().min(3),
  dropoff: z.string().min(3),
  purpose: z.string().min(3),
  instructions: z.string().optional(),
  scheduledAt: z.coerce.date().min(new Date()),
});

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });

  const partnerService = await prisma.partnerService.findFirst({
    where: { serviceCode: "PET_TAXI", status: "ACTIVE" },
  });

  if (!partnerService) {
    return NextResponse.json({ error: "service_unavailable", message: "Pet taxi services are currently unavailable." }, { status: 503 });
  }

  const reference = `PO-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const order = await prisma.partnerOrder.create({
    data: {
      reference,
      partnerServiceId: partnerService.id,
      customerId: identity.id,
      petId: parsed.data.petId,
      status: "REQUESTED",
      scheduledAt: parsed.data.scheduledAt,
      instructions: parsed.data.instructions,
      metadata: {
        tripType: parsed.data.tripType,
        pickup: parsed.data.pickup,
        dropoff: parsed.data.dropoff,
        purpose: parsed.data.purpose,
      },
    },
  });

  return NextResponse.json({ order: { id: order.id, reference: order.reference, status: order.status } }, { status: 201 });
}

export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const trips = await prisma.partnerOrder.findMany({
    where: { 
      customerId: identity.id,
      partnerService: { serviceCode: "PET_TAXI" }
    },
    orderBy: { createdAt: "desc" },
    include: {
      pet: { select: { name: true } },
      partnerService: { include: { partner: { select: { displayName: true } } } }
    },
  });

  return NextResponse.json({ trips });
}
