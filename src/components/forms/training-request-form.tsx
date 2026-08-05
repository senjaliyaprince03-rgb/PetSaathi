"use client";

import { BookOpen, CalendarPlus, CheckCircle2, ChevronRight, GraduationCap, LoaderCircle, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type Pet = { id: string; name: string };

const SERVICE_TYPES = [
  { id: "workshop", label: "Group Workshop", description: "Structured group sessions on specific topics" },
  { id: "assessment", label: "Individual Assessment", description: "45–60 minute evaluation by a specialist" },
  { id: "programme", label: "Training Programme", description: "4–6 session structured behaviour programme" },
] as const;

const WORKSHOP_TYPES = [
  "Puppy Foundation",
  "Leash Manners",
  "Recall Basics",
  "Calm Greetings",
  "Society Etiquette",
  "Children & Dogs",
  "Handling & Grooming Preparation",
  "Diwali / Noise Preparation",
] as const;

export function TrainingRequestForm({ pets }: { pets: Pet[] }) {
  const router = useRouter();
  const [serviceType, setServiceType] = useState("");
  const [workshopType, setWorkshopType] = useState("");
  const [petId, setPetId] = useState("");
  const [goals, setGoals] = useState("");
  const [concerns, setConcerns] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [step, setStep] = useState(1);

  async function submit() {
    setPending(true);
    setMessage(null);
    const response = await fetch("/api/customer/training", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceType, workshopType: workshopType || undefined, petId, goals, concerns: concerns || undefined, scheduledAt: scheduledAt || undefined }),
    });
    const result = await response.json() as { error?: string; message?: string };
    setPending(false);
    if (!response.ok) return setMessage({ tone: "error", text: result.message ?? result.error ?? "Request could not be recorded." });
    setStep(1);
    setServiceType("");
    setMessage({ tone: "success", text: "Training request submitted for specialist review." });
    router.refresh();
  }

  return (
    <section className="mt-7 overflow-hidden rounded-[1.75rem] bg-[#281d2b] text-paper shadow-soft">
      <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
        <div className="relative overflow-hidden border-b border-paper/10 p-6 lg:border-b-0 lg:border-r">
          <div className="absolute -left-14 -top-14 h-48 w-48 rounded-full bg-indigo/30 blur-3xl" />
          <div className="relative">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo text-paper"><GraduationCap className="h-5 w-5" /></span>
            <p className="mt-8 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-indigo/80">Dog training</p>
            <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">Reward-led training by verified specialists.</h3>
            <p className="mt-3 text-sm leading-6 text-paper/55">Only positive-reinforcement methods. Aversive tools and force-based techniques are strictly prohibited.</p>
            <div className="mt-7 grid gap-3">
              <Rule icon={CheckCircle2} text="Verified, positive-method trainers" />
              <Rule icon={BookOpen} text="Session reports & homework" />
              <Rule icon={CalendarPlus} text="Progress tracking over time" />
            </div>
          </div>
        </div>

        <div className="bg-paper p-6 text-ink sm:p-7">
          {step === 1 && (
            <div>
              <StepTitle>What type of training?</StepTitle>
              <div className="mt-5 grid gap-3">
                {SERVICE_TYPES.map((t) => (
                  <button key={t.id} type="button" onClick={() => { setServiceType(t.id); setStep(t.id === "workshop" ? 2 : 3); }} className={`rounded-2xl border p-5 text-left transition hover:border-indigo/30 hover:bg-cream/40 ${serviceType === t.id ? "border-indigo bg-indigo/5" : "border-ink/10"}`}>
                    <p className="font-semibold">{t.label}</p>
                    <p className="mt-1 text-xs text-ink/50">{t.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <StepTitle>Choose a workshop topic</StepTitle>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {WORKSHOP_TYPES.map((w) => (
                  <button key={w} type="button" onClick={() => { setWorkshopType(w); setStep(3); }} className={`rounded-2xl border p-4 text-left text-sm transition hover:border-indigo/30 ${workshopType === w ? "border-indigo bg-indigo/5 font-semibold" : "border-ink/10"}`}>
                    {w}
                  </button>
                ))}
              </div>
              <div className="mt-5"><Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button></div>
            </div>
          )}

          {step === 3 && (
            <div>
              <StepTitle>Tell us about your pet & goals</StepTitle>
              <div className="mt-5 grid gap-4">
                <Field label="Select pet">
                  <select value={petId} onChange={(e) => setPetId(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10">
                    <option value="">Choose a pet</option>
                    {pets.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </Field>
                <Field label="What do you want to achieve?">
                  <textarea value={goals} onChange={(e) => setGoals(e.target.value)} maxLength={1000} placeholder="E.g., better leash manners, stop jumping on guests, reduce barking" className="mt-2 min-h-24 w-full resize-y rounded-2xl border border-ink/12 bg-cream/45 p-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
                </Field>
                <Field label="Any behaviour concerns? (optional)">
                  <textarea value={concerns} onChange={(e) => setConcerns(e.target.value)} maxLength={1000} placeholder="Aggression, fear, separation anxiety, resource guarding..." className="mt-2 min-h-20 w-full resize-y rounded-2xl border border-ink/12 bg-cream/45 p-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
                </Field>
                <Field label="Preferred date & time (optional)">
                  <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
                </Field>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Button type="button" variant="ghost" onClick={() => setStep(serviceType === "workshop" ? 2 : 1)}>Back</Button>
                <Button type="button" variant="accent" onClick={submit} disabled={pending || !petId || !goals}>
                  {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Request training
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

function Rule({ icon: Icon, text }: { icon: typeof GraduationCap; text: string }) {
  return <div className="flex items-center gap-3 text-xs text-paper/60"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-paper/[0.07] text-indigo/80"><Icon className="h-4 w-4" /></span>{text}</div>;
}
