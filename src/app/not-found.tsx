"use client";

import Link from "next/link";
import Image from "next/image";
import { PublicShell } from "@/components/marketing/public-shell";
import { buttonVariants } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <PublicShell>
      {/* keyframe styles for subtle image animation */}
      <style>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-15px); }
        }
        @keyframes reveal {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-gradient-to-b from-paper to-cream/50 px-6 py-20 lg:px-12">
        {/* Background decorative elements */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-saffron/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-indigo/5 blur-[120px]" />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2 mt-12">

          {/* Text Content */}
          <div className="flex flex-col text-center lg:text-left" style={{ animation: "reveal 0.8s ease-out forwards" }}>
            <div className="mb-6 flex items-center justify-center gap-3 lg:justify-start">
              <span className="flex h-12 items-center rounded-2xl bg-coral/10 px-4 font-display text-lg font-bold tracking-widest text-coral">
                ERROR 404
              </span>
            </div>
            <h1 className="mb-6 font-display text-5xl font-bold leading-[1.1] text-ink md:text-6xl lg:text-7xl">
              Ruh-roh! <br />
              <span className="text-indigo">You&apos;re lost.</span>
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-ink/80 max-w-lg mx-auto lg:mx-0">
              We&apos;ve sniffed around every corner, but we can&apos;t seem to find the page you&apos;re looking for. It might have been moved or deleted.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/"
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
              <Link
                href="/services"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-paper px-6 font-bold text-ink shadow-sm ring-1 ring-inset ring-ink/10 transition-all hover:bg-cream hover:ring-indigo/30"
              >
                <Search className="mr-2 h-5 w-5 text-indigo" />
                Explore Services
              </Link>
            </div>
          </div>

          {/* Image Content */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none" style={{ animation: "reveal 1s ease-out forwards 0.2s", opacity: 0 }}>
            <div
              className="relative aspect-square w-full"
              style={{ animation: "gentleFloat 6s ease-in-out infinite" }}
            >
              <Image
                src="/images/404-dog.jpg"
                alt="Confused cute dog looking for a page"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain drop-shadow-xl"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
          </div>

        </div>
      </div>
    </PublicShell>
  );
}
