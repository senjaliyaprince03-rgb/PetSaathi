import { BadgeCheck, CheckCircle2, Clock3, FileText, GraduationCap, MapPin, ShieldCheck, UserCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function VerificationQueuePage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["VERIFICATION_ADMIN", "SUPER_ADMIN"])) {
    redirect("/login?returnTo=/admin/verification");
  }

  const applicants = await prisma.sitterProfile.findMany({
    where: { status: { in: ["APPLICANT", "UNDER_REVIEW", "TRAINING"] } },
    orderBy: { applicationAt: "asc" },
    take: 50,
    include: {
      user: { select: { displayName: true, email: true, phoneE164: true } },
      permissions: { include: { serviceType: { select: { name: true } } } },
      verifications: {
        orderBy: { checkedAt: "desc" },
        select: { type: true, status: true, publicLabel: true, expiresAt: true },
      },
      trainingAttempts: {
        where: { passed: true },
        include: { module: { select: { title: true } } },
      },
    },
  });

  const underReviewCount = applicants.filter((a) => a.status === "UNDER_REVIEW").length;
  const trainingCount = applicants.filter((a) => a.status === "TRAINING").length;
  const newApplicantsCount = applicants.filter((a) => a.status === "APPLICANT").length;

  return (
    <PortalShell mode="admin" displayName={identity.displayName} roles={identity.roles}>
      <div className="max-w-7xl pb-16 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-leaf/10 text-leaf border border-leaf/20 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                <BadgeCheck className="w-3.5 h-3.5 text-leaf" />
                Caregiver Onboarding &amp; Trust Authority
              </span>
              <span className="text-xs text-ink/60 font-semibold hidden sm:inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-leaf" />
                Evidence-Based KYC Verification
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-ink">
              Verification &amp; Onboarding Queue
            </h1>
            <p className="mt-2 text-sm leading-6 text-ink/70 max-w-3xl">
              Inspect government identity credentials, background police verification reports, and practical canine handling assessments before granting live visit privileges.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-2 bg-white hover:bg-surface border border-ink/10 text-ink text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-2xs"
            >
              <span>Onboarding Leads</span>
            </Link>
          </div>
        </div>

        {/* Top 4 Verification KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Total in Pipeline</span>
              <UserCheck className="w-4 h-4 text-indigo" />
            </div>
            <span className="text-3xl font-bold font-display text-ink block">{applicants.length}</span>
            <p className="text-[11px] text-ink/60 mt-1 font-medium">Applicants requiring evaluation</p>
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Under Review</span>
              <FileText className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-3xl font-bold font-display text-amber-700 block">{underReviewCount}</span>
            <p className="text-[11px] text-amber-700 mt-1 font-medium">KYC documents submitted</p>
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Practical Training</span>
              <GraduationCap className="w-4 h-4 text-leaf" />
            </div>
            <span className="text-3xl font-bold font-display text-leaf block">{trainingCount}</span>
            <p className="text-[11px] text-leaf mt-1 font-medium">Completing Saathi Academy</p>
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">New Submissions</span>
              <Clock3 className="w-4 h-4 text-coral" />
            </div>
            <span className="text-3xl font-bold font-display text-coral block">{newApplicantsCount}</span>
            <p className="text-[11px] text-coral mt-1 font-medium">Awaiting initial document triage</p>
          </div>
        </div>

        {/* Applicants Grid */}
        <div className="grid gap-6">
          {applicants.length ? (
            applicants.map((sitter) => (
              <article
                key={sitter.id}
                className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-7 shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ink/5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo/10 text-indigo flex items-center justify-center font-bold font-display text-lg">
                      {sitter.user.displayName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-display text-xl font-bold text-ink">{sitter.user.displayName}</h2>
                        <span className="rounded-full bg-saffron/15 text-saffron-dark border border-saffron/25 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                          {sitter.status.replaceAll("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-ink/60 mt-0.5 font-medium">
                        {sitter.yearsExperience} years experience • {sitter.serviceLocality ?? "Locality not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ink/60 font-medium">
                      Applied: {sitter.applicationAt ? new Date(sitter.applicationAt).toLocaleDateString() : "Recent"}
                    </span>
                  </div>
                </div>

                {/* Service Types Qualified */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-ink/70 mr-1">Permitted Services:</span>
                  {sitter.permissions.length ? (
                    sitter.permissions.map((p) => (
                      <span
                        key={p.id}
                        className="rounded-xl bg-surface px-3 py-1 text-xs font-semibold text-ink/80 border border-ink/5"
                      >
                        {p.serviceType.name} ({p.status})
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-ink/50 italic">No specific service qualifications recorded yet</span>
                  )}
                </div>

                {/* Verification Evidence & Training Checklists */}
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-surface/70 p-4 border border-ink/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/70">
                        <ShieldCheck className="h-4 w-4 text-leaf" />
                        <span>Identity &amp; Police Verification</span>
                      </span>
                      <span className="text-xs font-extrabold text-ink">
                        {sitter.verifications.length} Checks
                      </span>
                    </div>
                    {sitter.verifications.length ? (
                      <div className="space-y-1.5 mt-2">
                        {sitter.verifications.map((v, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs bg-white px-3 py-1.5 rounded-lg border border-ink/5">
                            <span className="font-medium text-ink">{v.publicLabel || v.type}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              v.status === "PASSED" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
                            }`}>
                              {v.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-ink/50 py-2 italic">Awaiting document uploads.</p>
                    )}
                  </div>

                  <div className="rounded-2xl bg-surface/70 p-4 border border-ink/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/70">
                        <GraduationCap className="h-4 w-4 text-indigo" />
                        <span>Practical Training Assessment</span>
                      </span>
                      <span className="text-xs font-extrabold text-ink">
                        {sitter.trainingAttempts.length} Passed
                      </span>
                    </div>
                    {sitter.trainingAttempts.length ? (
                      <div className="space-y-1.5 mt-2">
                        {sitter.trainingAttempts.map((t, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs bg-white px-3 py-1.5 rounded-lg border border-ink/5">
                            <span className="font-medium text-ink">{t.module?.title || "Care Module"}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800">
                              PASS
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-ink/50 py-2 italic">No completed training modules recorded.</p>
                    )}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-ink/15 bg-white p-12 text-center">
              <BadgeCheck className="mx-auto h-12 w-12 text-leaf mb-3" />
              <h2 className="font-display text-2xl font-bold text-ink">Verification Queue Clear</h2>
              <p className="mt-1 text-xs text-ink/60 max-w-sm mx-auto">
                All submitted caregiver applications and verification documents have been reviewed.
              </p>
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
