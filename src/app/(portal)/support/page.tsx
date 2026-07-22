import { Headphones, ShieldAlert } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { SupportCaseForm } from "@/components/portal/support-case-form";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login?returnTo=/support");
  const cases = await prisma.supportCase.findMany({ where: { userId: identity.id }, orderBy: { createdAt: "desc" }, take: 50 });
  const mode = identity.roles.includes("SITTER") && !identity.roles.includes("CUSTOMER") ? "saathi" : "customer";

  return (
    <PortalShell mode={mode} displayName={identity.displayName}>
      <div className="mt-5 flex items-start gap-3 rounded-3xl border border-coral/20 bg-coral/8 p-5">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
        <p className="text-sm leading-6"><strong>Active emergency?</strong> Use the emergency contact and veterinary escalation instructions attached to the booking. A support case does not replace emergency response.</p>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <SupportCaseForm />
        <section className="rounded-4xl border border-ink/10 bg-paper p-6">
          <h2 className="font-display text-3xl font-semibold">Case history</h2>
          <div className="mt-5 grid gap-3">
            {cases.length ? cases.map((supportCase) => <article key={supportCase.id} className="rounded-2xl bg-cream/45 p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/55">{supportCase.reference}</p><span className="rounded-full bg-indigo/10 px-3 py-1 text-xs font-bold text-indigo">{supportCase.status.replaceAll("_", " ")}</span></div><p className="mt-3 font-semibold">{supportCase.subject}</p><p className="mt-1 text-xs text-ink/55">{supportCase.category.toLowerCase()} · {supportCase.createdAt.toLocaleString("en-IN")}</p>{supportCase.resolution && <p className="mt-3 text-sm leading-6 text-ink/70">{supportCase.resolution}</p>}</article>) : <div className="rounded-3xl border border-dashed border-ink/15 p-8 text-center"><Headphones className="mx-auto h-7 w-7 text-indigo" /><p className="mt-3 text-sm text-ink/65">No support cases have been recorded.</p></div>}
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
