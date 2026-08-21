"use client";

import { CheckCircle2, ChevronRight, LoaderCircle, ShieldAlert, ShieldCheck, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Pet = { id: string; name: string; species: string; breed: string | null };

export function GroomingRequestForm({ pets }: { pets: Pet[] }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  // Form State
  const [petId, setPetId] = useState("");
  const [coatCondition, setCoatCondition] = useState("");
  const [lastGrooming, setLastGrooming] = useState("");
  const [skinIssues, setSkinIssues] = useState(false);
  const [aggressionHistory, setAggressionHistory] = useState(false);
  const [allergies, setAllergies] = useState("");
  const [packageType, setPackageType] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");

  const riskLevel = aggressionHistory ? "High" : skinIssues ? "Medium" : "Low";
  const riskColor = riskLevel === "High" ? "text-coral bg-coral/10" : riskLevel === "Medium" ? "text-saffron bg-saffron/20" : "text-leaf bg-leaf/10";
  const RiskIcon = riskLevel === "High" ? ShieldAlert : riskLevel === "Medium" ? TriangleAlert : ShieldCheck;

  async function submit() {
    if (riskLevel === "High") {
      setMessage({ tone: "error", text: "Grooming for pets with aggression history requires a vet consultation first." });
      return;
    }

    setPending(true);
    setMessage(null);

    const assessment = { coatCondition, lastGrooming, skinIssues, aggressionHistory, allergies };
    const response = await fetch("/api/customer/grooming", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        petId,
        packageType,
        scheduledAt,
        notes,
        assessment,
      }),
    });

    const result = await response.json() as { error?: string; message?: string };
    setPending(false);

    if (!response.ok) {
      return setMessage({ tone: "error", text: result.message ?? result.error ?? "Failed to submit request." });
    }

    setMessage({ tone: "success", text: "Grooming request submitted successfully." });
    setTimeout(() => {
      setStep(1);
      setPetId("");
      router.refresh();
    }, 2000);
  }

  return (
    <div className="mt-8 rounded-[1.75rem] border border-ink/[0.07] bg-paper p-6 shadow-sm sm:p-8">
      <div className="mb-8 flex items-center justify-between border-b border-ink/5 pb-6">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Request Grooming</h2>
        <div className="flex items-center gap-2 text-sm font-semibold text-ink/80">
          <span className={step >= 1 ? "text-indigo" : ""}>Pet</span>
          <ChevronRight className="h-4 w-4" />
          <span className={step >= 2 ? "text-indigo" : ""}>Assessment</span>
          <ChevronRight className="h-4 w-4" />
          <span className={step >= 3 ? "text-indigo" : ""}>Package</span>
          <ChevronRight className="h-4 w-4" />
          <span className={step >= 4 ? "text-indigo" : ""}>Schedule</span>
        </div>
      </div>

      {message && (
        <div className={cn("mb-6 flex items-center gap-3 rounded-2xl p-4 text-sm font-semibold", message.tone === "error" ? "bg-coral/10 text-coral" : "bg-leaf/10 text-leaf")}>
          <CheckCircle2 className="h-5 w-5" />
          {message.text}
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4">
          <label className="block text-sm font-semibold">
            Which pet needs grooming?
            <select
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10"
            >
              <option value="">Select a pet</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.breed || pet.species})
                </option>
              ))}
            </select>
          </label>
          <Button variant="accent" onClick={() => setStep(2)} disabled={!petId} className="w-fit">Next step</Button>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Coat Condition
              <select value={coatCondition} onChange={(e) => setCoatCondition(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10">
                <option value="">Select condition</option>
                <option value="Normal">Normal</option>
                <option value="Matted">Matted / Tangled</option>
                <option value="Heavy Shedding">Heavy Shedding</option>
              </select>
            </label>
            <label className="block text-sm font-semibold">
              Last Grooming
              <input type="month" value={lastGrooming} onChange={(e) => setLastGrooming(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
            </label>
          </div>
          
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 text-sm font-semibold">
              <input type="checkbox" checked={skinIssues} onChange={(e) => setSkinIssues(e.target.checked)} className="h-5 w-5 rounded-md border-ink/20 text-indigo focus:ring-indigo" />
              Known skin issues or sensitivities
            </label>
            <label className="flex items-center gap-3 text-sm font-semibold text-coral">
              <input type="checkbox" checked={aggressionHistory} onChange={(e) => setAggressionHistory(e.target.checked)} className="h-5 w-5 rounded-md border-coral/30 text-coral focus:ring-coral" />
              History of aggression during grooming
            </label>
          </div>

          <label className="block text-sm font-semibold">
            Allergies (optional)
            <textarea value={allergies} onChange={(e) => setAllergies(e.target.value)} className="mt-2 min-h-24 w-full resize-y rounded-2xl border border-ink/12 bg-cream/45 p-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" placeholder="List any product allergies..." />
          </label>

          <div className="flex items-center gap-4 pt-4 border-t border-ink/5">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button variant="accent" onClick={() => setStep(3)} disabled={!coatCondition}>Next step</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4">
          <div className={cn("flex items-center gap-3 rounded-2xl p-4 text-sm font-bold", riskColor)}>
            <RiskIcon className="h-5 w-5" />
            Risk Classification: {riskLevel}
            {riskLevel === "High" && " (Cannot proceed with home grooming)"}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { id: "Essential", name: "Essential Bath", desc: "Shampoo, blow dry, nail trim, ear cleaning." },
              { id: "Full", name: "Full Groom", desc: "Bath, full body haircut, sanitary trim." },
              { id: "Breed-Specific", name: "Breed Styling", desc: "Specialized styling tailored to breed standards." }
            ].map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setPackageType(pkg.id)}
                className={cn("cursor-pointer rounded-2xl border p-5 transition", packageType === pkg.id ? "border-indigo bg-indigo/5 ring-1 ring-indigo" : "border-ink/10 hover:border-indigo/30 hover:bg-cream")}
              >
                <h3 className="font-semibold">{pkg.name}</h3>
                <p className="mt-2 text-xs text-ink/80">{pkg.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-ink/5">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button variant="accent" onClick={() => setStep(4)} disabled={!packageType || riskLevel === "High"}>Next step</Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4">
          <label className="block text-sm font-semibold">
            Preferred Date & Time
            <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
          </label>

          <label className="block text-sm font-semibold">
            Additional Notes
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-2 min-h-24 w-full resize-y rounded-2xl border border-ink/12 bg-cream/45 p-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" placeholder="Parking instructions, specific requests..." />
          </label>

          <div className="flex items-center gap-4 pt-4 border-t border-ink/5">
            <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
            <Button variant="accent" onClick={submit} disabled={pending || !scheduledAt}>
              {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Submit Request
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
