import { CalendarDays, CheckCircle2, Clock3, DollarSign, MapPin, Navigation, PawPrint, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

import { AssignmentActions } from "@/components/portal/assignment-actions";
import { SitterCancellationAction } from "@/components/portal/booking-recovery-actions";
import { IncidentReportForm } from "@/components/portal/incident-report-form";
import { PortalShell } from "@/components/portal/portal-shell";
import { ReportForm, ServiceActions } from "@/components/portal/service-actions";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { isFeatureEnabled } from "@/modules/features/server";
import { cn } from "@/lib/cn";

const addressReleaseBookingStates = ["CONFIRMED", "SITTER_EN_ROUTE", "IN_PROGRESS", "REPORT_PENDING", "COMPLETED", "CLOSED", "INCIDENT_HOLD"] as const;

export default async function SaathiAssignmentsPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) redirect("/login?returnTo=/saathi/assignments");
  let assignments: any[] = [];
  let liveWalkTrackingEnabled = true;
  let addressByBooking = new Map();

  try {
    const sitter = await prisma.sitterProfile.findUnique({ where: { userId: identity.id }, select: { id: true } });
    liveWalkTrackingEnabled = await isFeatureEnabled("live_walk_tracking");
    
    assignments = sitter ? await prisma.bookingAssignment.findMany({
      where: { sitterId: sitter.id },
      orderBy: { booking: { scheduledStart: "asc" } },
      include: {
        booking: {
          include: {
            pet: { select: { name: true, species: true, breed: true } },
            serviceType: { select: { name: true } },
            address: { select: { locality: true, city: true } },
            reports: { orderBy: { version: "desc" }, take: 1, select: { reviewStatus: true, reviewNote: true, version: true } },
            payouts: { select: { sitterId: true, status: true, amountPaise: true, adjustmentPaise: true } },
            incidents: { where: { status: { not: "CLOSED" } }, orderBy: { detectedAt: "desc" }, take: 1, select: { reference: true, status: true } }
          }
        }
      }
    }) : [];

    const releasedBookingIds = assignments
      .filter((assignment) => ["CUSTOMER_APPROVED", "ACTIVE", "COMPLETED"].includes(assignment.status) && (addressReleaseBookingStates as readonly string[]).includes(assignment.booking.status))
      .map(({ bookingId }) => bookingId);
      
    const releasedAddresses = releasedBookingIds.length
      ? await prisma.booking.findMany({
          where: { id: { in: releasedBookingIds } },
          select: { id: true, address: { select: { line1: true, line2: true, landmark: true, locality: true, city: true } } }
        })
      : [];
    addressByBooking = new Map(releasedAddresses.map(({ id, address }) => [id, address]));
  } catch (err) {
    console.warn("Failed to fetch Saathi assignments:", err);
  }

  return (
    <PortalShell mode="saathi" displayName={identity.displayName}>
      <div className="max-w-6xl pb-16">
        {/* Header */}
        <section className="mt-4 rounded-[2rem] border border-black/[0.06] bg-gradient-to-r from-paper via-cream to-[#fbf2ea] p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-indigo animate-pulse" />
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-indigo">Saathi Field Assignments</p>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Assignments & Job Roster
          </h1>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-ink/70 leading-relaxed">
            Review incoming booking offers, start your travel, log GPS milestones, and submit post-care report cards.
          </p>
        </section>

        {/* Assignments List */}
        <div className="mt-8 space-y-6">
          {assignments.length ? (
            assignments.map((assignment) => {
              const releasedAddress = addressByBooking.get(assignment.bookingId);
              const payout = assignment.booking.payouts.find((p: any) => p.sitterId === assignment.sitterId);
              const payoutTotal = (payout ? payout.amountPaise + payout.adjustmentPaise : assignment.payoutPaise) / 100;

              return (
                <article
                  key={assignment.id}
                  className="rounded-[2rem] border border-black/[0.06] bg-white p-6 shadow-sm transition sm:p-8 hover:shadow-md"
                >
                  <div className="flex flex-col justify-between gap-4 border-b border-black/[0.06] pb-5 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-indigo/10 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase text-indigo">
                          {assignment.status.replaceAll("_", " ")}
                        </span>
                        <span className="text-xs text-ink/50">· Booking: {assignment.booking.status.replaceAll("_", " ")}</span>
                      </div>
                      <h2 className="mt-1 font-display text-2xl font-bold text-ink">
                        {assignment.booking.serviceType.name} · <span className="text-coral">{assignment.booking.pet.name}</span>
                      </h2>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="font-display text-2xl font-bold text-ink">₹{payoutTotal.toLocaleString("en-IN")}</p>
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-leaf">
                        {payout ? `Payout ${payout.status.toLowerCase()}` : "Estimated Payout"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 text-xs text-ink/70 sm:grid-cols-3">
                    <p className="flex items-center gap-2">
                      <PawPrint className="h-4 w-4 text-indigo" />
                      Species: <strong className="text-ink">{assignment.booking.pet.species.toLowerCase()} {assignment.booking.pet.breed ? `(${assignment.booking.pet.breed})` : ""}</strong>
                    </p>
                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-indigo" />
                      {assignment.booking.scheduledStart.toLocaleDateString("en-IN", { dateStyle: "medium" })} at {assignment.booking.scheduledStart.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
                    </p>
                    <p className="flex items-center gap-2 sm:col-span-3">
                      <MapPin className="h-4 w-4 text-indigo" />
                      {releasedAddress
                        ? [releasedAddress.line1, releasedAddress.line2, releasedAddress.landmark, releasedAddress.locality, releasedAddress.city].filter(Boolean).join(", ")
                        : `${assignment.booking.address.locality}, ${assignment.booking.address.city} · exact address released on confirmation`}
                    </p>
                  </div>

                  <div className="mt-6 space-y-4">
                    {assignment.status === "OFFERED" && <AssignmentActions assignmentId={assignment.id} />}
                    <ServiceActions
                      assignmentId={assignment.id}
                      bookingStatus={assignment.booking.status}
                      trackingEnabled={liveWalkTrackingEnabled}
                    />
                    {assignment.status === "CUSTOMER_APPROVED" && assignment.booking.status === "CONFIRMED" && (
                      <SitterCancellationAction assignmentId={assignment.id} />
                    )}
                    {["CUSTOMER_APPROVED", "ACTIVE", "COMPLETED"].includes(assignment.status) && (
                      <IncidentReportForm
                        bookingId={assignment.bookingId}
                        existingIncident={assignment.booking.incidents[0] ?? null}
                      />
                    )}
                    {assignment.booking.reports[0] && (
                      <div className="rounded-2xl border border-black/[0.06] bg-cream/40 p-4 text-xs font-semibold text-ink">
                        <span>Report v{assignment.booking.reports[0].version}: </span>
                        <span className="uppercase text-coral">{assignment.booking.reports[0].reviewStatus.replaceAll("_", " ")}</span>
                        {assignment.booking.reports[0].reviewNote && <span> · {assignment.booking.reports[0].reviewNote}</span>}
                      </div>
                    )}
                    {assignment.status === "ACTIVE" && assignment.booking.status === "REPORT_PENDING" && (
                      <ReportForm assignmentId={assignment.id} />
                    )}
                    {assignment.status === "COMPLETED" &&
                      assignment.booking.status === "COMPLETED" &&
                      assignment.booking.reports[0]?.reviewStatus === "CORRECTION_REQUIRED" && (
                        <ReportForm assignmentId={assignment.id} correctionNote={assignment.booking.reports[0].reviewNote ?? undefined} />
                      )}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-[2.5rem] border border-black/[0.06] bg-white p-12 text-center shadow-sm">
              <CheckCircle2 className="mx-auto h-12 w-12 text-leaf" />
              <h2 className="mt-4 font-display text-2xl font-bold text-ink">No assignments in queue</h2>
              <p className="mt-1 text-xs text-ink/60">New care requests dispatched in your service area will show up here.</p>
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
