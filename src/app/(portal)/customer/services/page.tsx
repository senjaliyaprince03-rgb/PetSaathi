import { ArrowRight, BadgeCheck, Building2, Car, GraduationCap, PawPrint, Scissors, Sparkles, Stethoscope, Syringe } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardHeading, DashboardPanel, MetricCard } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

const SERVICES: Array<{
  slug: string;
  title: string;
  description: string;
  icon: typeof Scissors;
  href: Route;
  status: string;
  badge: string;
  tone: string;
}> = [
  {
    slug: "grooming",
    title: "In-Home Grooming",
    description: "Bath, drying, nail trim, styling, and breed-specific grooming at your doorstep.",
    icon: Scissors,
    href: "/customer/grooming" as Route,
    status: "ACTIVE",
    badge: "Popular",
    tone: "bg-saffron/15 text-saffron",
  },
  {
    slug: "vet",
    title: "Veterinary Support",
    description: "Triage-guided vet consultations, home visits, and clinic referrals.",
    icon: Stethoscope,
    href: "/customer/vet" as Route,
    status: "ACTIVE",
    badge: "Verified Vets",
    tone: "bg-leaf/15 text-leaf",
  },
  {
    slug: "training",
    title: "Dog Training",
    description: "Reward-led foundation workshops, leash manners, and individual assessments.",
    icon: GraduationCap,
    href: "/customer/training" as Route,
    status: "ACTIVE",
    badge: "Positive Method",
    tone: "bg-indigo/15 text-indigo",
  },
  {
    slug: "taxi",
    title: "Pet Taxi",
    description: "Pet-safe commercial vehicles for vet visits, grooming, or relocation.",
    icon: Car,
    href: "/customer/taxi" as Route,
    status: "ACTIVE",
    badge: "Permitted Vehicles",
    tone: "bg-coral/15 text-coral",
  },
  {
    slug: "partners",
    title: "Partner Marketplace",
    description: "Explore all verified local partners, clinics, and specialist services.",
    icon: Building2,
    href: "/partners" as Route,
    status: "ACTIVE",
    badge: "Curated",
    tone: "bg-paper/20 text-ink",
  },
  {
    slug: "vaccinations",
    title: "Vaccination Camps",
    description: "RWA & society vaccination drives with certified local vet partners.",
    icon: Syringe,
    href: "/customer/vet" as Route,
    status: "ACTIVE",
    badge: "Society Drives",
    tone: "bg-leaf/15 text-leaf",
  },
];

export default async function CustomerServicesHubPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/customer/services");

  const [pets, ordersCount] = await Promise.all([
    prisma.pet.findMany({
      where: { ownerId: identity.id, active: true },
      select: { id: true, name: true },
    }),
    prisma.partnerOrder.count({ where: { customerId: identity.id } }),
  ]);

  return (
    <PortalShell mode="customer" displayName={identity.displayName} showSummaryCards={false}>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <MetricCard icon={Sparkles} label="Service categories" value="6 available" hint="Expanded care ecosystem" tone="leaf" />
        <MetricCard icon={PawPrint} label="Registered pets" value={`${pets.length} active`} hint="Linked to longitudinal profile" tone="indigo" />
        <MetricCard icon={BadgeCheck} label="Partner requests" value={`${ordersCount} total`} hint="Marketplace orders" tone="coral" />
      </div>

      <DashboardPanel className="mt-7">
        <DashboardHeading
          eyebrow="Service Expansion Hub"
          title="All your pet's care in one trusted place."
          description="From daily walks to professional grooming, veterinary triage, and specialist training — unified under one pet profile."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.slug}
                href={service.href}
                className="group relative overflow-hidden rounded-[1.75rem] border border-ink/[0.08] bg-paper/80 p-6 transition duration-200 hover:-translate-y-1 hover:border-indigo/30 hover:bg-paper hover:shadow-lifted"
              >
                <div className="flex items-start justify-between">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${service.tone}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="rounded-full bg-cream px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink/60">
                    {service.badge}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.03em] group-hover:text-indigo">
                  {service.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-ink/50">
                  {service.description}
                </p>

                <div className="mt-6 flex items-center gap-1 text-xs font-bold text-indigo">
                  Explore service <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </DashboardPanel>

      {/* Cross-Sell Recommendation Section */}
      <DashboardPanel className="mt-7" tone="lavender">
        <DashboardHeading
          eyebrow="Personalised Care Recommendations"
          title="Based on your pet's profile"
          description="Contextual care suggestions to keep your pet healthy, groomed, and happy."
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-indigo/10 bg-paper p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-saffron/20 text-saffron">
                <Scissors className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-sm">Grooming Refresh Reminder</p>
                <p className="text-xs text-ink/50">Recommended every 4–6 weeks for coat maintenance</p>
              </div>
            </div>
            <Link href={"/customer/grooming" as Route} className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo hover:underline">
              Book grooming <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="rounded-2xl border border-indigo/10 bg-paper p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf/20 text-leaf">
                <Stethoscope className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-sm">Annual Vaccination Check</p>
                <p className="text-xs text-ink/50">Keep rabies and annual boosters updated</p>
              </div>
            </div>
            <Link href={"/customer/vet" as Route} className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo hover:underline">
              Check vet records <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </DashboardPanel>
    </PortalShell>
  );
}
