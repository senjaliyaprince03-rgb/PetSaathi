import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { PrivacyRequestForm } from "@/components/portal/privacy-request-form";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function PrivacySettingsPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login?returnTo=/settings/privacy");
  const requests = await prisma.accountRequest.findMany({ where: { userId: identity.id }, orderBy: { requestedAt: "desc" }, take: 25 });
  const mode = identity.roles.includes("SITTER") && !identity.roles.includes("CUSTOMER") ? "saathi" : "customer";
  return <PortalShell mode={mode} displayName={identity.displayName}><div className="mt-5 grid gap-5 lg:grid-cols-2"><PrivacyRequestForm /><section className="rounded-4xl border border-ink/10 bg-paper p-6"><h2 className="font-display text-3xl font-semibold">Request history</h2><div className="mt-5 grid gap-3">{requests.length ? requests.map((request) => <article key={request.id} className="rounded-2xl bg-cream/45 p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45">{request.reference}</p><span className="rounded-full bg-indigo/10 px-3 py-1 text-xs font-bold text-indigo">{request.status.replaceAll("_", " ")}</span></div><p className="mt-3 font-semibold">{request.type.toLowerCase()} request</p><p className="mt-1 text-xs text-ink/40">{request.requestedAt.toLocaleString("en-IN")}</p>{request.resolution && <p className="mt-3 text-sm leading-6 text-ink/55">{request.resolution}</p>}</article>) : <p className="text-sm text-ink/45">No account requests have been recorded.</p>}</div></section></div></PortalShell>;
}
