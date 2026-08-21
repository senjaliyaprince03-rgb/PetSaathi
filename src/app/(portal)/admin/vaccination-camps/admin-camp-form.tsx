"use client";

import { LoaderCircle, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AdminCampForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [capacity, setCapacity] = useState("50");
  const [location, setLocation] = useState("");
  const [vetPartnerId, setVetPartnerId] = useState(""); // Simplified for demo
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    
    // Auto-generate a dummy UUID if vetPartnerId is empty for the demo
    const finalVetPartnerId = vetPartnerId || "00000000-0000-0000-0000-000000000000";

    const res = await fetch("/api/admin/vaccination-camps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, date, capacity: parseInt(capacity), location, vetPartnerId: finalVetPartnerId })
    });
    
    const result = await res.json();
    setPending(false);
    
    if (!res.ok) {
      setMessage({ tone: "error", text: result.message || "Failed to create camp" });
      return;
    }
    
    setMessage({ tone: "success", text: "Camp created successfully" });
    setName("");
    setDate("");
    setCapacity("50");
    setLocation("");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <Field label="Camp Name">
        <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Annual Rabies Drive" className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
      </Field>
      
      <Field label="Date & Time">
        <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
      </Field>
      
      <div className="grid grid-cols-2 gap-4">
        <Field label="Capacity (Pets)">
          <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} required min="1" className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
        </Field>
        
        <Field label="Location">
          <input type="text" value={location} onChange={e => setLocation(e.target.value)} required placeholder="Clubhouse, Tower B" className="mt-2 min-h-13 w-full rounded-2xl border border-ink/12 bg-cream/45 px-4 font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10" />
        </Field>
      </div>
      
      <div className="mt-6 flex items-center gap-4">
        <Button variant="accent" type="submit" disabled={pending || !name || !date || !location}>
          {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Schedule Camp
        </Button>
        {message && <span className={`text-sm font-semibold ${message.tone === 'success' ? 'text-leaf' : 'text-coral'}`}>{message.text}</span>}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold">{label}{children}</label>;
}
