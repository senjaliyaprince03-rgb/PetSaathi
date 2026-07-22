import { redirect } from "next/navigation";

import { AddressForm } from "@/components/forms/address-form";
import { getCurrentIdentity } from "@/modules/auth/session";

export default async function NewAddressPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/addresses/new");
  return <main className="min-h-screen bg-cream/50 py-10"><div className="container-shell"><AddressForm /></div></main>;
}
