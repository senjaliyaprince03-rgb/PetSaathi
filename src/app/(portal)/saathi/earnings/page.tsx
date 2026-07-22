import { Clock3, WalletCards } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export default async function SaathiEarningsPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) redirect("/login?returnTo=/saathi/earnings");
  const sitter = await prisma.sitterProfile.findUnique({ where: { userId: identity.id }, select: { id: true } });
  const payouts = sitter ? await prisma.payout.findMany({ where: { sitterId: sitter.id }, orderBy: { createdAt: "desc" }, take: 24, include: { booking: { select: { reference: true, serviceType: { select: { name: true } }, pet: { select: { name: true } } } } } }) : [];
  const paid = payouts.filter((item) => item.status === "PAID").reduce((sum, item) => sum + item.amountPaise + item.adjustmentPaise, 0);
  const pending = payouts.filter((item) => item.status !== "PAID").reduce((sum, item) => sum + item.amountPaise + item.adjustmentPaise, 0);
  return <PortalShell mode="saathi" displayName={identity.displayName} metrics={[money(paid), money(pending), `${payouts.length} payout record${payouts.length === 1 ? "" : "s"}`]}><section className="mt-5 rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted"><p className="eyebrow">Earnings ledger</p><h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em]">Clear money. Clear status.</h2><div className="mt-6 grid gap-3">{payouts.length ? payouts.map((payout) => <article key={payout.id} className="flex flex-col justify-between gap-4 rounded-3xl bg-cream/55 p-5 sm:flex-row sm:items-center"><div><p className="font-bold">{payout.booking.serviceType.name} · {payout.booking.pet.name}</p><p className="mt-1 text-xs text-ink/45">{payout.booking.reference} · created {payout.createdAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}</p></div><div className="sm:text-right"><p className="font-display text-2xl font-semibold">{money(payout.amountPaise + payout.adjustmentPaise)}</p><p className={`mt-1 text-xs font-bold uppercase tracking-[0.12em] ${payout.status === "PAID" ? "text-leaf" : "text-coral"}`}>{payout.status.replaceAll("_", " ")}</p></div></article>) : <Empty icon={WalletCards} title="No earnings recorded yet." copy="Completed, approved services will appear here with their payout state." />}</div></section></PortalShell>;
}

function money(paise: number) { return `₹${(paise / 100).toLocaleString("en-IN")}`; }
function Empty({ icon: Icon, title, copy }: { icon: typeof WalletCards; title: string; copy: string }) { return <div className="rounded-4xl border border-dashed border-indigo/15 p-10 text-center"><Icon className="mx-auto h-9 w-9 text-indigo/45" /><h3 className="mt-4 font-display text-3xl font-semibold">{title}</h3><p className="mt-2 text-sm text-ink/48">{copy}</p><p className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-leaf"><Clock3 className="h-4 w-4" />Ledger remains live</p></div>; }
