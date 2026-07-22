"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, LoaderCircle, ShieldCheck } from "lucide-react";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";

const phoneSchema = z.object({ phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number") });
const otpSchema = z.object({ otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code") });
type PhoneInput = z.infer<typeof phoneSchema>;
type OtpInput = z.infer<typeof otpSchema>;

export function LoginPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [pending, setPending] = useState(false);
  const [providerError, setProviderError] = useState<string | null>(null);
  const phoneForm = useForm<PhoneInput>({ resolver: zodResolver(phoneSchema), defaultValues: { phone: "" } });
  const otpForm = useForm<OtpInput>({ resolver: zodResolver(otpSchema), defaultValues: { otp: "" } });
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  async function requestOtp(values: PhoneInput) {
    setPending(true);
    setProviderError(null);
    const fullPhone = `+91${values.phone}`;
    const response = await fetch("/api/auth/otp/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: fullPhone }) });
    const result = await response.json() as { error?: string };
    setPending(false);
    if (!response.ok) return setProviderError(authError(result.error));
    setPhone(fullPhone);
    setPhase("otp");
  }

  async function verifyOtp(values: OtpInput) {
    setPending(true);
    setProviderError(null);
    const response = await fetch("/api/auth/otp/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, otp: values.otp }) });
    const result = await response.json() as { error?: string };
    setPending(false);
    if (!response.ok) return setProviderError(authError(result.error));
    router.replace(safeReturnTo(searchParams.get("returnTo")));
    router.refresh();
  }

  return (
    <div className="mt-8 max-w-lg border-t border-indigo/10 pt-7">
      <h2 className="font-display text-3xl font-semibold tracking-[-0.035em]">{phase === "phone" ? "Welcome back." : "Check your phone."}</h2>
      <p className="mt-3 leading-7 text-ink/58">{phase === "phone" ? "Use the mobile number connected to your PetSaathi profile." : `We sent a six-digit code to ${phone.replace("+91", "+91 ")}.`}</p>

      {!configured && <div className="mt-6 rounded-3xl border border-saffron/30 bg-saffron/10 p-4 text-sm leading-6 text-ink/65" role="status">The interface is ready, but OTP delivery stays disabled until the Supabase Auth keys are connected.</div>}
      {providerError && <div className="mt-6 rounded-3xl border border-coral/25 bg-coral/10 p-4 text-sm font-medium leading-6 text-coral" role="alert">{providerError}</div>}

      {phase === "phone" ? (
        <form onSubmit={phoneForm.handleSubmit(requestOtp)} className="mt-7" noValidate>
          <label className="block"><span className="mb-2 block text-sm font-semibold">Indian mobile number</span><div className="flex min-h-14 items-center rounded-2xl border border-ink/15 bg-paper px-4 shadow-sm transition focus-within:border-indigo/45 focus-within:ring-4 focus-within:ring-indigo/10"><span className="border-r border-ink/10 pr-3 text-sm font-semibold text-ink/55">+91</span><input {...phoneForm.register("phone")} inputMode="numeric" autoComplete="tel" maxLength={10} className="min-w-0 flex-1 bg-transparent px-3 outline-none placeholder:text-ink/30" placeholder="10-digit number" /></div>{phoneForm.formState.errors.phone && <span className="mt-2 block text-xs font-semibold text-coral">{phoneForm.formState.errors.phone.message}</span>}</label>
          <Button type="submit" variant="accent" size="lg" className="mt-5 w-full" disabled={pending || !configured}>{pending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}Send secure OTP <ArrowRight className="h-5 w-5" /></Button>
        </form>
      ) : (
        <form onSubmit={otpForm.handleSubmit(verifyOtp)} className="mt-7" noValidate>
          <label className="block"><span className="mb-2 block text-sm font-semibold">One-time code</span><input {...otpForm.register("otp")} inputMode="numeric" autoComplete="one-time-code" maxLength={6} className="form-control text-center text-xl font-bold tracking-[0.35em]" placeholder="000000" />{otpForm.formState.errors.otp && <span className="mt-2 block text-xs font-semibold text-coral">{otpForm.formState.errors.otp.message}</span>}</label>
          <Button type="submit" variant="accent" size="lg" className="mt-5 w-full" disabled={pending}>{pending && <LoaderCircle className="h-5 w-5 animate-spin" />}Verify and continue <ArrowRight className="h-5 w-5" /></Button>
          <button type="button" className="mx-auto mt-5 flex items-center gap-2 text-sm font-semibold text-ink/55" onClick={() => { setPhase("phone"); setProviderError(null); otpForm.reset(); }}><ArrowLeft className="h-4 w-4" />Use a different number</button>
        </form>
      )}
      <p className="mt-6 text-xs leading-5 text-ink/45">Pet parents and caregivers can share one identity while keeping role-specific access separate.</p>
    </div>
  );
}

function safeReturnTo(value: string | null) {
  return (value?.startsWith("/") && !value.startsWith("//") ? value : "/dashboard") as Route;
}

function authError(code?: string) {
  if (code === "too_many_requests" || code === "too_many_attempts") return "Too many attempts. Please wait before trying again.";
  if (code === "auth_not_configured") return "Secure sign-in is waiting for the Supabase project credentials.";
  if (code === "invalid_or_expired_otp") return "That code is invalid or has expired.";
  return "Secure sign-in could not be completed. Please try again.";
}
