"use client";

import { Download, FilePenLine, LoaderCircle, Send, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const requestTypes = [
  { value: "CORRECTION", label: "Correct data", copy: "Fix inaccurate account information.", icon: FilePenLine },
  { value: "EXPORT", label: "Export data", copy: "Request a reviewed copy of your data.", icon: Download },
  { value: "DELETION", label: "Delete account", copy: "Start a verified deletion review.", icon: Trash2 },
] as const;

export function PrivacyRequestForm() {
  const router = useRouter();
  const [type, setType] = useState<(typeof requestTypes)[number]["value"]>("CORRECTION");
  const [details, setDetails] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setPending(true);
    setError(null);
    const response = await fetch("/api/account-requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, details }) });
    const result = await response.json() as { error?: string; reference?: string };
    setPending(false);
    if (!response.ok) return setError(result.error === "request_already_open" ? `A request is already open${result.reference ? ` (${result.reference})` : ""}.` : "The request could not be recorded. Check the details and try again.");
    setDetails("");
    router.refresh();
  }

  return (
    <section className="rounded-[1.75rem] border border-ink/[0.07] bg-paper p-5 shadow-[0_18px_55px_-42px_rgb(var(--ink)/0.35)] sm:p-6">
      <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-coral">New privacy request</p>
      <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em]">Choose the right request path.</h2>
      <p className="mt-2 text-sm leading-6 text-ink/50">Recording a request never exports or deletes protected data without identity verification and review.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Privacy request type">{requestTypes.map((item) => { const active = type === item.value; const Icon = item.icon; return <button key={item.value} type="button" role="radio" aria-checked={active} onClick={() => setType(item.value)} className={`rounded-[1.35rem] border p-4 text-left transition ${active ? "border-indigo/25 bg-indigo/[0.055] shadow-sm" : "border-ink/[0.07] bg-cream/30 hover:bg-cream/55"}`}><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? "bg-indigo text-paper" : "bg-paper text-ink/35"}`}><Icon className="h-4 w-4" /></span><span className="mt-4 block text-sm font-bold">{item.label}</span><span className="mt-1 block text-xs leading-5 text-ink/45">{item.copy}</span></button>; })}</div>
      <label className="mt-5 block text-sm font-semibold">Request details<textarea value={details} onChange={(event) => setDetails(event.target.value)} minLength={20} maxLength={2000} className="mt-2 min-h-36 w-full resize-y rounded-2xl border border-ink/12 bg-cream/35 p-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" placeholder="Describe the records or account scope involved." /></label>
      <div className="mt-5 flex flex-wrap items-center gap-4"><Button type="button" variant="accent" onClick={submit} disabled={pending || details.trim().length < 20}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Record request</Button><p className="text-xs text-ink/40">Identity review follows submission.</p></div>
      {error ? <p role="alert" className="mt-4 rounded-2xl bg-coral/10 p-4 text-sm font-semibold text-coral">{error}</p> : null}
    </section>
  );
}
