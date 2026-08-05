import { BellRing, LockKeyhole, MegaphoneOff, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

import { CommunicationPreferencesForm } from "@/components/portal/communication-preferences-form";
import { DashboardHeading, DashboardPanel } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function NotificationSettingsPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login?returnTo=/settings/notifications");
  const rows = await prisma.communicationPreference.findMany({ where: { userId: identity.id, purpose: "CARE_UPDATES" }, select: { channel: true, enabled: true } });
  const enabled = new Map(rows.map((row) => [row.channel, row.enabled]));
  const mode = identity.roles.includes("SITTER") && !identity.roles.includes("CUSTOMER") ? "saathi" : "customer";

  return (
    <PortalShell mode={mode} displayName={identity.displayName} showSummaryCards={false}>
      <DashboardPanel className="mt-5">
        <DashboardHeading eyebrow="Communication control" title="Reachable when it matters. Quiet when it does not." description="Choose optional delivery channels while preserving the protected in-app record for every essential update." />
        <div className="mt-7 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <CommunicationPreferencesForm initial={{ emailCare: enabled.get("EMAIL") ?? true, whatsappCare: enabled.get("WHATSAPP") ?? false, pushCare: enabled.get("PUSH") ?? false }} />
          <aside className="relative overflow-hidden rounded-[1.75rem] bg-[#281d2b] p-6 text-paper"><div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-coral/20 blur-3xl" /><div className="relative"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-saffron text-ink"><BellRing className="h-5 w-5" /></span><h3 className="mt-7 font-display text-3xl font-semibold tracking-[-0.04em]">Your communication promise.</h3><div className="mt-6 grid gap-4"><Promise icon={ShieldCheck} title="Essential stays on" copy="Safety, booking and account-security events remain in-app." /><Promise icon={MegaphoneOff} title="Marketing stays off" copy="Promotional messages remain disabled until consent controls are approved." /><Promise icon={LockKeyhole} title="Choices are private" copy="Channel preferences are stored against your authenticated account." /></div></div></aside>
        </div>
      </DashboardPanel>
    </PortalShell>
  );
}

function Promise({ icon: Icon, title, copy }: { icon: typeof ShieldCheck; title: string; copy: string }) {
  return <div className="flex gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-paper/[0.07] text-saffron"><Icon className="h-4 w-4" /></span><div><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-paper/45">{copy}</p></div></div>;
}
