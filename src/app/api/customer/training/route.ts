import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

const createSchema = z.object({
  serviceType: z.enum(["workshop", "assessment", "programme"]),
  workshopType: z.string().optional(),
  petId: z.string().min(1),
  goals: z.string().min(5).max(1000),
  concerns: z.string().max(1000).optional(),
  scheduledAt: z.coerce.date().optional(),
});

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });

  const { serviceType, workshopType, petId, goals, concerns, scheduledAt } = parsed.data;

  const pet = await prisma.pet.findFirst({ where: { id: petId, ownerId: identity.id, active: true }, select: { id: true, name: true } });
  if (!pet) return NextResponse.json({ error: "pet_not_found" }, { status: 404 });

  let trainingService = await prisma.partnerService.findFirst({
    where: { serviceCode: "TRAINING_ASSESSMENT", status: "ACTIVE" },
    select: { id: true },
  });

  if (!trainingService) {
    trainingService = await prisma.partnerService.findFirst({ where: { serviceCode: "TRAINING_ASSESSMENT" }, select: { id: true } });
  }

  if (!trainingService) return NextResponse.json({ error: "no_training_service", message: "Training partner support is not available." }, { status: 404 });

  const reference = `TRN-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const order = await prisma.partnerOrder.create({
    data: {
      reference,
      partnerServiceId: trainingService.id,
      customerId: identity.id,
      petId,
      scheduledAt,
      instructions: `Goals: ${goals}\nConcerns: ${concerns || "None"}`,
      metadata: { serviceType, workshopType, petName: pet.name, serviceCategory: "TRAINING" },
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
      partnerService: { serviceCode: "TRAINING_ASSESSMENT" },
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
