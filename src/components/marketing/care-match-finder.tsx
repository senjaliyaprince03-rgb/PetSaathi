"use client";

import { ArrowRight, CheckCircle2, MapPin, PawPrint, Search, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";

const careOptions = [
  { value: "DOG_WALK_30", label: "Dog walking", note: "30-minute neighbourhood care" },
  { value: "HOME_VISIT", label: "Home visit", note: "Food, water and a reassuring check-in" },
  { value: "HOME_SITTING_60", label: "Home pet sitting", note: "Companionship in a familiar space" },
  { value: "GROOMING_HOME", label: "At-home grooming", note: "Hygiene and grooming at your doorstep" },
  { value: "VET_SUPPORT", label: "Veterinary support", note: "Professional clinical coordination" },
  { value: "TRAINING_ASSESSMENT", label: "Training assessment", note: "Reward-led behaviour guidance" },
  { value: "PET_TAXI", label: "Pet taxi", note: "A planned, traceable pet journey" }
] as const;

const citySuggestions = ["Bengaluru", "Pune", "Mumbai", "Gurugram", "Ahmedabad", "Surat"];

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
      setError("Enter a city or locality so we can check care availability.");
      return;
    }

    setError(null);
    const query = new URLSearchParams({ service, petType, locality: safeLocality });
    startTransition(() => router.push(`/book?${query.toString()}`));
  };

  return (
    <form
      onSubmit={submit}
      className="relative mt-9 overflow-hidden rounded-[2rem] border border-paper/90 bg-paper/[0.92] p-5 shadow-2xl backdrop-blur-xl sm:p-6"
      aria-label="Start a PetSaathi care match"
      noValidate
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-saffron/25 blur-3xl" />
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-indigo/70 font-outfit">Instant Care Match</p>
          <p className="mt-1 text-sm font-bold text-ink">Share the care context in under a minute.</p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full bg-secondary-container/50 px-3 py-1.5 text-[0.65rem] font-bold text-on-secondary-container sm:inline-flex">
          <ShieldCheck className="h-3.5 w-3.5" /> Checked per service
        </span>
      </div>

      <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
        <label className="care-finder-field sm:col-span-2">
          <span className="care-finder-label"><PawPrint className="h-3.5 w-3.5" />Care service</span>
          <select value={service} onChange={(event) => setService(event.target.value as typeof service)} className="care-finder-input">
            {careOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>

        <label className="care-finder-field">
          <span className="care-finder-label"><CheckCircle2 className="h-3.5 w-3.5" />Pet type</span>
          <select value={petType} onChange={(event) => setPetType(event.target.value as PetType)} className="care-finder-input">
            <option value="DOG">Dog</option>
            <option value="CAT">Cat</option>
            <option value="RABBIT">Rabbit</option>
            <option value="BIRD">Bird</option>
            <option value="FISH">Fish</option>
            <option value="TURTLE">Turtle</option>
            <option value="RAT">Rat / Mouse</option>
          </select>
        </label>

        <label className="care-finder-field">
          <span className="care-finder-label"><MapPin className="h-3.5 w-3.5" />City or locality</span>
          <input
            value={locality}
            onChange={(event) => {
              setLocality(event.target.value);
              if (error) setError(null);
            }}
            className="care-finder-input"
            placeholder="e.g. Indiranagar, Bengaluru"
            autoComplete="address-level2"
          />
        </label>
      </div>

      <div className="relative mt-3 flex flex-wrap gap-2" aria-label="Suggested cities">
        {citySuggestions.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => {
              setLocality(city);
              setError(null);
            }}
            className="rounded-full border border-surface-variant bg-surface-container-low px-3 py-1.5 text-[0.65rem] font-bold text-on-surface-variant transition hover:border-secondary hover:bg-secondary-container hover:text-on-secondary-container"
          >
            {city}
          </button>
        ))}
      </div>

      {error ? <p className="relative mt-3 text-xs font-semibold text-[#301F30]" role="alert">{error}</p> : null}

      <div className="relative mt-5 flex flex-col gap-3 border-t border-indigo/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold text-ink">{selectedService.label}</p>
          <p className="mt-0.5 text-[0.68rem] text-ink/45">{selectedService.note}</p>
        </div>
        <Button type="submit" size="lg" disabled={isPending} className="shrink-0 font-outfit bg-[#301F30] hover:bg-[#301F30]/90 text-white border-transparent">
          {isPending ? <Search className="h-4 w-4 animate-pulse" /> : null}
          {isPending ? "Opening request..." : "Start Assisted Matching"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <p className="relative mt-3 text-[0.65rem] font-medium leading-5 text-ink/50">
        No payment is requested here. Availability, permissions, capacity, and the current quote are checked before confirmation.
      </p>
    </form>
  );
}
