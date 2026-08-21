"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoaderCircle, MapPin, Save, Briefcase, Star, Info } from "lucide-react";
import { motion } from "framer-motion";

const profileSchema = z.object({
  bio: z.string().max(1000, "Bio is too long").optional().nullable(),
  yearsExperience: z.number().min(0, "Cannot be negative").max(50, "Invalid experience"),
  serviceLocality: z.string().min(2, "Locality is required").max(100, "Locality is too long"),
  serviceRadiusKm: z.number().min(1, "Radius must be at least 1km").max(100, "Radius too large"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: "",
      yearsExperience: 0,
      serviceLocality: "",
      serviceRadiusKm: 5,
    }
  });

  useEffect(() => {
    // We could fetch the initial data from another API or Server Action, 
    // but for simplicity we can use the same route or a dedicated GET.
    // For now, let's fetch the current profile.
    async function loadProfile() {
      try {
        const res = await fetch("/api/saathi/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            reset({
              bio: data.profile.bio || "",
              yearsExperience: data.profile.yearsExperience || 0,
              serviceLocality: data.profile.serviceLocality || "",
              serviceRadiusKm: data.profile.serviceRadiusKm || 5,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [reset]);

  async function onSubmit(data: ProfileFormValues) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/saathi/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const payload = await res.json();
        setError(payload.error || "Failed to update profile");
        return;
      }
      
      router.push("/saathi/profile");
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
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">Edit Profile</h1>
        <p className="mt-2 text-ink/80">Update your public Saathi profile information.</p>
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

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
              <Briefcase className="h-4 w-4 text-indigo" /> Years of Experience
            </label>
            <input
              type="number"
              {...register("yearsExperience", { valueAsNumber: true })}
              className="h-12 w-full rounded-xl border border-ink/10 bg-cream/50 px-4 text-sm outline-none transition focus:border-indigo focus:ring-1 focus:ring-indigo"
            />
            {errors.yearsExperience && <p className="mt-1 text-xs text-coral">{errors.yearsExperience.message}</p>}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
              <MapPin className="h-4 w-4 text-indigo" /> Service Locality
            </label>
            <input
              type="text"
              placeholder="e.g. Bandra West, Mumbai"
              {...register("serviceLocality")}
              className="h-12 w-full rounded-xl border border-ink/10 bg-cream/50 px-4 text-sm outline-none transition focus:border-indigo focus:ring-1 focus:ring-indigo"
            />
            {errors.serviceLocality && <p className="mt-1 text-xs text-coral">{errors.serviceLocality.message}</p>}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
              <Star className="h-4 w-4 text-indigo" /> Service Radius (km)
            </label>
            <input
              type="number"
              {...register("serviceRadiusKm", { valueAsNumber: true })}
              className="h-12 w-full rounded-xl border border-ink/10 bg-cream/50 px-4 text-sm outline-none transition focus:border-indigo focus:ring-1 focus:ring-indigo"
            />
            <p className="mt-2 flex items-center gap-1.5 text-xs text-ink/80">
              <Info className="h-3.5 w-3.5" /> How far you are willing to travel.
            </p>
            {errors.serviceRadiusKm && <p className="mt-1 text-xs text-coral">{errors.serviceRadiusKm.message}</p>}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
              Bio
            </label>
            <textarea
              rows={4}
              placeholder="Tell pet parents a bit about yourself..."
              {...register("bio")}
              className="w-full resize-none rounded-xl border border-ink/10 bg-cream/50 p-4 text-sm outline-none transition focus:border-indigo focus:ring-1 focus:ring-indigo"
            />
            {errors.bio && <p className="mt-1 text-xs text-coral">{errors.bio.message}</p>}
          </div>

          <div className="mt-4 flex gap-4">
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
              {saving ? "SAVING..." : "SAVE PROFILE"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
