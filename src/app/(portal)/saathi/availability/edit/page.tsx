"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoaderCircle, Save, Calendar, Plus, Trash2, Clock } from "lucide-react";
import { motion } from "framer-motion";

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: { rules: [] }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rules"
  });

  useEffect(() => {
    async function loadAvailability() {
      try {
        const res = await fetch("/api/saathi/availability");
        if (res.ok) {
          const data = await res.json();
          // Initialize with fetched rules or empty array
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

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-indigo" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">Availability</h1>
          <p className="mt-2 text-ink/60">Set your weekly recurring schedule.</p>
        </div>
        <button
          type="button"
          onClick={() => append({ weekday: 1, startTime: "09:00", endTime: "17:00", active: true })}
          className="flex items-center gap-2 rounded-xl bg-ink/5 px-4 py-2 text-sm font-bold text-ink transition hover:bg-ink/10"
        >
          <Plus className="h-4 w-4" /> Add Slot
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted sm:p-10"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {error && (
            <div className="rounded-2xl bg-coral/10 p-4 text-sm font-semibold text-coral">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {fields.length === 0 && (
              <div className="rounded-2xl border border-dashed border-ink/20 p-8 text-center text-ink/50">
                <Calendar className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No availability rules set. Click &quot;Add Slot&quot; to define your schedule.</p>
              </div>
            )}
            
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col items-start gap-4 rounded-2xl bg-cream/50 p-4 sm:flex-row sm:items-center">
                
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-bold text-ink/70">Day</label>
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
                  <label className="mb-1 block text-xs font-bold text-ink/70">Start Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
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
                  <label className="mb-1 block text-xs font-bold text-ink/70">End Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
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
      </motion.div>
    </div>
  );
}
