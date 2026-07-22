import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const pets = await prisma.pet.findMany({
    where: { ownerId: identity.id, active: true },
    select: {
      id: true,
      name: true,
      species: true,
      breed: true,
      sex: true,
      weightKg: true,
      sterilised: true,
      photoPath: true,
      medicalProfile: true,
      emergencyContacts: true,
      careInstructions: true,
      medications: { where: { active: true } },
      vaccinations: true,
      riskAssessments: true, // PetRiskAssessment does not have 'active' field
    },
  });

  return NextResponse.json({
    pets: pets.map((p) => ({
      id: p.id,
      name: p.name,
      species: p.species,
      breed: p.breed,
      sex: p.sex,
      weightKg: p.weightKg ? Number(p.weightKg) : null,
      sterilised: p.sterilised,
      photoPath: p.photoPath,
      medical: p.medicalProfile,
      emergencyContacts: p.emergencyContacts,
      instructions: p.careInstructions,
      medications: p.medications,
      vaccinations: p.vaccinations,
      riskFlags: p.riskAssessments,
    })),
    syncedAt: new Date().toISOString(),
  });
}
