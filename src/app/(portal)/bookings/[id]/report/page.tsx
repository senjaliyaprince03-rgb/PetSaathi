import { ClipboardCheck, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export default async function SessionReportCardPage({ params }: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity(); const { id } = await params;
  if (!identity?.roles.includes("CUSTOMER")) redirect(`/login?returnTo=/bookings/${id}/report`);
  const booking = await prisma.booking.findFirst({ where: { id, customerId: identity.id }, include: { pet: { select: { name: true } }, serviceType: { select: { name: true } }, reports: { orderBy: { version: "desc" }, take: 1 } } });
  if (!booking) notFound(); const report = booking.reports[0];
  return <PortalShell mode="customer" displayName={identity.displayName} metrics={[report ? `Report v${report.version}` : "No report", report?.reviewStatus.replaceAll("_", " ") ?? "Awaiting care", report?.concernFlag ? "Concern flagged" : "No concern flag"]}><div className="mx-auto mt-5 max-w-4xl rounded-5xl border border-indigo/10 bg-paper p-7 shadow-soft sm:p-10"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="eyebrow">Session report card</p><h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em]">{booking.serviceType.name} · {booking.pet.name}</h1></div><Link href={`/bookings/${booking.id}`} className={buttonVariants({ variant: "outline" })}>Booking overview</Link></div>{report ? <div className="mt-8"><div className={`flex items-start gap-3 rounded-3xl p-5 ${report.concernFlag ? "bg-coral/10 text-coral" : "bg-leaf/[0.07] text-leaf"}`}>{report.concernFlag ? <ShieldAlert className="mt-0.5 h-5 w-5" /> : <ClipboardCheck className="mt-0.5 h-5 w-5" />}<div><p className="font-bold">{report.reviewStatus.replaceAll("_", " ")}</p><p className="mt-1 text-sm opacity-75">Submitted {report.submittedAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p></div></div><dl className="mt-6 grid gap-3 sm:grid-cols-2">{Object.entries(readFields(report.fields)).map(([key, value]) => <div key={key} className="rounded-3xl bg-cream/55 p-5"><dt className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-ink/38">{key.replaceAll("_", " ")}</dt><dd className="mt-2 text-sm leading-6 text-ink/60">{formatValue(value)}</dd></div>)}</dl>{report.reviewNote && <p className="mt-6 rounded-3xl border border-indigo/10 p-5 text-sm leading-6 text-ink/52"><strong className="text-ink">Quality review:</strong> {report.reviewNote}</p>}</div> : <div className="mt-8 rounded-4xl border border-dashed border-indigo/15 p-10 text-center"><ClipboardCheck className="mx-auto h-10 w-10 text-indigo/30" /><h2 className="mt-4 font-display text-3xl font-semibold">No report card yet.</h2><p className="mt-2 text-sm text-ink/48">A structured report appears here after the Saathi completes the reporting stage.</p></div>}</div></PortalShell>;
}

function readFields(value: unknown): Record<string, unknown> { return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}; }
function formatValue(value: unknown) { if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value); if (Array.isArray(value)) return value.map(String).join(", "); return JSON.stringify(value); }
