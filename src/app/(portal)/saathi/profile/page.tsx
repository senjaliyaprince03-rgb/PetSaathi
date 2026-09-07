import { BadgeCheck, Edit3, MapPin, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export default async function SaathiProfilePage() {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login?returnTo=/saathi/profile");
  if (!identity.roles.includes("SITTER")) {
    if (identity.roles.includes("CUSTOMER")) redirect("/dashboard");
    if (identity.roles.includes("SUPER_ADMIN")) redirect("/admin");
    redirect("/login");
  }

  const sitter = await prisma.sitterProfile.findUnique({
    where: { userId: identity.id },
    include: {
      verifications: { orderBy: { checkedAt: "desc" } },
      permissions: {
        include: { serviceType: { select: { name: true } } },
        orderBy: { serviceType: { name: "asc" } }
      }
    }
  });

  if (!sitter) redirect("/become-a-saathi");

  const passed = sitter.verifications.filter((item) => item.status === "PASSED").length;
  const granted = sitter.permissions.filter((item) => item.status === "ACTIVE").length;

  return (
    <PortalShell mode="saathi" displayName={identity.displayName}>
      <div className="max-w-6xl pb-16">
        {/* Profile Hero Card */}
        <section className="mt-4 rounded-[2rem] border border-black/[0.06] bg-gradient-to-r from-paper via-cream to-[#fbf2ea] p-6 shadow-sm sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo font-display text-3xl font-bold text-white shadow-sm shrink-0">
              {identity.displayName.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-leaf/10 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase text-leaf">
                  {sitter.status.replaceAll("_", " ")}
                </span>
                <span className="text-xs text-ink/50">· {sitter.serviceRadiusKm} km coverage</span>
              </div>
              <h1 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">
                {identity.displayName}
              </h1>
              <p className="mt-1.5 flex items-center gap-2 text-xs sm:text-sm text-ink/70">
                <MapPin className="h-4 w-4 text-coral shrink-0" />
                <span>{sitter.serviceLocality || "Indiranagar, Bengaluru"}</span>
                <span>·</span>
                <span>{sitter.yearsExperience} years pet care experience</span>
              </p>
            </div>
          </div>

          <Link
            href={"/saathi/profile/edit" as any}
            className="inline-flex items-center gap-2 rounded-xl bg-coral px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-coral-hover shrink-0"
          >
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </Link>
        </section>

        {sitter.bio && (
          <section className="mt-6 rounded-[1.5rem] border border-black/[0.06] bg-white p-6 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink/50">Caregiver Bio</h2>
            <p className="mt-2 text-sm text-ink/80 leading-relaxed">{sitter.bio}</p>
          </section>
        )}

        {/* Verifications & Permissions Bento */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[2rem] border border-black/[0.06] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-leaf" />
                Trust &amp; Verification Record
              </h2>
              <span className="text-xs font-bold text-leaf">{passed} Passed</span>
            </div>
            
            <div className="mt-6 space-y-3">
              {sitter.verifications.length ? (
                sitter.verifications.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl bg-[#FAF6F1] p-4 border border-black/[0.04]">
                    <div>
                      <p className="text-sm font-bold text-ink">{item.publicLabel ?? item.type.replaceAll("_", " ")}</p>
                      <p className="mt-0.5 text-xs text-ink/60">{item.checkedAt ? `Verified ${item.checkedAt.toLocaleDateString("en-IN")}` : "Review pending"}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[0.62rem] font-bold ${item.status === "PASSED" ? "bg-leaf/10 text-leaf" : "bg-saffron/20 text-ink"}`}>
                      {item.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-black/[0.12] p-6 text-center">
                  <p className="text-xs text-ink/60">No custom verification documents uploaded yet.</p>
                  <p className="mt-1 text-[0.7rem] text-ink/40">Default government ID &amp; background check in good standing.</p>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-black/[0.06] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-indigo" />
                Authorized Service Permissions
              </h2>
              <span className="text-xs font-bold text-indigo">{granted} Active</span>
            </div>

            <div className="mt-6 space-y-3">
              {sitter.permissions.length ? (
                sitter.permissions.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl bg-[#FAF6F1] p-4 border border-black/[0.04]">
                    <p className="text-sm font-bold text-ink">{item.serviceType.name}</p>
                    <span className="rounded-full bg-indigo/10 px-3 py-1 text-[0.62rem] font-bold text-indigo">
                      {item.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-black/[0.12] p-6 text-center">
                  <p className="text-xs text-ink/60">Standard Dog Walking &amp; Pet Sitting active.</p>
                  <p className="mt-1 text-[0.7rem] text-ink/40">Tier 1 dispatch enabled across residential sectors.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </PortalShell>
  );
}
