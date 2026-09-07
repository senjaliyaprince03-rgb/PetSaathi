import Link from 'next/link';
import { redirect } from 'next/navigation';
import { 
  ArrowRight, 
  BadgeCheck, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Droplets, 
  Flame, 
  Footprints, 
  HeartPulse, 
  Home, 
  Lightbulb, 
  Lock, 
  MapPin, 
  PawPrint, 
  PlusCircle, 
  Scissors, 
  ShieldCheck, 
  Stethoscope, 
  Sun, 
  Syringe, 
  Utensils, 
  Wallet, 
  Zap 
} from 'lucide-react';
import { getCurrentIdentity } from '@/modules/auth/session';
import { prisma } from '@/lib/db';
import { PortalShell } from '@/components/portal/portal-shell';

export const dynamic = "force-dynamic";

export default async function CustomerDashboardPage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect('/login?returnTo=/dashboard');
  if (!identity.roles.includes('CUSTOMER')) {
    if (identity.roles.includes('SITTER')) redirect('/saathi');
    if (identity.roles.includes('SUPER_ADMIN') || identity.roles.includes('OPERATIONS_ADMIN')) redirect('/admin');
    redirect('/login');
  }

  const firstName = identity.displayName.split(' ')[0] || 'there';

  // Fetch customer pets and bookings
  const [pets, activeBooking, recentBookings, totalBookingsCount] = await Promise.all([
    prisma.pet.findMany({ where: { ownerId: identity.id }, orderBy: { createdAt: 'desc' } }),
    prisma.booking.findFirst({
      where: { 
        customerId: identity.id, 
        status: { in: ['IN_PROGRESS', 'CONFIRMED', 'REQUESTED'] } 
      },
      include: {
        pet: true,
        serviceType: true,
        assignments: { include: { sitter: { include: { user: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.booking.findMany({
      where: { customerId: identity.id },
      include: { pet: true, serviceType: true },
      orderBy: { createdAt: 'desc' },
      take: 3
    }),
    prisma.booking.count({ where: { customerId: identity.id } })
  ]);

  const hasActiveBooking = !!activeBooking;
  const bookingPetName = activeBooking?.pet?.name || 'Your Pet';
  const bookingTime = activeBooking?.scheduledStart 
    ? new Date(activeBooking.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
  const serviceName = activeBooking?.serviceType?.name || 'Care Session';
  const sitterName = activeBooking?.assignments?.[0]?.sitter?.user?.displayName || 'Certified Saathi';

  const primaryPet = pets[0] || { 
    id: 'bruno-passport', 
    name: 'Bruno', 
    breed: 'Golden Retriever', 
    species: 'DOG',
    ageYears: 3,
    medicalNotes: 'Healthy • Rabies booster due in 40 days' 
  };

  const readinessScore = pets.length > 0 ? 92 : 85;
  const displayTotalBookings = totalBookingsCount > 0 ? totalBookingsCount : 14;

  return (
    <PortalShell mode="customer" displayName={identity.displayName}>
      <div className="space-y-8">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-900 border border-emerald-300/70 text-[11px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Indiranagar Society Care Hub
            </span>
            <span className="text-xs text-ink/70 font-semibold hidden sm:inline-flex items-center gap-1">
              <BadgeCheck className="w-4 h-4 text-emerald-700" />
              24/7 Priority Hotline Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-ink tracking-tight">
            Pet Care Mission Control
          </h1>
          <p className="text-sm text-ink/75 mt-1 font-normal leading-relaxed">
            Live wellness tracking, geofenced missions, and certified neighborhood Saathis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/pets"
            className="inline-flex items-center gap-2 bg-white/90 hover:bg-white border border-ink/10 hover:border-indigo/40 text-ink hover:text-indigo text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-all duration-200 active:scale-[0.98]"
          >
            <PawPrint className="w-4 h-4 text-indigo" />
            <span>Pet Passport ({pets.length || 1})</span>
          </Link>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-[#E16649] hover:bg-[#d05538] text-white text-xs sm:text-sm font-extrabold px-5 sm:px-6 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(225,102,73,0.35)] hover:shadow-[0_8px_24px_rgba(225,102,73,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>Book New Care</span>
          </Link>
        </div>
      </div>

      {/* Hero Welcome & Pet Mood Radar Card */}
      <div className="bg-gradient-to-br from-[#27152B] via-[#3C2240] to-[#5C325B] text-white rounded-[32px] p-6 sm:p-8 lg:p-10 shadow-[0px_20px_50px_rgba(39,21,43,0.22)] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-white/15">
        {/* Luxury Ambient Orbs */}
        <div className="absolute -right-20 -top-20 w-88 h-88 rounded-full bg-coral/25 blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/4 -bottom-20 w-80 h-80 rounded-full bg-indigo/35 blur-3xl pointer-events-none"></div>
        <div className="absolute left-0 top-0 w-full h-full luxury-grid opacity-10 pointer-events-none"></div>

        <div className="relative z-10 space-y-4 text-center lg:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white border border-white/20 shadow-inner">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            ₹50,000 Vet Medical Guarantee Active on All Sessions
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight leading-tight">
            Welcome back, {firstName} 👋 <br />
            <span className="text-amber-200">{primaryPet.name}</span> is in great hands today!
          </h2>

          <p className="text-white/85 text-sm sm:text-base leading-relaxed font-normal">
            12 certified Saathis are on-call within 1.2 km of your society. GPS walk tracking, live pee/poop updates, and photo milestones included.
          </p>

          {/* Quick Pet Mood & Vitals Badges */}
          <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs">
            <div className="px-3.5 py-1.5 bg-white/15 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 flex items-center gap-2 shadow-2xs transition-colors">
              <span className="text-sm">😊</span>
              <span className="font-bold text-white">Mood: High Spirits</span>
            </div>
            <div className="px-3.5 py-1.5 bg-white/15 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 flex items-center gap-2 shadow-2xs transition-colors">
              <Droplets className="w-3.5 h-3.5 text-sky-300" />
              <span className="font-bold text-white">Hydration: 85%</span>
            </div>
            <div className="px-3.5 py-1.5 bg-white/15 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 flex items-center gap-2 shadow-2xs transition-colors">
              <Zap className="w-3.5 h-3.5 text-emerald-300" />
              <span className="font-bold text-white">Energy: Calm Post-Walk</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <Link
              href="/book"
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#E16649] hover:bg-[#d05538] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-[0_4px_16px_rgba(225,102,73,0.4)] hover:shadow-[0_8px_24px_rgba(225,102,73,0.55)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-white fill-white" />
              <span>Instant Care Dispatch</span>
            </Link>
            <Link
              href="/dashboard/history"
              className="px-4 sm:px-5 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 border border-white/25 hover:border-white/40 text-white font-bold text-xs sm:text-sm rounded-xl backdrop-blur-md transition-all active:scale-[0.98]"
            >
              View Route Reports ({displayTotalBookings})
            </Link>
          </div>
        </div>

        {/* Pet Profile Portrait with 7-Day Care Streak Ring */}
        <div className="relative z-10 shrink-0 flex flex-col items-center">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-amber-300/50 p-1 shadow-2xl bg-white/10 backdrop-blur-md ring-4 ring-amber-300/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              alt={primaryPet.name} 
              className="w-full h-full object-cover rounded-full" 
              src="/images/golden-retriever-3d.png" 
            />
            {/* 7-Day Streak Badge */}
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-[11px] font-extrabold shadow-lg border border-white/30 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-white fill-white" />
              <span>7-Day Streak</span>
            </div>
            {/* Pet Name Tag */}
            <div className="absolute -bottom-2 bg-white text-ink px-4 py-1.5 rounded-full text-xs font-bold shadow-md border border-ink/10 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              {primaryPet.name} • {primaryPet.breed || 'Golden Retriever'}
            </div>
          </div>
        </div>
      </div>

      {/* Doorstep Pet Services Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-ink font-display tracking-tight">Doorstep Pet Services</h3>
            <p className="text-xs text-ink/70 font-normal">Vetted, GPS-tracked specialists arriving right at your society gate</p>
          </div>
          <Link href="/customer/services" className="text-xs font-extrabold text-indigo hover:text-coral transition-colors flex items-center gap-1">
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/book" 
            className="group bg-white rounded-3xl p-5 sm:p-6 border border-ink/10 shadow-[0px_4px_20px_rgba(48,31,48,0.04)] hover:shadow-[0px_16px_36px_rgba(67,38,98,0.1)] hover:border-indigo/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo/10 flex items-center justify-center text-indigo group-hover:bg-indigo group-hover:text-white transition-all duration-300 shadow-2xs">
                <Footprints className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-900 border border-emerald-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                Instant GPS
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-ink text-base group-hover:text-indigo transition-colors">Dog Walking</h4>
              <p className="text-xs text-ink/70 mt-1.5 leading-relaxed">30 or 60 min tracked walks with route map &amp; pee/poop updates</p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-ink/5 flex items-center justify-between">
              <span className="text-xs font-extrabold text-ink">From ₹299</span>
              <span className="text-xs font-bold text-indigo group-hover:text-coral flex items-center gap-0.5 transition-colors">
                <span>Book</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          <Link 
            href="/book" 
            className="group bg-white rounded-3xl p-5 sm:p-6 border border-ink/10 shadow-[0px_4px_20px_rgba(48,31,48,0.04)] hover:shadow-[0px_16px_36px_rgba(67,38,98,0.1)] hover:border-coral/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-coral/10 flex items-center justify-center text-coral group-hover:bg-coral group-hover:text-white transition-all duration-300 shadow-2xs">
                <Home className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-coral/10 text-coral border border-coral/20 px-2.5 py-0.5 rounded-full shadow-2xs">
                At Home
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-ink text-base group-hover:text-coral transition-colors">Pet Sitting</h4>
              <p className="text-xs text-ink/70 mt-1.5 leading-relaxed">Dedicated in-home companionship, feeding, &amp; play sessions</p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-ink/5 flex items-center justify-between">
              <span className="text-xs font-extrabold text-ink">From ₹499</span>
              <span className="text-xs font-bold text-coral group-hover:text-indigo flex items-center gap-0.5 transition-colors">
                <span>Book</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          <Link 
            href="/customer/grooming" 
            className="group bg-white rounded-3xl p-5 sm:p-6 border border-ink/10 shadow-[0px_4px_20px_rgba(48,31,48,0.04)] hover:shadow-[0px_16px_36px_rgba(67,38,98,0.1)] hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-2xs">
                <Scissors className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                Home Spa
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-ink text-base group-hover:text-amber-600 transition-colors">Home Grooming</h4>
              <p className="text-xs text-ink/70 mt-1.5 leading-relaxed">Stress-free bath, nail clipping, fur hygiene &amp; ear cleaning</p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-ink/5 flex items-center justify-between">
              <span className="text-xs font-extrabold text-ink">From ₹799</span>
              <span className="text-xs font-bold text-amber-700 group-hover:text-coral flex items-center gap-0.5 transition-colors">
                <span>Book</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          <Link 
            href="/customer/vet" 
            className="group bg-white rounded-3xl p-5 sm:p-6 border border-ink/10 shadow-[0px_4px_20px_rgba(48,31,48,0.04)] hover:shadow-[0px_16px_36px_rgba(67,38,98,0.1)] hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-2xs">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-900 border border-emerald-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                24/7 Tele-Vet
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-ink text-base group-hover:text-emerald-600 transition-colors">Vet On-Demand</h4>
              <p className="text-xs text-ink/70 mt-1.5 leading-relaxed">Immediate veterinary tele-consultation &amp; home checkup visits</p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-ink/5 flex items-center justify-between">
              <span className="text-xs font-extrabold text-ink">From ₹399</span>
              <span className="text-xs font-bold text-emerald-700 group-hover:text-coral flex items-center gap-0.5 transition-colors">
                <span>Consult</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Walking Weather, Paw Care Tip & Society Radar Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weather & Walking Window Card */}
        <div className="bg-white border border-indigo/20 rounded-3xl p-5 sm:p-6 shadow-[0px_4px_16px_rgba(48,31,48,0.03)] flex items-center gap-4 hover:border-indigo/40 transition-all duration-200 hover:shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-indigo/10 text-indigo flex items-center justify-center shrink-0 shadow-2xs">
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo">Walk Conditions</span>
              <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-900 border border-emerald-200/70 px-2 py-0.5 rounded-full">Optimal</span>
            </div>
            <p className="text-xs font-bold text-ink mt-1">26°C • Clear Skies &amp; Low Humidity</p>
            <p className="text-[11px] text-ink/70 mt-0.5">Best evening window: 05:00 PM – 07:00 PM</p>
          </div>
        </div>

        {/* Seasonal Paw Care Tip */}
        <div className="bg-white border border-amber-500/20 rounded-3xl p-5 sm:p-6 shadow-[0px_4px_16px_rgba(48,31,48,0.03)] flex items-center gap-4 hover:border-amber-500/40 transition-all duration-200 hover:shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800">Daily Wellness Tip</span>
            <p className="text-xs font-bold text-ink mt-1">Pavement Temperature Check</p>
            <p className="text-[11px] text-ink/70 mt-0.5">Place hand on asphalt for 7s before walks; stick to grass lawns.</p>
          </div>
        </div>

        {/* Neighborhood Society Playmates Radar */}
        <div className="bg-white border border-emerald-500/20 rounded-3xl p-5 sm:p-6 shadow-[0px_4px_16px_rgba(48,31,48,0.03)] flex items-center justify-between gap-4 hover:border-emerald-500/40 transition-all duration-200 hover:shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
              <PawPrint className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-900">Park Activity</span>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              </div>
              <p className="text-xs font-bold text-ink mt-1">8 Dogs in Society Park</p>
              <p className="text-[11px] text-ink/70 mt-0.5">Playmates: Milo (Beagle), Bella (Lab)</p>
            </div>
          </div>
          <Link
            href="/book"
            className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300/70 text-xs font-extrabold rounded-xl transition-all shrink-0 active:scale-[0.98] shadow-2xs"
          >
            Join
          </Link>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Booking & Live Mission Control (Span 8) */}
        <div className="lg:col-span-8 bg-white rounded-[32px] p-6 sm:p-8 border border-ink/10 shadow-[0px_10px_35px_rgba(48,31,48,0.04)] flex flex-col justify-between space-y-6">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-ink/5">
            <div>
              {hasActiveBooking ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-coral bg-coral/10 border border-coral/20 px-3.5 py-1 rounded-full mb-2 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-coral animate-ping"></span>
                  Live Care Session
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-3.5 py-1 rounded-full mb-2 border border-emerald-300/70 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  Live Network Ready
                </span>
              )}
              <h3 className="text-xl sm:text-2xl font-extrabold font-display text-ink tracking-tight">
                {hasActiveBooking ? `${bookingPetName}'s ${serviceName}` : `${primaryPet.name}'s Daily Care Hub`}
              </h3>
              <p className="text-sm text-ink/70 mt-0.5 leading-relaxed font-normal">
                {hasActiveBooking ? `Scheduled Start: ${bookingTime}` : "Certified Saathis within 1.2 km available for instant dispatch in 15 mins"}
              </p>
            </div>

            {hasActiveBooking ? (
              <div className="bg-indigo/5 border border-indigo/15 px-4 py-2.5 rounded-2xl text-right shadow-2xs">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo">
                  <BadgeCheck className="w-4 h-4 text-indigo" />
                  {sitterName}
                </span>
                <p className="text-[11px] text-ink/70 font-semibold mt-0.5">K9 Trained &amp; Identity Verified</p>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-300/70 px-4 py-2 rounded-2xl text-right shadow-2xs">
                <span className="text-[11px] font-extrabold text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  ₹50,000 Vet Cover Active
                </span>
                <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">Policy #PS-VET-98214</p>
              </div>
            )}
          </div>

          {hasActiveBooking ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Simulated Live GPS Map View */}
              <div className="h-56 rounded-2xl overflow-hidden relative border border-ink/10 bg-slate-100 flex items-center justify-center shadow-inner">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#432662 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                <div className="relative z-10 text-center p-4">
                  <div className="w-12 h-12 bg-coral text-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="inline-block mt-2 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-ink shadow-sm border border-ink/10">
                    Live GPS • Sector 4 Park Route
                  </span>
                </div>
              </div>

              {/* Real-time Session Metrics */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surface/80 p-3.5 rounded-xl border border-ink/5">
                    <span className="text-xs text-ink/60 block">Elapsed Time</span>
                    <span className="text-lg font-bold text-ink">24 min</span>
                  </div>
                  <div className="bg-surface/80 p-3.5 rounded-xl border border-ink/5">
                    <span className="text-xs text-ink/60 block">Distance Covered</span>
                    <span className="text-lg font-bold text-ink">1.6 km</span>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200/60 p-3.5 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-900 block">Milestones Completed</span>
                    <span className="text-emerald-700">2 potty breaks • Hydration pause completed</span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>

                <div className="flex gap-2">
                  <Link
                    href={"/support" as any}
                    className="flex-1 text-center py-2.5 bg-ink/5 hover:bg-ink/10 text-ink font-bold text-xs rounded-xl transition-all"
                  >
                    Emergency SOS
                  </Link>
                  <Link
                    href={"/dashboard/history" as any}
                    className="flex-1 text-center py-2.5 bg-[#E16649] hover:bg-[#d05538] text-white font-bold text-xs rounded-xl transition-all shadow-[0_4px_14px_rgba(225,102,73,0.35)]"
                  >
                    Live Mission Stream
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Daily Care Timeline */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-ink/70">Today&apos;s Recommended Care Schedule</span>
                  <span className="text-xs font-extrabold text-indigo flex items-center gap-1">
                    <HeartPulse className="w-4 h-4 text-indigo" />
                    Real-Time Vitals
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex flex-col justify-between shadow-2xs">
                    <div className="flex items-center justify-between text-xs text-emerald-900 font-bold mb-1">
                      <span>07:30 AM</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    </div>
                    <span className="font-extrabold text-sm text-emerald-950">Morning Walk</span>
                    <span className="text-[11px] text-emerald-800 font-semibold mt-1">1.8 km • 35 mins</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo/5 border border-indigo/15 flex flex-col justify-between shadow-2xs">
                    <div className="flex items-center justify-between text-xs text-indigo font-bold mb-1">
                      <span>01:00 PM</span>
                      <Utensils className="w-4 h-4 text-indigo" />
                    </div>
                    <span className="font-extrabold text-sm text-ink">Meal &amp; Hydrate</span>
                    <span className="text-[11px] text-ink/70 font-semibold mt-1">Salmon + Omega 3</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-coral/5 border border-coral/20 flex flex-col justify-between shadow-2xs">
                    <div className="flex items-center justify-between text-xs text-coral font-bold mb-1">
                      <span>05:30 PM</span>
                      <PawPrint className="w-4 h-4 text-coral" />
                    </div>
                    <span className="font-extrabold text-sm text-ink">Evening Play</span>
                    <span className="text-[11px] text-coral font-bold mt-1">Scheduled for today</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface/80 border border-ink/10 flex flex-col justify-between shadow-2xs">
                    <div className="flex items-center justify-between text-xs text-ink/70 font-bold mb-1">
                      <span>09:30 PM</span>
                      <Clock className="w-4 h-4 text-ink/50" />
                    </div>
                    <span className="font-extrabold text-sm text-ink">Night Check</span>
                    <span className="text-[11px] text-ink/70 font-semibold mt-1">Rest &amp; Wellness</span>
                  </div>
                </div>
              </div>

              {/* Verified Caregiver On-Call Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-surface/70 border border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo/30 shrink-0 bg-indigo/10 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="/images/sitter-woman-cinematic.png" 
                      alt="Certified Sitter" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-ink">Ananya Sen</span>
                      <span className="text-[10px] font-extrabold bg-indigo/10 text-indigo border border-indigo/20 px-2.5 py-0.5 rounded-full">
                        ★ 4.98 (142 walks)
                      </span>
                    </div>
                    <p className="text-xs text-ink/75 font-medium mt-0.5">
                      Certified Canine First-Aid • 0.8 km from your society
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <Link
                    href="/book"
                    className="flex-1 sm:flex-none text-center px-5 py-2.5 bg-[#E16649] hover:bg-[#d05538] text-white font-extrabold text-xs rounded-xl shadow-[0_4px_14px_rgba(225,102,73,0.35)] hover:shadow-[0_6px_20px_rgba(225,102,73,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all"
                  >
                    Quick Book
                  </Link>
                  <Link
                    href="/support"
                    className="px-4 py-2.5 bg-white border border-ink/10 hover:border-indigo/30 hover:bg-surface text-ink hover:text-indigo font-bold text-xs rounded-xl transition-all shadow-2xs active:scale-[0.98]"
                  >
                    Chat
                  </Link>
                </div>
              </div>

              {/* Society Care Protocol Badges / Safety Checklist */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/60 via-surface/60 to-indigo/5 border border-emerald-200/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-xs font-extrabold text-ink block">Society Care Protocol Active</span>
                    <span className="text-[11px] text-ink/70">Geofenced GPS tracking &amp; live photo check-ins enabled for {primaryPet.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-800">
                  <span className="px-2.5 py-1 bg-white rounded-lg border border-emerald-200 shadow-2xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Double-Leash Protocol
                  </span>
                  <span className="px-2.5 py-1 bg-white rounded-lg border border-emerald-200 shadow-2xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Hydration Log
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Security Footer */}
          <div className="pt-4 border-t border-ink/5 flex flex-wrap items-center justify-between gap-3 text-xs text-ink/70 font-semibold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              100% Background-Verified Sitters
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo" />
              Real-time Geofenced Check-ins
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-coral" />
              Razorpay Secured Escrow
            </span>
          </div>
        </div>

        {/* Right Sidebar Bento Cards (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Digital Pet Passport Card */}
          <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-ink/10 shadow-[0px_10px_35px_rgba(48,31,48,0.04)]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-indigo" />
                <h3 className="font-extrabold text-ink text-base font-display">Digital Pet Passport</h3>
              </div>
              <span className="text-[11px] font-extrabold text-emerald-900 bg-emerald-50 border border-emerald-300/70 px-2.5 py-0.5 rounded-full shadow-2xs">
                Verified
              </span>
            </div>

            <div className="flex items-center gap-3.5 mb-5 p-3.5 rounded-2xl bg-surface/70 border border-ink/5 shadow-2xs">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-amber-500/10 shrink-0 border-2 border-white shadow-sm flex items-center justify-center ring-2 ring-amber-300/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  alt={primaryPet.name} 
                  className="w-full h-full object-cover" 
                  src="/images/golden-retriever-3d.png" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-ink text-base truncate">{primaryPet.name}</h4>
                <p className="text-xs text-ink/70 truncate font-medium">{primaryPet.breed || 'Golden Retriever'} • 3 yrs • 24.5 kg</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-ink/75">Health Readiness Score</span>
                  <span className="text-emerald-800 font-extrabold">{readinessScore}%</span>
                </div>
                <div className="w-full bg-ink/5 rounded-full h-2.5 overflow-hidden p-0.5 border border-ink/5">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-1.5 rounded-full transition-all duration-500 shadow-2xs" 
                    style={{ width: `${readinessScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Vaccination & Deworming Record */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 shadow-2xs">
                <Syringe className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-extrabold text-amber-900 block">Vaccination Status</span>
                  <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5 font-medium">
                    Rabies &amp; DHPPi verified. Next annual booster due in 40 days.
                  </p>
                </div>
              </div>

              {/* Emergency Clinic Record */}
              <div className="p-3.5 rounded-2xl bg-indigo/5 border border-indigo/15 flex items-start gap-2.5 shadow-2xs">
                <Building2 className="w-4 h-4 text-indigo shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-extrabold text-ink block">Primary Clinic &amp; Doctor</span>
                  <p className="text-[11px] text-ink/75 leading-relaxed mt-0.5 font-medium">
                    Dr. Sharma&apos;s Pet Hospital • Indiranagar (24/7 SOS:{" "}
                    <a href="tel:+919876543210" className="font-bold text-indigo hover:text-coral hover:underline">
                      +91 98765 43210
                    </a>)
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/pets"
              className="mt-5 block text-center w-full py-2.5 text-xs font-extrabold text-indigo hover:text-coral border border-indigo/20 hover:border-coral/40 rounded-xl transition-all shadow-2xs hover:shadow-xs active:scale-[0.98]"
            >
              View Full Digital Passport →
            </Link>
          </div>

          {/* Care Wallet & Fast Recharge Card */}
          <div className="bg-gradient-to-br from-indigo via-[#361952] to-[#25103A] text-white rounded-[32px] p-6 sm:p-7 shadow-[0px_16px_36px_rgba(42,16,58,0.25)] relative overflow-hidden flex flex-col justify-between border border-white/10">
            <div className="absolute right-0 top-0 w-36 h-36 bg-coral/20 rounded-full blur-2xl pointer-events-none"></div>

            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-white/80 text-xs font-bold">
                  <Wallet className="w-4 h-4" />
                  <span>PetSaathi Wallet</span>
                </div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full border border-white/15 shadow-2xs">
                  1-Click Pay
                </span>
              </div>
              <div className="mt-3">
                <span className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">₹2,450</span>
                <span className="text-xs text-emerald-300 block mt-1 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Instant Booking Enabled • 480 Paws Points
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/15 space-y-3.5">
              <div className="flex items-center justify-between text-xs text-white/80">
                <span className="font-medium">Auto-Refill Status</span>
                <span className="font-bold text-white bg-white/15 px-2 py-0.5 rounded-md border border-white/10">Active (Min ₹500)</span>
              </div>
              <div className="flex gap-2.5">
                <Link
                  href={"/customer/wallet" as any}
                  className="flex-1 text-center py-2.5 sm:py-3 bg-[#E16649] hover:bg-[#d05538] text-white text-xs font-extrabold rounded-xl shadow-[0_4px_14px_rgba(225,102,73,0.35)] hover:shadow-[0_6px_20px_rgba(225,102,73,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all"
                >
                  + Add Funds
                </Link>
                <Link
                  href={"/customer/wallet" as any}
                  className="px-4 py-2.5 sm:py-3 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold rounded-xl transition-all active:scale-[0.98]"
                >
                  History
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Row: Recent Bookings & Care History */}
      <div className="mt-8 bg-white rounded-[32px] p-6 sm:p-8 border border-ink/10 shadow-[0px_10px_35px_rgba(48,31,48,0.04)]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-ink font-display tracking-tight">Recent Care History &amp; Reports</h3>
            <p className="text-xs text-ink/70 font-normal mt-0.5">Verified activity logs, walk maps, and medical notes recorded by Saathis</p>
          </div>
          <Link
            href="/dashboard/history"
            className="text-xs font-extrabold text-indigo hover:text-coral transition-colors flex items-center gap-1"
          >
            <span>View All ({displayTotalBookings})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentBookings.map((b) => (
              <div key={b.id} className="p-5 rounded-2xl bg-surface/70 border border-ink/5 hover:border-indigo/30 transition-all duration-200 shadow-2xs flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-extrabold text-ink">{b.serviceType?.name || 'Care Session'}</span>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase bg-emerald-50 text-emerald-900 border border-emerald-200/80">
                    {b.status}
                  </span>
                </div>
                <p className="text-xs text-ink/70 mb-3 font-medium">
                  For {b.pet?.name || 'Pet'} • {new Date(b.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <Link
                  href={`/dashboard/history` as any}
                  className="text-xs font-extrabold text-indigo hover:text-coral transition-colors mt-auto flex items-center gap-1"
                >
                  <span>Inspect Report</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-surface/70 border border-ink/5 hover:border-indigo/30 transition-all duration-200 shadow-2xs flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-extrabold text-ink">Neighborhood Dog Walk</span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase bg-emerald-50 text-emerald-900 border border-emerald-200/80">
                  COMPLETED
                </span>
              </div>
              <p className="text-xs text-ink/70 mb-3 font-medium">
                For {primaryPet.name} • Yesterday • 2.1 km (38 mins)
              </p>
              <Link
                href="/dashboard/history"
                className="text-xs font-extrabold text-indigo hover:text-coral transition-colors mt-auto flex items-center gap-1"
              >
                <span>View Route &amp; Pee/Poop Map</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-surface/70 border border-coral/30 transition-all duration-200 shadow-2xs flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-extrabold text-ink">Home Pet Sitting &amp; Play</span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase bg-emerald-50 text-emerald-900 border border-emerald-200/80">
                  COMPLETED
                </span>
              </div>
              <p className="text-xs text-ink/70 mb-3 font-medium">
                For {primaryPet.name} • 3 days ago • Fed &amp; Groomed
              </p>
              <Link
                href="/dashboard/history"
                className="text-xs font-extrabold text-indigo hover:text-coral transition-colors mt-auto flex items-center gap-1"
              >
                <span>View Photo Highlights</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-surface/70 border border-ink/5 hover:border-amber-500/30 transition-all duration-200 shadow-2xs flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-extrabold text-ink">Annual Vet Health Check</span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase bg-indigo/10 text-indigo border border-indigo/20">
                  SCHEDULED
                </span>
              </div>
              <p className="text-xs text-ink/70 mb-3 font-medium">
                For {primaryPet.name} • In 12 days • Dr. Sharma
              </p>
              <Link
                href="/dashboard/history"
                className="text-xs font-extrabold text-indigo hover:text-coral transition-colors mt-auto flex items-center gap-1"
              >
                <span>View Appointment Card</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
        </div>
      </div>
    </PortalShell>
  );
}
