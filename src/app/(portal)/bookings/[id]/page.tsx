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
      assignments: { where: { status: { in: ["ACCEPTED", "CUSTOMER_APPROVED", "ACTIVE", "COMPLETED"] } }, orderBy: { offeredAt: "desc" }, take: 1, include: { sitter: { select: { user: { select: { displayName: true } }, verifications: { where: { status: "PASSED", revokedAt: null }, select: { publicLabel: true, type: true, expiresAt: true } } } } } },
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
      <div className="mt-5 pb-12 max-w-6xl">
        <Link href="/dashboard" className={buttonVariants({ variant: "ghost", size: "sm" })}>← Back to dashboard</Link>
    <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_22rem]"><section className="rounded-5xl bg-indigo p-7 text-paper shadow-soft sm:p-10"><p className="text-xs font-bold uppercase tracking-[0.2em] text-saffron">{booking.reference}</p><h1 className="mt-4 font-display text-5xl font-semibold tracking-tight">{booking.serviceType.name} for {booking.pet.name}</h1><div className="mt-7 grid gap-3 text-sm text-paper/70 sm:grid-cols-2"><p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-saffron" />{booking.scheduledStart.toLocaleDateString("en-IN", { dateStyle: "full" })}</p><p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-saffron" />{booking.scheduledStart.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}</p><p className="flex items-center gap-2"><PawPrint className="h-4 w-4 text-saffron" />{booking.pet.species.toLowerCase()} {booking.pet.breed ? `· ${booking.pet.breed}` : ""}</p><p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-saffron" />{booking.address.label} · {booking.address.locality}</p></div></section><aside className="rounded-5xl border border-ink/10 bg-paper p-6 shadow-lifted"><p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/45">Current status</p><p className="mt-3 font-display text-3xl font-semibold">{booking.status.replaceAll("_", " ")}</p><div className="mt-6 grid gap-2">{["Request", "Match", "Approve", "Pay", "Care", "Report"].map((label, index) => <div key={label} className="flex items-center gap-3 text-sm"><span className={`h-2.5 w-2.5 rounded-full ${currentIndex >= [0,2,4,5,6,9][index]! ? "bg-leaf" : "bg-ink/12"}`} />{label}</div>)}</div></aside></div>
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
      ]] satisfies Array<[string, Route, typeof Activity]>).map(([label, href, Icon]) => <Link key={label} href={href} className="group flex items-center justify-between rounded-3xl border border-indigo/10 bg-paper px-4 py-4 text-sm font-bold text-ink/65 shadow-lifted transition hover:-translate-y-0.5 hover:border-coral/20 hover:text-indigo"><span className="flex items-center gap-2"><Icon className="h-4 w-4 text-coral" />{label}</span><span aria-hidden className="transition group-hover:translate-x-0.5">→</span></Link>)}
    </nav>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]"><section className="rounded-4xl border border-ink/10 bg-paper p-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/45">{booking.status === "CUSTOMER_APPROVAL_PENDING" && assignment?.type === "REPLACEMENT" ? "Proposed replacement Saathi" : "Proposed Saathi"}</p>{assignment ? <div className="mt-4"><h2 className="font-display text-3xl font-semibold">{assignment.sitter.user.displayName}</h2><div className="mt-4 flex flex-wrap gap-2">{assignment.sitter.verifications.filter(({ expiresAt }) => !expiresAt || expiresAt > new Date()).map((verification) => <span key={verification.type} className="flex items-center gap-2 rounded-full bg-leaf/10 px-3 py-2 text-xs font-semibold"><ShieldCheck className="h-4 w-4 text-leaf" />{verification.publicLabel ?? verification.type.replaceAll("_", " ")}</span>)}</div></div> : <p className="mt-4 text-ink/55">Operations is checking eligible local caregivers. No private sitter data is exposed before a proposal.</p>}{booking.status === "CUSTOMER_APPROVAL_PENDING" && assignment && <div className="mt-6"><CustomerApprovalAction bookingId={booking.id} assignmentId={assignment.id} /></div>}{booking.status === "REPLACEMENT_REQUIRED" && <p className="mt-5 rounded-2xl bg-saffron/15 p-4 text-sm leading-6 font-semibold">Operations is searching for an eligible replacement. Your original verified payment remains attached; no second payment is requested. You will approve any replacement before care resumes.</p>}</section><div className="grid gap-5">{booking.status === "PAYMENT_PENDING" && <PaymentAction bookingId={booking.id} reference={booking.reference} amountPaise={booking.quoteAmountPaise} />}{["REQUESTED", "RISK_REVIEW", "MATCHING", "SITTER_PROPOSED", "CUSTOMER_APPROVAL_PENDING", "PAYMENT_PENDING"].includes(booking.status) && <CustomerCancelAction bookingId={booking.id} />}{booking.status === "COMPLETED" && !booking.review && <ReviewAction bookingId={booking.id} />}{booking.review && <div className="rounded-3xl bg-leaf/10 p-5"><CheckCircle2 className="h-6 w-6 text-leaf" /><p className="mt-3 font-semibold">Review saved · {booking.review.rating}/5</p></div>}</div></div>
    {booking.reports[0] && <section className="mt-6 rounded-4xl border border-ink/10 bg-paper p-6"><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/45">Care report · version {booking.reports[0].version}</p><span className="rounded-full bg-saffron/15 px-3 py-1 text-xs font-bold">{booking.reports[0].reviewStatus.replaceAll("_", " ")}</span></div><p className="mt-3 text-sm leading-6 text-ink/55">The report is visible immediately; booking closure and payout eligibility wait for the recorded quality review.</p><pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-7 text-ink/65">{JSON.stringify(booking.reports[0].fields, null, 2)}</pre></section>}
      {liveWalkTrackingEnabled && ["SITTER_EN_ROUTE", "IN_PROGRESS"].includes(booking.status) && <TrackingViewer bookingId={booking.id} />}
      <IncidentReportForm bookingId={booking.id} existingIncident={booking.incidents[0] ?? null} />
      <ComplaintForm bookingId={booking.id} existingReference={booking.complaints[0]?.reference} />
    </div>
  </PortalShell>
  );
}
