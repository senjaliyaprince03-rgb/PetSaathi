"use client";

import { useState } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

const topics = [
  ["BOOKING_HELP", "Booking help"],
  ["SITTER_INTEREST", "Saathi application"],
  ["SOCIETY", "Society partnership"],
  ["PARTNER", "Service partnership"],
  ["SAFETY", "Safety concern"],
  ["GENERAL", "Other"]
] as const;

export function ContactForm({ defaultTopic = "GENERAL" }: { defaultTopic?: string }) {
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState(topics.some(([value]) => value === defaultTopic) ? defaultTopic : "GENERAL");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: topic, name: data.get("name"), email: data.get("email"), phone: data.get("phone"), organisationName: data.get("organisationName"), locality: data.get("locality"), message: data.get("message"), consentToContact: data.get("consentToContact") === "on" }) });
    const result = await response.json() as { error?: string };
    setPending(false);
    if (!response.ok) return setError(result.error === "lead_capture_not_configured" ? "The form is ready, but secure enquiry storage requires the production database connection." : result.error === "too_many_requests" ? "Too many enquiries were submitted from this connection. Please try again later." : "Check the required fields and add a valid email or Indian mobile number.");
    setSent(true);
  }

  if (sent) return <div className="glass-panel mx-auto max-w-2xl rounded-5xl p-10 text-center"><CheckCircle2 className="mx-auto h-11 w-11 text-leaf" /><h2 className="mt-5 font-display text-4xl font-semibold">Your enquiry is recorded.</h2><p className="mt-3 leading-7 text-ink/55">An authorised team member can now review it in the qualification queue.</p></div>;
  return <form onSubmit={submit} className="glass-panel mx-auto max-w-2xl rounded-5xl p-7 sm:p-10"><div className="grid gap-5 sm:grid-cols-2"><Field label="Name" name="name" required /><Field label="Email" name="email" type="email" /><Field label="Indian mobile" name="phone" inputMode="numeric" maxLength={10} /><Field label="Society or organisation" name="organisationName" required={topic === "SOCIETY"} /><Field label="Locality" name="locality" /></div><label className="mt-5 block"><span className="mb-2 block text-sm font-semibold">Topic</span><select value={topic} onChange={(event) => setTopic(event.target.value)} className="min-h-13 w-full rounded-2xl border border-ink/15 bg-paper/80 px-4 outline-none focus:border-indigo">{topics.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="mt-5 block"><span className="mb-2 block text-sm font-semibold">Message</span><textarea name="message" required minLength={20} maxLength={2000} className="min-h-36 w-full rounded-2xl border border-ink/15 bg-paper/80 p-4 outline-none focus:border-indigo" placeholder="Share the context, preferred next step and any timing constraints." /></label><label className="mt-5 flex items-start gap-3 text-sm leading-6"><input name="consentToContact" type="checkbox" required className="mt-1 accent-indigo" />I consent to PetSaathi contacting me about this enquiry. This is not marketing consent.</label><Button type="submit" variant="accent" size="lg" className="mt-6" disabled={pending}>{pending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}Submit securely</Button>{error && <p className="mt-4 rounded-2xl bg-coral/10 p-4 text-sm font-semibold text-coral" role="alert">{error}</p>}</form>;
}

function Field({ label, name, type = "text", required = false, inputMode, maxLength }: { label: string; name: string; type?: string; required?: boolean; inputMode?: "numeric"; maxLength?: number }) { return <label><span className="mb-2 block text-sm font-semibold">{label}</span><input name={name} type={type} required={required} inputMode={inputMode} maxLength={maxLength} className="min-h-13 w-full rounded-2xl border border-ink/15 bg-paper/80 px-4 outline-none focus:border-indigo" /></label>; }
