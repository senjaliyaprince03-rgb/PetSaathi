import { ArrowDownRight, ArrowUpRight, Sparkles, WalletCards } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { getLoyaltySummary } from "@/modules/loyalty/rewards";

export const dynamic = "force-dynamic";

export default async function CustomerLoyaltyPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["CUSTOMER"])) redirect("/login?returnTo=/customer/loyalty");

  const summary = await getLoyaltySummary(identity.id);
  const ledger = await prisma.loyaltyLedger.findMany({
    where: { userId: identity.id },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  return (
    <PortalShell mode="customer" displayName={identity.displayName} metrics={[`₹${(summary.balancePaise / 100).toLocaleString("en-IN")} available`, `₹${(summary.totalEarned / 100).toLocaleString("en-IN")} earned`, `₹${(summary.totalSpent / 100).toLocaleString("en-IN")} redeemed`]}>
      <div className="mt-5 rounded-5xl border border-indigo/10 bg-gradient-to-br from-[#f3eafa] via-paper to-[#fff0e8] p-6 shadow-soft sm:p-9">
        <p className="eyebrow">Loyalty & Rewards</p>
        <h1 className="section-title mt-5">Your PetSaathi credits</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/60">
          Earn credits when eligible services, memberships or referrals are completed. Every movement remains visible in your private ledger.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <article className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo text-paper">
              <WalletCards className="h-5 w-5" />
            </span>
            <p className="mt-8 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-ink/42">Available Balance</p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight">₹{summary.balancePaise / 100}</h2>
          </article>
          
          <article className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf text-paper">
              <Sparkles className="h-5 w-5" />
            </span>
            <p className="mt-8 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-ink/42">Lifetime Earned</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">₹{summary.totalEarned / 100}</h2>
          </article>
          
          <article className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-coral text-paper">
              <ArrowDownRight className="h-5 w-5" />
            </span>
            <p className="mt-8 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-ink/42">Lifetime Spent</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">₹{summary.totalSpent / 100}</h2>
          </article>
        </div>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">Ledger History</h2>
          <div className="mt-5 rounded-4xl border border-ink/10 bg-paper shadow-lifted overflow-hidden">
            {ledger.length > 0 ? (
              <ul className="divide-y divide-ink/10">
                {ledger.map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-full ${entry.delta > 0 ? 'bg-leaf/10 text-leaf' : 'bg-coral/10 text-coral'}`}>
                        {entry.delta > 0 ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                      </span>
                      <div>
                        <p className="font-semibold">{entry.reason}</p>
                        <p className="text-xs text-ink/50">{entry.createdAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${entry.delta > 0 ? 'text-leaf' : 'text-coral'}`}>
                        {entry.delta > 0 ? '+' : ''}₹{entry.delta / 100}
                      </p>
                      <p className="text-xs text-ink/50">Balance: ₹{entry.balanceAfter / 100}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-10 text-center">
                <p className="font-semibold text-ink/60">No credit history yet.</p>
                <p className="mt-2 text-sm text-ink/50">Your ledger will update automatically as you use PetSaathi.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
