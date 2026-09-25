import { ArrowRight, CheckCircle2, IndianRupee, Landmark, RotateCcw, ShieldCheck, WalletCards } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PayoutActions, ReconciliationPanel, RefundActions } from "@/components/portal/finance-actions";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminFinancePage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["FINANCE_ADMIN", "SUPER_ADMIN"])) {
    redirect("/login?returnTo=/admin/finance");
  }

  const [refunds, payouts, reconciliationRows] = await Promise.all([
    prisma.refund.findMany({
      where: { status: { notIn: ["COMPLETED", "REJECTED"] } },
      orderBy: { createdAt: "asc" },
      take: 50,
      select: {
        id: true,
        amountPaise: true,
        reason: true,
        status: true,
        providerRefundId: true,
        createdAt: true,
        payment: { select: { booking: { select: { reference: true } } } },
      },
    }),
    prisma.payout.findMany({
      where: { status: { notIn: ["PAID", "CANCELLED"] } },
      orderBy: { createdAt: "asc" },
      take: 50,
      select: {
        id: true,
        amountPaise: true,
        adjustmentPaise: true,
        status: true,
        providerRef: true,
        createdAt: true,
        booking: {
          select: {
            reference: true,
            status: true,
            reports: { orderBy: { version: "desc" }, take: 1, select: { reviewStatus: true } },
          },
        },
        sitter: { select: { user: { select: { displayName: true } } } },
      },
    }),
    prisma.reconciliationRun.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        provider: true,
        periodStart: true,
        periodEnd: true,
        status: true,
        expected: true,
        actual: true,
        differences: true,
      },
    }),
  ]);

  const totalPendingRefundPaise = refunds.reduce((acc, r) => acc + r.amountPaise, 0);
  const totalPendingPayoutPaise = payouts.reduce((acc, p) => acc + (p.amountPaise + p.adjustmentPaise), 0);

  const total = (value: unknown) =>
    value && typeof value === "object"
      ? (value as {
          capturedPaise: number;
          refundedPaise: number;
          paidOutPaise: number;
          netCashPaise: number;
        })
      : null;

  const reconciliationRuns = reconciliationRows.map((run) => ({
    ...run,
    status: String(run.status),
    periodStart: run.periodStart.toISOString(),
    periodEnd: run.periodEnd.toISOString(),
    expected: total(run.expected),
    actual: total(run.actual),
    differences: total(run.differences),
  }));

  return (
    <PortalShell mode="admin" displayName={identity.displayName} roles={identity.roles}>
      <div className="max-w-7xl pb-16 space-y-8">
        {/* Top Finance Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-700" />
                Platform Finance &amp; Ledger Authority
              </span>
              <span className="text-xs text-ink/60 font-semibold hidden sm:inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Razorpay Escrow Integrated
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-ink">
              Refunds, Payouts &amp; Reconciliation
            </h1>
            <p className="mt-2 text-sm leading-6 text-ink/70 max-w-3xl">
              Authorize customer refunds, verify weekly caregiver direct deposits, and audit bank statements against platform booking ledgers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/b2b/invoices"
              className="inline-flex items-center gap-2 bg-white hover:bg-surface border border-ink/10 text-ink text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-2xs"
            >
              <span>Corporate Invoices</span>
              <ArrowRight className="w-4 h-4 text-indigo" />
            </Link>
          </div>
        </div>

        {/* Top 4 Finance KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Pending Refunds</span>
              <RotateCcw className="w-4 h-4 text-coral" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold font-display text-ink block">
              ₹{(totalPendingRefundPaise / 100).toLocaleString("en-IN")}
            </span>
            <p className="text-[11px] text-coral mt-1 font-medium">{refunds.length} requests awaiting authorization</p>
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Pending Payouts</span>
              <Landmark className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold font-display text-emerald-700 block">
              ₹{(totalPendingPayoutPaise / 100).toLocaleString("en-IN")}
            </span>
            <p className="text-[11px] text-emerald-700 mt-1 font-medium">{payouts.length} caregiver payouts queued</p>
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Reconciled Runs</span>
              <ShieldCheck className="w-4 h-4 text-indigo" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold font-display text-ink block">
              {reconciliationRuns.length}
            </span>
            <p className="text-[11px] text-ink/60 mt-1 font-medium">Recorded settlement statements</p>
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Escrow Security</span>
              <WalletCards className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold font-display text-ink block">100% Locked</span>
            <p className="text-[11px] text-purple-700 mt-1 font-medium">Released only after report card</p>
          </div>
        </div>

        {/* Queues Grid */}
        <div className="grid gap-8 xl:grid-cols-2">
          {/* Refund Queue Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ink/5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-coral/10 text-coral">
                  <RotateCcw className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-bold text-ink">Refund Queue</h2>
                  <p className="text-xs text-ink/60">{refunds.length} open customer request{refunds.length === 1 ? "" : "s"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {refunds.length ? (
                refunds.map((refund) => (
                  <article key={refund.id} className="rounded-3xl border border-ink/10 bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-ink/70">
                        Booking: {refund.payment.booking.reference}
                      </p>
                      <span className="rounded-full bg-coral/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-extrabold text-coral border border-coral/20">
                        {refund.status}
                      </span>
                    </div>
                    <div className="my-2">
                      <span className="text-2xl font-bold font-display text-ink">
                        ₹{(refund.amountPaise / 100).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-xs text-ink/70 leading-relaxed font-medium mb-3">{refund.reason}</p>
                    {refund.providerRefundId && (
                      <p className="text-[11px] text-ink/50 font-mono mb-3">
                        Provider ID: {refund.providerRefundId}
                      </p>
                    )}
                    <div className="pt-3 border-t border-ink/5">
                      <RefundActions id={refund.id} status={refund.status} />
                    </div>
                  </article>
                ))
              ) : (
                <EmptyState label="No customer refunds currently need review." />
              )}
            </div>
          </section>

          {/* Payout Queue Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ink/5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Landmark className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-bold text-ink">Payout Queue</h2>
                  <p className="text-xs text-ink/60">{payouts.length} caregiver payout{payouts.length === 1 ? "" : "s"} ready</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {payouts.length ? (
                payouts.map((payout) => {
                  const reviewReady =
                    payout.booking.status === "CLOSED" &&
                    payout.booking.reports[0]?.reviewStatus === "APPROVED";
                  return (
                    <article key={payout.id} className="rounded-3xl border border-ink/10 bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <p className="text-xs font-bold text-ink">
                          {payout.sitter.user.displayName} • {payout.booking.reference}
                        </p>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] uppercase font-extrabold text-emerald-800 border border-emerald-200">
                          {payout.status}
                        </span>
                      </div>
                      <div className="my-2">
                        <span className="text-2xl font-bold font-display text-emerald-700">
                          ₹{((payout.amountPaise + payout.adjustmentPaise) / 100).toLocaleString("en-IN")}
                        </span>
                      </div>
                      {payout.providerRef && (
                        <p className="text-[11px] text-ink/50 font-mono mb-3">
                          Transfer Ref: {payout.providerRef}
                        </p>
                      )}
                      <div className="pt-3 border-t border-ink/5">
                        <PayoutActions id={payout.id} status={payout.status} reviewReady={reviewReady} />
                      </div>
                    </article>
                  );
                })
              ) : (
                <EmptyState label="No caregiver payouts currently require review." />
              )}
            </div>
          </section>
        </div>

        {/* Bank & Payment Statement Reconciliation */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-2xs">
          <ReconciliationPanel runs={reconciliationRuns} />
        </div>
      </div>
    </PortalShell>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-ink/15 bg-white p-8 text-center text-xs sm:text-sm font-semibold text-ink/60">
      {label}
    </div>
  );
}
