"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoaderCircle, Save, Calendar, Plus, Trash2, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { PortalShell } from "@/components/portal/portal-shell";

const ruleSchema = z.object({
  weekday: z.number().min(0).max(6),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "HH:MM (24h) required"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "HH:MM (24h) required"),
  active: z.boolean().default(true),
});

const availabilitySchema = z.object({
  rules: z.array(ruleSchema),
});

type AvailabilityFormValues = z.infer<typeof availabilitySchema>;

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function EditAvailabilityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: { rules: [] }
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "rules"
  });

  useEffect(() => {
    async function loadAvailability() {
      try {
        const res = await fetch("/api/saathi/availability");
        if (res.ok) {
          const data = await res.json();
          reset({ rules: data.rules || [] });
        }
      } catch (err) {
        console.error("Failed to load availability", err);
      } finally {
        setLoading(false);
      }
    }
    loadAvailability();
  }, [reset]);

  const applyFullWeekPreset = () => {
    const fullWeek = [1, 2, 3, 4, 5, 6].map((day) => ({
      weekday: day,
      startTime: "08:00",
      endTime: "20:00",
      active: true,
    }));
    replace(fullWeek);
  };

  const applyWeekdaysPreset = () => {
    const weekdays = [1, 2, 3, 4, 5].map((day) => ({
      weekday: day,
      startTime: "09:00",
      endTime: "18:00",
      active: true,
    }));
    replace(weekdays);
  };

  async function onSubmit(data: AvailabilityFormValues) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/saathi/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const payload = await res.json();
        setError(payload.error || "Failed to update schedule");
        return;
      }
      
      router.push("/saathi/availability");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PortalShell mode="saathi" displayName="Saathi Caregiver">
      <div className="max-w-4xl pb-16">
        {/* Header */}
        <section className="mt-4 rounded-[2rem] border border-black/[0.06] bg-gradient-to-r from-paper via-cream to-[#fbf2ea] p-6 shadow-sm sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-indigo animate-pulse" />
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-indigo">Availability Manager</p>
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Edit Weekly Schedule
            </h1>
            <p className="mt-2 max-w-xl text-xs sm:text-sm text-ink/70 leading-relaxed">
              Add or remove daily working windows. Our matching engine will dispatch walks and visits only during your active hours.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={applyFullWeekPreset}
              className="inline-flex items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-3.5 py-2 text-xs font-bold text-ink shadow-sm transition hover:bg-cream"
            >
              <Sparkles className="h-3.5 w-3.5 text-coral" /> Mon–Sat (8AM–8PM)
            </button>
            <button
              type="button"
              onClick={() => append({ weekday: 1, startTime: "09:00", endTime: "18:00", active: true })}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo/90"
            >
              <Plus className="h-3.5 w-3.5" /> Add Day Slot
            </button>
          </div>
        </section>

        {loading ? (
          <div className="mt-12 flex h-64 items-center justify-center">
            <LoaderCircle className="h-8 w-8 animate-spin text-indigo" />
          </div>
        ) : (
          <div className="mt-8 rounded-[2rem] border border-black/[0.06] bg-white p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {error && (
            <div className="rounded-2xl bg-coral/10 p-4 text-sm font-semibold text-coral">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {fields.length === 0 && (
              <div className="rounded-2xl border border-dashed border-ink/20 p-8 text-center text-ink/80">
                <Calendar className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No availability rules set. Click &quot;Add Slot&quot; to define your schedule.</p>
              </div>
            )}
            
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col items-start gap-4 rounded-2xl bg-cream/50 p-4 sm:flex-row sm:items-center">
                
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-bold text-ink/80">Day</label>
                  <select
                    {...register(`rules.${index}.weekday`, { valueAsNumber: true })}
                    className="h-10 w-full rounded-lg border border-ink/10 bg-white px-3 text-sm outline-none focus:border-indigo"
                  >
                    {DAYS.map((day, i) => (
                      <option key={i} value={i}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="mb-1 block text-xs font-bold text-ink/80">Start Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/80" />
                    <input
                      type="text"
                      placeholder="09:00"
                      {...register(`rules.${index}.startTime`)}
                      className="h-10 w-full rounded-lg border border-ink/10 bg-white pl-9 pr-3 text-sm outline-none focus:border-indigo"
                    />
                  </div>
                  {errors.rules?.[index]?.startTime && (
                    <p className="mt-1 text-[10px] text-coral">{errors.rules[index].startTime?.message}</p>
                  )}
                </div>

                <div className="flex-1">
                  <label className="mb-1 block text-xs font-bold text-ink/80">End Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/80" />
                    <input
                      type="text"
                      placeholder="17:00"
                      {...register(`rules.${index}.endTime`)}
                      className="h-10 w-full rounded-lg border border-ink/10 bg-white pl-9 pr-3 text-sm outline-none focus:border-indigo"
                    />
                  </div>
                  {errors.rules?.[index]?.endTime && (
                    <p className="mt-1 text-[10px] text-coral">{errors.rules[index].endTime?.message}</p>
                  )}
                </div>

                <div className="flex items-end justify-center self-stretch sm:self-auto sm:pb-0 pb-2">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-coral transition hover:bg-coral/10"
                    title="Remove slot"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-12 flex-1 items-center justify-center rounded-xl font-bold tracking-wide text-ink transition hover:bg-ink/5"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo font-bold tracking-wide text-white transition hover:bg-indigo/90 disabled:opacity-50"
            >
              {saving ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "SAVING..." : "SAVE SCHEDULE"}
            </button>
          </div>
        </form>
      </div>
    )}
  </div>
</PortalShell>
  );
}
