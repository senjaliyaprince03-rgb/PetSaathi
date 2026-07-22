import { redirect } from "next/navigation";
import Link from "next/link";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export default async function SaathiDashboardPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) redirect("/login?returnTo=/saathi");
  const sitter = await prisma.sitterProfile.findUnique({ where: { userId: identity.id }, select: { id: true } });
  const [assignments, checks, completed] = sitter ? await Promise.all([
    prisma.bookingAssignment.count({ where: { sitterId: sitter.id, status: { in: ["OFFERED", "ACCEPTED", "CUSTOMER_APPROVED", "ACTIVE"] } } }),
    prisma.sitterVerification.count({ where: { sitterId: sitter.id, status: "PASSED" } }),
    prisma.bookingAssignment.count({ where: { sitterId: sitter.id, status: "COMPLETED" } })
  ]) : [0, 0, 0];
  return <PortalShell mode="saathi" displayName={identity.displayName} metrics={[`${assignments} open assignment${assignments === 1 ? "" : "s"}`, `${checks} passed check${checks === 1 ? "" : "s"}`, `${completed} completed service${completed === 1 ? "" : "s"}`]}><div className="mt-5 grid gap-5 lg:grid-cols-2"><section className="rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted"><p className="eyebrow">Today’s rhythm</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em]">Your care ledger</h2><p className="mt-3 text-sm leading-6 text-ink/52">Offers, accepted services and active care appear in one verified queue. Nothing is published or accepted automatically.</p><Link href="/saathi/assignments" className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-bold text-paper transition hover:bg-indigo">Review assignments →</Link></section><section className="rounded-4xl border border-indigo/10 bg-gradient-to-br from-[#fff0e8] to-paper p-6 shadow-lifted"><p className="eyebrow">Professional standing</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em]">Trust grows by proof.</h2><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-3xl bg-paper/80 p-4"><p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-ink/40">Checks</p><p className="mt-2 font-display text-3xl font-semibold">{checks}</p></div><div className="rounded-3xl bg-paper/80 p-4"><p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-ink/40">Completed</p><p className="mt-2 font-display text-3xl font-semibold">{completed}</p></div></div></section></div></PortalShell>;
}
