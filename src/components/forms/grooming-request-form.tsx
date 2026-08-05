"use client";

import { AlertTriangle, CalendarPlus, CheckCircle2, ChevronRight, LoaderCircle, PawPrint, Send, Scissors, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type Pet = { id: string; name: string; species: string; breed: string | null };

const PACKAGES = [
  { id: "essential", name: "Essential Grooming", description: "Bath, drying, brushing, nail trimming, ear cleaning, paw cleaning", price: "From ₹999" },
  { id: "full", name: "Full Grooming", description: "Essential package + coat trimming, sanitary trimming, detangling, basic styling", price: "From ₹1,499" },
  { id: "breed_specific", name: "Breed / Coat-Specific", description: "Long-coat, double-coated, senior pets, anxious pets — specialist handling", price: "From ₹1,999" },
] as const;

const COAT_CONDITIONS = ["Well-maintained", "Slightly matted", "Heavily matted", "Short coat", "Long coat", "Double coat"] as const;

function classifyRisk(assessment: { aggression: boolean; skinIssues: boolean; coatCondition: string }): "LOW" | "MEDIUM" | "HIGH" | "PROHIBITED" {
  if (assessment.aggression && assessment.skinIssues) return "PROHIBITED";
  if (assessment.aggression || assessment.coatCondition === "Heavily matted") return "HIGH";
  if (assessment.skinIssues || assessment.coatCondition === "Slightly matted") return "MEDIUM";
  return "LOW";
}

const RISK_STYLES = {
  LOW: { bg: "bg-leaf/10", text: "text-leaf", label: "Low risk — normal booking" },
  MEDIUM: { bg: "bg-saffron/10", text: "text-saffron", label: "Medium risk — senior groomer recommended" },
  HIGH: { bg: "bg-coral/10", text: "text-coral", label: "High risk — vet or specialist assessment first" },
  PROHIBITED: { bg: "bg-red-100", text: "text-red-700", label: "Cannot book — requires veterinary clearance" },
};

export function GroomingRequestForm({ pets }: { pets: Pet[] }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [petId, setPetId] = useState("");
  const [coatCondition, setCoatCondition] = useState("");
  const [lastGroomingDate, setLastGroomingDate] = useState("");
  const [skinIssues, setSkinIssues] = useState(false);
  const [aggression, setAggression] = useState(false);
  const [allergies, setAllergies] = useState("");
  const [packageType, setPackageType] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  const risk = coatCondition ? classifyRisk({ aggression, skinIssues, coatCondition }) : null;

  async function submit() {
    setPending(true);
    setMessage(null);
    const response = await fetch("/api/customer/grooming", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ petId, packageType, scheduledAt: scheduledAt || undefined, notes: notes || undefined, assessment: { coatCondition, lastGroomingDate: lastGroomingDate || undefined, skinIssues, aggression, allergies: allergies || undefined } }),
    });
    const result = await response.json() as { error?: string; message?: string };
    setPending(false);
    if (!response.ok) return setMessage({ tone: "error", text: result.message ?? result.error ?? "The request could not be recorded." });
    setStep(1);
    setPetId("");
    setPackageType("");
    setMessage({ tone: "success", text: "Grooming request submitted for partner review." });
    router.refresh();
  }

  return (
    <section className="mt-7 overflow-hidden rounded-[1.75rem] bg-[#281d2b] text-paper shadow-soft">
      <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
        <div className="relative overflow-hidden border-b border-paper/10 p-6 lg:border-b-0 lg:border-r">
          <div className="absolute -left-14 -top-14 h-48 w-48 rounded-full bg-indigo/40 blur-3xl" />
          <div className="relative">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron text-ink"><Scissors className="h-5 w-5" /></span>
            <p className="mt-8 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-saffron">In-home grooming</p>
            <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">Professional grooming, at your door.</h3>
            <p className="mt-3 text-sm leading-6 text-paper/55">Our verified groomers bring everything needed for a safe, comfortable grooming session at home.</p>
            <div className="mt-7 grid gap-3">
              <Rule icon={ShieldCheck} text="Verified & insured groomers" />
              <Rule icon={PawPrint} text="Breed-specific expertise" />
              <Rule icon={CheckCircle2} text="Before & after report card" />
            </div>
            {/* Progress Steps */}
            <div className="mt-8 grid gap-2">
              {["Select pet", "Pre-assessment", "Choose package", "Schedule"].map((label, i) => (
                <div key={label} className={`flex items-center gap-3 text-xs ${step > i + 1 ? "text-leaf" : step === i + 1 ? "text-saffron font-bold" : "text-paper/30"}`}>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${step > i + 1 ? "bg-leaf/20" : step === i + 1 ? "bg-saffron/20" : "bg-paper/[0.07]"}`}>{step > i + 1 ? "✓" : i + 1}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-paper p-6 text-ink sm:p-7">
          {step === 1 && (
            <div>
              <StepTitle>Which pet needs grooming?</StepTitle>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {pets.map((pet) => (
                  <button key={pet.id} type="button" onClick={() => { setPetId(pet.id); setStep(2); }} className={`rounded-2xl border p-4 text-left transition hover:border-indigo/30 hover:bg-cream/40 ${petId === pet.id ? "border-indigo bg-indigo/5" : "border-ink/10"}`}>
                    <p className="font-semibold">{pet.name}</p>
                    <p className="mt-1 text-xs text-ink/50">{pet.breed || pet.species}</p>
                  </button>
                ))}
              </div>
              {pets.length === 0 && <p className="mt-4 text-sm text-ink/50">Add a pet to your profile first.</p>}
            </div>
          )}

          {step === 2 && (
            <div>
              <StepTitle>Pre-grooming assessment</StepTitle>
              <div className="mt-5 grid gap-4">
                <Field label="Coat condition">
                  <select value={coatCondition} onChange={(e) => setCoatCondition(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10">
                    <option value="">Select condition</option>
                    {COAT_CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Last grooming date (approximate)">
                  <input type="date" value={lastGroomingDate} onChange={(e) => setLastGroomingDate(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
                </Field>
                <label className="flex items-center gap-3 text-sm">
                  <input type="checkbox" checked={skinIssues} onChange={(e) => setSkinIssues(e.target.checked)} className="h-5 w-5 rounded-lg border-ink/20 text-indigo" />
                  My pet has skin conditions or irritation
                </label>
                <label className="flex items-center gap-3 text-sm">
                  <input type="checkbox" checked={aggression} onChange={(e) => setAggression(e.target.checked)} className="h-5 w-5 rounded-lg border-ink/20 text-indigo" />
                  My pet has shown aggression or bite history
                </label>
                <Field label="Allergies or special notes">
                  <textarea value={allergies} onChange={(e) => setAllergies(e.target.value)} maxLength={500} placeholder="Any allergies, medications, or special care instructions" className="mt-2 min-h-20 w-full resize-y rounded-2xl border border-ink/12 bg-cream/45 p-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
                </Field>
                {risk && (
                  <div className={`rounded-2xl ${RISK_STYLES[risk].bg} p-4`}>
                    <p className={`text-sm font-bold ${RISK_STYLES[risk].text}`}>
                      {risk === "PROHIBITED" && <AlertTriangle className="mr-2 inline h-4 w-4" />}
                      {RISK_STYLES[risk].label}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-5 flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button type="button" variant="accent" onClick={() => setStep(3)} disabled={!coatCondition || risk === "PROHIBITED"}>
                  Continue <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <StepTitle>Choose your grooming package</StepTitle>
              <div className="mt-5 grid gap-3">
                {PACKAGES.map((pkg) => (
                  <button key={pkg.id} type="button" onClick={() => { setPackageType(pkg.id); setStep(4); }} className={`rounded-2xl border p-5 text-left transition hover:border-indigo/30 hover:bg-cream/40 ${packageType === pkg.id ? "border-indigo bg-indigo/5" : "border-ink/10"}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{pkg.name}</p>
                        <p className="mt-1 text-xs leading-5 text-ink/50">{pkg.description}</p>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-indigo">{pkg.price}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <Button type="button" variant="ghost" onClick={() => setStep(2)}>Back</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <StepTitle>Schedule your grooming session</StepTitle>
              <div className="mt-5 grid gap-4">
                <Field label="Preferred date & time">
                  <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
                </Field>
                <Field label="Additional notes for the groomer (optional)">
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={2000} placeholder="Any specific requests or instructions" className="mt-2 min-h-28 w-full resize-y rounded-2xl border border-ink/12 bg-cream/45 p-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
                </Field>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Button type="button" variant="ghost" onClick={() => setStep(3)}>Back</Button>
                <Button type="button" variant="accent" onClick={submit} disabled={pending || !petId || !packageType}>
                  {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Request grooming
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

function Rule({ icon: Icon, text }: { icon: typeof ShieldCheck; text: string }) {
  return <div className="flex items-center gap-3 text-xs text-paper/60"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-paper/[0.07] text-saffron"><Icon className="h-4 w-4" /></span>{text}</div>;
}
