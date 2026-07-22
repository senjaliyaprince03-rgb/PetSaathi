import { redirect } from "next/navigation";

import { PetProfileForm } from "@/components/forms/pet-profile-form";
import { getCurrentIdentity } from "@/modules/auth/session";

export default async function NewPetPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/pets/new");
  return <main className="min-h-screen bg-cream/50 py-10"><div className="container-shell"><PetProfileForm /></div></main>;
}
