"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type Result = { error?: string };

export function RefundActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const actions = status === "REQUESTED" ? ["APPROVED", "REJECTED"] : status === "APPROVED" || status === "FAILED" ? ["PROCESSING", "REJECTED"] : [];
  if (!actions.length) return null;

  async function transition(toState: string) {
    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/refunds/${id}/transition`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ toState, note }) });
      const result = await response.json() as Result;
      if (!response.ok) throw new Error(result.error ?? "Refund update failed");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Refund update failed");
    } finally {
      setPending(false);
    }
  }

  return <div className="mt-4"><label className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45">Finance note<input value={note} onChange={(event) => setNote(event.target.value)} minLength={5} maxLength={500} className="mt-2 w-full rounded-2xl border border-ink/10 bg-cream/35 px-4 py-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-coral" placeholder="Reason and reconciliation context" /></label><div className="mt-3 flex flex-wrap gap-2">{actions.map((action) => <button key={action} type="button" disabled={pending || note.trim().length < 5} onClick={() => transition(action)} className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-paper transition hover:bg-coral disabled:opacity-40">{action === "PROCESSING" ? "Send to Razorpay" : action.toLowerCase().replace(/^./, (letter) => letter.toUpperCase())}</button>)}</div>{error && <p role="alert" className="mt-2 text-xs font-semibold text-coral">{error}</p>}</div>;
}

export function PayoutActions({ id, status, reviewReady }: { id: string; status: string; reviewReady: boolean }) {
  const router = useRouter();
  const [providerRef, setProviderRef] = useState("");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const actions: Record<string, string[]> = { PENDING: ["APPROVED", "HELD", "CANCELLED"], APPROVED: ["PROCESSING", "HELD", "CANCELLED"], PROCESSING: ["PAID", "FAILED", "HELD"], HELD: ["PENDING", "APPROVED", "CANCELLED"], FAILED: ["PROCESSING", "HELD", "CANCELLED"] };
  const available = actions[status] ?? [];
  if (!available.length) return null;
  if (!reviewReady) return <p className="mt-4 rounded-2xl bg-saffron/15 p-3 text-sm font-semibold">Awaiting approved care report and closed booking. Finance actions remain locked.</p>;

  async function transition(toState: string) {
    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/payouts/${id}/transition`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ toState, providerRef: providerRef || undefined, note }) });
      const result = await response.json() as Result;
      if (!response.ok) throw new Error(result.error ?? "Payout update failed");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Payout update failed");
    } finally {
      setPending(false);
    }
  }

  return <div className="mt-4"><label className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45">Transfer reference<input value={providerRef} onChange={(event) => setProviderRef(event.target.value)} maxLength={200} className="mt-2 w-full rounded-2xl border border-ink/10 bg-cream/35 px-4 py-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-coral" placeholder="Required before marking paid" /></label><label className="mt-3 block text-xs font-bold uppercase tracking-[0.14em] text-ink/45">Finance decision note<input value={note} onChange={(event) => setNote(event.target.value)} minLength={5} maxLength={1000} className="mt-2 w-full rounded-2xl border border-ink/10 bg-cream/35 px-4 py-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-coral" placeholder="Required for the audit trail" /></label><div className="mt-3 flex flex-wrap gap-2">{available.map((action) => <button key={action} type="button" disabled={pending || note.trim().length < 5 || (action === "PAID" && providerRef.trim().length < 3)} onClick={() => transition(action)} className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-paper transition hover:bg-coral disabled:opacity-40">{action.toLowerCase().replace(/^./, (letter) => letter.toUpperCase())}</button>)}</div>{error && <p role="alert" className="mt-2 text-xs font-semibold text-coral">{error}</p>}</div>;
}

type ReconciliationRun = { id: string; provider: string; periodStart: string; periodEnd: string; status: string; expected: Totals | null; actual: Totals | null; differences: Totals | null };
type Totals = { capturedPaise: number; refundedPaise: number; paidOutPaise: number; netCashPaise: number };

