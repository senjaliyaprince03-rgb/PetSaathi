import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { createPetSchema } from "@/modules/pets/input";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const pet = await prisma.pet.findFirst({ where: { id, ownerId: identity.id, active: true } });
  if (!pet) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const parsed = createPetSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { medical, emergencyContact, birthDate, weightKg, ...petInput } = parsed.data;

  const updatedPet = await prisma.pet.update({
    where: { id },
    data: {
      ...petInput,
      birthDate: birthDate ? new Date(`${birthDate}T00:00:00.000Z`) : null,
      weightKg: weightKg || null,
      medicalProfile: medical ? {
        upsert: {
          create: medical,
          update: medical
        }
      } : { delete: true },
      emergencyContacts: emergencyContact ? {
        deleteMany: {},
        create: { ...emergencyContact, priority: 1 }
      } : { deleteMany: {} }
    },
    select: { id: true }
  });

  return NextResponse.json({ pet: updatedPet }, { headers: { "Cache-Control": "private, no-store" } });
}
