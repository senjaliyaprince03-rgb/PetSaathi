import { ShieldAlert } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { SocietyGateForm } from "@/components/forms/society-gate-form";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export default async function SocietyGateProtocolPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SOCIETY_MANAGER", "SUPER_ADMIN"])) {
    redirect("/login?returnTo=/society/gate-protocol");
  }

  // Find which society this user manages
  const membership = await prisma.societyMember.findFirst({
    where: { userId: identity.id },
  });

  if (!membership) {
    return (
      <PortalShell mode="society" displayName={identity.displayName}>
        <div className="max-w-7xl pb-12">
          <h1 className="font-display text-4xl font-semibold">Security Protocol</h1>
          <p className="mt-5 rounded-2xl bg-coral/10 p-4 text-coral font-semibold">You are not linked to a society as a manager.</p>
        </div>
      </PortalShell>
    );
  }

  const accessRule = await prisma.societyAccessRule.findUnique({
    where: { societyId: membership.societyId },
  });

  return (
    <PortalShell mode="society" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12">
        <div className="border-b border-ink/10 pb-8 mb-10">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/50">safety & operations</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Gate Security Protocol</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-ink/60">
            Define exactly how PetSaathi verified caregivers should enter your society premises. We strictly enforce these protocols with all sitters serving your community.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2">
            <div className="rounded-4xl border border-ink/10 bg-white p-8 shadow-sm">
              <SocietyGateForm initialData={accessRule} />
            </div>
          </div>
          
          <div className="rounded-4xl bg-indigo/5 border border-indigo/10 p-8 sticky top-24">
            <div className="flex items-center gap-3 text-indigo mb-4">
              <ShieldAlert className="h-6 w-6" />
              <h3 className="font-bold">Trust & Safety Guarantee</h3>
            </div>
            <p className="text-sm leading-relaxed text-ink/70">
              PetSaathi sitters undergo a rigorous 4-step background verification. By explicitly outlining your gate rules here, our operations team ensures that no sitter arrives without knowing your community&apos;s specific access policies, avoiding gate delays and enhancing resident trust.
            </p>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
