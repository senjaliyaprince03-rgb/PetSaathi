"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function AdminPlanForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      planKey: formData.get("planKey") as string,
      version: parseInt(formData.get("version") as string, 10) || 1,
      name: formData.get("name") as string,
      audience: formData.get("audience") as string,
      pricePaise: parseInt(formData.get("pricePaise") as string, 10),
      billingInterval: formData.get("billingInterval") as string,
      totalBillingCycles: parseInt(formData.get("totalBillingCycles") as string, 10) || 12,
      entitlements: {}, // We mock this for now
    };

    try {
      const res = await fetch("/api/admin/plan-versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create plan");
      
      setIsOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to create plan");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className={buttonVariants({ variant: "outline", className: "w-full sm:w-auto" })}>
        <Plus className="mr-2 h-4 w-4" /> Create New Plan
      </button>
    );
  }

  return (
    <div className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-semibold">New Plan Version</h2>
        <button onClick={() => setIsOpen(false)} className="text-sm font-semibold text-ink/80 hover:text-ink">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-ink/80">Plan Key</label>
          <input required name="planKey" type="text" placeholder="e.g. dog_walking_monthly" className="w-full rounded-2xl border border-ink/10 bg-cream/50 px-4 py-3 outline-none focus:border-indigo/30 focus:bg-paper" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-ink/80">Version</label>
          <input required name="version" type="number" defaultValue={1} min={1} className="w-full rounded-2xl border border-ink/10 bg-cream/50 px-4 py-3 outline-none focus:border-indigo/30 focus:bg-paper" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-ink/80">Display Name</label>
          <input required name="name" type="text" placeholder="e.g. Monthly Dog Walking" className="w-full rounded-2xl border border-ink/10 bg-cream/50 px-4 py-3 outline-none focus:border-indigo/30 focus:bg-paper" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-ink/80">Audience</label>
          <select required name="audience" className="w-full rounded-2xl border border-ink/10 bg-cream/50 px-4 py-3 outline-none focus:border-indigo/30 focus:bg-paper">
            <option value="CUSTOMER">Customer</option>
            <option value="SITTER">Sitter (Partner)</option>
            <option value="SOCIETY">Society</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-ink/80">Price (in Paise)</label>
          <input required name="pricePaise" type="number" placeholder="e.g. 500000 for ₹5000" min={0} className="w-full rounded-2xl border border-ink/10 bg-cream/50 px-4 py-3 outline-none focus:border-indigo/30 focus:bg-paper" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-ink/80">Billing Interval</label>
          <select required name="billingInterval" className="w-full rounded-2xl border border-ink/10 bg-cream/50 px-4 py-3 outline-none focus:border-indigo/30 focus:bg-paper">
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-widest text-ink/80">Total Billing Cycles</label>
          <input required name="totalBillingCycles" type="number" defaultValue={12} min={1} className="w-full rounded-2xl border border-ink/10 bg-cream/50 px-4 py-3 outline-none focus:border-indigo/30 focus:bg-paper" />
        </div>
        <div className="sm:col-span-2 flex justify-end">
          <button disabled={loading} type="submit" className={buttonVariants({ className: "w-full sm:w-auto" })}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Create Plan
          </button>
        </div>
      </form>
    </div>
  );
}
