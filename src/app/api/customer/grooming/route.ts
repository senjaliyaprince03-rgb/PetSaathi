import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

const createSchema = z.object({
  petId: z.string().min(1),
  packageType: z.enum(["essential", "full", "breed_specific"]),
  scheduledAt: z.coerce.date().min(new Date()).optional(),
  notes: z.string().trim().max(2_000).optional(),
  assessment: z.object({
    coatCondition: z.string().min(1),
    lastGroomingDate: z.string().optional(),
    skinIssues: z.boolean().default(false),
    aggression: z.boolean().default(false),
    allergies: z.string().max(500).optional(),
  }),
});

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });

  const { petId, packageType, scheduledAt, notes, assessment } = parsed.data;

  // Verify pet belongs to customer
  const pet = await prisma.pet.findFirst({ where: { id: petId, ownerId: identity.id, active: true }, select: { id: true, name: true } });
  if (!pet) return NextResponse.json({ error: "pet_not_found" }, { status: 404 });

  // Find an active grooming partner service
  const groomingService = await prisma.partnerService.findFirst({
    where: { serviceCode: "GROOMING_HOME", status: "ACTIVE", partner: { status: "ACTIVE" } },
    select: { id: true, partner: { select: { displayName: true } } },
  });

  if (!groomingService) return NextResponse.json({ error: "no_grooming_service", message: "No grooming partner is currently available." }, { status: 404 });

  const reference = `GRM-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const order = await prisma.partnerOrder.create({
    data: {
      reference,
      partnerServiceId: groomingService.id,
      customerId: identity.id,
      petId,
      scheduledAt,
      instructions: notes,
      metadata: { packageType, assessment, petName: pet.name, serviceCategory: "GROOMING" },
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
      partnerService: { serviceCode: "GROOMING_HOME" },
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
      partnerService: { select: { partner: { select: { displayName: true } } } },
      pet: { select: { name: true } },
    },
  });

  return NextResponse.json(orders);
}
