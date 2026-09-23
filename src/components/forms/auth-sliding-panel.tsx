"use client";

import { useState, useRef, type FormEvent } from "react";
import dynamic from "next/dynamic";
import { Eye, EyeOff, KeyRound, LoaderCircle, Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

import { hasUsableGoogleClientId } from "@/lib/public-config";
import { PetSaathiLogo } from "@/components/brand/logo";
import { sanitizeReturnTo } from "@/lib/sanitize-url";

// Decorative animation: loaded lazily so lottie-react + the animation JSON
// stay out of the login route's first-load JS.
const LottiePetAnimation = dynamic(() => import("./lottie-pet-animation"), {
  ssr: false,
  loading: () => <div className="h-28 w-28 sm:h-64 sm:w-64" aria-hidden="true" />,
});

type ApiResponse = { error?: string; message?: string; developmentOtp?: string; role?: string; roles?: string[] };
type PanelMode = "signin" | "signup" | "emailCode" | "setPassword";

export function AuthSlidingPanel({ returnTo }: { returnTo?: string }) {
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
    if (roles?.includes("SUPER_ADMIN") || roles?.includes("OPERATIONS_ADMIN") || roles?.includes("ADMIN")) return "/admin";
    if (role === "SITTER" && roles?.includes("SITTER")) return "/saathi";
    return "/dashboard";
  }

  function getSafeDestination(roles?: string[]) {
    let candidate = returnTo;
    if (!candidate && typeof window !== "undefined") {
      const searchParam = new URLSearchParams(window.location.search).get("returnTo");
      candidate = sanitizeReturnTo(searchParam) ?? undefined;
    }
    if (candidate) {
      return candidate;
    }
    return redirectForRoles(roles);
  }

  function redirectToDashboardOrPortal(roles?: string[]) {
    const target = getSafeDestination(roles);
    if (typeof window !== "undefined") {
      window.location.href = target;
    } else {
      router.replace(target as any, { scroll: false });
      router.refresh();
    }
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
    const google = typeof window !== "undefined" ? (window as any).google : undefined;
    if (!hasGoogleAuth || !google?.accounts) return;
    
    google.accounts.id.initialize({
      client_id: googleClientId!,
      callback: handleGoogleCredentialResponse,
      use_fedcm_for_prompt: false,
      auto_select: false,
    });

    const options = { theme: "outline", size: "large", shape: "rectangular", width: 320, logo_alignment: "left" };

    if (googleButtonSignUpRef.current && googleButtonSignUpRef.current.children.length === 0) {
      google.accounts.id.renderButton(googleButtonSignUpRef.current, options);
    }
    if (googleButtonSignInRef.current && googleButtonSignInRef.current.children.length === 0) {
      google.accounts.id.renderButton(googleButtonSignInRef.current, options);
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

      const { response, payload } = await submit("/api/auth/password/signup", {
        displayName: displayName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });
      if (!response.ok) {
        setError(errorMessage(payload, "Account creation is unavailable."));
        return;
      }
      setVerificationPending(true);
      if (payload?.developmentOtp) {
        setOtp(payload.developmentOtp);
        setMessage(`Local development verification code: ${payload.developmentOtp}`);
      } else {
        setMessage("We sent a six-digit verification code to your email.");
      }
    } finally {
      setPending(false);
    }
  }

  async function handleVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const { response, payload } = await submit("/api/auth/email/verify", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });
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
      const normalized = email.trim().toLowerCase();
      const { response, payload } = await submit("/api/auth/email/request", { email: normalized });
      if (!response.ok) {
        setError(errorMessage(payload, "We couldn't send the code right now."));
        return;
      }
      setVerificationPending(true);
      if (payload?.developmentOtp) {
        setOtp(payload.developmentOtp);
        setMessage(`Local development code: ${payload.developmentOtp}`);
      } else {
        setMessage(`We sent a six-digit code to ${normalized}. It expires shortly.`);
      }
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
      const endpoint = "/api/auth/password/signin";
      const { response, payload } = await submit(endpoint, {
        email: email.trim().toLowerCase(),
        password,
      });
      if (!response.ok) {
        setError(errorMessage(payload, "Sign in failed. Please check your credentials and try again."));
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
    <div className="relative flex min-h-[820px] w-full max-w-[900px] overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/30 sm:min-h-[600px]">
      <div
        className={`absolute left-0 top-[36%] z-10 flex h-[64%] w-full flex-col justify-center px-6 pt-2 transition-all duration-700 ease-in-out sm:top-0 sm:h-full sm:w-1/2 sm:px-14 sm:pt-0 ${
          isSignUp ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-0 opacity-0 invisible pointer-events-none sm:translate-x-[100%]"
        }`}
      >
        <div className="flex justify-center mb-2">
          <PetSaathiLogo compact={true} />
        </div>
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
            <button type="button" onClick={() => { setVerificationPending(false); setError(null); setMessage(null); }} className="text-center text-xs font-bold text-indigo transition hover:text-coral">
              Entered wrong email? Go back
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col gap-2 px-1">
              <span className="text-sm font-semibold text-ink/80"><span className="text-coral">*</span>Role</span>
              <div className="flex items-center gap-4 sm:gap-6">
                <label htmlFor="signup-role-customer" className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink/80">
                  <input
                    id="signup-role-customer"
                    aria-label="Customer role"
                    type="radio"
                    name="role"
                    value="CUSTOMER"
                    checked={role === "CUSTOMER"}
                    onChange={() => setRole("CUSTOMER")}
                    className="h-4 w-4 text-indigo focus:ring-indigo accent-indigo"
                  />
                  Customer
                </label>
                <label htmlFor="signup-role-sitter" className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink/80">
                  <input
                    id="signup-role-sitter"
                    aria-label="Saathi role"
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
            {hasGoogleAuth && (
              <div className="flex flex-col gap-2 mt-2">
                <div className="relative my-1 flex items-center py-1">
                  <div className="flex-grow border-t border-ink/10"></div>
                  <span className="mx-4 flex-shrink-0 text-xs font-semibold text-ink/80 uppercase">Or continue with</span>
                  <div className="flex-grow border-t border-ink/10"></div>
                </div>
                <div ref={googleButtonSignUpRef} className="flex justify-center w-full empty:hidden"></div>
                <GoogleOAuthButton role={role} returnTo={returnTo} label="Sign up with Google" />
              </div>
            )}
          </form>
        )}
        {isSignUp && <Feedback error={error} message={message} />}
      </div>

      <div
        className={`absolute right-0 top-[36%] z-10 flex h-[64%] w-full flex-col justify-center px-6 pt-2 transition-all duration-700 ease-in-out sm:top-0 sm:h-full sm:w-1/2 sm:px-14 sm:pt-0 ${
          isSignUp ? "translate-x-0 opacity-0 invisible pointer-events-none sm:-translate-x-[100%]" : "translate-x-0 opacity-100 pointer-events-auto"
        }`}
      >
        <div className="flex justify-center mb-2">
          <PetSaathiLogo compact={true} />
        </div>
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
              <button type="button" onClick={() => { setVerificationPending(false); setError(null); setMessage(null); }} className="text-center text-xs font-bold text-indigo transition hover:text-coral">
                Entered wrong email? Request a new code
              </button>
            </form>
          ) : (
            <form onSubmit={handleEmailCodeRequest} className="flex flex-col gap-3 sm:gap-4">
              <Field aria-label="Email address" autoComplete="email" icon={<Mail />} maxLength={254} name="email" onChange={setEmail} placeholder="Email Address" type="email" value={email} />
              <SubmitButton pending={pending} label="EMAIL ME A CODE" color="bg-indigo hover:bg-indigo/90" />
              <button type="button" onClick={() => { setMode("signin"); setError(null); setMessage(null); }} className="text-center text-xs font-bold text-indigo transition hover:text-coral">
                ← Back to Password Sign In
              </button>
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
            <div className="flex items-center gap-4 sm:gap-6">
              <label htmlFor="signin-role-customer" className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink/80">
                <input
                  id="signin-role-customer"
                  aria-label="Customer signin role"
                  type="radio"
                  name="signinRole"
                  value="CUSTOMER"
                  checked={role === "CUSTOMER"}
                  onChange={() => setRole("CUSTOMER")}
                  className="h-4 w-4 text-indigo focus:ring-indigo accent-indigo"
                />
                Customer
              </label>
              <label htmlFor="signin-role-sitter" className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink/80">
                <input
                  id="signin-role-sitter"
                  aria-label="Saathi signin role"
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
          {hasGoogleAuth && (
            <div className="flex flex-col gap-2 mt-2">
              <div className="relative my-1 flex items-center py-1">
                <div className="flex-grow border-t border-ink/10"></div>
                <span className="mx-4 flex-shrink-0 text-xs font-semibold text-ink/80 uppercase">Or continue with</span>
                <div className="flex-grow border-t border-ink/10"></div>
              </div>
              <div ref={googleButtonSignInRef} className="flex justify-center w-full empty:hidden"></div>
              <GoogleOAuthButton role={role} returnTo={returnTo} label="Sign in with Google" />
            </div>
          )}
          </form>
        )}
        {!isSignUp && <Feedback error={error} message={message} />}
      </div>

      <div
        className={`absolute left-0 top-0 z-50 flex h-[36%] w-full flex-col items-center justify-center rounded-b-3xl bg-gradient-to-br from-[#5B3D7A] to-[#301F30] px-6 text-center text-white shadow-[0_0_40px_rgba(91,61,122,0.5)] transition-all duration-700 ease-in-out sm:h-full sm:w-1/2 sm:px-10 ${
          isSignUp
            ? "sm:translate-x-full sm:rounded-[30%_0_0_30%]"
            : "sm:translate-x-0 sm:rounded-[0_30%_30%_0]"
        }`}
      >
        <div className="pointer-events-none h-24 w-24 drop-shadow-2xl sm:mb-4 sm:h-64 sm:w-64">
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
            onClick={() => {
              setMode(isSignUp ? "signin" : "signup");
            }}
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
          aria-label={showPassword ? "Hide password" : "Show password"}
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

function GoogleOAuthButton({ role, returnTo, label }: { role: string; returnTo?: string; label?: string }) {
  const [targetUrl, setTargetUrl] = useState("/api/auth/google/oauth");

  useEffect(() => {
    const params = new URLSearchParams();
    if (role) params.set("role", role);
    let dest = returnTo;
    if (!dest && typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search).get("returnTo");
      if (sp) dest = sp;
    }
    if (dest) params.set("returnTo", dest);
    setTargetUrl(`/api/auth/google/oauth?${params.toString()}`);
  }, [role, returnTo]);

  return (
    <a
      href={targetUrl}
      className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-ink/15 bg-white py-2.5 px-4 text-xs font-bold text-ink shadow-2xs transition-all hover:bg-surface hover:border-ink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo/40"
    >
      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.36 7.33 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
        />
      </svg>
      <span>{label || "Sign in with Google"}</span>
    </a>
  );
}
