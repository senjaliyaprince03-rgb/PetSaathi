"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Route } from "next";

import { MagneticButton } from "@/components/effects/animos-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { MobileNav } from "@/components/marketing/mobile-nav";

type AppIdentity = {
  displayName: string;
  roles: string[];
};

export function AuthNav() {
  const [currentUser, setCurrentUser] = useState<AppIdentity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then(res => res.json())
      .then(session => {
        if (session && session.user) {
          // Approximate the roles since NextAuth session might not have all of them unless configured,
          // but we can just use a simple check or fetch a specific endpoint.
          // For now, if we have a session, we show a generic Dashboard link.
          setCurrentUser({
            displayName: session.user.name || "User",
            roles: session.user.roles || []
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const dashboardUrl = currentUser
    ? currentUser.roles.includes("SUPER_ADMIN") || currentUser.roles.includes("OPERATIONS_ADMIN")
      ? "/admin"
      : currentUser.roles.includes("SITTER")
      ? "/saathi"
      : "/dashboard"
    : "/dashboard";

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-9 w-20 animate-pulse rounded-full bg-indigo/10" />
        <div className="h-10 w-28 animate-pulse rounded-full bg-indigo/20" />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {currentUser ? (
        <div className="flex items-center gap-3">
          <Link
            href={dashboardUrl as Route}
            className="hidden text-sm font-bold text-indigo transition hover:underline sm:block"
          >
            Dashboard ({currentUser.displayName.split(" ")[0]})
          </Link>
          <Link
            href={"/api/auth/signout" as Route}
            className="hidden text-xs font-semibold text-ink/60 transition hover:text-coral sm:block"
          >
            Sign out
          </Link>
        </div>
      ) : (
        <>
          <Link
            href={"/become-a-saathi" as Route}
            className="hidden text-xs font-bold uppercase tracking-wider text-ink/70 transition hover:text-coral xl:inline-block"
          >
            Become a Saathi
          </Link>
          <MagneticButton strength={0.2}>
            <Link href={"/login" as Route} className="hidden text-sm font-bold text-ink sm:block">Sign in</Link>
          </MagneticButton>
        </>
      )}
      <MagneticButton strength={0.4}>
        <Link href={"/book" as Route} className={cn(buttonVariants({ variant: "primary", size: "default" }), "rounded-full font-bold bg-[#301F30] hover:bg-[#301F30]/90 text-white whitespace-nowrap")}>
          Find Care &amp; Book <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </MagneticButton>
      <MobileNav />
    </div>
  );
}
