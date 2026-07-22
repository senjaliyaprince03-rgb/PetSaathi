import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { createPetSchema } from "@/modules/pets/input";

export const dynamic = "force-dynamic";

export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const pets = await prisma.pet.findMany({
    where: { ownerId: identity.id, active: true },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, species: true, breed: true, sex: true, birthDate: true, weightKg: true, sterilised: true, photoPath: true }
  });
  return NextResponse.json({ pets }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = createPetSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { medical, emergencyContact, birthDate, weightKg, ...petInput } = parsed.data;

  const pet = await prisma.pet.create({
    data: {
      ...petInput,
      ownerId: identity.id,
      birthDate: birthDate ? new Date(`${birthDate}T00:00:00.000Z`) : undefined,
      weightKg,
      medicalProfile: medical ? { create: medical } : undefined,
      emergencyContacts: emergencyContact ? { create: { ...emergencyContact, priority: 1 } } : undefined
    },
    select: { id: true, name: true, species: true, breed: true, createdAt: true }
  });

  return NextResponse.json({ pet }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
}
