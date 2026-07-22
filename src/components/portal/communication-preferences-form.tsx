"use client";

import { useState } from "react";
import { BellRing, Check, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type Preferences = { emailCare: boolean; whatsappCare: boolean; pushCare: boolean };

export function CommunicationPreferencesForm({ initial }: { initial: Preferences }) {
  const [preferences, setPreferences] = useState(initial);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function save() {
    setPending(true);
    setMessage(null);
    const response = await fetch("/api/communication-preferences", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(preferences) });
    setPending(false);
    setMessage(response.ok ? "Preferences saved." : "Preferences could not be saved. Try again.");
  }

  return <section className="rounded-4xl border border-ink/10 bg-paper p-6"><BellRing className="h-7 w-7 text-indigo" /><h2 className="mt-4 font-display text-3xl font-semibold">Care update channels</h2><p className="mt-2 text-sm leading-6 text-ink/70">In-app safety and booking notices remain enabled. Choose where else operational updates may reach you.</p><div className="mt-6 grid gap-3"><Preference label="Email care updates" description="Booking confirmations, reminders and care-report availability." checked={preferences.emailCare} onChange={(emailCare) => setPreferences((current) => ({ ...current, emailCare }))} /><Preference label="WhatsApp care updates" description="Used only after the approved WhatsApp provider is configured." checked={preferences.whatsappCare} onChange={(whatsappCare) => setPreferences((current) => ({ ...current, whatsappCare }))} /><Preference label="Push care updates" description="Available after you explicitly enable browser or app notifications." checked={preferences.pushCare} onChange={(pushCare) => setPreferences((current) => ({ ...current, pushCare }))} /><div className="flex items-center justify-between gap-4 rounded-2xl border border-leaf/20 bg-leaf/8 p-4"><div><p className="font-semibold">In-app essential updates</p><p className="mt-1 text-xs leading-5 text-ink/65">Required for active bookings, safety and account security.</p></div><span className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf text-paper"><Check className="h-4 w-4" /></span></div></div><Button type="button" variant="accent" className="mt-5" disabled={pending} onClick={save}>{pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Save preferences</Button>{message && <p aria-live="polite" className="mt-3 text-sm font-semibold text-ink/70">{message}</p>}<div className="mt-6 rounded-2xl bg-saffron/10 p-4 text-xs leading-5 text-ink/70"><strong>Marketing remains off.</strong> Promotional preferences will not be exposed until the final consent policy, sender identity and withdrawal workflow are approved.</div></section>;
}

function Preference({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-cream/35 p-4"><span><span className="block font-semibold">{label}</span><span className="mt-1 block text-xs leading-5 text-ink/65">{description}</span></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 shrink-0 accent-indigo" /></label>;
}