export function ReconciliationPanel({ runs }: { runs: ReconciliationRun[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); setPending(true); setError(null);
    const start = new Date(String(form.get("periodStart"))); const end = new Date(String(form.get("periodEnd")));
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) { setPending(false); return setError("Choose a valid start and end time."); }
    const response = await fetch("/api/admin/reconciliation-runs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provider: "razorpay", periodStart: start.toISOString(), periodEnd: end.toISOString() }) });
    const result = await response.json().catch(() => null) as { message?: string; error?: string } | null; setPending(false);
    if (!response.ok) return setError(result?.message ?? result?.error ?? "Reconciliation run could not be created.");
    event.currentTarget.reset(); router.refresh();
  }
  return <section className="mt-12"><div className="grid gap-6 xl:grid-cols-[22rem_1fr]"><form onSubmit={create} className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted"><p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo">Statement period</p><h2 className="mt-3 font-display text-3xl font-semibold">Snapshot expected totals</h2><p className="mt-2 text-sm leading-6 text-ink/55">Use half-open periods: the start is included and the end is excluded.</p><FinanceInput name="periodStart" label="Period start" type="datetime-local" required /><FinanceInput name="periodEnd" label="Period end" type="datetime-local" required /><button type="submit" disabled={pending} className="mt-5 rounded-full bg-ink px-5 py-3 text-sm font-bold text-paper disabled:opacity-45">{pending ? "Creating…" : "Create Razorpay run"}</button>{error && <p className="mt-3 text-sm font-semibold text-coral" role="alert">{error}</p>}</form><div><h2 className="font-display text-3xl font-semibold">Reconciliation history</h2><div className="mt-4 grid gap-4">{runs.length ? runs.map((run) => <ReconciliationCard key={run.id} run={run} />) : <div className="rounded-4xl border border-dashed border-ink/15 bg-paper/50 p-8 text-center text-sm font-semibold text-ink/45">No provider period has been reconciled.</div>}</div></div></div></section>;
}

function ReconciliationCard({ run }: { run: ReconciliationRun }) {
  const router = useRouter(); const [pending, setPending] = useState(false); const [error, setError] = useState<string | null>(null);
  async function complete(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); setPending(true); setError(null); const response = await fetch(`/api/admin/reconciliation-runs/${run.id}/complete`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ capturedPaise: rupeesToPaise(form.get("captured")), refundedPaise: rupeesToPaise(form.get("refunded")), paidOutPaise: rupeesToPaise(form.get("paidOut")), note: form.get("note") }) }); const result = await response.json().catch(() => null) as { message?: string; error?: string } | null; setPending(false); if (!response.ok) return setError(result?.message ?? result?.error ?? "Reconciliation could not be completed."); router.refresh(); }
  const open = run.status === "QUEUED" || run.status === "RUNNING";
  return <article className="rounded-4xl border border-ink/10 bg-paper p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/45">{run.provider} · {new Date(run.periodStart).toLocaleString("en-IN")} → {new Date(run.periodEnd).toLocaleString("en-IN")}</p><h3 className="mt-2 font-display text-2xl font-semibold">Expected net {money(run.expected?.netCashPaise ?? 0)}</h3></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${run.status === "SUCCEEDED" ? "bg-leaf/10 text-leaf" : run.status === "FAILED" ? "bg-coral/10 text-coral" : "bg-saffron/20 text-ink"}`}>{run.status}</span></div><TotalsRow label="Expected" totals={run.expected} />{run.actual && <TotalsRow label="Provider statement" totals={run.actual} />}{run.differences && <TotalsRow label="Difference" totals={run.differences} />}{open && <form onSubmit={complete} className="mt-5 grid gap-3 rounded-3xl bg-cream/40 p-4 sm:grid-cols-3"><FinanceInput name="captured" label="Captured (₹)" type="number" min="0" step="0.01" required /><FinanceInput name="refunded" label="Refunded (₹)" type="number" min="0" step="0.01" required /><FinanceInput name="paidOut" label="Paid out (₹)" type="number" min="0" step="0.01" required /><div className="sm:col-span-3"><FinanceInput name="note" label="Statement reference / review note" minLength={5} required /></div><button type="submit" disabled={pending} className="w-fit rounded-full bg-indigo px-5 py-3 text-sm font-bold text-paper disabled:opacity-45">{pending ? "Comparing…" : "Compare and finalize"}</button>{error && <p className="text-sm font-semibold text-coral sm:col-span-3" role="alert">{error}</p>}</form>}</article>;
}

function TotalsRow({ label, totals }: { label: string; totals: Totals | null }) { if (!totals) return null; return <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-ink/8 p-3 text-sm md:grid-cols-5"><strong>{label}</strong><span>Captured {money(totals.capturedPaise)}</span><span>Refunded {money(totals.refundedPaise)}</span><span>Paid {money(totals.paidOutPaise)}</span><span>Net {money(totals.netCashPaise)}</span></div>; }
function FinanceInput(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) { const { label, ...rest } = props; return <label className="mt-4 block text-xs font-bold uppercase tracking-[0.12em] text-ink/45">{label}<input {...rest} className="mt-2 min-h-11 w-full rounded-xl border border-ink/12 bg-paper px-3 py-2 text-sm font-normal normal-case tracking-normal outline-none focus:border-indigo" /></label>; }
function rupeesToPaise(value: FormDataEntryValue | null) { return Math.round(Number(value) * 100); }
function money(paise: number) { const sign = paise < 0 ? "−" : ""; return `${sign}₹${(Math.abs(paise) / 100).toLocaleString("en-IN")}`; }
