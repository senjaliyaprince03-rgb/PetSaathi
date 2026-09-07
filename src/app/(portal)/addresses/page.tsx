import { MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardEmptyState, DashboardHeading, DashboardPanel } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/addresses");

  const addresses = await prisma.address.findMany({
    where: { userId: identity.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PortalShell mode="customer" displayName={identity.displayName}>
      <div className="mt-5 max-w-5xl pb-12">
        <DashboardPanel>
          <DashboardHeading
            eyebrow="Saved Addresses"
            title="Service & Pickup Locations"
            description="Manage doorstep locations for dog walking, pet sitting, and grooming visits."
            action={
              <Link href="/addresses/new" className={buttonVariants({ variant: "accent" })}>
                <Plus className="h-4 w-4 mr-1.5" /> Add Address
              </Link>
            }
          />

          {addresses.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="rounded-2xl border border-ink/[0.08] bg-paper p-5 transition hover:shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo/10 text-indigo">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <span className="font-bold text-sm text-ink">{address.label}</span>
                  </div>
                  <p className="mt-3 text-xs text-ink/80 leading-relaxed">
                    {address.line1}
                    {address.line2 ? `, ${address.line2}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-ink/60">
                    {address.locality}, {address.city}, {address.state} - {address.postalCode}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <DashboardEmptyState
                icon={MapPin}
                title="No saved addresses yet"
                description="Add an address to streamline your care bookings and home visits."
                action={
                  <Link href="/addresses/new" className={buttonVariants({ variant: "accent" })}>
                    <Plus className="h-4 w-4 mr-1.5" /> Add your first address
                  </Link>
                }
              />
            </div>
          )}
        </DashboardPanel>
      </div>
    </PortalShell>
  );
}
