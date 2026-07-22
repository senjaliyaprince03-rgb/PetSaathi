import { ClipboardCheck, ShieldAlert } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export default async function SaathiReportsPage() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) redirect("/login?returnTo=/saathi/reports");
  const reports = await prisma.bookingReport.findMany({ where: { submittedBy: identity.id }, orderBy: { submittedAt: "desc" }, take: 30, include: { booking: { select: { reference: true, pet: { select: { name: true } }, serviceType: { select: { name: true } } } } } });
  const approved = reports.filter((item) => item.reviewStatus === "APPROVED").length;
  const corrections = reports.filter((item) => item.reviewStatus === "CORRECTION_REQUIRED").length;
  return <PortalShell mode="saathi" displayName={identity.displayName} metrics={[`${reports.length} submitted`, `${approved} approved`, `${corrections} need correction`]}><section className="mt-5 rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted"><p className="eyebrow">Session report cards</p><h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em]">Care, documented with clarity.</h2><div className="mt-6 grid gap-3">{reports.length ? reports.map((report) => <article key={report.id} className="rounded-3xl bg-cream/55 p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-coral">{report.booking.reference} · version {report.version}</p><h3 className="mt-2 font-display text-2xl font-semibold">{report.booking.serviceType.name} · {report.booking.pet.name}</h3><p className="mt-2 text-xs text-ink/42">Submitted {report.submittedAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p></div><span className={`flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${report.concernFlag ? "bg-coral/10 text-coral" : "bg-leaf/10 text-leaf"}`}>{report.concernFlag ? <ShieldAlert className="h-3.5 w-3.5" /> : <ClipboardCheck className="h-3.5 w-3.5" />}{report.reviewStatus.replaceAll("_", " ")}</span></div>{report.reviewNote && <p className="mt-4 rounded-2xl bg-paper/85 p-3 text-sm leading-6 text-ink/52">{report.reviewNote}</p>}</article>) : <div className="rounded-4xl border border-dashed border-indigo/15 p-10 text-center"><ClipboardCheck className="mx-auto h-10 w-10 text-indigo/35" /><h3 className="mt-4 font-display text-3xl font-semibold">No report cards yet.</h3><p className="mt-2 text-sm text-ink/48">Reports appear after an active service reaches the reporting stage.</p></div>}</div></section></PortalShell>;
}
