"use client";

import { useState, useRef, type FormEvent } from "react";
import dynamic from "next/dynamic";
import { Eye, EyeOff, KeyRound, LoaderCircle, Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

import { hasUsableGoogleClientId } from "@/lib/public-config";

// Decorative animation: loaded lazily so lottie-react + the animation JSON
// stay out of the login route's first-load JS.
const LottiePetAnimation = dynamic(() => import("./lottie-pet-animation"), {
  ssr: false,
  loading: () => <div className="h-28 w-28 sm:h-64 sm:w-64" aria-hidden="true" />,
});

type ApiResponse = { error?: string; message?: string; developmentOtp?: string; role?: string; roles?: string[] };
type PanelMode = "signin" | "signup" | "emailCode" | "setPassword";

export function AuthSlidingPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<PanelMode>("signin");
  const [pending, setPending] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "SITTER">("CUSTOMER");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const googleButtonSignUpRef = useRef<HTMLDivElement>(null);
  const googleButtonSignInRef = useRef<HTMLDivElement>(null);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const hasGoogleAuth = hasUsableGoogleClientId(googleClientId);
  const isSignUp = mode === "signup";

  const [emailCodeIntent, setEmailCodeIntent] = useState<"login" | "reset">("login");

  function errorMessage(payload: ApiResponse | null, fallback: string) {
    return payload?.message ?? payload?.error?.replaceAll("_", " ") ?? fallback;
  }

  function redirectForRoles(roles?: string[]) {
    if (roles?.includes("SUPER_ADMIN") || roles?.includes("OPERATIONS_ADMIN")) return "/admin";
    if (role === "SITTER" && roles?.includes("SITTER")) return "/saathi";
    return "/dashboard";
  }

  function redirectToDashboardOrPortal(roles?: string[]) {
    router.replace(redirectForRoles(roles), { scroll: false });
    router.refresh();
  }

  async function handleGoogleCredentialResponse(response: any) {
    if (!response.credential) return;
    setPending(true);
    setError(null);
    try {
      const { response: res, payload } = await submit("/api/auth/google/signin", { credential: response.credential });
      if (!res.ok) {
        setError(errorMessage(payload, "Google sign in failed."));
        return;
      }
      redirectToDashboardOrPortal(payload?.roles);
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

  function startEmailCodeLogin() {
    setMode("emailCode");
    setVerificationPending(false);
    setOtp("");
    setError(null);
    setMessage(null);
  }

  async function submit(path: string, body: Record<string, string>) {
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await response.json().catch(() => null)) as ApiResponse | null;
      return { response, payload };
    } catch {
      // Network/infra failure: surface a retryable message instead of failing silently.
      return {
        response: { ok: false } as Response,
        payload: { error: "network_error", message: "We couldn't reach the service. Check your connection and try again." },
      };
    }
  }

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const pwErrors = [];
      if (password.length < 10) pwErrors.push("at least 10 characters");
      if (!/[A-Z]/.test(password)) pwErrors.push("an uppercase letter");
      if (!/[a-z]/.test(password)) pwErrors.push("a lowercase letter");
      if (!/[0-9]/.test(password)) pwErrors.push("a number");
      if (!/[^A-Za-z0-9]/.test(password)) pwErrors.push("a special character");
      
      if (pwErrors.length > 0) {
        setError(`Password must contain ${pwErrors.join(", ")}.`);
        setPending(false);
        return;
      }

      const { response, payload } = await submit("/api/auth/password/signup", { displayName, email, password, role });
      if (!response.ok) {
        setError(errorMessage(payload, "Account creation is unavailable."));
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
        setError(errorMessage(payload, "The verification code was rejected."));
        return;
      }
      if (mode === "emailCode" && emailCodeIntent === "reset") {
        // OTP login established a verified session; now allow a password reset.
        setMode("setPassword");
        setMessage("Code verified. Choose a new password for your account.");
        return;
      }
      redirectToDashboardOrPortal(payload?.roles);
    } finally {
      setPending(false);
    }
  }

  async function handleEmailCodeRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const { response, payload } = await submit("/api/auth/email/request", { email });
      if (!response.ok) {
        setError(errorMessage(payload, "We couldn't send the code right now."));
        return;
      }
      setVerificationPending(true);
      setMessage(payload?.developmentOtp
        ? `Local development code: ${payload.developmentOtp}`
        : `We sent a six-digit code to ${email}. It expires shortly.`);
    } finally {
      setPending(false);
    }
  }

  async function handleSetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const { response, payload } = await submit("/api/auth/password/reset", { password });
      if (!response.ok) {
        setError(errorMessage(payload, "We couldn't update the password."));
        return;
      }
      setMode("signin");
      setVerificationPending(false);
      setPassword("");
      setConfirmPassword("");
      setOtp("");
      setMessage("Password updated. You're signed in with your new password.");
      redirectToDashboardOrPortal(undefined);
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
        setError(errorMessage(payload, "Sign in failed. Please try again."));
        return;
      }
      redirectToDashboardOrPortal(payload?.roles);
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
          isSignUp ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-0 opacity-0 invisible pointer-events-none sm:translate-x-[100%]"
        }`}
      >
        <h2 className="mb-2 text-center font-display text-2xl font-bold text-ink sm:mb-3 sm:text-3xl">
          {verificationPending ? "Verify your email" : "Create Account"}
        </h2>
        <p className="mb-4 text-center text-[0.65rem] font-semibold uppercase tracking-wider text-ink/80 sm:mb-6 sm:text-xs">
          {verificationPending ? "Enter the code sent to your inbox" : "Secure account backed by PetSaathi"}
        </p>

        {verificationPending ? (
          <form onSubmit={handleVerification} className="flex flex-col gap-3 sm:gap-4">
            <Field aria-label="Verification code" autoComplete="one-time-code" icon={<KeyRound />} inputMode="numeric" maxLength={6} name="otp" onChange={setOtp} pattern="[0-9]{6}" placeholder="6-digit code" type="text" value={otp} />
            <SubmitButton pending={pending} label="VERIFY & CONTINUE" color="bg-indigo hover:bg-indigo/90" />
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col gap-2 px-1">
              <span className="text-sm font-semibold text-ink/80"><span className="text-coral">*</span>Role</span>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink/80">
                  <input
                    type="radio"
                    name="role"
                    value="CUSTOMER"
                    checked={role === "CUSTOMER"}
                    onChange={() => setRole("CUSTOMER")}
                    className="h-4 w-4 text-indigo focus:ring-indigo accent-indigo"
                  />
                  Customer
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink/80">
                  <input
                    type="radio"
                    name="role"
                    value="SITTER"
                    checked={role === "SITTER"}
                    onChange={() => setRole("SITTER")}
                    className="h-4 w-4 text-indigo focus:ring-indigo accent-indigo"
                  />
                  Saathi
                </label>
              </div>
            </div>
            <Field aria-label="Full name" autoComplete="name" icon={<User />} maxLength={80} minLength={2} name="displayName" onChange={setDisplayName} placeholder="Full Name" type="text" value={displayName} />
            <Field aria-label="Email address" autoComplete="email" icon={<Mail />} maxLength={254} name="email" onChange={setEmail} placeholder="Email Address" type="email" value={email} />
            <Field aria-label="Create password" autoComplete="new-password" icon={<Lock />} maxLength={128} minLength={10} name="newPassword" onChange={setPassword} placeholder="Strong Password" type="password" value={password} />
            <SubmitButton pending={pending} label="SIGN UP" color="bg-indigo hover:bg-indigo/90" />
            {hasGoogleAuth && <div className="relative my-2 flex items-center py-2">
              <div className="flex-grow border-t border-ink/10"></div>
              <span className="mx-4 flex-shrink-0 text-xs font-semibold text-ink/80 uppercase">Or continue with</span>
              <div className="flex-grow border-t border-ink/10"></div>
            </div>}
            {hasGoogleAuth && <div ref={googleButtonSignUpRef} className="flex justify-center w-full min-h-[40px]"></div>}
          </form>
        )}
        {isSignUp && <Feedback error={error} message={message} />}
      </div>

      <div
        className={`absolute right-0 top-[42%] z-10 flex h-[58%] w-full flex-col justify-center px-8 transition-all duration-700 ease-in-out sm:top-0 sm:h-full sm:w-1/2 sm:px-14 ${
          isSignUp ? "translate-x-0 opacity-0 invisible pointer-events-none sm:-translate-x-[100%]" : "translate-x-0 opacity-100 pointer-events-auto"
        }`}
      >
        <h2 className="mb-2 text-center font-display text-2xl font-bold text-ink sm:mb-3 sm:text-3xl">
          {mode === "emailCode" ? (verificationPending ? "Enter your email code" : "Log in with an email code") : mode === "setPassword" ? "Choose a new password" : "Sign In"}
        </h2>
        <p className="mb-4 text-center text-[0.65rem] font-semibold uppercase tracking-wider text-ink/80 sm:mb-6 sm:text-xs">
          {mode === "emailCode"
            ? verificationPending ? "Enter the code we emailed you" : "We'll email you a one-time code — no password needed"
            : mode === "setPassword"
              ? "Your identity was verified by email code"
              : "Use your verified email account"}
        </p>
        {mode === "emailCode" ? (
          verificationPending ? (
            <form onSubmit={handleVerification} className="flex flex-col gap-3 sm:gap-4">
              <Field aria-label="Email code" autoComplete="one-time-code" icon={<KeyRound />} inputMode="numeric" maxLength={6} name="otp" onChange={setOtp} pattern="[0-9]{6}" placeholder="6-digit code" type="text" value={otp} />
              <SubmitButton pending={pending} label="VERIFY & CONTINUE" color="bg-indigo hover:bg-indigo/90" />
            </form>
          ) : (
            <form onSubmit={handleEmailCodeRequest} className="flex flex-col gap-3 sm:gap-4">
              <Field aria-label="Email address" autoComplete="email" icon={<Mail />} maxLength={254} name="email" onChange={setEmail} placeholder="Email Address" type="email" value={email} />
              <SubmitButton pending={pending} label="EMAIL ME A CODE" color="bg-indigo hover:bg-indigo/90" />
            </form>
          )
        ) : mode === "setPassword" ? (
          <form onSubmit={handleSetPassword} className="flex flex-col gap-3 sm:gap-4">
            <Field aria-label="New password" autoComplete="new-password" icon={<Lock />} maxLength={128} minLength={10} name="newPassword" onChange={setPassword} placeholder="New password (10+ chars, Aa1!)" type="password" value={password} />
            <Field aria-label="Confirm new password" autoComplete="new-password" icon={<Lock />} maxLength={128} minLength={10} name="confirmPassword" onChange={setConfirmPassword} placeholder="Repeat new password" type="password" value={confirmPassword} />
            <SubmitButton pending={pending} label="SAVE NEW PASSWORD" color="bg-indigo hover:bg-indigo/90" />
          </form>
        ) : (
          <form onSubmit={handleSignIn} className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col gap-2 px-1">
            <span className="text-sm font-semibold text-ink/80"><span className="text-coral">*</span>Role</span>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink/80">
                <input
                  type="radio"
                  name="signinRole"
                  value="CUSTOMER"
                  checked={role === "CUSTOMER"}
                  onChange={() => setRole("CUSTOMER")}
                  className="h-4 w-4 text-indigo focus:ring-indigo accent-indigo"
                />
                Customer
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink/80">
                <input
                  type="radio"
                  name="signinRole"
                  value="SITTER"
                  checked={role === "SITTER"}
                  onChange={() => setRole("SITTER")}
                  className="h-4 w-4 text-indigo focus:ring-indigo accent-indigo"
                />
                Saathi
              </label>
            </div>
          </div>
          <Field aria-label="Email address" autoComplete="email" icon={<Mail />} maxLength={254} name="email" onChange={setEmail} placeholder="Email Address" type="email" value={email} />
          <Field aria-label="Password" autoComplete="current-password" icon={<Lock />} maxLength={128} name="password" onChange={setPassword} placeholder="Password" type="password" value={password} />
          <SubmitButton pending={pending} label="SIGN IN" color="bg-[#301F30] hover:bg-[#301F30]/90" />
          <button type="button" onClick={startEmailCodeLogin} className="text-center text-xs font-bold text-indigo transition hover:text-coral">
            Forgot password? Log in with an email code
          </button>
          {hasGoogleAuth && <div className="relative my-2 flex items-center py-2">
            <div className="flex-grow border-t border-ink/10"></div>
            <span className="mx-4 flex-shrink-0 text-xs font-semibold text-ink/80 uppercase">Or continue with</span>
            <div className="flex-grow border-t border-ink/10"></div>
          </div>}
          {hasGoogleAuth && <div ref={googleButtonSignInRef} className="flex justify-center w-full min-h-[40px]"></div>}
          </form>
        )}
        {!isSignUp && <Feedback error={error} message={message} />}
      </div>

      <div
        className={`absolute left-0 top-0 z-50 flex h-[42%] w-full flex-col items-center justify-center rounded-b-[28%] bg-gradient-to-br from-[#5B3D7A] to-[#301F30] px-6 text-center text-white shadow-[0_0_40px_rgba(91,61,122,0.5)] transition-all duration-700 ease-in-out sm:h-full sm:w-1/2 sm:px-10 ${
          isSignUp
            ? "sm:translate-x-full sm:rounded-[30%_0_0_30%]"
            : "sm:translate-x-0 sm:rounded-[0_30%_30%_0]"
        }`}
      >
        <div className="pointer-events-none h-28 w-28 drop-shadow-2xl sm:mb-4 sm:h-64 sm:w-64">
          <LottiePetAnimation />
        </div>
        <div
          key={isSignUp ? "signup" : "signin"}
          className="flex flex-col items-center opacity-0 animate-[auth-panel-fade-up_0.5s_ease_0.2s_forwards]"
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
            onClick={() => setMode(isSignUp ? "signin" : "signup")}
            className="rounded-full border-2 border-white px-8 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-[#5B3D7A] active:scale-95 sm:px-12 sm:py-3 sm:text-base"
          >
            {isSignUp ? "Sign In" : mode === "signin" ? "Sign Up" : "Sign In"}
          </button>
        </div>
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
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === "password";
  const inputType = isPassword && showPassword ? "text" : props.type;

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/80">{icon}</span>
      <input
        {...props}
        type={inputType}
        required
        onChange={(event) => onChange(event.target.value)}
        className={`h-11 w-full rounded-xl bg-ink/5 pl-12 text-sm outline-none transition focus:ring-2 focus:ring-indigo/30 sm:h-12 sm:text-[15px] ${isPassword ? 'pr-12' : 'pr-4'}`}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/60 transition hover:text-ink/90"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      )}
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
