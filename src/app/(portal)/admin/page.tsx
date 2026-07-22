import type { Role } from "@prisma/client";
import type { Route } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

const adminRoles: Role[] = ["OPERATIONS_ADMIN", "VERIFICATION_ADMIN", "SAFETY_ADMIN", "FINANCE_ADMIN", "CONTENT_ADMIN", "SUPER_ADMIN"];

export default async function AdminDashboardPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, adminRoles)) redirect("/login?returnTo=/admin");
  const [matching, incidents, paymentEvents] = await Promise.all([
    prisma.booking.count({ where: { status: { in: ["REQUESTED", "RISK_REVIEW", "MATCHING", "REPLACEMENT_REQUIRED"] } } }),
    prisma.incident.count({ where: { status: { not: "CLOSED" } } }),
    prisma.paymentEvent.count({ where: { processedAt: null } })
  ]);
  return <PortalShell mode="admin" displayName={identity.displayName} metrics={[`${matching} need matching`, `${incidents} open incident${incidents === 1 ? "" : "s"}`, `${paymentEvents} payment event${paymentEvents === 1 ? "" : "s"}`]}><section className="mt-5 rounded-4xl border border-indigo/10 bg-paper p-6 shadow-lifted"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="eyebrow">Priority lanes</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em]">Command centre</h2></div><p className="max-w-md text-sm leading-6 text-ink/48">Each queue keeps its own permission boundary and recorded decision trail.</p></div><div className="mt-6 grid gap-3 md:grid-cols-3">{([[
    "Matching decisions", `${matching} waiting`, "/admin/matching"
  ], [
    "Safety & incidents", `${incidents} open`, "/admin/safety"
  ], [
    "Finance events", `${paymentEvents} unprocessed`, "/admin/finance"
  ]] satisfies Array<[string, string, Route]>).map(([label, value, href]) => <Link key={href} href={href} className="group rounded-3xl border border-indigo/10 bg-cream/45 p-5 transition hover:-translate-y-1 hover:bg-indigo/[0.05]"><p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/40">{label}</p><p className="mt-3 font-display text-2xl font-semibold">{value}</p><p className="mt-5 text-sm font-bold text-coral transition group-hover:text-indigo">Open queue →</p></Link>)}</div></section></PortalShell>;
}
