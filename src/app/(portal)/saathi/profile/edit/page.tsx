"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoaderCircle, MapPin, Save, Briefcase, Star, Info, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { PortalShell } from "@/components/portal/portal-shell";

const profileSchema = z.object({
  bio: z.string().max(1000, "Bio is too long").optional().nullable(),
  yearsExperience: z.number().min(0, "Cannot be negative").max(50, "Invalid experience"),
  serviceLocality: z.string().min(2, "Locality is required").max(100, "Locality is too long"),
  serviceRadiusKm: z.number().min(1, "Radius must be at least 1km").max(100, "Radius too large"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: "Passionate and certified animal caregiver with deep experience handling active dogs and sensitive cats in residential neighborhoods.",
      yearsExperience: 2,
      serviceLocality: "Indiranagar, Bengaluru",
      serviceRadiusKm: 8,
    }
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/saathi/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            reset({
              bio: data.profile.bio || "Passionate and certified animal caregiver with deep experience handling active dogs and sensitive cats in residential neighborhoods.",
              yearsExperience: data.profile.yearsExperience ?? 2,
              serviceLocality: data.profile.serviceLocality || "Indiranagar, Bengaluru",
              serviceRadiusKm: data.profile.serviceRadiusKm || 8,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load profile", err);
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

  return (
    <PortalShell mode="saathi" displayName="Saathi Caregiver">
      <div className="max-w-3xl pb-16">
        {/* Header */}
        <section className="mt-4 rounded-[2rem] border border-black/[0.06] bg-gradient-to-r from-paper via-cream to-[#fbf2ea] p-6 shadow-sm sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-indigo animate-pulse" />
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-indigo">Caregiver Profile</p>
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Edit Caregiver Profile
            </h1>
            <p className="mt-2 max-w-xl text-xs sm:text-sm text-ink/70 leading-relaxed">
              Update your service locality, coverage radius, experience, and caregiver bio visible to pet parents.
            </p>
          </div>
        </section>

        <div className="mt-8 rounded-[2rem] border border-black/[0.06] bg-white p-6 sm:p-8 shadow-sm">
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
                className="h-12 w-full rounded-xl border border-black/[0.1] bg-[#FAF6F1] px-4 text-sm outline-none transition focus:border-indigo"
              />
              {errors.yearsExperience && <p className="mt-1 text-xs text-coral">{errors.yearsExperience.message}</p>}
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
                <MapPin className="h-4 w-4 text-indigo" /> Primary Service Locality
              </label>
              <input
                type="text"
                placeholder="e.g. Indiranagar, Bengaluru"
                {...register("serviceLocality")}
                className="h-12 w-full rounded-xl border border-black/[0.1] bg-[#FAF6F1] px-4 text-sm outline-none transition focus:border-indigo"
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
                className="h-12 w-full rounded-xl border border-black/[0.1] bg-[#FAF6F1] px-4 text-sm outline-none transition focus:border-indigo"
              />
              <p className="mt-2 flex items-center gap-1.5 text-xs text-ink/70">
                <Info className="h-3.5 w-3.5 text-indigo" /> Maximum dispatch radius from your primary service locality.
              </p>
              {errors.serviceRadiusKm && <p className="mt-1 text-xs text-coral">{errors.serviceRadiusKm.message}</p>}
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
                Caregiver Bio
              </label>
              <textarea
                rows={4}
                placeholder="Tell pet parents a bit about yourself..."
                {...register("bio")}
                className="w-full resize-none rounded-xl border border-black/[0.1] bg-[#FAF6F1] p-4 text-sm outline-none transition focus:border-indigo"
              />
              {errors.bio && <p className="mt-1 text-xs text-coral">{errors.bio.message}</p>}
            </div>

            <div className="mt-4 flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex h-12 flex-1 items-center justify-center rounded-xl font-bold tracking-wide text-ink transition hover:bg-black/[0.05]"
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
        </div>
      </div>
    </PortalShell>
  );
}
