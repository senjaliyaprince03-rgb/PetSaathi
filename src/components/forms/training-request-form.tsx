"use client";

import { Dog, LoaderCircle, Send, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type Pet = { id: string; name: string };

const WORKSHOP_TYPES = [
  "Puppy Foundation",
  "Leash Manners",
  "Recall Basics",
  "Society Etiquette",
  "Children & Dogs"
];

export function TrainingRequestForm({ pets }: { pets: Pet[] }) {
  const router = useRouter();
  const [serviceType, setServiceType] = useState<"WORKSHOP" | "INDIVIDUAL" | "PROGRAMME" | "">("");
  const [workshopType, setWorkshopType] = useState("");
  const [petId, setPetId] = useState("");
  const [goals, setGoals] = useState("");
  const [concerns, setConcerns] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  async function submit() {
    setPending(true);
    setMessage(null);
    const response = await fetch("/api/customer/training", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        serviceType, 
        workshopType: serviceType === "WORKSHOP" ? workshopType : undefined, 
        petId, 
        goals, 
        concerns, 
        scheduledAt: scheduledAt || undefined 
      })
    });
    
    const result = await response.json() as { error?: string; message?: string };
    setPending(false);
    
    if (!response.ok) return setMessage({ tone: "error", text: result.message ?? result.error ?? "Failed to request training." });
    
    setMessage({ tone: "success", text: "Training request submitted." });
    setServiceType("");
    setWorkshopType("");
    setPetId("");
    setGoals("");
    setConcerns("");
    setScheduledAt("");
    router.refresh();
  }

  return (
    <section className="mt-7 overflow-hidden rounded-[1.75rem] bg-[#281d2b] text-paper shadow-soft">
      <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
        <div className="relative overflow-hidden border-b border-paper/10 p-6 lg:border-b-0 lg:border-r">
          <div className="absolute -left-14 -top-14 h-48 w-48 rounded-full bg-saffron/40 blur-3xl" />
          <div className="relative">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron text-ink">
              <Dog className="h-5 w-5" />
            </span>
            <p className="mt-8 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-saffron">Behaviour & Training</p>
            <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">Request Training.</h3>
            <p className="mt-3 text-sm leading-6 text-paper/80">Expert trainers using positive reinforcement to help your pet thrive in the society.</p>
          </div>
        </div>
        
        <div className="bg-paper p-6 text-ink sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Service Type">
                <select value={serviceType} onChange={(e) => setServiceType(e.target.value as any)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10">
                  <option value="">Select training format</option>
                  <option value="WORKSHOP">Group Workshop</option>
                  <option value="INDIVIDUAL">Individual Assessment</option>
                  <option value="PROGRAMME">Structured Programme</option>
                </select>
              </Field>
            </div>

            {serviceType === "WORKSHOP" && (
              <div className="sm:col-span-2">
                <Field label="Workshop Topic">
                  <select value={workshopType} onChange={(e) => setWorkshopType(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10">
                    <option value="">Select topic</option>
                    {WORKSHOP_TYPES.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </Field>
              </div>
            )}

            <Field label="Pet">
              <select value={petId} onChange={(e) => setPetId(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10">
                <option value="">Select a pet</option>
                {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </Field>

            <Field label="Preferred Date (Optional)">
              <input type="date" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
            </Field>

            <div className="sm:col-span-2">
              <Field label="What do you want to achieve? (Goals)">
                <textarea value={goals} onChange={(e) => setGoals(e.target.value)} className="mt-2 min-h-24 w-full resize-y rounded-2xl border border-ink/12 bg-cream/45 p-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" placeholder="E.g., Better leash walking, polite greetings..." />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Any specific behavioural concerns?">
                <textarea value={concerns} onChange={(e) => setConcerns(e.target.value)} className="mt-2 min-h-24 w-full resize-y rounded-2xl border border-ink/12 bg-cream/45 p-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" placeholder="E.g., Barking at doorbells, reactivity to other dogs..." />
              </Field>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Button variant="accent" onClick={submit} disabled={pending || !serviceType || !petId || !goals}>
              {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Request Training
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
