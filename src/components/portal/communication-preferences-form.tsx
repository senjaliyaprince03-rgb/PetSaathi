"use client";

import { BellRing, Check, LoaderCircle, Mail, MessageCircleMore, ShieldCheck, Smartphone } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type Preferences = { emailCare: boolean; whatsappCare: boolean; pushCare: boolean };

export function CommunicationPreferencesForm({ initial }: { initial: Preferences }) {
  const [preferences, setPreferences] = useState(initial);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  async function save() {
    setPending(true);
    setMessage(null);
    const response = await fetch("/api/communication-preferences", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(preferences) });
    setPending(false);
    setMessage(response.ok ? { tone: "success", text: "Communication preferences saved." } : { tone: "error", text: "Preferences could not be saved. Try again." });
  }

  return (
    <section className="rounded-[1.75rem] border border-ink/[0.07] bg-paper p-5 shadow-[0_18px_55px_-42px_rgb(var(--ink)/0.35)] sm:p-6">
      <div className="flex items-start justify-between gap-5"><div><p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-coral">Optional delivery channels</p><h3 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em]">Choose how care finds you.</h3><p className="mt-2 text-sm leading-6 text-ink/50">The official in-app record remains available regardless of these choices.</p></div><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo/10 text-indigo"><BellRing className="h-5 w-5" /></span></div>
      <div className="mt-6 grid gap-3">
        <Preference icon={Mail} label="Email care updates" description="Booking confirmations, reminders and care-report availability." checked={preferences.emailCare} onChange={(emailCare) => setPreferences((current) => ({ ...current, emailCare }))} />
        <Preference icon={MessageCircleMore} label="WhatsApp care updates" description="Used only after the approved WhatsApp provider is configured." checked={preferences.whatsappCare} onChange={(whatsappCare) => setPreferences((current) => ({ ...current, whatsappCare }))} />
        <Preference icon={Smartphone} label="Push care updates" description="Available after browser or app notification permission is granted." checked={preferences.pushCare} onChange={(pushCare) => setPreferences((current) => ({ ...current, pushCare }))} />
        <div className="flex items-center justify-between gap-4 rounded-[1.35rem] border border-leaf/15 bg-leaf/[0.06] p-4"><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-leaf/10 text-leaf"><ShieldCheck className="h-4 w-4" /></span><div><p className="font-bold">In-app essential updates</p><p className="mt-1 text-xs leading-5 text-ink/48">Always enabled for bookings, safety and account security.</p></div></div><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf text-paper"><Check className="h-4 w-4" /></span></div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4"><Button type="button" variant="accent" disabled={pending} onClick={save}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Save preferences</Button>{message ? <p aria-live="polite" className={`text-sm font-semibold ${message.tone === "success" ? "text-leaf" : "text-coral"}`}>{message.text}</p> : null}</div>
    </section>
  );
}

function Preference({ icon: Icon, label, description, checked, onChange }: { icon: typeof Mail; label: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className={`group flex cursor-pointer items-center justify-between gap-4 rounded-[1.35rem] border p-4 transition ${checked ? "border-indigo/20 bg-indigo/[0.045]" : "border-ink/[0.07] bg-cream/30 hover:bg-cream/55"}`}><span className="flex items-start gap-3"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition ${checked ? "bg-indigo text-paper" : "bg-paper text-ink/35 shadow-sm"}`}><Icon className="h-4 w-4" /></span><span><span className="block font-bold">{label}</span><span className="mt-1 block text-xs leading-5 text-ink/48">{description}</span></span></span><span className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-indigo" : "bg-ink/10"}`}><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="sr-only" /><span className={`absolute top-1 h-5 w-5 rounded-full bg-paper shadow-sm transition ${checked ? "left-6" : "left-1"}`} /></span></label>;
}
