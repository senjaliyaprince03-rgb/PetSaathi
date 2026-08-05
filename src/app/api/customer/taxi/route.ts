import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

const createSchema = z.object({
  tripType: z.enum(["OWNER_ACCOMPANIED", "HANDLER_ACCOMPANIED", "UNACCOMPANIED"]),
  petId: z.string().min(1),
  pickupAddress: z.string().min(3).max(500),
  dropoffAddress: z.string().min(3).max(500),
  purpose: z.string().min(1),
  scheduledAt: z.coerce.date().optional(),
  instructions: z.string().max(1000).optional(),
});

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });

  const { tripType, petId, pickupAddress, dropoffAddress, purpose, scheduledAt, instructions } = parsed.data;

  const pet = await prisma.pet.findFirst({ where: { id: petId, ownerId: identity.id, active: true }, select: { id: true, name: true } });
  if (!pet) return NextResponse.json({ error: "pet_not_found" }, { status: 404 });

  let taxiService = await prisma.partnerService.findFirst({
    where: { serviceCode: "PET_TAXI", status: "ACTIVE" },
    select: { id: true },
  });

  if (!taxiService) {
    taxiService = await prisma.partnerService.findFirst({ where: { serviceCode: "PET_TAXI" }, select: { id: true } });
  }

  if (!taxiService) return NextResponse.json({ error: "no_taxi_service", message: "Pet taxi service is not currently available." }, { status: 404 });

  const reference = `TXI-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const order = await prisma.partnerOrder.create({
    data: {
      reference,
      partnerServiceId: taxiService.id,
      customerId: identity.id,
      petId,
      scheduledAt,
      instructions: `Pickup: ${pickupAddress}\nDropoff: ${dropoffAddress}\nInstructions: ${instructions || "None"}`,
      metadata: { tripType, purpose, pickupAddress, dropoffAddress, petName: pet.name, serviceCategory: "PET_TAXI" },
    },
  });

  return NextResponse.json({ order: { id: order.id, reference: order.reference, status: order.status } }, { status: 201 });
}

export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const orders = await prisma.partnerOrder.findMany({
    where: {
      customerId: identity.id,
      partnerService: { serviceCode: "PET_TAXI" },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      reference: true,
      status: true,
      scheduledAt: true,
      metadata: true,
      createdAt: true,
      pet: { select: { name: true } },
    },
  });

  return NextResponse.json(orders);
}
