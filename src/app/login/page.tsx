import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthSlidingPanel } from "@/components/forms/auth-sliding-panel";
import { ParallaxTotemBackground } from "@/components/motion/parallax-totem-background";
import { getCurrentIdentity } from "@/modules/auth/session";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function LoginPage() {
  const identity = await getCurrentIdentity();
  if (identity) {
    if (identity.roles.includes("SUPER_ADMIN") || identity.roles.includes("OPERATIONS_ADMIN")) {
      redirect("/admin");
    } else if (identity.roles.includes("SITTER")) {
      redirect("/saathi");
    } else {
      redirect("/dashboard");
    }
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4 sm:p-8">
      <ParallaxTotemBackground />

      <div className="relative z-10 w-full max-w-[900px]">
        <AuthSlidingPanel />
      </div>
    </main>
  );
}
