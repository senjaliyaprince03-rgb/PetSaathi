import { AlertTriangle, CalendarPlus, Car, History, MapPin } from "lucide-react";
import { redirect } from "next/navigation";

import { TaxiRequestForm } from "@/components/forms/taxi-request-form";
import { DashboardEmptyState, DashboardHeading, DashboardPanel, MetricCard, StatusPill } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function CustomerTaxiPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) redirect("/login?returnTo=/customer/taxi");

  const [pets, orders] = await Promise.all([
    prisma.pet.findMany({ where: { ownerId: identity.id, active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.partnerOrder.findMany({ 
      where: { customerId: identity.id, partnerService: { serviceCode: "PET_TAXI" } }, 
      orderBy: { createdAt: "desc" }, 
      take: 20, 
      select: { id: true, reference: true, status: true, scheduledAt: true, metadata: true, pet: { select: { name: true } } } 
    }),
  ]);

  const upcomingCount = orders.filter(o => ["REQUESTED", "ACCEPTED", "SCHEDULED"].includes(o.status)).length;

  return (
    <PortalShell mode="customer" displayName={identity.displayName} showSummaryCards={false}>
      {/* Pilot Banner */}
      <div className="mt-5 rounded-2xl bg-indigo/10 border border-indigo/20 p-4 flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo text-paper shadow-sm">
          <Car className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-indigo">Pet Taxi Pilot</h3>
          <p className="mt-1 text-sm text-indigo/80">We are currently prioritising &quot;Owner Accompanied&quot; trips as we expand our fleet. Unaccompanied trips may experience longer confirmation times.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <MetricCard icon={Car} label="Total Trips" value={orders.length.toString()} hint="Requested or completed" tone="indigo" />
        <MetricCard icon={CalendarPlus} label="Upcoming" value={upcomingCount.toString()} hint="Scheduled rides" tone="leaf" />
      </div>

      <DashboardPanel className="mt-5">
        <DashboardHeading eyebrow="Transportation" title="Book a Ride" description="Safe and reliable transport for your pets, whether it's a vet visit or dropping them at a boarding facility." />
        <TaxiRequestForm pets={pets} />
      </DashboardPanel>

      <DashboardPanel className="mt-5" tone="lavender">
        <DashboardHeading eyebrow="Logistics" title="Trip History" />
        {orders.length ? (
          <div className="mt-7 grid gap-3">
            {orders.map((order) => {
              const meta = order.metadata as any;
              return (
                <article key={order.id} className="rounded-2xl border border-ink/[0.06] bg-paper/90 p-5">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="flex-1">
                      <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-coral">{order.reference}</p>
                      <h3 className="mt-2 font-display text-xl font-semibold capitalize">
                        {meta?.tripType?.replaceAll("_", " ").toLowerCase() || "Taxi Ride"}
                      </h3>
                      <p className="mt-1 text-sm text-ink/80">Passenger: {order.pet?.name ?? "Unknown pet"}</p>
                      
                      <div className="mt-4 flex flex-col gap-2">
                        <div className="flex items-start gap-2 text-xs font-semibold text-ink/80">
                          <MapPin className="w-4 h-4 text-leaf shrink-0 mt-0.5" />
                          <span>Pickup: {meta?.pickup || "Not specified"}</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs font-semibold text-ink/80">
                          <MapPin className="w-4 h-4 text-coral shrink-0 mt-0.5" />
                          <span>Drop-off: {meta?.dropoff || "Not specified"}</span>
                        </div>
                      </div>

                      {order.scheduledAt && (
                        <p className="mt-4 text-xs font-semibold text-ink/80 flex items-center gap-1.5">
                          <CalendarPlus className="h-3.5 w-3.5 text-indigo" />
                          {order.scheduledAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                        </p>
                      )}
                    </div>
                    <StatusPill status={order.status} />
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-7">
            <DashboardEmptyState icon={History} title="No trips yet" description="Your past and upcoming pet taxi rides will appear here." compact />
          </div>
        )}
      </DashboardPanel>
    </PortalShell>
  );
}
