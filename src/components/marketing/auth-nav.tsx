"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, User } from "lucide-react";
import type { Route } from "next";

type AppIdentity = {
  displayName: string;
  roles: string[];
};

export function AuthNav() {
  const [currentUser, setCurrentUser] = useState<AppIdentity | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data && data.authenticated && data.user) {
          setCurrentUser({
            displayName: data.user.displayName || "User",
            roles: data.user.roles || []
          });
        }
      })
      .catch(() => {});
  }, []);

  const dashboardUrl = currentUser
    ? currentUser.roles.includes("SUPER_ADMIN") || currentUser.roles.includes("OPERATIONS_ADMIN")
      ? "/admin"
      : currentUser.roles.includes("SITTER")
      ? "/saathi"
      : "/dashboard"
    : "/dashboard";

  return (
    <div className="flex items-center gap-3">
      {currentUser ? (
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href={dashboardUrl as Route}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo transition hover:underline"
          >
            <User className="h-3.5 w-3.5" />
            <span>Dashboard ({currentUser.displayName.split(" ")[0]})</span>
          </Link>
          <Link
            href={"/api/auth/signout" as Route}
            className="text-xs font-semibold text-ink/60 transition hover:text-coral"
          >
            Sign out
          </Link>
        </div>
      ) : (
        <Link href={"/login" as Route} className="hidden text-sm font-bold text-ink transition-colors hover:text-ink/70 sm:block">
          Sign in
        </Link>
      )}
      <Link
        href={"/book" as Route}
        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#301F30] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#301F30]/90 sm:px-5 sm:py-2.5 sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#301F30] focus-visible:ring-offset-2"
      >
        <span>Find Care &amp; Book</span>
        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Link>
    </div>
  );
}
