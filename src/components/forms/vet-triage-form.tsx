"use client";

import { AlertTriangle, CalendarPlus, CheckCircle2, ChevronRight, HeartPulse, LoaderCircle, Send, ShieldAlert, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type Pet = { id: string; name: string };

const TRIAGE_LEVELS = [
  { id: "RED", label: "Emergency", icon: "🔴", color: "border-red-400 bg-red-50", textColor: "text-red-700", examples: "Collapse, breathing difficulty, seizures, poisoning, severe bleeding, unconsciousness" },
  { id: "AMBER", label: "Urgent — same day", icon: "🟡", color: "border-saffron/40 bg-saffron/10", textColor: "text-saffron", examples: "Repeated vomiting, persistent diarrhoea, wound/swelling, eye injury, sudden limping" },
  { id: "GREEN", label: "Routine", icon: "🟢", color: "border-leaf/40 bg-leaf/10", textColor: "text-leaf", examples: "Vaccination planning, preventive care, nutrition, skin/coat observations, follow-up" },
] as const;

const CONSULTATION_MODES = [
  { id: "ONLINE", label: "Online Consultation", description: "Video/chat with a licensed veterinarian" },
  { id: "HOME_VISIT", label: "Home Visit", description: "Vet visits your home for examination" },
  { id: "CLINIC_REFERRAL", label: "Clinic Referral", description: "We'll book you at a partner clinic" },
] as const;

export function VetTriageForm({ pets }: { pets: Pet[] }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [urgency, setUrgency] = useState("");
  const [petId, setPetId] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [consultationMode, setConsultationMode] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  async function submit() {
    setPending(true);
    setMessage(null);
    const response = await fetch("/api/customer/vet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ petId, urgency, symptoms, consultationMode, scheduledAt: scheduledAt || undefined }),
    });
    const result = await response.json() as { error?: string; message?: string };
    setPending(false);
    if (!response.ok) return setMessage({ tone: "error", text: result.message ?? result.error ?? "Request could not be recorded." });
    setStep(1);
    setUrgency("");
    setMessage({ tone: "success", text: "Vet consultation request submitted." });
    router.refresh();
  }

  return (
    <section className="mt-7 overflow-hidden rounded-[1.75rem] bg-[#281d2b] text-paper shadow-soft">
      <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
        <div className="relative overflow-hidden border-b border-paper/10 p-6 lg:border-b-0 lg:border-r">
          <div className="absolute -left-14 -top-14 h-48 w-48 rounded-full bg-leaf/30 blur-3xl" />
          <div className="relative">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf text-paper"><Stethoscope className="h-5 w-5" /></span>
            <p className="mt-8 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-leaf">Veterinary support</p>
            <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">Licensed vet care, coordinated for you.</h3>
            <p className="mt-3 text-sm leading-6 text-paper/55">PetSaathi coordinates with verified veterinary partners. We do not diagnose or replace emergency services.</p>
            <div className="mt-7 grid gap-3">
              <Rule icon={ShieldAlert} text="Licensed & registered vets only" />
              <Rule icon={HeartPulse} text="Triage-guided booking" />
              <Rule icon={CheckCircle2} text="Medical records stored securely" />
            </div>
          </div>
        </div>

        <div className="bg-paper p-6 text-ink sm:p-7">
          {step === 1 && (
            <div>
              <StepTitle>How urgent is this?</StepTitle>
              <p className="mt-2 text-sm text-ink/50">Select the urgency level to help us route your request correctly.</p>
              <div className="mt-5 grid gap-3">
                {TRIAGE_LEVELS.map((level) => (
                  <button key={level.id} type="button" onClick={() => { setUrgency(level.id); if (level.id === "RED") { setStep(0); } else { setStep(2); } }} className={`rounded-2xl border p-5 text-left transition hover:shadow-sm ${level.color}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{level.icon}</span>
                      <div>
                        <p className={`font-bold ${level.textColor}`}>{level.label}</p>
                        <p className="mt-1 text-xs text-ink/50">{level.examples}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 0 && (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100"><AlertTriangle className="h-8 w-8 text-red-600" /></div>
              <h3 className="mt-5 font-display text-2xl font-bold text-red-700">This is NOT an emergency service</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-ink/60">If your pet is experiencing a life-threatening emergency, please go to your nearest veterinary emergency clinic immediately. Do not wait for an online consultation.</p>
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-bold text-red-700">Emergency vet contacts:</p>
                <p className="mt-1 text-xs text-red-600">Call your local veterinary emergency hospital or dial your city&apos;s animal emergency helpline.</p>
              </div>
              <Button type="button" variant="ghost" onClick={() => { setStep(1); setUrgency(""); }} className="mt-6">← Go back and select a different urgency</Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <StepTitle>Which pet needs attention?</StepTitle>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {pets.map((pet) => (
                  <button key={pet.id} type="button" onClick={() => { setPetId(pet.id); setStep(3); }} className={`rounded-2xl border p-4 text-left transition hover:border-indigo/30 ${petId === pet.id ? "border-indigo bg-indigo/5" : "border-ink/10"}`}>
                    <p className="font-semibold">{pet.name}</p>
                  </button>
                ))}
              </div>
              <div className="mt-5"><Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button></div>
            </div>
          )}

          {step === 3 && (
            <div>
              <StepTitle>Describe symptoms & choose consultation mode</StepTitle>
              <div className="mt-5 grid gap-4">
                <Field label="Describe the symptoms or concern">
                  <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} maxLength={2000} placeholder="What are you observing? When did it start?" className="mt-2 min-h-28 w-full resize-y rounded-2xl border border-ink/12 bg-cream/45 p-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
                </Field>
                <div>
                  <p className="text-sm font-semibold">Consultation mode</p>
                  <div className="mt-3 grid gap-3">
                    {CONSULTATION_MODES.map((mode) => (
                      <button key={mode.id} type="button" onClick={() => setConsultationMode(mode.id)} className={`rounded-2xl border p-4 text-left transition hover:border-indigo/30 ${consultationMode === mode.id ? "border-indigo bg-indigo/5" : "border-ink/10"}`}>
                        <p className="font-semibold text-sm">{mode.label}</p>
                        <p className="mt-0.5 text-xs text-ink/50">{mode.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setStep(2)}>Back</Button>
                <Button type="button" variant="accent" onClick={() => setStep(4)} disabled={!symptoms || !consultationMode}>
                  Continue <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <StepTitle>Schedule your consultation</StepTitle>
              <div className="mt-5 grid gap-4">
                <Field label={urgency === "AMBER" ? "Preferred time (same-day recommended)" : "Preferred date & time"}>
                  <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
                </Field>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Button type="button" variant="ghost" onClick={() => setStep(3)}>Back</Button>
                <Button type="button" variant="accent" onClick={submit} disabled={pending || !petId}>
                  {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Request consultation
                </Button>
                {message ? <p role={message.tone === "error" ? "alert" : "status"} className={`text-sm font-semibold ${message.tone === "error" ? "text-coral" : "text-leaf"}`}>{message.text}</p> : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">{children}</h3>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold">{label}{children}</label>;
}

function Rule({ icon: Icon, text }: { icon: typeof Stethoscope; text: string }) {
  return <div className="flex items-center gap-3 text-xs text-paper/60"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-paper/[0.07] text-leaf"><Icon className="h-4 w-4" /></span>{text}</div>;
}
