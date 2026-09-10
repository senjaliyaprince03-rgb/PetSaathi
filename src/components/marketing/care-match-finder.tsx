"use client";

import { ArrowRight, CheckCircle2, ChevronDown, MapPin, PawPrint, Search, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const careOptions = [
  { value: "DOG_WALK_30", label: "Dog walking", note: "30-minute neighbourhood care", price: "From ₹149" },
  { value: "HOME_VISIT", label: "Home visit", note: "Food, water & reassuring check-in", price: "From ₹299" },
  { value: "HOME_SITTING_60", label: "Home pet sitting", note: "Companionship in your home", price: "From ₹299" },
  { value: "GROOMING_HOME", label: "At-home grooming", note: "Hygiene & grooming at doorstep", price: "From ₹799" },
  { value: "VET_SUPPORT", label: "Veterinary support", note: "Professional clinical coordination", price: "From ₹349" },
  { value: "TRAINING_ASSESSMENT", label: "Training assessment", note: "Reward-led behaviour guidance", price: "From ₹499" },
  { value: "PET_TAXI", label: "Pet taxi", note: "A planned, traceable pet journey", price: "From ₹199" }
] as const;

const citySuggestions = [
  { name: "Ahmedabad", isLive: true },
  { name: "Bangalore", isLive: true },
  { name: "Pune", isLive: true },
  { name: "Mumbai", isLive: false, label: "Mumbai · Waitlist" },
  { name: "Delhi NCR", isLive: false, label: "Delhi NCR · Waitlist" }
];

type PetType = "DOG" | "CAT" | "RABBIT" | "BIRD" | "FISH" | "TURTLE" | "RAT";

export function CareMatchFinder() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [service, setService] = useState<(typeof careOptions)[number]["value"]>("DOG_WALK_30");
  const [petType, setPetType] = useState<PetType>("DOG");
  const [locality, setLocality] = useState("");
  const [error, setError] = useState<string | null>(null);

  const selectedService = useMemo(
    () => careOptions.find((option) => option.value === service) ?? careOptions[0],
    [service]
  );

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const safeLocality = locality.trim();
    if (safeLocality.length < 2) {
      setError("Please enter your city or locality to check caregiver availability.");
      return;
    }

    setError(null);
    const query = new URLSearchParams({ service, petType, locality: safeLocality });
    startTransition(() => router.push(`/book?${query.toString()}`));
  };

  return (
    <form
      onSubmit={submit}
      action="/book"
      method="get"
      className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/95 p-6 sm:p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-2xl"
      aria-label="Start a PetSaathi care match"
      noValidate
    >
      {/* Subtle luxury ambient glows inside card */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-saffron/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-coral/10 blur-3xl" />

      {/* Header */}
      <div className="relative flex items-center justify-between gap-4 border-b border-indigo/10 pb-4">
        <div>
          <span className="inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C84B31] font-outfit">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Instant Care Match
          </span>
          <h2 className="mt-1 font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Find trusted local care
          </h2>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-leaf/20 bg-leaf/10 px-3 py-1.5 text-[0.68rem] font-bold text-leaf shrink-0 shadow-2xs font-outfit">
          <ShieldCheck className="h-3.5 w-3.5" /> 100% Vetted
        </span>
      </div>

      {/* Fields Grid */}
      <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
        {/* Care Service Selection */}
        <label className="sm:col-span-2 group relative flex flex-col gap-1 rounded-2xl border border-indigo/15 bg-cream/40 p-3 transition focus-within:border-indigo/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo/10 hover:border-indigo/30 hover:bg-cream/70">
          <span className="flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-ink/70">
            <PawPrint className="h-3.5 w-3.5 text-coral" />
            Care Service
          </span>
          <div className="relative flex items-center">
            <select
              name="service"
              value={service}
              onChange={(event) => setService(event.target.value as typeof service)}
              className="w-full appearance-none bg-transparent pr-8 text-sm font-bold text-ink focus:outline-none cursor-pointer"
            >
              {careOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} — {option.note}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 h-4 w-4 text-ink/50 transition group-focus-within:text-ink" />
          </div>
        </label>

        {/* Pet Type Selection */}
        <label className="group relative flex flex-col gap-1 rounded-2xl border border-indigo/15 bg-cream/40 p-3 transition focus-within:border-indigo/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo/10 hover:border-indigo/30 hover:bg-cream/70">
          <span className="flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-ink/70">
            <CheckCircle2 className="h-3.5 w-3.5 text-leaf" />
            Pet Type
          </span>
          <div className="relative flex items-center">
            <select
              name="petType"
              value={petType}
              onChange={(event) => setPetType(event.target.value as PetType)}
              className="w-full appearance-none bg-transparent pr-8 text-sm font-bold text-ink focus:outline-none cursor-pointer"
            >
              <option value="DOG">Dog 🐕</option>
              <option value="CAT">Cat 🐈</option>
              <option value="RABBIT">Rabbit 🐇</option>
              <option value="BIRD">Bird 🦜</option>
              <option value="FISH">Fish 🐠</option>
              <option value="TURTLE">Turtle 🐢</option>
              <option value="RAT">Small Pet 🐹</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 h-4 w-4 text-ink/50 transition group-focus-within:text-ink" />
          </div>
        </label>

        {/* City or Locality Input */}
        <label className="group relative flex flex-col gap-1 rounded-2xl border border-indigo/15 bg-cream/40 p-3 transition focus-within:border-indigo/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo/10 hover:border-indigo/30 hover:bg-cream/70">
          <span className="flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-ink/70">
            <MapPin className="h-3.5 w-3.5 text-saffron" />
            City or Locality
          </span>
          <input
            value={locality}
            name="locality"
            onChange={(event) => {
              setLocality(event.target.value);
              if (error) setError(null);
            }}
            className="w-full bg-transparent text-sm font-bold text-ink placeholder:text-ink/40 focus:outline-none"
            placeholder="e.g. Indiranagar, Bengaluru"
            autoComplete="address-level2"
          />
        </label>
      </div>

      {/* Suggested Cities Quick Pills */}
      <div className="relative mt-3.5 flex flex-wrap items-center gap-1.5" aria-label="Suggested cities">
        <span className="text-[0.65rem] font-bold text-ink/60 uppercase tracking-wider mr-1">Popular:</span>
        {citySuggestions.map((item) => {
          const isSelected = locality.toLowerCase().includes(item.name.toLowerCase());
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                setLocality(item.name);
                setError(null);
              }}
              className={cn(
                "rounded-full px-3 py-1 text-[0.68rem] font-bold transition-all duration-200",
                isSelected
                  ? "bg-[#241727] text-white shadow-xs scale-105"
                  : item.isLive
                  ? "border border-indigo/15 bg-white text-ink/80 hover:border-indigo/30 hover:bg-cream"
                  : "border border-dashed border-ink/20 bg-surface-container-low text-ink/60 hover:text-ink"
              )}
            >
              {item.label ?? item.name}
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="relative mt-3 text-xs font-semibold text-coral animate-shake" role="alert">
          {error}
        </p>
      ) : null}

      {/* Bottom Quote Strip & Action */}
      <div className="relative mt-5 flex flex-col gap-3.5 border-t border-indigo/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral/10 text-coral font-bold text-sm shrink-0">
            ₹
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-ink">{selectedService.label}</span>
              <span className="rounded-full bg-leaf/10 px-2 py-0.5 text-[0.65rem] font-bold text-leaf">
                {selectedService.price}
              </span>
            </div>
            <p className="text-[0.68rem] text-ink/70">{selectedService.note}</p>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="shrink-0 rounded-2xl bg-gradient-to-r from-[#241727] via-[#371f3a] to-[#241727] px-6 py-4 font-outfit text-sm font-bold text-white shadow-lifted hover:from-[#371f3a] hover:to-[#4a2b52] hover:shadow-xl transition-all duration-300 border-transparent"
        >
          {isPending ? <Search className="h-4 w-4 animate-pulse" /> : null}
          {isPending ? "Checking availability..." : "Check Availability in My Area"}
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <div className="relative mt-3.5 flex items-center gap-2 rounded-xl bg-leaf/5 px-3 py-2 text-[0.68rem] font-medium text-ink/80">
        <CheckCircle2 className="h-3.5 w-3.5 text-leaf shrink-0" />
        <span>No upfront payment · Capacity & transparent quotes confirmed before booking</span>
      </div>
    </form>
  );
}
