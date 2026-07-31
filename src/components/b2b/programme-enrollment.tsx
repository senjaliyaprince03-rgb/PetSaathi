"use client";

import { ArrowRight, CheckCircle2, KeyRound, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

type EnrollmentPhase = "idle" | "token" | "verified";

type ProgrammeEnrollmentProps = {
  slug: string;
  eligibilityLabel: string;
  openAccess: boolean;
};

export function ProgrammeEnrollment({
  slug,
  eligibilityLabel,
  openAccess,
}: ProgrammeEnrollmentProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [phase, setPhase] = useState<EnrollmentPhase>("idle");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const signIn = () => {
    const returnTo = encodeURIComponent(`/benefits/${slug}`);
    startTransition(() => router.push(`/login?returnTo=${returnTo}`));
  };

  const enroll = async () => {
    setMessage(null);
    const response = await fetch(`/api/partner-programmes/${slug}/enroll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    if (response.status === 401) return signIn();

    const result = (await response.json().catch(() => null)) as {
      verificationStatus?: string;
      message?: string;
    } | null;
    if (!response.ok) {
      setMessage(result?.message ?? "Enrollment could not be started.");
      return;
    }

    if (result?.verificationStatus === "VERIFIED") {
      setPhase("verified");
      setMessage("Your programme access is active.");
      return;
    }

    setPhase("token");
    setMessage(
      "Enrollment is recorded. Enter the one-time token issued by an authorised programme manager.",
    );
  };

  const verify = async () => {
    setMessage(null);
    const response = await fetch(`/api/partner-programmes/${slug}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token.trim() }),
    });
    if (response.status === 401) return signIn();

    const result = (await response.json().catch(() => null)) as {
      verificationStatus?: string;
      message?: string;
    } | null;
    if (!response.ok) {
      setMessage(
        result?.message ??
          "The token is invalid, expired, consumed, or unavailable.",
      );
      return;
    }

    setToken("");
    setPhase("verified");
    setMessage("Eligibility verified. Your programme access is active.");
  };

  if (phase === "verified") {
    return (
      <div className="rounded-4xl border border-leaf/20 bg-leaf/10 p-6">
        <CheckCircle2 className="h-8 w-8 text-leaf" />
        <h2 className="mt-4 font-display text-3xl font-semibold">
          Programme access verified
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink/65" aria-live="polite">
          {message}
        </p>
        <Button
          type="button"
          variant="accent"
          className="mt-5"
          onClick={() =>
            startTransition(() => router.push("/customer/wallet"))
          }
        >
          Open service wallet <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-4xl border border-indigo/12 bg-paper p-6 shadow-lifted sm:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo/10 text-indigo">
        <KeyRound className="h-5 w-5" />
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-coral">
        Eligibility · {eligibilityLabel}
      </p>
      <h2 className="mt-2 font-display text-3xl font-semibold">
        {phase === "token"
          ? "Complete the controlled verification step."
          : "Request programme access."}
      </h2>
      <p className="mt-3 text-sm leading-6 text-ink/60">
        {openAccess
          ? "Open-access enrollment activates only for an authenticated customer while this programme remains active."
          : "Enrollment does not grant benefits by itself. An authorised programme manager must verify eligibility and issue a short-lived, one-time token."}
      </p>

      {phase === "token" ? (
        <>
          <label className="mt-5 block text-sm font-semibold">
            One-time verification token
            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              autoComplete="one-time-code"
              spellCheck={false}
              maxLength={43}
              className="mt-2 min-h-13 w-full rounded-2xl border border-ink/15 bg-cream/35 px-4 font-mono text-sm outline-none focus:border-indigo"
            />
          </label>
          <Button
            type="button"
            variant="accent"
            className="mt-4"
            disabled={pending || !/^[A-Za-z0-9_-]{43}$/.test(token.trim())}
            onClick={() => startTransition(verify)}
          >
            {pending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="h-4 w-4" />
            )}
            Verify eligibility
          </Button>
        </>
      ) : (
        <Button
          type="button"
          variant="accent"
          className="mt-5"
          disabled={pending}
          onClick={() => startTransition(enroll)}
        >
          {pending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : null}
          {pending ? "Recording enrollment..." : "Continue securely"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}

      {message ? (
        <p
          className="mt-4 rounded-2xl bg-cream/70 p-3 text-sm leading-6 text-ink/70"
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
