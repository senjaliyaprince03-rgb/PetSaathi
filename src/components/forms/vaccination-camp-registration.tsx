"use client";

import { CheckCircle2, LoaderCircle, Send, Syringe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type Pet = { id: string; name: string };

export function VaccinationCampRegistration({ pets }: { pets: Pet[] }) {
  const router = useRouter();
  const [petId, setPetId] = useState("");
  const [previousVaccine, setPreviousVaccine] = useState("");
  const [lastVaccineDate, setLastVaccineDate] = useState("");
  const [healthConditions, setHealthConditions] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  async function submit() {
    if (!consent) {
      setMessage({ tone: "error", text: "You must confirm your pet is healthy." });
      return;
    }
    setPending(true);
    setMessage(null);
    
    const response = await fetch("/api/customer/vaccinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        petId, 
        previousVaccine: previousVaccine || undefined,
        lastVaccineDate: lastVaccineDate || undefined,
        healthConditions: healthConditions || undefined,
        emergencyContact,
        consent 
      })
    });
    
    const result = await response.json() as { error?: string; message?: string };
    setPending(false);
    
    if (!response.ok) return setMessage({ tone: "error", text: result.message ?? result.error ?? "Registration failed." });
    
    setMessage({ tone: "success", text: "Successfully registered for vaccination." });
    setPetId("");
    setPreviousVaccine("");
    setLastVaccineDate("");
    setHealthConditions("");
    setEmergencyContact("");
    setConsent(false);
    router.refresh();
  }

  return (
    <section className="mt-7 overflow-hidden rounded-[1.75rem] bg-[#281d2b] text-paper shadow-soft">
      <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
        <div className="relative overflow-hidden border-b border-paper/10 p-6 lg:border-b-0 lg:border-r">
          <div className="absolute -left-14 -top-14 h-48 w-48 rounded-full bg-leaf/40 blur-3xl" />
          <div className="relative">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf text-paper">
              <Syringe className="h-5 w-5" />
            </span>
            <p className="mt-8 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-leaf">Preventive Care</p>
            <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">Vaccination Registration</h3>
            <p className="mt-3 text-sm leading-6 text-paper/80">Register your pet for upcoming vaccination camps securely and easily.</p>
          </div>
        </div>
        
        <div className="bg-paper p-6 text-ink sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Pet">
                <select value={petId} onChange={(e) => setPetId(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10">
                  <option value="">Select a pet</option>
                  {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </Field>
            </div>
            
            <Field label="Previous Vaccine (optional)">
              <input type="text" value={previousVaccine} onChange={(e) => setPreviousVaccine(e.target.value)} placeholder="e.g. DHPPi, Rabies" className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
            </Field>
            
            <Field label="Last Vaccine Date (optional)">
              <input type="date" value={lastVaccineDate} onChange={(e) => setLastVaccineDate(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Emergency Contact">
                <input type="tel" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} placeholder="Phone number" className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Health Conditions / Allergies (optional)">
                <textarea value={healthConditions} onChange={(e) => setHealthConditions(e.target.value)} className="mt-2 min-h-24 w-full resize-y rounded-2xl border border-ink/12 bg-cream/45 p-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" placeholder="List any known conditions..." />
              </Field>
            </div>

            <div className="sm:col-span-2 mt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 shrink-0 h-4 w-4 rounded border-ink/20 text-indigo focus:ring-indigo" />
                <span className="text-sm text-ink/80">I confirm my pet is healthy enough for vaccination and is not currently showing signs of illness.</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Button variant="accent" onClick={submit} disabled={pending || !petId || !emergencyContact || !consent}>
              {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Register
            </Button>
            {message && (
              <span className={`text-sm font-semibold ${message.tone === 'success' ? 'text-leaf' : 'text-coral'}`}>
                {message.text}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold">{label}{children}</label>;
}
