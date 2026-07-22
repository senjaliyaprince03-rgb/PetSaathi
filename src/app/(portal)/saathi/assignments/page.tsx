import { CalendarDays, Clock3, MapPin, PawPrint } from "lucide-react";
import { redirect } from "next/navigation";

import { AssignmentActions } from "@/components/portal/assignment-actions";
import { SitterCancellationAction } from "@/components/portal/booking-recovery-actions";
import { IncidentReportForm } from "@/components/portal/incident-report-form";
import { ReportForm, ServiceActions } from "@/components/portal/service-actions";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { isFeatureEnabled } from "@/modules/features/server";

const addressReleaseBookingStates = ["CONFIRMED", "SITTER_EN_ROUTE", "IN_PROGRESS", "REPORT_PENDING", "COMPLETED", "CLOSED", "INCIDENT_HOLD"] as const;

export default async function SaathiAssignmentsPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) redirect("/login?returnTo=/saathi/assignments");
  const sitter = await prisma.sitterProfile.findUnique({ where: { userId: identity.id }, select: { id: true } });
  const liveWalkTrackingEnabled = await isFeatureEnabled("live_walk_tracking");
  const assignments = sitter ? await prisma.bookingAssignment.findMany({
    where: { sitterId: sitter.id },
    orderBy: { booking: { scheduledStart: "asc" } },
    include: { booking: { include: { pet: { select: { name: true, species: true, breed: true } }, serviceType: { select: { name: true } }, address: { select: { locality: true, city: true } }, reports: { orderBy: { version: "desc" }, take: 1, select: { reviewStatus: true, reviewNote: true, version: true } }, payouts: { select: { sitterId: true, status: true, amountPaise: true, adjustmentPaise: true } }, incidents: { where: { status: { not: "CLOSED" } }, orderBy: { detectedAt: "desc" }, take: 1, select: { reference: true, status: true } } } } }
  }) : [];

  const releasedBookingIds = assignments.filter((assignment) => ["CUSTOMER_APPROVED", "ACTIVE", "COMPLETED"].includes(assignment.status) && (addressReleaseBookingStates as readonly string[]).includes(assignment.booking.status)).map(({ bookingId }) => bookingId);
  const releasedAddresses = releasedBookingIds.length ? await prisma.booking.findMany({ where: { id: { in: releasedBookingIds } }, select: { id: true, address: { select: { line1: true, line2: true, landmark: true, locality: true, city: true } } } }) : [];
  const addressByBooking = new Map(releasedAddresses.map(({ id, address }) => [id, address]));

  return <main className="min-h-screen bg-cream/50 py-10"><div className="container-shell">
    <p className="eyebrow">authorised work only</p><h1 className="section-title mt-5">Assignments</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-ink/60">Offers show only the information needed to decide. Exact care instructions and address remain hidden until approval and confirmation.</p>
    <div className="mt-10 grid gap-5">{assignments.length ? assignments.map((assignment) => {
      const releasedAddress = addressByBooking.get(assignment.bookingId);
      const payout = assignment.booking.payouts.find(({ sitterId }) => sitterId === assignment.sitterId);
      return <article key={assignment.id} className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
        <div className="flex flex-col justify-between gap-4 sm:flex-row"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">{assignment.status.replaceAll("_", " ")} · {assignment.booking.status.replaceAll("_", " ")}</p><h2 className="mt-2 font-display text-3xl font-semibold">{assignment.booking.serviceType.name} with {assignment.booking.pet.name}</h2></div><div className="text-right"><p className="font-display text-2xl font-semibold">₹{((payout ? payout.amountPaise + payout.adjustmentPaise : assignment.payoutPaise) / 100).toLocaleString("en-IN")}</p><p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-ink/40">{payout ? `Payout ${payout.status.toLowerCase()}` : "Estimated payout"}</p></div></div>
        <div className="mt-5 grid gap-3 text-sm text-ink/60 sm:grid-cols-3"><p className="flex items-center gap-2"><PawPrint className="h-4 w-4 text-leaf" />{assignment.booking.pet.species.toLowerCase()} {assignment.booking.pet.breed ? `· ${assignment.booking.pet.breed}` : ""}</p><p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-leaf" />{assignment.booking.scheduledStart.toLocaleDateString("en-IN", { dateStyle: "medium" })}</p><p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-leaf" />{assignment.booking.scheduledStart.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}</p><p className="flex items-center gap-2 sm:col-span-3"><MapPin className="h-4 w-4 text-leaf" />{releasedAddress ? [releasedAddress.line1, releasedAddress.line2, releasedAddress.landmark, releasedAddress.locality, releasedAddress.city].filter(Boolean).join(", ") : `${assignment.booking.address.locality}, ${assignment.booking.address.city} · exact address withheld until confirmation`}</p></div>
        {assignment.status === "OFFERED" && <AssignmentActions assignmentId={assignment.id} />}
        <ServiceActions assignmentId={assignment.id} bookingStatus={assignment.booking.status} trackingEnabled={liveWalkTrackingEnabled} />
        {assignment.status === "CUSTOMER_APPROVED" && assignment.booking.status === "CONFIRMED" && <SitterCancellationAction assignmentId={assignment.id} />}
        {["CUSTOMER_APPROVED", "ACTIVE", "COMPLETED"].includes(assignment.status) && <IncidentReportForm bookingId={assignment.bookingId} existingIncident={assignment.booking.incidents[0] ?? null} />}
        {assignment.booking.reports[0] && <p className="mt-4 rounded-2xl bg-cream/60 p-3 text-sm font-semibold">Report v{assignment.booking.reports[0].version}: {assignment.booking.reports[0].reviewStatus.replaceAll("_", " ").toLowerCase()}{assignment.booking.reports[0].reviewNote ? ` · ${assignment.booking.reports[0].reviewNote}` : ""}</p>}
        {assignment.status === "ACTIVE" && assignment.booking.status === "REPORT_PENDING" && <ReportForm assignmentId={assignment.id} />}
        {assignment.status === "COMPLETED" && assignment.booking.status === "COMPLETED" && assignment.booking.reports[0]?.reviewStatus === "CORRECTION_REQUIRED" && <ReportForm assignmentId={assignment.id} correctionNote={assignment.booking.reports[0].reviewNote ?? undefined} />}
      </article>;
    }) : <div className="glass-panel rounded-5xl p-10 text-center"><PawPrint className="mx-auto h-10 w-10 text-saffron" /><h2 className="mt-5 font-display text-3xl font-semibold">No assignments yet.</h2><p className="mt-3 text-ink/55">Eligible offers will appear here.</p></div>}</div>
  </div></main>;
}
