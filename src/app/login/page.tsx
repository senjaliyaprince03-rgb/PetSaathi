import type { Metadata } from "next";
import { AuthSlidingPanel } from "@/components/forms/auth-sliding-panel";
import { ParallaxTotemBackground } from "@/components/motion/parallax-totem-background";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4 sm:p-8">
      <ParallaxTotemBackground />

      <div className="relative z-10 w-full max-w-[900px]">
        <AuthSlidingPanel />
      </div>
    </main>
  );
}
