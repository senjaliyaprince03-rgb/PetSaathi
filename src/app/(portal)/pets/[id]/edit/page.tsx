import { redirect, notFound } from "next/navigation";
import { PetProfileForm } from "@/components/forms/pet-profile-form";
import { PortalShell } from "@/components/portal/portal-shell";
import { getCurrentIdentity } from "@/modules/auth/session";
import { prisma } from "@/lib/db";

export default async function EditPetPage({ params }: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  const { id } = await params;
  if (!identity?.roles.includes("CUSTOMER")) redirect(`/login?returnTo=/pets/${id}/edit`);

  const pet = await prisma.pet.findFirst({
    where: { id, ownerId: identity.id, active: true },
    include: { medicalProfile: true, emergencyContacts: true }
  });
  
  if (!pet) notFound();

  const formattedPet = {
    id: pet.id,
    name: pet.name,
    species: pet.species as "DOG" | "CAT" | "OTHER",
    breed: pet.breed,
    sex: pet.sex as "FEMALE" | "MALE" | "UNKNOWN" | null,
    birthDate: pet.birthDate?.toISOString(),
    weightKg: pet.weightKg,
    sterilised: pet.sterilised,
    medical: pet.medicalProfile ? {
      allergies: pet.medicalProfile.allergies,
      conditions: pet.medicalProfile.conditions,
      medications: pet.medicalProfile.medications
    } : null,
    emergencyContact: pet.emergencyContacts[0] ? {
      name: pet.emergencyContacts[0].name,
      phone: pet.emergencyContacts[0].phone
    } : null
  };

  return (
    <PortalShell mode="customer" displayName={identity.displayName}>
      <div className="mt-5 max-w-3xl">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">Edit Pet Profile</h1>
        <p className="mt-3 text-sm leading-6 text-ink/60 mb-8">
          Update the profile details for {pet.name}.
        </p>
        <PetProfileForm pet={formattedPet} />
      </div>
    </PortalShell>
  );
}
