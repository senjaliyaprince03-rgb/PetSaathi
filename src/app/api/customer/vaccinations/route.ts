import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const pets = await prisma.pet.findMany({
    where: { ownerId: identity.id, active: true },
    select: { id: true, name: true },
  });

  const petIds = pets.map((p) => p.id);

  const vaccinations = await prisma.vaccination.findMany({
    where: { petId: { in: petIds } },
    orderBy: { administeredAt: "desc" },
    select: {
      id: true,
      petId: true,
      vaccine: true,
      administeredAt: true,
      nextDueAt: true,
      clinic: true,
      evidenceRef: true,
      verifiedAt: true,
      pet: { select: { name: true } },
    },
  });

  return NextResponse.json(vaccinations);
}

const registerSchema = z.object({
  petId: z.string().min(1),
  campId: z.string().optional(),
  previousVaccine: z.string().optional(),
  lastVaccineDate: z.coerce.date().optional(),
  healthConditions: z.string().max(1000).optional(),
  emergencyContact: z.string().min(10),
  consent: z.literal(true),
});

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const parsed = registerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });

  const { petId, campId, previousVaccine, lastVaccineDate, healthConditions, emergencyContact } = parsed.data;

  const pet = await prisma.pet.findFirst({ where: { id: petId, ownerId: identity.id, active: true } });
  if (!pet) return NextResponse.json({ error: "pet_not_found" }, { status: 404 });

  // Record registration in Vaccination model as pending or as audit event
  const record = await prisma.vaccination.create({
    data: {
      petId,
      vaccine: previousVaccine || "Rabies / Annual Camp",
      administeredAt: new Date(),
      clinic: campId ? `Society Camp (${campId})` : "Society Vaccination Camp",
      evidenceRef: `REG:${emergencyContact}:${healthConditions || "None"}`,
    },
  });

  return NextResponse.json({ registration: record }, { status: 201 });
}
