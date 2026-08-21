"use client";

import { LoaderCircle, Send, Stethoscope, AlertTriangle, Info, CalendarPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type Pet = { id: string; name: string };

export function VetTriageForm({ pets }: { pets: Pet[] }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [urgency, setUrgency] = useState<"RED" | "AMBER" | "GREEN" | "">("");
  const [petId, setPetId] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [consultationMode, setConsultationMode] = useState<"ONLINE" | "HOME_VISIT" | "CLINIC_REFERRAL" | "">("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  async function submit() {
    setPending(true);
    setMessage(null);
    const response = await fetch("/api/customer/vet", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ petId, urgency, symptoms, consultationMode, scheduledAt: scheduledAt || undefined }) 
    });
    const result = await response.json() as { error?: string; message?: string };
    setPending(false);
    if (!response.ok) return setMessage({ tone: "error", text: result.message ?? result.error ?? "Failed to create consultation request." });
    
    setMessage({ tone: "success", text: "Consultation request submitted successfully." });
    router.refresh();
    
    // Reset form
    setTimeout(() => {
      setStep(1);
      setUrgency("");
      setPetId("");
      setSymptoms("");
      setConsultationMode("");
      setScheduledAt("");
      setMessage(null);
    }, 3000);
  }

  return (
    <section className="mt-7 overflow-hidden rounded-[1.75rem] bg-[#281d2b] text-paper shadow-soft">
      <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
        <div className="relative overflow-hidden border-b border-paper/10 p-6 lg:border-b-0 lg:border-r">
          <div className="absolute -left-14 -top-14 h-48 w-48 rounded-full bg-indigo/40 blur-3xl" />
          <div className="relative">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron text-ink">
              <Stethoscope className="h-5 w-5" />
            </span>
            <p className="mt-8 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-saffron">Veterinary Support</p>
            <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">Book a consultation.</h3>
            <p className="mt-3 text-sm leading-6 text-paper/80">Expert veterinary care tailored for your pet. We assess urgency to connect you with the right support.</p>
          </div>
        </div>
        
        <div className="bg-paper p-6 text-ink sm:p-7">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
              <h4 className="font-semibold text-lg">Step 1: Triage Assessment</h4>
              <p className="text-sm text-ink/80 mb-4">Please select the condition that best describes your pet&apos;s current situation.</p>
              
              <button onClick={() => setUrgency("RED")} className={`w-full text-left p-4 rounded-2xl border transition-all ${urgency === "RED" ? "border-coral bg-coral/10 ring-2 ring-coral/20" : "border-ink/10 hover:border-coral/50"}`}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-coral shrink-0" />
                  <span className="font-bold text-coral">Emergency (RED)</span>
                </div>
                <p className="text-xs mt-2 text-ink/80">Collapse, breathing difficulty, seizures, poisoning, severe bleeding.</p>
              </button>
              
              {urgency === "RED" && (
                <div className="mt-4 p-4 bg-coral/10 border border-coral/20 rounded-xl text-coral">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">This is NOT an emergency service.</p>
                      <p className="text-xs mt-1">Please call or go to your nearest emergency vet clinic immediately. Do not wait for an online booking.</p>
                    </div>
                  </div>
                </div>
              )}

              <button onClick={() => setUrgency("AMBER")} className={`w-full text-left p-4 rounded-2xl border transition-all ${urgency === "AMBER" ? "border-saffron bg-saffron/10 ring-2 ring-saffron/20" : "border-ink/10 hover:border-saffron/50"}`}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-saffron shrink-0" />
                  <span className="font-bold text-[#7a5814]">Urgent (AMBER)</span>
                </div>
                <p className="text-xs mt-2 text-ink/80">Repeated vomiting, persistent diarrhoea, wound/swelling, eye injury, sudden limping.</p>
              </button>

              <button onClick={() => setUrgency("GREEN")} className={`w-full text-left p-4 rounded-2xl border transition-all ${urgency === "GREEN" ? "border-leaf bg-leaf/10 ring-2 ring-leaf/20" : "border-ink/10 hover:border-leaf/50"}`}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-leaf shrink-0" />
                  <span className="font-bold text-leaf">Routine (GREEN)</span>
                </div>
                <p className="text-xs mt-2 text-ink/80">Vaccination planning, preventive care, nutrition, skin/coat observations.</p>
              </button>

              <div className="mt-6 flex justify-end">
                <Button variant="accent" onClick={() => setStep(2)} disabled={!urgency || urgency === "RED"}>
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h4 className="font-semibold text-lg">Step 2: Select Pet</h4>
              <Field label="Which pet needs a consultation?">
                <select value={petId} onChange={(e) => setPetId(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10">
                  <option value="">Choose a pet</option>
                  {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </Field>
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button variant="accent" onClick={() => setStep(3)} disabled={!petId}>Next Step</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h4 className="font-semibold text-lg">Step 3: Details & Mode</h4>
              <Field label="Describe the symptoms or reason for visit">
                <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} className="mt-2 min-h-24 w-full resize-y rounded-2xl border border-ink/12 bg-cream/45 p-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" placeholder="Please provide specific details..." />
              </Field>

              <Field label="Consultation Mode">
                <select value={consultationMode} onChange={(e) => setConsultationMode(e.target.value as any)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10">
                  <option value="">Select mode</option>
                  <option value="ONLINE">Online Video Consultation</option>
                  <option value="HOME_VISIT">Home Visit</option>
                  <option value="CLINIC_REFERRAL">Clinic Referral</option>
                </select>
              </Field>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button variant="accent" onClick={() => setStep(4)} disabled={!symptoms || !consultationMode}>Next Step</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h4 className="font-semibold text-lg">Step 4: Schedule</h4>
              <Field label="Preferred time (optional)">
                <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
              </Field>

              {urgency === "AMBER" && (
                <div className="mt-4 p-3 bg-saffron/10 border border-saffron/20 rounded-xl text-saffron/90 flex gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="text-xs">As this is an urgent request, a partner vet will try to accommodate a same-day booking.</p>
                </div>
              )}

              <div className="mt-6 flex justify-between items-center">
                <Button variant="outline" type="button" onClick={() => setStep(3)} disabled={pending}>Back</Button>
                <div className="flex items-center gap-3">
                  {message && <span className={`text-xs font-semibold ${message.tone === 'success' ? 'text-leaf' : 'text-coral'}`}>{message.text}</span>}
                  <Button variant="accent" onClick={submit} disabled={pending}>
                    {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Submit Request
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold">{label}{children}</label>;
}
