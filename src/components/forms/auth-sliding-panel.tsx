"use client";

import { useState, useRef, type FormEvent } from "react";
import { motion } from "framer-motion";
import { KeyRound, LoaderCircle, Lock, Mail, User } from "lucide-react";
import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

import lottiePet from "../../../public/images/lottie-pet.json";
import { hasUsableGoogleClientId } from "@/lib/public-config";

type ApiResponse = { error?: string; developmentOtp?: string };

export function AuthSlidingPanel() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [pending, setPending] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const googleButtonSignUpRef = useRef<HTMLDivElement>(null);
  const googleButtonSignInRef = useRef<HTMLDivElement>(null);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const hasGoogleAuth = hasUsableGoogleClientId(googleClientId);

  async function handleGoogleCredentialResponse(response: any) {
    if (!response.credential) return;
    setPending(true);
    setError(null);
    try {
      const { response: res, payload } = await submit("/api/auth/google/signin", { credential: response.credential });
      if (!res.ok) {
        setError(payload?.error?.replaceAll("_", " ") ?? "Google sign in failed.");
        return;
      }
      router.replace("/dashboard", { scroll: false });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  function renderGoogleButtons() {
    if (!hasGoogleAuth || typeof window === "undefined" || !window.google?.accounts) return;
    
    window.google.accounts.id.initialize({
      client_id: googleClientId!,
      callback: handleGoogleCredentialResponse,
    });

    const options = { theme: "outline", size: "large", shape: "rectangular", width: 320, logo_alignment: "left" };

    if (googleButtonSignUpRef.current && googleButtonSignUpRef.current.children.length === 0) {
      window.google.accounts.id.renderButton(googleButtonSignUpRef.current, options);
    }
    if (googleButtonSignInRef.current && googleButtonSignInRef.current.children.length === 0) {
      window.google.accounts.id.renderButton(googleButtonSignInRef.current, options);
    }
  }

  useEffect(() => {
    // If the script is already loaded (e.g. strict mode or fast refresh), render immediately
    renderGoogleButtons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasGoogleAuth]);

  function toggleMode() {
    setIsSignUp((previous) => !previous);
    setVerificationPending(false);
    setOtp("");
    setError(null);
    setMessage(null);
  }

  async function submit(path: string, body: Record<string, string>) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = (await response.json().catch(() => null)) as ApiResponse | null;
    return { response, payload };
  }

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const { response, payload } = await submit("/api/auth/password/signup", { displayName, email, password });
      if (!response.ok) {
        setError(payload?.error?.replaceAll("_", " ") ?? "Account creation is unavailable.");
        return;
      }
      setVerificationPending(true);
      setMessage(
        payload?.developmentOtp
          ? `Local development verification code: ${payload.developmentOtp}`
          : "We sent a six-digit verification code to your email.",
      );
    } finally {
      setPending(false);
    }
  }

  async function handleVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const { response, payload } = await submit("/api/auth/email/verify", { email, otp });
      if (!response.ok) {
        setError(payload?.error?.replaceAll("_", " ") ?? "The verification code was rejected.");
        return;
      }
      router.replace("/dashboard", { scroll: false });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const { response, payload } = await submit("/api/auth/password/signin", { email, password });
      if (!response.ok) {
        setError(payload?.error?.replaceAll("_", " ") ?? "Sign in failed.");
        return;
      }
      router.replace("/dashboard", { scroll: false });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <>
    {hasGoogleAuth && <Script src="https://accounts.google.com/gsi/client" onReady={renderGoogleButtons} />}
    <div className="relative flex min-h-[720px] w-full max-w-[900px] overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/30 sm:min-h-[600px]">
      <div
        className={`absolute left-0 top-[42%] z-10 flex h-[58%] w-full flex-col justify-center px-8 transition-all duration-700 ease-in-out sm:top-0 sm:h-full sm:w-1/2 sm:px-14 ${
          isSignUp ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-0 opacity-0 pointer-events-none sm:translate-x-[100%]"
        }`}
      >
        <h2 className="mb-2 text-center font-display text-2xl font-bold text-ink sm:mb-3 sm:text-3xl">
          {verificationPending ? "Verify your email" : "Create Account"}
        </h2>
        <p className="mb-4 text-center text-[0.65rem] font-semibold uppercase tracking-wider text-ink/50 sm:mb-6 sm:text-xs">
          {verificationPending ? "Enter the code sent to your inbox" : "Secure account backed by PetSaathi"}
        </p>

        {verificationPending ? (
          <form onSubmit={handleVerification} className="flex flex-col gap-3 sm:gap-4">
            <Field aria-label="Verification code" autoComplete="one-time-code" icon={<KeyRound />} inputMode="numeric" maxLength={6} name="otp" onChange={setOtp} pattern="[0-9]{6}" placeholder="6-digit code" type="text" value={otp} />
            <SubmitButton pending={pending} label="VERIFY & CONTINUE" color="bg-indigo hover:bg-indigo/90" />
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="flex flex-col gap-3 sm:gap-4">
            <Field aria-label="Full name" autoComplete="name" icon={<User />} maxLength={80} minLength={2} name="displayName" onChange={setDisplayName} placeholder="Full Name" type="text" value={displayName} />
            <Field aria-label="Email address" autoComplete="email" icon={<Mail />} maxLength={254} name="email" onChange={setEmail} placeholder="Email Address" type="email" value={email} />
            <Field aria-label="Create password" autoComplete="new-password" icon={<Lock />} maxLength={128} minLength={10} name="newPassword" onChange={setPassword} placeholder="Password (10+ characters)" type="password" value={password} />
            <SubmitButton pending={pending} label="SIGN UP" color="bg-indigo hover:bg-indigo/90" />
            {hasGoogleAuth && <div className="relative my-2 flex items-center py-2">
              <div className="flex-grow border-t border-ink/10"></div>
              <span className="mx-4 flex-shrink-0 text-xs font-semibold text-ink/40 uppercase">Or continue with</span>
              <div className="flex-grow border-t border-ink/10"></div>
            </div>}
            {hasGoogleAuth && <div ref={googleButtonSignUpRef} className="flex justify-center w-full min-h-[40px]"></div>}
          </form>
        )}
        <Feedback error={error} message={message} />
      </div>

      <div
        className={`absolute right-0 top-[42%] z-10 flex h-[58%] w-full flex-col justify-center px-8 transition-all duration-700 ease-in-out sm:top-0 sm:h-full sm:w-1/2 sm:px-14 ${
          isSignUp ? "translate-x-0 opacity-0 pointer-events-none sm:-translate-x-[100%]" : "translate-x-0 opacity-100 pointer-events-auto"
        }`}
      >
        <h2 className="mb-2 text-center font-display text-2xl font-bold text-ink sm:mb-3 sm:text-3xl">Sign In</h2>
        <p className="mb-4 text-center text-[0.65rem] font-semibold uppercase tracking-wider text-ink/50 sm:mb-6 sm:text-xs">Use your verified email account</p>
        <form onSubmit={handleSignIn} className="flex flex-col gap-3 sm:gap-4">
          <Field aria-label="Email address" autoComplete="email" icon={<Mail />} maxLength={254} name="email" onChange={setEmail} placeholder="Email Address" type="email" value={email} />
          <Field aria-label="Password" autoComplete="current-password" icon={<Lock />} maxLength={128} name="password" onChange={setPassword} placeholder="Password" type="password" value={password} />
          <SubmitButton pending={pending} label="SIGN IN" color="bg-[#301F30] hover:bg-[#301F30]/90" />
          {hasGoogleAuth && <div className="relative my-2 flex items-center py-2">
            <div className="flex-grow border-t border-ink/10"></div>
            <span className="mx-4 flex-shrink-0 text-xs font-semibold text-ink/40 uppercase">Or continue with</span>
            <div className="flex-grow border-t border-ink/10"></div>
          </div>}
          {hasGoogleAuth && <div ref={googleButtonSignInRef} className="flex justify-center w-full min-h-[40px]"></div>}
        </form>
        <Feedback error={error} message={message} />
      </div>

      <div
        className={`absolute left-0 top-0 z-50 flex h-[42%] w-full flex-col items-center justify-center rounded-b-[28%] bg-gradient-to-br from-[#5B3D7A] to-[#301F30] px-6 text-center text-white shadow-[0_0_40px_rgba(91,61,122,0.5)] transition-all duration-700 ease-in-out sm:h-full sm:w-1/2 sm:px-10 ${
          isSignUp
            ? "sm:translate-x-full sm:rounded-[30%_0_0_30%]"
            : "sm:translate-x-0 sm:rounded-[0_30%_30%_0]"
        }`}
      >
        <div className="pointer-events-none h-28 w-28 drop-shadow-2xl sm:mb-4 sm:h-64 sm:w-64">
          <Lottie animationData={lottiePet} loop />
        </div>
        <motion.div
          key={isSignUp ? "signup" : "signin"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <h2 className="mb-2 font-display text-2xl font-bold tracking-tight sm:mb-4 sm:text-4xl">
            {isSignUp ? "Welcome Back!" : "Hello, Friend!"}
          </h2>
          <p className="mb-4 max-w-[260px] text-xs font-medium leading-5 text-white/80 sm:mb-8 sm:text-[15px] sm:leading-relaxed">
            {isSignUp
              ? "Sign in to continue caring for your furry family."
              : "Create your verified PetSaathi account and begin your care journey."}
          </p>
          <button
            type="button"
            onClick={toggleMode}
            className="rounded-full border-2 border-white px-8 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-[#5B3D7A] active:scale-95 sm:px-12 sm:py-3 sm:text-base"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </motion.div>
      </div>
    </div>
    </>
  );
}

function Field({
  icon,
  onChange,
  ...props
}: {
  icon: React.ReactElement<{ className?: string }>;
  onChange: (value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/40">{icon}</span>
      <input
        {...props}
        required
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl bg-ink/5 pl-12 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-indigo/30 sm:h-12 sm:text-[15px]"
      />
    </div>
  );
}

function SubmitButton({ pending, label, color }: { pending: boolean; label: string; color: string }) {
  return (
    <button type="submit" disabled={pending} className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl font-bold tracking-wide text-white transition disabled:opacity-50 ${color}`}>
      {pending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : label}
    </button>
  );
}

function Feedback({ error, message }: { error: string | null; message: string | null }) {
  return (
    <>
      {error && <p className="mt-4 rounded-xl bg-coral/10 p-3 text-sm font-semibold text-coral" role="alert">{error}</p>}
      {message && <p className="mt-4 rounded-xl bg-leaf/10 p-3 text-sm font-semibold text-leaf" role="status">{message}</p>}
    </>
  );
}
