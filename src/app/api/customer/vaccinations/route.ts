import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

const schema = z.object({
  petId: z.string().uuid(),
  campId: z.string().optional(),
  previousVaccine: z.string().optional(),
  lastVaccineDate: z.coerce.date().optional(),
  healthConditions: z.string().optional(),
  emergencyContact: z.string().min(5),
  consent: z.boolean().refine((val) => val === true, { message: "Consent is required" }),
});

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });

  // If there's a specific vet for the camp, we'd link to them. For now, find first active vet service.
  const partnerService = await prisma.partnerService.findFirst({
    where: { serviceCode: "VET_SUPPORT", status: "ACTIVE" },
  });

  if (!partnerService) {
    return NextResponse.json({ error: "service_unavailable", message: "Vaccination camps are currently unavailable." }, { status: 503 });
  }

  const reference = `PO-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const order = await prisma.partnerOrder.create({
    data: {
      reference,
      partnerServiceId: partnerService.id,
      customerId: identity.id,
      petId: parsed.data.petId,
      status: "REQUESTED",
      instructions: `Vaccination Camp Registration. Health conditions: ${parsed.data.healthConditions || 'None'}`,
      metadata: {
        isVaccinationCamp: true,
        campId: parsed.data.campId,
        previousVaccine: parsed.data.previousVaccine,
        lastVaccineDate: parsed.data.lastVaccineDate,
        emergencyContact: parsed.data.emergencyContact,
        consentGiven: parsed.data.consent,
      },
    },
  });

  return NextResponse.json({ order: { id: order.id, reference: order.reference, status: order.status } }, { status: 201 });
}

export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const pets = await prisma.pet.findMany({
    where: { ownerId: identity.id, active: true },
    select: { id: true }
  });

  const petIds = pets.map(p => p.id);

  const records = await prisma.vaccination.findMany({
    where: { petId: { in: petIds } },
    orderBy: { administeredAt: "desc" },
    include: { pet: { select: { name: true } } }
  });

  return NextResponse.json({ records });
}
