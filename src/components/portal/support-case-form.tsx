"use client";

import { Headphones, LoaderCircle, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function SupportCaseForm() {
  const router = useRouter();
  const [category, setCategory] = useState("ACCOUNT");
  const [priority, setPriority] = useState("LOW");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setPending(true);
    setError(null);
    const response = await fetch("/api/support-cases", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ category, priority, subject, description }) });
    const result = await response.json() as { error?: string };
    setPending(false);
    if (!response.ok) return setError(result.error === "too_many_requests" ? "Daily support request limit reached. For an immediate safety emergency, use the emergency instructions." : "The support case could not be recorded. Check the details and try again.");
    setSubject("");
    setDescription("");
    router.refresh();
  }

  return (
    <section className="rounded-[1.75rem] border border-ink/[0.07] bg-paper p-5 shadow-[0_18px_55px_-42px_rgb(var(--ink)/0.35)] sm:p-6">
      <div className="flex items-start justify-between gap-4"><div><p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-coral">New support case</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em]">Tell us what outcome would help.</h2><p className="mt-2 text-sm leading-6 text-ink/50">Relevant dates and references help the team respond without asking you to repeat context.</p></div><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo/10 text-indigo"><Headphones className="h-5 w-5" /></span></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Category"><select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/40 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10"><option value="ACCOUNT">Account</option><option value="BOOKING">Booking</option><option value="PAYMENT">Payment</option><option value="SAFETY">Safety follow-up</option><option value="TECHNICAL">Technical</option><option value="OTHER">Other</option></select></Field>
        <Field label="Priority"><select value={priority} onChange={(event) => setPriority(event.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/40 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10"><option value="LOW">Standard</option><option value="MODERATE">Important</option><option value="HIGH">Urgent follow-up</option></select></Field>
        <div className="sm:col-span-2"><Field label="Subject"><input value={subject} onChange={(event) => setSubject(event.target.value)} minLength={5} maxLength={120} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/40 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" placeholder="What do you need help with?" /></Field></div>
        <div className="sm:col-span-2"><Field label="Details"><textarea value={description} onChange={(event) => setDescription(event.target.value)} minLength={20} maxLength={3000} className="mt-2 min-h-36 w-full resize-y rounded-2xl border border-ink/12 bg-cream/40 p-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" placeholder="Include the relevant dates, references and the outcome you need." /></Field></div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4"><Button type="button" variant="accent" onClick={submit} disabled={pending || subject.trim().length < 5 || description.trim().length < 20}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Create case</Button><p className="text-xs text-ink/40">Minimum 20 characters of useful context.</p></div>
      {error ? <p role="alert" className="mt-4 rounded-2xl bg-coral/10 p-4 text-sm font-semibold text-coral">{error}</p> : null}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold">{label}{children}</label>;
}
