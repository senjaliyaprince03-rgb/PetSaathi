import { redirect } from "next/navigation";

import { CommunicationPreferencesForm } from "@/components/portal/communication-preferences-form";
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
  return <PortalShell mode={mode} displayName={identity.displayName}><div className="mt-5 max-w-3xl"><CommunicationPreferencesForm initial={{ emailCare: enabled.get("EMAIL") ?? true, whatsappCare: enabled.get("WHATSAPP") ?? false, pushCare: enabled.get("PUSH") ?? false }} /></div></PortalShell>;
}
