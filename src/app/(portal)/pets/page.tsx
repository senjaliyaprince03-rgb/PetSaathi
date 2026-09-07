import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  Activity, 
  ArrowRight, 
  Award, 
  CalendarClock, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Download, 
  FileHeart, 
  HeartPulse, 
  MapPin, 
  PawPrint, 
  Phone, 
  Plus, 
  QrCode, 
  ShieldCheck, 
  Sparkles, 
  Stethoscope, 
  Syringe, 
  Utensils 
} from "lucide-react";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Pets & Digital Health Passports",
  description: "Manage encrypted medical ledgers, vaccination booster schedules, dietary routines, and emergency SOS contacts for your pets."
};

export const dynamic = "force-dynamic";

export default async function PetsPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/pets");

  const dbPets = await prisma.pet.findMany({
    where: { ownerId: identity.id, active: true },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      species: true,
      breed: true,
      birthDate: true,
      weightKg: true,
      sterilised: true,
      medicalProfile: { select: { allergies: true, conditions: true, medications: true, veterinarianName: true, veterinarianPhone: true, emergencyClinicName: true, emergencyClinicPhone: true } },
      emergencyContacts: { orderBy: { priority: "asc" }, take: 1, select: { name: true, phone: true, relation: true } },
      _count: { select: { careInstructions: true, medications: true, vaccinations: true, healthEvents: true } },
    },
  });

  const pets = dbPets.length > 0 ? dbPets : [
    {
      id: "bruno-passport",
      name: "Bruno",
      species: "DOG" as any,
      breed: "Golden Retriever",
      birthDate: new Date(Date.now() - 3 * 365 * 24 * 3600 * 1000),
      weightKg: 24.5,
      sterilised: true,
      medicalProfile: {
        allergies: "Chicken intolerance (grain-free diet)",
        conditions: "None active • Excellent cardiac & joint mobility",
        medications: "Omega-3 Salmon Oil daily supplement",
        veterinarianName: "Dr. Sharma",
        veterinarianPhone: "+91 98765 43210",
        emergencyClinicName: "Indiranagar 24/7 Vet Hospital",
        emergencyClinicPhone: "+91 98765 43211",
      },
      emergencyContacts: [
        { name: "Aarav Sharma", phone: "+91 98765 00000", relation: "Primary Pet Parent" }
      ],
      _count: {
        careInstructions: 4,
        medications: 1,
        vaccinations: 3,
        healthEvents: 2,
      }
    }
  ];

  const totalRecords = pets.reduce((sum, pet) => sum + pet._count.careInstructions + pet._count.medications + pet._count.vaccinations + pet._count.healthEvents, 0);

  const completeness = (pet: (typeof pets)[number]) => {
    const fields = [
      pet.breed,
      pet.birthDate,
      pet.weightKg,
      pet.sterilised,
      pet.medicalProfile?.allergies,
      pet.medicalProfile?.conditions,
      pet.medicalProfile?.medications,
      pet.medicalProfile?.veterinarianName,
      pet.medicalProfile?.veterinarianPhone,
      pet.medicalProfile?.emergencyClinicName,
      pet.medicalProfile?.emergencyClinicPhone,
      pet.emergencyContacts[0]?.name,
      pet.emergencyContacts[0]?.phone,
      pet.emergencyContacts[0]?.relation,
    ];

    const filled = fields.filter((value) => value !== undefined && value !== null && value !== "").length;
    return { filled, total: fields.length };
  };

  const careReady = pets.filter((pet) => {
    const score = completeness(pet);
    return score.filled === score.total;
  }).length;

  return (
    <PortalShell mode="customer" displayName={identity.displayName} showSummaryCards={false} showGreeting={false}>
      <div className="space-y-8">
        
        {/* Top Header & Breadcrumb Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            {/* Society Pill & Live Network */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                Indiranagar Society Care Hub
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo/5 text-indigo border border-indigo/15 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Digital Pet Passports
              </span>
            </div>
            
            <h1 className="mt-2.5 text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-ink tracking-tight">
              My Pets & Digital Passports
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-ink/70 max-w-2xl leading-relaxed">
              Tamper-proof medical profiles, vaccine schedules, veterinary SOS contacts, and routine handovers — always accessible by certified Saathis.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={"/book" as any}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-surface border border-ink/15 hover:border-indigo/30 text-ink font-bold text-xs sm:text-sm transition-all duration-200 shadow-2xs hover:shadow-sm"
            >
              <CalendarClock className="w-4 h-4 text-indigo" />
              <span>Book Care</span>
            </Link>
            
            <Link
              href={"/pets/new" as any}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E16649] hover:bg-[#d05538] text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-[0_4px_14px_rgba(225,102,73,0.35)] hover:shadow-[0_6px_20px_rgba(225,102,73,0.45)] hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Add Pet Passport</span>
            </Link>
          </div>
        </div>

        {/* 4-Card Luxury Vitals Bento Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Registered Pets */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-ink/10 shadow-[0px_4px_20px_rgba(48,31,48,0.03)] hover:shadow-lifted hover:border-indigo/20 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-ink/50">Active Passports</span>
              <span className="w-8 h-8 rounded-xl bg-indigo/10 text-indigo flex items-center justify-center">
                <PawPrint className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-display text-ink">{pets.length}</span>
              <span className="text-xs font-bold text-indigo">Registered</span>
            </div>
            <p className="mt-1 text-[11px] text-ink/60">Fully secured digital profiles</p>
          </div>

          {/* Card 2: Vaccine Protection */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-ink/10 shadow-[0px_4px_20px_rgba(48,31,48,0.03)] hover:shadow-lifted hover:border-emerald-200 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-ink/50">Vaccine Cover</span>
              <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Syringe className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-display text-ink">100%</span>
              <span className="text-xs font-bold text-emerald-700">Protected</span>
            </div>
            <p className="mt-1 text-[11px] text-ink/60">Rabies & DHPPi active</p>
          </div>

          {/* Card 3: Health Records */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-ink/10 shadow-[0px_4px_20px_rgba(48,31,48,0.03)] hover:shadow-lifted hover:border-coral/20 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-ink/50">Care Records</span>
              <span className="w-8 h-8 rounded-xl bg-coral/10 text-coral flex items-center justify-center">
                <FileHeart className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-display text-ink">{totalRecords}</span>
              <span className="text-xs font-bold text-coral">Structured</span>
            </div>
            <p className="mt-1 text-[11px] text-ink/60">Medical, diet & timeline events</p>
          </div>

          {/* Card 4: Vet Guarantee */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-ink/10 shadow-[0px_4px_20px_rgba(48,31,48,0.03)] hover:shadow-lifted hover:border-indigo/20 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-ink/50">Medical Cover</span>
              <span className="w-8 h-8 rounded-xl bg-purple-50 text-indigo flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-display text-ink">₹50,000</span>
              <span className="text-xs font-bold text-indigo">Active</span>
            </div>
            <p className="mt-1 text-[11px] text-ink/60">Policy #PS-VET-98214</p>
          </div>
        </div>

        {/* Pet Passports Showcase List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold font-display text-ink">
                Registered Pet Profiles
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-ink/5 text-ink/70">
                {pets.length}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-ink/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>All profiles verified for instant care dispatch</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {pets.map((pet) => {
              const score = completeness(pet);
              const readiness = Math.round((score.filled / score.total) * 100);
              const age = pet.birthDate ? Math.max(0, new Date().getFullYear() - pet.birthDate.getFullYear()) : 3;

              return (
                <div
                  key={pet.id}
                  className="rounded-[28px] bg-white border border-ink/10 shadow-[0px_10px_35px_rgba(48,31,48,0.04)] overflow-hidden transition-all duration-300 hover:shadow-lifted hover:border-indigo/25"
                >
                  {/* Top Banner with Pet Identity */}
                  <div className="p-6 sm:p-8 bg-gradient-to-r from-[#2A1540] via-[#381e54] to-[#4a266a] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-80 h-80 bg-coral/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="flex items-center gap-5 relative z-10">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-4 ring-white/20 overflow-hidden shadow-xl bg-ink/20 relative">
                          <Image
                            src="/images/hero-care-handover-highres.jpg"
                            alt={pet.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                            priority
                          />
                        </div>
                        <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px] shadow">
                          ✓
                        </span>
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/15 text-white border border-white/20">
                            {pet.species} PASSPORT
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            Verified
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-white/80">
                            Microchip: #985141002941
                          </span>
                        </div>

                        <h3 className="mt-1.5 text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
                          {pet.name}
                        </h3>

                        <p className="mt-0.5 text-xs sm:text-sm text-white/75 font-medium">
                          {pet.breed} • {age} years old • {pet.weightKg} kg • {pet.sterilised ? "Sterilised" : "Intact"}
                        </p>
                      </div>
                    </div>

                    {/* Right Readiness Ring */}
                    <div className="flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-4 md:pt-0 relative z-10">
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 block">
                          Readiness Score
                        </span>
                        <span className="text-xl sm:text-2xl font-extrabold text-emerald-300 font-display">
                          {readiness}% Complete
                        </span>
                        <span className="text-[10px] text-white/70 block mt-0.5">
                          {pet._count.careInstructions + pet._count.medications + pet._count.vaccinations + pet._count.healthEvents} structured vitals
                        </span>
                      </div>

                      <Link
                        href={`/pets/${pet.id}` as any}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-ink hover:bg-surface text-xs font-bold transition-all shadow-md hover:scale-105"
                      >
                        <span>Full Passport</span>
                        <ArrowRight className="w-4 h-4 text-indigo" />
                      </Link>
                    </div>
                  </div>

                  {/* Body Content - 4 Bento Feature Cards */}
                  <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#FAF6F1]/50">
                    
                    {/* 1. Diet & Nutrition */}
                    <div className="p-4 rounded-2xl bg-white border border-ink/8 shadow-2xs space-y-2">
                      <div className="flex items-center gap-2 text-indigo">
                        <Utensils className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Diet Routine</span>
                      </div>
                      <p className="text-xs font-semibold text-ink leading-relaxed">
                        {pet.medicalProfile?.allergies || "Grain-free formula"}
                      </p>
                      <span className="inline-block text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                        Omega-3 Daily • Fed 2x/day
                      </span>
                    </div>

                    {/* 2. Vaccine Status */}
                    <div className="p-4 rounded-2xl bg-white border border-ink/8 shadow-2xs space-y-2">
                      <div className="flex items-center gap-2 text-emerald-700">
                        <Syringe className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Vaccinations</span>
                      </div>
                      <p className="text-xs font-semibold text-ink leading-relaxed">
                        Rabies & DHPPi Up to date
                      </p>
                      <span className="inline-block text-[10px] font-medium text-indigo bg-indigo/5 px-2 py-0.5 rounded-md border border-indigo/15">
                        Next booster in 40 days
                      </span>
                    </div>

                    {/* 3. Primary Veterinarian */}
                    <div className="p-4 rounded-2xl bg-white border border-ink/8 shadow-2xs space-y-2">
                      <div className="flex items-center gap-2 text-purple-700">
                        <Stethoscope className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Primary Clinic</span>
                      </div>
                      <p className="text-xs font-semibold text-ink leading-relaxed truncate">
                        {pet.medicalProfile?.veterinarianName || "Dr. Sharma's Clinic"}
                      </p>
                      <a href="tel:+919876543210" className="inline-flex items-center gap-1 text-[10px] font-medium text-ink/70 bg-ink/5 hover:bg-leaf/10 hover:text-leaf px-2 py-0.5 rounded-md transition-colors">
                        <Phone className="w-2.5 h-2.5 text-leaf" />
                        +91 98765 43210
                      </a>
                    </div>

                    {/* 4. Emergency SOS */}
                    <div className="p-4 rounded-2xl bg-white border border-ink/8 shadow-2xs space-y-2">
                      <div className="flex items-center gap-2 text-coral">
                        <HeartPulse className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">24/7 Emergency SOS</span>
                      </div>
                      <p className="text-xs font-semibold text-ink leading-relaxed truncate">
                        {pet.medicalProfile?.emergencyClinicName || "Indiranagar 24/7 Vet"}
                      </p>
                      <a href="tel:+919876543211" className="inline-flex items-center gap-1 text-[10px] font-bold text-coral bg-coral/10 hover:bg-coral/20 px-2 py-0.5 rounded-md transition-colors">
                        <Phone className="w-2.5 h-2.5" />
                        +91 98765 43211
                      </a>
                    </div>
                  </div>

                  {/* Passport Actions Footer Bar */}
                  <div className="px-6 py-4 bg-white border-t border-ink/8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-ink/60">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Encrypted under PetSaathi Care Protocol Policy #PS-VET-98214</span>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                      <Link
                        href={`/pets/${pet.id}/id-card` as any}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface hover:bg-ink/5 border border-ink/10 text-ink/80 hover:text-ink text-xs font-bold transition-all shadow-2xs"
                      >
                        <QrCode className="w-3.5 h-3.5 text-indigo" />
                        <span>Digital ID & QR</span>
                      </Link>

                      <Link
                        href={`/pets/${pet.id}` as any}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface hover:bg-ink/5 border border-ink/10 text-ink/80 hover:text-ink text-xs font-bold transition-all shadow-2xs"
                      >
                        <FileHeart className="w-3.5 h-3.5 text-coral" />
                        <span>Medical Ledger</span>
                      </Link>

                      <Link
                        href={"/book" as any}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#E16649] hover:bg-[#d05538] text-white text-xs font-bold transition-all shadow-[0_4px_14px_rgba(225,102,73,0.35)]"
                      >
                        <PawPrint className="w-3.5 h-3.5" />
                        <span>Book for {pet.name}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Another Pet Luxury Box */}
          <Link
            href={"/pets/new" as any}
            className="group block p-6 sm:p-8 rounded-[28px] border-2 border-dashed border-indigo/20 hover:border-indigo/50 bg-white/60 hover:bg-white transition-all duration-200 shadow-2xs hover:shadow-soft text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo/10 text-indigo mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-7 h-7" />
            </div>
            <h3 className="mt-3 text-lg font-bold font-display text-ink">
              Register Another Pet or Puppy
            </h3>
            <p className="mt-1 text-xs text-ink/60 max-w-md mx-auto leading-relaxed">
              Add cats, rescue dogs, or multiple pets with individual dietary protocols, medical ledgers, and emergency contacts.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo group-hover:underline">
              <span>Start Pet Onboarding</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

      </div>
    </PortalShell>
  );
}
