import type { Metadata } from "next";
import Link from "next/link";
import { AuthSlidingPanel } from "@/components/forms/auth-sliding-panel";
import { ParallaxTotemBackground } from "@/components/motion/parallax-totem-background";
import { getCurrentIdentity } from "@/modules/auth/session";

export const metadata: Metadata = { 
  title: "Parent & Saathi Sign In", 
  description: "Access your PetSaathi customer dashboard, pet passports, live walk tracking, and caregiver assignments.",
  robots: { index: false, follow: false } 
};

export default async function LoginPage() {
  const identity = await getCurrentIdentity();
  const dashboardUrl = identity
    ? identity.roles.includes("SUPER_ADMIN") || identity.roles.includes("OPERATIONS_ADMIN")
      ? "/admin"
      : identity.roles.includes("SITTER")
      ? "/saathi"
      : "/dashboard"
    : "/dashboard";

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-4 sm:p-8">
      <ParallaxTotemBackground />

      <div className="relative z-10 w-full max-w-[900px]">
        {identity && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo/20 bg-paper/95 px-5 py-3 shadow-sm backdrop-blur">
            <p className="text-xs text-ink/80">
              Currently signed in as <strong className="text-ink">{identity.displayName}</strong> ({identity.roles.includes("SUPER_ADMIN") ? "Admin" : identity.roles.includes("SITTER") ? "Saathi" : "Pet Parent"})
            </p>
            <div className="flex items-center gap-3 text-xs font-bold">
              <Link href={dashboardUrl} className="text-indigo hover:underline">
                Go to Dashboard →
              </Link>
              <span className="text-ink/30">|</span>
              <Link href={"/api/auth/signout"} className="text-coral hover:underline">
                Sign out
              </Link>
            </div>
          </div>
        )}

        <AuthSlidingPanel />
      </div>
    </main>
  );
}
