import { redirect } from "next/navigation";

import { AddressForm } from "@/components/forms/address-form";
import { PortalShell } from "@/components/portal/portal-shell";
import { getCurrentIdentity } from "@/modules/auth/session";

export default async function NewAddressPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/addresses/new");
  return (
    <PortalShell mode="customer" displayName={identity.displayName}>
      <div className="mt-5 max-w-3xl">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">Add New Address</h1>
        <p className="mt-3 text-sm leading-6 text-ink/60 mb-8">
          Save an address to book services more easily.
        </p>
        <AddressForm />
      </div>
    </PortalShell>
  );
}
