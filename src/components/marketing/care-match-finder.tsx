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
      className="relative w-full min-w-0 overflow-hidden rounded-[2rem] border border-white/80 bg-white/95 p-4 sm:p-5 lg:p-5 shadow-[0_16px_50px_rgba(0,0,0,0.16)] backdrop-blur-2xl"
      aria-label="Start a PetSaathi care match"
      noValidate
    >
      {/* Header */}
      <div className="relative flex min-w-0 items-center justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 text-[0.62rem] sm:text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[#d45638] font-outfit">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Instant Care Match
          </span>
          <h2 className="mt-0.5 truncate font-display text-[1.25rem] sm:text-[1.45rem] font-bold tracking-tight text-[#1e1322]">
            Find trusted local care
          </h2>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#eaf4ec] px-2.5 py-1 text-[0.65rem] sm:text-[0.68rem] font-bold text-[#357a4e] font-outfit">
          <ShieldCheck className="h-3.5 w-3.5 text-[#357a4e]" /> <span>100% Vetted</span>
        </span>
      </div>

      {/* Fields Grid - 2 columns side by side on both mobile & desktop */}
      <div className="relative mt-3 grid grid-cols-2 gap-2">
        {/* Care Service Selection (Full Width) */}
        <label className="group relative col-span-2 flex min-w-0 flex-col gap-0.5 rounded-xl border border-[#e8e2e9] bg-[#fbf9fa] px-3 py-1.5 transition focus-within:border-indigo/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo/10 hover:border-[#d9cfdc] sm:px-3.5 sm:py-2">
          <span className="flex items-center gap-1.5 text-[0.62rem] sm:text-[0.65rem] font-bold uppercase tracking-wider text-[#938290]">
            <PawPrint className="h-3.5 w-3.5 text-[#d45638]" />
            Care Service
          </span>
          <div className="relative flex items-center">
            <select
              name="service"
              value={service}
              onChange={(event) => setService(event.target.value as typeof service)}
              className="w-full appearance-none bg-transparent pr-7 text-[0.82rem] sm:text-[0.88rem] font-bold text-[#231526] focus:outline-none cursor-pointer truncate"
            >
              {careOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} — {option.note}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 h-4 w-4 text-[#938290] transition group-focus-within:text-[#231526]" />
          </div>
        </label>

        {/* Pet Type Selection (Column 1) */}
        <label className="group relative col-span-1 flex min-w-0 flex-col gap-0.5 rounded-xl border border-[#e8e2e9] bg-[#fbf9fa] px-3 py-1.5 transition focus-within:border-indigo/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo/10 hover:border-[#d9cfdc] sm:px-3.5 sm:py-2">
          <span className="flex items-center gap-1.5 text-[0.62rem] sm:text-[0.65rem] font-bold uppercase tracking-wider text-[#938290]">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#357a4e]" />
            Pet Type
          </span>
          <div className="relative flex items-center">
            <select
              name="petType"
              value={petType}
              onChange={(event) => setPetType(event.target.value as PetType)}
              className="w-full appearance-none bg-transparent pr-6 text-[0.82rem] sm:text-[0.88rem] font-bold text-[#231526] focus:outline-none cursor-pointer"
            >
              <option value="DOG">Dog 🐕</option>
              <option value="CAT">Cat 🐈</option>
              <option value="RABBIT">Rabbit 🐇</option>
              <option value="BIRD">Bird 🦜</option>
              <option value="FISH">Fish 🐠</option>
              <option value="TURTLE">Turtle 🐢</option>
              <option value="RAT">Small Pet 🐹</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 h-4 w-4 text-[#938290] transition group-focus-within:text-[#231526]" />
          </div>
        </label>

        {/* City or Locality Input (Column 2) */}
        <label className="group relative col-span-1 flex min-w-0 flex-col gap-0.5 rounded-xl border border-[#e8e2e9] bg-[#fbf9fa] px-3 py-1.5 transition focus-within:border-indigo/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo/10 hover:border-[#d9cfdc] sm:px-3.5 sm:py-2">
          <span className="flex items-center gap-1.5 text-[0.62rem] sm:text-[0.65rem] font-bold uppercase tracking-wider text-[#938290]">
            <MapPin className="h-3.5 w-3.5 text-[#d97706]" />
            City or Locality
          </span>
          <input
            value={locality}
            name="locality"
            onChange={(event) => {
              setLocality(event.target.value);
              if (error) setError(null);
            }}
            className="w-full bg-transparent text-[0.82rem] sm:text-[0.88rem] font-bold text-[#231526] placeholder:text-[#938290]/50 placeholder:font-normal focus:outline-none truncate"
            placeholder="e.g. Indiranagar, BLR"
            autoComplete="address-level2"
          />
        </label>
      </div>

      {/* Suggested Cities Quick Pills */}
      <div className="relative mt-2.5 flex flex-wrap items-center gap-1.5" aria-label="Suggested cities">
        <span className="text-[0.62rem] sm:text-[0.65rem] font-bold text-[#716573] uppercase tracking-wider mr-0.5">Popular:</span>
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
                "rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold transition-all duration-200",
                isSelected
                  ? "bg-[#231526] text-white shadow-xs"
                  : item.isLive
                  ? "border border-[#e5dfe6] bg-white text-[#453648] hover:border-[#d0c6d2] hover:bg-[#faf7f9]"
                  : "border border-dashed border-[#d8b4e2] bg-[#fbf5fd] text-[#553b5c] hover:bg-[#f5eafd]"
              )}
            >
              {item.label ?? item.name}
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="relative mt-2 text-xs font-semibold text-coral animate-shake" role="alert">
          {error}
        </p>
      ) : null}

      {/* Bottom Quote Strip & Action */}
      <div className="relative mt-3 flex items-center justify-between gap-2 sm:gap-3 max-[430px]:flex-col max-[430px]:items-stretch">
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#faece7] text-[#cf4d30] font-bold text-sm shrink-0">
            ₹
          </div>
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="min-w-0 truncate text-[0.78rem] sm:text-[0.82rem] font-bold text-[#1e1322]">{selectedService.label}</span>
              <span className="rounded-full bg-[#eaf4ec] px-1.5 py-0.5 text-[0.62rem] font-bold text-[#357a4e] shrink-0">
                {selectedService.price}
              </span>
            </div>
            <p className="text-[0.62rem] sm:text-[0.68rem] text-[#6d616f] truncate">{selectedService.note}</p>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="shrink-0 rounded-xl bg-[#231526] hover:bg-[#341d39] px-3 sm:px-3.5 py-2 sm:py-2.5 font-outfit text-xs sm:text-[0.72rem] font-bold text-white shadow-lifted hover:shadow-xl transition-all duration-300 border-transparent whitespace-nowrap max-[430px]:w-full max-[430px]:justify-center"
        >
          {isPending ? <Search className="h-3.5 w-3.5 animate-pulse" /> : null}
          <span>{isPending ? "Checking..." : "Check Availability in My Area"}</span>
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>

      {/* Bottom Guarantee Pill */}
      <div className="relative mt-2.5 flex items-center gap-1.5 rounded-xl bg-[#f2f6f3] px-3 py-1.5 text-[0.64rem] sm:text-[0.68rem] font-medium text-[#415647]">
        <CheckCircle2 className="h-3.5 w-3.5 text-[#357a4e] shrink-0" />
        <span className="leading-snug truncate">No upfront payment · Capacity & transparent quotes confirmed before booking</span>
      </div>
    </form>
  );
}
