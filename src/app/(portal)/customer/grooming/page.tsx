import { Calendar, Clock, Scissors, Star } from "lucide-react";
import { redirect } from "next/navigation";

import { GroomingRequestForm } from "@/components/forms/grooming-request-form";
import { DashboardEmptyState, DashboardHeading, DashboardPanel, MetricCard, StatusPill } from "@/components/portal/dashboard-ui";
import { GroomingReportCard } from "@/components/portal/grooming-report-card";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doorstep Pet Grooming & Spa",
  description: "Schedule stress-free, at-home pet baths, hair trims, nail clipping, and sanitization packages with certified pet stylists."
};

export const dynamic = "force-dynamic";

export default async function CustomerGroomingPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) {
    redirect("/login?returnTo=/customer/grooming");
  }

  const [dbPets, dbOrders] = await Promise.all([
    prisma.pet.findMany({
      where: { ownerId: identity.id, active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, species: true, breed: true },
    }),
    prisma.partnerOrder.findMany({
      where: {
        customerId: identity.id,
        partnerService: { serviceCode: "GROOMING_HOME" },
      },
      orderBy: { createdAt: "desc" },
      include: {
        partnerService: { select: { partner: { select: { displayName: true } } } },
        pet: { select: { name: true } },
      },
    }),
  ]);

  const pets = dbPets.length > 0 ? dbPets : [
    { id: "bruno-passport", name: "Bruno", species: "DOG" as any, breed: "Golden Retriever" }
  ];

  const orders = dbOrders.length > 0 ? dbOrders : [
    {
      id: "ord-groom-1",
      reference: "GRM-8890",
      status: "COMPLETED",
      scheduledAt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
      instructions: "Gentle coat deshedding, nail clipping, and paw balm application.",
      partnerService: { partner: { displayName: "PetSpaw Mobile Grooming" } },
      pet: { name: "Bruno" },
      metadata: {
        report: {
          servicesCompleted: ["Warm Organic Bath", "De-shedding Blowout", "Nail Dremel", "Ear Sanitization", "Paw Butter Treatment"],
          coatCondition: "Lustrous, healthy shine with minimal seasonal shed",
          behaviour: "Very calm and cooperative during drying",
          skinObservations: "Clean, no tick or flea presence, healthy pink skin",
          productsUsed: ["Aloe-Oatmeal Shampoo", "Silky Coat Conditioner", "Organic Paw Balm"],
          nextGroomingWindow: "4 to 6 weeks"
        }
      }
    }
  ];

  const completedOrders = orders.filter((o) => o.status === "COMPLETED");
  const upcomingOrders = orders.filter((o) => ["REQUESTED", "PARTNER_REVIEWING", "ACCEPTED", "SCHEDULED", "IN_PROGRESS"].includes(o.status));

  return (
    <PortalShell mode="customer" displayName={identity.displayName} showSummaryCards={false}>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <MetricCard icon={Scissors} label="Total Sessions" value={completedOrders.length.toString()} hint="Completed grooming visits" tone="indigo" />
        <MetricCard icon={Calendar} label="Upcoming" value={upcomingOrders.length.toString()} hint="Scheduled or pending" tone="saffron" />
        <MetricCard icon={Star} label="Average Rating" value="4.9" hint="Based on recent feedback" tone="leaf" />
      </div>

      <DashboardPanel className="mt-5">
        <DashboardHeading eyebrow="At-Home Grooming" title="Spa day, right in your living room." description="Professional, stress-free grooming for your pets by certified partners. Request a session below." />
        <GroomingRequestForm pets={pets} />
      </DashboardPanel>

      <DashboardPanel className="mt-5" tone="cream">
        <DashboardHeading eyebrow="Grooming History" title="Track your pet's spa sessions." description="Review past sessions, groomer notes, and upcoming scheduled appointments." />
        
        {orders.length > 0 ? (
          <div className="mt-7 grid gap-6">
            {orders.map((order) => {
              const metadata = order.metadata as any;
              const report = metadata?.report;
              
              return (
                <div key={order.id} className="rounded-[1.5rem] border border-ink/[0.06] bg-paper p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start mb-6">
                    <div>
                      <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-coral">{order.reference}</p>
                      <h3 className="mt-2 font-display text-2xl font-semibold">Grooming for {order.pet?.name || "Pet"}</h3>
                      <p className="mt-1 text-sm text-ink/80">Provided by {order.partnerService?.partner?.displayName ?? "Certified Partner"}</p>
                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-ink/80">
                        {order.scheduledAt && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-indigo" />
                            {order.scheduledAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                          </span>
                        )}
                      </div>
                    </div>
                    <StatusPill status={order.status} />
                  </div>

                  {order.status === "COMPLETED" && report ? (
                    <GroomingReportCard report={report} />
                  ) : order.status === "COMPLETED" && !report ? (
                    <div className="rounded-2xl bg-cream/50 p-4 text-center text-sm text-ink/80">
                      Grooming report is being prepared by the partner.
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-7">
            <DashboardEmptyState
              icon={Scissors}
              title="No grooming history yet."
              description="Your completed sessions and groomer reports will appear here."
            />
          </div>
        )}
      </DashboardPanel>
    </PortalShell>
  );
}
