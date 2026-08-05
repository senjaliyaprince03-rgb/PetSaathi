import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

const createSchema = z.object({
  petId: z.string().min(1),
  urgency: z.enum(["RED", "AMBER", "GREEN"]),
  symptoms: z.string().min(5).max(2000),
  consultationMode: z.enum(["ONLINE", "HOME_VISIT", "CLINIC_REFERRAL"]),
  scheduledAt: z.coerce.date().optional(),
});

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });

  const { petId, urgency, symptoms, consultationMode, scheduledAt } = parsed.data;

  if (urgency === "RED") {
    return NextResponse.json({ error: "emergency_blocked", message: "Emergency cases cannot be handled via online consultation. Please visit your nearest clinic." }, { status: 400 });
  }

  const pet = await prisma.pet.findFirst({ where: { id: petId, ownerId: identity.id, active: true }, select: { id: true, name: true } });
  if (!pet) return NextResponse.json({ error: "pet_not_found" }, { status: 404 });

  let vetService = await prisma.partnerService.findFirst({
    where: { serviceCode: "VET_SUPPORT", status: "ACTIVE" },
    select: { id: true },
  });

  if (!vetService) {
    // Fallback search or fallback partner service
    const anyVet = await prisma.partnerService.findFirst({ where: { serviceCode: "VET_SUPPORT" }, select: { id: true } });
    vetService = anyVet;
  }

  if (!vetService) return NextResponse.json({ error: "no_vet_service", message: "Veterinary partner support is not available." }, { status: 404 });

  const reference = `VET-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const order = await prisma.partnerOrder.create({
    data: {
      reference,
      partnerServiceId: vetService.id,
      customerId: identity.id,
      petId,
      scheduledAt,
      instructions: symptoms,
      metadata: { urgency, consultationMode, petName: pet.name, serviceCategory: "VETERINARY" },
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
      partnerService: { serviceCode: "VET_SUPPORT" },
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
