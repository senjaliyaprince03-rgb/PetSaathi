import { Activity, CalendarDays, CheckCircle2, Clock3, CreditCard, FileCheck2, MapPin, MessageSquareHeart, PawPrint, Route as RouteIcon, ShieldCheck } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { CustomerApprovalAction, CustomerCancelAction, PaymentAction, ReviewAction } from "@/components/portal/customer-booking-actions";
import { PortalShell } from "@/components/portal/portal-shell";
import { ComplaintForm } from "@/components/portal/complaint-form";
import { IncidentReportForm } from "@/components/portal/incident-report-form";
import { TrackingViewer } from "@/components/portal/tracking-viewer";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { isFeatureEnabled } from "@/modules/features/server";
import { cn } from "@/lib/cn";

const statusOrder = ["REQUESTED", "RISK_REVIEW", "MATCHING", "SITTER_PROPOSED", "CUSTOMER_APPROVAL_PENDING", "PAYMENT_PENDING", "CONFIRMED", "SITTER_EN_ROUTE", "IN_PROGRESS", "REPORT_PENDING", "COMPLETED", "CLOSED"];

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  const { id } = await params;
  if (!identity?.roles.includes("CUSTOMER")) redirect(`/login?returnTo=/bookings/${id}`);
  
  const booking = await prisma.booking.findFirst({
    where: { id, customerId: identity.id },
    include: {
      pet: { select: { name: true, species: true, breed: true } },
      serviceType: { select: { name: true } },
      address: { select: { label: true, locality: true, city: true } },
      assignments: {
        where: { status: { in: ["ACCEPTED", "CUSTOMER_APPROVED", "ACTIVE", "COMPLETED"] } },
        orderBy: { offeredAt: "desc" },
        take: 1,
        include: {
          sitter: {
            select: {
              user: { select: { displayName: true } },
              verifications: {
                where: { status: "PASSED", revokedAt: null },
                select: { publicLabel: true, type: true, expiresAt: true }
              }
            }
          }
        }
      },
      reports: { orderBy: { version: "desc" }, take: 1 },
      payments: { orderBy: { createdAt: "desc" }, take: 1, select: { status: true } },
      review: { select: { id: true, rating: true } },
      complaints: { where: { status: { notIn: ["CLOSED", "REJECTED"] } }, orderBy: { createdAt: "desc" }, take: 1, select: { reference: true } },
      incidents: { where: { status: { not: "CLOSED" } }, orderBy: { detectedAt: "desc" }, take: 1, select: { reference: true, status: true } }
    }
  });

  if (!booking) notFound();
  const liveWalkTrackingEnabled = await isFeatureEnabled("live_walk_tracking");
  const assignment = booking.assignments[0];
  const currentIndex = statusOrder.indexOf(booking.status);

  return (
    <PortalShell mode="customer" displayName={identity.displayName}>
      <div className="mt-4 max-w-6xl pb-16">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-xs font-bold text-ink shadow-sm transition hover:bg-paper"
        >
          ← Back to Overview
        </Link>

        {/* Hero Card */}
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <section className="rounded-[2.2rem] bg-gradient-to-br from-indigo via-[#4c3167] to-[#29173d] p-7 text-white shadow-sm sm:p-10">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-saffron backdrop-blur">
                Ref: {booking.reference}
              </span>
              <span className="rounded-full bg-leaf/20 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-leaf">
                Verified Protocol
              </span>
            </div>

            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {booking.serviceType?.name ?? "Service"} for {booking.pet?.name ?? "Pet"}
            </h1>

            <div className="mt-6 grid gap-3 text-xs sm:text-sm text-white/80 sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-saffron" />
                {booking.scheduledStart ? booking.scheduledStart.toLocaleDateString("en-IN", { dateStyle: "full" }) : "Scheduled"}
              </p>
              <p className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-saffron" />
                {booking.scheduledStart ? booking.scheduledStart.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }) : ""}
              </p>
              <p className="flex items-center gap-2">
                <PawPrint className="h-4 w-4 text-saffron" />
                {booking.pet?.name} ({booking.pet?.breed || booking.pet?.species})
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-saffron" />
                {booking.address?.locality}, {booking.address?.city}
              </p>
            </div>
          </section>

          {/* Status Tracker */}
          <aside className="flex flex-col justify-between rounded-[2.2rem] border border-black/[0.06] bg-white p-6 shadow-sm sm:p-8">
            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-indigo">Booking Lifecycle</p>
              <p className="mt-2 font-display text-2xl font-bold text-ink">
                {booking.status.replaceAll("_", " ")}
              </p>

              <div className="mt-6 space-y-2.5">
                {["Request", "Match", "Approve", "Pay", "Care", "Report"].map((label, index) => {
                  const isDone = currentIndex >= [0, 2, 4, 5, 6, 9][index]!;
                  return (
                    <div key={label} className="flex items-center gap-3 text-xs font-semibold">
                      <span className={cn("h-2.5 w-2.5 rounded-full transition", isDone ? "bg-leaf" : "bg-black/10")} />
                      <span className={cn(isDone ? "text-ink font-bold" : "text-ink/50")}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>

        {/* Quick Nav Links */}
        <nav aria-label="Booking protocol views" className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {([[
            "Care timeline", `/bookings/${booking.id}/timeline` as Route, RouteIcon
          ], [
            "Checkout", `/bookings/${booking.id}/checkout` as Route, CreditCard
          ], [
            "Live telemetry", `/bookings/${booking.id}/live` as Route, Activity
          ], [
            "Session report", `/bookings/${booking.id}/report` as Route, FileCheck2
          ], [
            "Feedback", `/bookings/${booking.id}/feedback` as Route, MessageSquareHeart
          ]] satisfies Array<[string, Route, typeof Activity]>).map(([label, href, Icon]) => (
            <Link
              key={label}
              href={href}
              className="group flex items-center justify-between rounded-2xl border border-black/[0.06] bg-white px-4 py-3.5 text-xs font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-indigo/30 hover:shadow-md"
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-coral" />
                {label}
              </span>
              <span aria-hidden className="text-ink/40 transition group-hover:translate-x-1 group-hover:text-indigo">→</span>
            </Link>
          ))}
        </nav>

        {/* Proposed Sitter & Actions */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <section className="rounded-[2rem] border border-black/[0.06] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-indigo">
              {booking.status === "CUSTOMER_APPROVAL_PENDING" && assignment?.type === "REPLACEMENT" ? "Proposed Replacement Saathi" : "Proposed Saathi"}
            </p>

            {assignment ? (
              <div className="mt-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo text-xl font-bold text-white shadow-sm">
                    {assignment.sitter.user.displayName[0]}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-ink">{assignment.sitter.user.displayName}</h2>
                    <p className="text-xs text-ink/60">Certified Caregiver · Background Verified</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {assignment.sitter.verifications
                    .filter(({ expiresAt }) => !expiresAt || expiresAt > new Date())
                    .map((verification) => (
                      <span key={verification.type} className="flex items-center gap-1.5 rounded-full bg-leaf/10 px-3 py-1.5 text-xs font-bold text-leaf">
                        <ShieldCheck className="h-3.5 w-3.5 text-leaf" />
                        {verification.publicLabel ?? verification.type.replaceAll("_", " ")}
                      </span>
                    ))}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-xs leading-relaxed text-ink/70">
                Operations is checking eligible local caregivers. No private sitter data is exposed before a verified proposal.
              </p>
            )}

            {booking.status === "CUSTOMER_APPROVAL_PENDING" && assignment && (
              <div className="mt-6">
                <CustomerApprovalAction bookingId={booking.id} assignmentId={assignment.id} />
              </div>
            )}

            {booking.status === "REPLACEMENT_REQUIRED" && (
              <p className="mt-5 rounded-2xl bg-saffron/20 p-4 text-xs font-semibold leading-relaxed text-ink">
                Operations is searching for an eligible replacement. Your original verified payment remains attached; no second payment is requested. You will approve any replacement before care resumes.
              </p>
            )}
          </section>

          {/* Action Column */}
          <div className="space-y-4">
            {booking.status === "PAYMENT_PENDING" && (
              <PaymentAction bookingId={booking.id} reference={booking.reference} amountPaise={booking.quoteAmountPaise} />
            )}

            {["REQUESTED", "RISK_REVIEW", "MATCHING", "SITTER_PROPOSED", "CUSTOMER_APPROVAL_PENDING", "PAYMENT_PENDING"].includes(booking.status) && (
              <CustomerCancelAction bookingId={booking.id} />
            )}

            {booking.status === "COMPLETED" && !booking.review && <ReviewAction bookingId={booking.id} />}

            {booking.review && (
              <div className="rounded-2xl border border-leaf/20 bg-leaf/10 p-5">
                <CheckCircle2 className="h-6 w-6 text-leaf" />
                <p className="mt-2 text-xs font-bold text-leaf">Review recorded · {booking.review.rating}/5 Stars</p>
              </div>
            )}
          </div>
        </div>

        {/* Report Card */}
        {booking.reports[0] && (
          <section className="mt-6 rounded-[2rem] border border-black/[0.06] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo">
                Care Report · Version {booking.reports[0].version}
              </p>
              <span className="rounded-full bg-saffron/25 px-3 py-1 text-[0.65rem] font-bold text-ink uppercase">
                {booking.reports[0].reviewStatus.replaceAll("_", " ")}
              </span>
            </div>
            <p className="mt-3 text-xs text-ink/70">
              The report is visible immediately; booking closure and payout eligibility wait for the recorded quality review.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-2xl bg-cream/40 p-4 font-mono text-xs text-ink/80">
              {JSON.stringify(booking.reports[0].fields, null, 2)}
            </pre>
          </section>
        )}

        {liveWalkTrackingEnabled && ["SITTER_EN_ROUTE", "IN_PROGRESS"].includes(booking.status) && (
          <div className="mt-6">
            <TrackingViewer bookingId={booking.id} />
          </div>
        )}

        <div className="mt-6 space-y-4">
          <IncidentReportForm bookingId={booking.id} existingIncident={booking.incidents[0] ?? null} />
          <ComplaintForm bookingId={booking.id} existingReference={booking.complaints[0]?.reference} />
        </div>
      </div>
    </PortalShell>
  );
}
