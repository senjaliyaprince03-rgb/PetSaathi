import { ClipboardCheck, ShieldAlert } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { ReportReviewActions } from "@/components/portal/report-review-actions";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["OPERATIONS_ADMIN", "SAFETY_ADMIN", "SUPER_ADMIN"])) redirect("/login?returnTo=/admin/reports");
  const bookingRows = await prisma.booking.findMany({
    where: { status: "COMPLETED", reports: { some: { reviewStatus: { in: ["PENDING", "CORRECTION_REQUIRED", "ESCALATED"] } } } },
    orderBy: { updatedAt: "asc" }, take: 100,
    select: { id: true, reference: true, status: true, pet: { select: { name: true } }, serviceType: { select: { name: true } }, assignments: { where: { status: "COMPLETED" }, orderBy: { completedAt: "desc" }, take: 1, select: { sitter: { select: { user: { select: { displayName: true } } } } } }, reports: { orderBy: { version: "desc" }, take: 1, select: { id: true, version: true, fields: true, concernFlag: true, reviewStatus: true, reviewNote: true, submittedAt: true } }, payouts: { take: 1, select: { status: true, amountPaise: true } }, incidents: { where: { status: { not: "CLOSED" } }, select: { reference: true } } }
  });
  const bookings = bookingRows.filter(({ reports }) => reports[0] && reports[0].reviewStatus !== "APPROVED");
  const canApproveConcern = hasAnyRole(identity, ["SAFETY_ADMIN", "SUPER_ADMIN"]);
  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/50">care quality gate</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Report review and booking closure</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/60 mb-10">A sitter submission completes care delivery, but only an authorised review closes the booking, consumes capacity and makes the payout eligible for finance approval.</p>
        <div className="mt-10 grid gap-5">{bookings.length ? bookings.map((booking) => { const report = booking.reports[0]!; const payout = booking.payouts[0]; return <article key={report.id} className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted"><div className="flex flex-wrap items-start justify-between gap-4"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${report.concernFlag ? "bg-coral/12 text-coral" : "bg-leaf/12 text-leaf"}`}>{report.concernFlag ? <ShieldAlert className="h-6 w-6" /> : <ClipboardCheck className="h-6 w-6" />}</span><span className="rounded-full bg-saffron/15 px-4 py-2 text-xs font-bold">{report.reviewStatus.replaceAll("_", " ")}</span></div><p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-ink/45">{booking.reference} · report v{report.version} · {report.submittedAt.toLocaleString("en-IN")}</p><h2 className="mt-2 font-display text-3xl font-semibold">{booking.serviceType.name} for {booking.pet.name}</h2><p className="mt-2 text-sm text-ink/55">Saathi: {booking.assignments[0]?.sitter.user.displayName ?? "Assignment record unavailable"} · Payout: {payout ? `₹${(payout.amountPaise / 100).toLocaleString("en-IN")} ${payout.status.toLowerCase()}` : "not created"}</p>{booking.incidents.length > 0 && <p className="mt-4 rounded-2xl bg-coral/10 p-3 text-sm font-semibold text-coral">Open incident: {booking.incidents.map(({ reference }) => reference).join(", ")}. Approval is blocked.</p>}<pre className="mt-5 max-h-80 overflow-auto whitespace-pre-wrap rounded-3xl bg-ink p-5 font-sans text-sm leading-7 text-paper/75">{JSON.stringify(report.fields, null, 2)}</pre>{report.reviewNote && <p className="mt-4 text-sm leading-6 text-ink/60"><strong>Previous decision:</strong> {report.reviewNote}</p>}<ReportReviewActions reportId={report.id} status={report.reviewStatus} concernFlag={report.concernFlag} canApproveConcern={canApproveConcern} /></article>; }) : <div className="rounded-5xl border border-dashed border-ink/15 bg-paper/60 p-10 text-center"><ClipboardCheck className="mx-auto h-11 w-11 text-leaf" /><h2 className="mt-5 font-display text-3xl font-semibold">No report awaits review.</h2><p className="mt-3 text-ink/55">Every completed care report has a recorded decision.</p></div>}</div>
      </div>
    </PortalShell>
  );
}
