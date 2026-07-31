import { BadgeCheck, Clock3, MapPin, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export default async function VerificationQueuePage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["VERIFICATION_ADMIN", "SUPER_ADMIN"])) redirect("/login?returnTo=/admin/verification");
  const applicants = await prisma.sitterProfile.findMany({ where: { status: { in: ["APPLICANT", "UNDER_REVIEW", "TRAINING"] } }, orderBy: { applicationAt: "asc" }, take: 50, include: { user: { select: { displayName: true } }, permissions: { include: { serviceType: { select: { name: true } } } }, verifications: { orderBy: { checkedAt: "desc" }, select: { type: true, status: true, publicLabel: true, expiresAt: true } }, trainingAttempts: { where: { passed: true }, include: { module: { select: { title: true } } } } } });
  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/50">evidence, not a universal badge</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Verification queue</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/60 mb-10">Approval stays unavailable until the launch policy lists its required evidence and training modules in production configuration.</p>
        <div className="mt-10 grid gap-5">{applicants.map((sitter) => <article key={sitter.id} className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">{sitter.status.replaceAll("_", " ")}</p><h2 className="mt-2 font-display text-3xl font-semibold">{sitter.user.displayName}</h2></div><p className="flex items-center gap-2 text-sm font-semibold text-ink/55"><Clock3 className="h-4 w-4" />{sitter.yearsExperience} years experience</p></div><p className="mt-4 flex items-center gap-2 text-sm text-ink/60"><MapPin className="h-4 w-4 text-leaf" />{sitter.serviceLocality ?? "Locality not provided"}</p><div className="mt-5 flex flex-wrap gap-2">{sitter.permissions.map((permission) => <span key={permission.id} className="rounded-full bg-saffron/14 px-3 py-2 text-xs font-semibold">{permission.serviceType.name} · {permission.status}</span>)}</div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-cream/70 p-4"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-ink/45"><ShieldCheck className="h-4 w-4" />Evidence</p><p className="mt-2 text-sm">{sitter.verifications.length} recorded check{sitter.verifications.length === 1 ? "" : "s"}</p></div><div className="rounded-2xl bg-cream/70 p-4"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-ink/45"><BadgeCheck className="h-4 w-4" />Training</p><p className="mt-2 text-sm">{sitter.trainingAttempts.length} passed module{sitter.trainingAttempts.length === 1 ? "" : "s"}</p></div></div></article>)}{!applicants.length && <div className="glass-panel rounded-5xl p-10 text-center"><BadgeCheck className="mx-auto h-10 w-10 text-leaf" /><h2 className="mt-5 font-display text-3xl font-semibold">The review queue is clear.</h2></div>}</div>
      </div>
    </PortalShell>
  );
}
