import { Flag } from "lucide-react";
import { redirect } from "next/navigation";

import { FeatureFlagAction } from "@/components/portal/feature-flag-actions";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminFeaturesPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SUPER_ADMIN"])) redirect("/login?returnTo=/admin/features");
  const flags = await prisma.featureFlag.findMany({ orderBy: { key: "asc" } });
  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/50">server-side release gates</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Expansion controls</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/60 mb-10">Risky services remain unavailable until a Super Admin records the operational reason for activation. Every change is audited.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{flags.map((flag) => <article key={flag.key} className="rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted"><div className="flex items-center justify-between gap-3"><Flag className={`h-6 w-6 ${flag.enabled ? "text-leaf" : "text-ink/25"}`} /><span className={`rounded-full px-3 py-1 text-[10px] uppercase font-bold tracking-[0.16em] ${flag.enabled ? "bg-leaf/10 text-leaf" : "bg-ink/5 text-ink/45"}`}>{flag.enabled ? "ENABLED" : "DISABLED"}</span></div><h2 className="mt-5 font-display text-2xl font-semibold">{flag.key.replaceAll("_", " ")}</h2><p className="mt-3 text-sm leading-6 text-ink/55">{flag.description}</p><FeatureFlagAction flagKey={flag.key} enabled={flag.enabled} /></article>)}</div>
      </div>
    </PortalShell>
  );
}
