"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Headphones, LoaderCircle, Send } from "lucide-react";

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
    const response = await fetch("/api/support-cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, priority, subject, description })
    });
    const result = await response.json() as { error?: string };
    setPending(false);
    if (!response.ok) return setError(result.error === "too_many_requests" ? "Daily support request limit reached. For an immediate safety emergency, use the emergency instructions." : "The support case could not be recorded. Check the details and try again.");
    setSubject("");
    setDescription("");
    router.refresh();
  }

  return (
    <section className="rounded-4xl border border-ink/10 bg-paper p-6">
      <Headphones className="h-7 w-7 text-indigo" />
      <h2 className="mt-4 font-display text-3xl font-semibold">Ask the support team</h2>
      <p className="mt-2 text-sm leading-6 text-ink/65">This creates a traceable case. It is not an emergency channel.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold">Category<select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/15 bg-cream/35 px-4 font-normal"><option value="ACCOUNT">Account</option><option value="BOOKING">Booking</option><option value="PAYMENT">Payment</option><option value="SAFETY">Safety follow-up</option><option value="TECHNICAL">Technical</option><option value="OTHER">Other</option></select></label>
        <label className="text-sm font-semibold">Priority<select value={priority} onChange={(event) => setPriority(event.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/15 bg-cream/35 px-4 font-normal"><option value="LOW">Standard</option><option value="MODERATE">Important</option><option value="HIGH">Urgent follow-up</option></select></label>
      </div>
      <label className="mt-3 block text-sm font-semibold">Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} minLength={5} maxLength={120} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/15 bg-cream/35 px-4 font-normal" placeholder="What do you need help with?" /></label>
      <label className="mt-3 block text-sm font-semibold">Details<textarea value={description} onChange={(event) => setDescription(event.target.value)} minLength={20} maxLength={3000} className="mt-2 min-h-36 w-full rounded-2xl border border-ink/15 bg-cream/35 p-4 font-normal" placeholder="Include the relevant dates and what outcome would help." /></label>
      <Button type="button" variant="accent" className="mt-4" onClick={submit} disabled={pending || subject.trim().length < 5 || description.trim().length < 20}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Create case</Button>
      {error && <p role="alert" className="mt-3 text-sm font-semibold text-coral">{error}</p>}
    </section>
  );
}
