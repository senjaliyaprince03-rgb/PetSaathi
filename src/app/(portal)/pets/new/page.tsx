import { redirect } from "next/navigation";

import { PetProfileForm } from "@/components/forms/pet-profile-form";
import { PortalShell } from "@/components/portal/portal-shell";
import { getCurrentIdentity } from "@/modules/auth/session";

export default async function NewPetPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/pets/new");
  return (
    <PortalShell mode="customer" displayName={identity.displayName}>
      <div className="mt-5 max-w-3xl">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">Add Pet Profile</h1>
        <p className="mt-3 text-sm leading-6 text-ink/60 mb-8">
          Create a profile for your pet to start booking services.
        </p>
        <PetProfileForm />
      </div>
    </PortalShell>
  );
}
