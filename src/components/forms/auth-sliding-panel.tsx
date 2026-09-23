"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Eye, EyeOff, KeyRound, LoaderCircle, Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Script from "next/script";

import { hasUsableGoogleClientId } from "@/lib/public-config";
import { PetSaathiLogo } from "@/components/brand/logo";
import { sanitizeReturnTo } from "@/lib/sanitize-url";
import { PetCompanionIllustration } from "@/components/brand/pet-companion";
import LottiePetAnimation from "./lottie-pet-animation";

type ApiResponse = { error?: string; message?: string; developmentOtp?: string; role?: string; roles?: string[] };
type PanelMode = "signin" | "signup" | "emailCode" | "setPassword";

export function AuthSlidingPanel({ returnTo, initialError }: { returnTo?: string; initialError?: string }) {
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
  const [gsiActive, setGsiActive] = useState(false);
  const googleButtonSignUpRef = useRef<HTMLDivElement>(null);
  const googleButtonSignInRef = useRef<HTMLDivElement>(null);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const hasGoogleAuth = hasUsableGoogleClientId(googleClientId);
  const isSignUp = mode === "signup";

  const [emailCodeIntent, setEmailCodeIntent] = useState<"login" | "reset">("login");

  // Read initial error from URL query if present
  useEffect(() => {
    let errCode = initialError;
    if (!errCode && typeof window !== "undefined") {
      errCode = new URLSearchParams(window.location.search).get("error") || undefined;
    }
    if (errCode) {
      if (errCode === "cancelled" || errCode === "oauth_cancelled") {
        setError("Google sign in was cancelled.");
      } else if (errCode === "access_denied") {
        setError("Access was denied during sign in.");
      } else if (errCode === "oauth_configuration_error") {
        setError("Google sign in is temporarily unavailable.");
      } else {
        setError(errCode.replaceAll("_", " "));
      }
    }
  }, [initialError]);

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
    
    try {
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

      setTimeout(() => {
        const hasIframe = Boolean(
          googleButtonSignInRef.current?.querySelector("iframe") ||
          googleButtonSignUpRef.current?.querySelector("iframe")
        );
        if (hasIframe) setGsiActive(true);
      }, 500);
    } catch {
      // GSI initialization failed gracefully; fallback button will be used
      setGsiActive(false);
    }
  }

  useEffect(() => {
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
      {hasGoogleAuth && <Script src="https://accounts.google.com/gsi/client" onReady={renderGoogleButtons} strategy="afterInteractive" />}

      {/* Main Container: responsive card on mobile, dual sliding curtain on desktop */}
      <div className="relative flex w-full max-w-[900px] flex-col rounded-3xl bg-white shadow-2xl shadow-black/30 sm:min-h-[620px] sm:flex-row sm:overflow-hidden">

        {/* Mobile Header: Pet Companion & Mode Switcher */}
        <div className="flex flex-col items-center px-6 pt-6 sm:hidden">
          <div className="mb-2">
            <PetSaathiLogo compact={true} />
          </div>
          <PetCompanionIllustration className="h-20 w-20 mb-3" />
          
          {/* Segmented Mode Switcher on Mobile */}
          {mode !== "emailCode" && mode !== "setPassword" && (
            <div className="flex w-full max-w-xs rounded-2xl bg-ink/5 p-1 border border-ink/10 mb-4">
              <button
                type="button"
                onClick={() => { setMode("signin"); setError(null); setMessage(null); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  !isSignUp ? "bg-[#301F30] text-white shadow-sm" : "text-ink/70 hover:text-ink"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode("signup"); setError(null); setMessage(null); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSignUp ? "bg-[#301F30] text-white shadow-sm" : "text-ink/70 hover:text-ink"
                }`}
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* -------------------- SIGN UP PANEL -------------------- */}
        <div
          className={`flex w-full flex-col justify-center px-6 pb-8 pt-2 sm:absolute sm:left-0 sm:top-0 sm:h-full sm:w-1/2 sm:px-12 sm:py-8 sm:transition-all sm:duration-700 sm:ease-in-out ${
            isSignUp
              ? "flex sm:translate-x-0 sm:opacity-100 sm:pointer-events-auto"
              : "hidden sm:flex sm:translate-x-full sm:opacity-0 sm:invisible sm:pointer-events-none"
          }`}
        >
          <div className="hidden sm:flex justify-center mb-2">
            <PetSaathiLogo compact={true} />
          </div>
          <h2 className="mb-1 text-center font-display text-2xl font-bold text-ink sm:mb-2 sm:text-3xl">
            {verificationPending ? "Verify your email" : "Create Account"}
          </h2>
          <p className="mb-4 text-center text-[0.7rem] font-semibold uppercase tracking-wider text-ink/70 sm:mb-6 sm:text-xs">
            {verificationPending ? "Enter the code sent to your inbox" : "Secure account backed by PetSaathi"}
          </p>

          {verificationPending ? (
            <form onSubmit={handleVerification} className="flex flex-col gap-3 sm:gap-4">
              <Field
                aria-label="Verification code"
                autoComplete="one-time-code"
                icon={<KeyRound />}
                inputMode="numeric"
                maxLength={6}
                name="otp"
                onChange={setOtp}
                pattern="[0-9]{6}"
                placeholder="6-digit code"
                type="text"
                value={otp}
                disabled={!isSignUp}
              />
              <SubmitButton pending={pending} label="VERIFY & CONTINUE" color="bg-indigo hover:bg-indigo/90" />
              <button
                type="button"
                onClick={() => { setVerificationPending(false); setError(null); setMessage(null); }}
                className="text-center text-xs font-bold text-indigo transition hover:text-coral"
              >
                Entered wrong email? Go back
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col gap-1.5 px-1">
                <span className="text-xs sm:text-sm font-semibold text-ink/80"><span className="text-coral">*</span>I want to join as:</span>
                <div className="flex items-center gap-4 sm:gap-6">
                  <label htmlFor="signup-role-customer" className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-medium text-ink/80">
                    <input
                      id="signup-role-customer"
                      aria-label="Customer role"
                      type="radio"
                      name="role"
                      value="CUSTOMER"
                      checked={role === "CUSTOMER"}
                      onChange={() => setRole("CUSTOMER")}
                      disabled={!isSignUp}
                      className="h-4 w-4 text-indigo focus:ring-indigo accent-indigo"
                    />
                    Pet Parent
                  </label>
                  <label htmlFor="signup-role-sitter" className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-medium text-ink/80">
                    <input
                      id="signup-role-sitter"
                      aria-label="Saathi role"
                      type="radio"
                      name="role"
                      value="SITTER"
                      checked={role === "SITTER"}
                      onChange={() => setRole("SITTER")}
                      disabled={!isSignUp}
                      className="h-4 w-4 text-indigo focus:ring-indigo accent-indigo"
                    />
                    Saathi (Sitter)
                  </label>
                </div>
              </div>

              <Field
                aria-label="Full name"
                autoComplete="name"
                icon={<User />}
                maxLength={80}
                minLength={2}
                name="displayName"
                onChange={setDisplayName}
                placeholder="Full Name"
                type="text"
                value={displayName}
                disabled={!isSignUp}
              />
              <Field
                aria-label="Email address"
                autoComplete="email"
                icon={<Mail />}
                maxLength={254}
                name="email"
                onChange={setEmail}
                placeholder="Email Address"
                type="email"
                value={email}
                disabled={!isSignUp}
              />
              <Field
                aria-label="Create password"
                autoComplete="new-password"
                icon={<Lock />}
                maxLength={128}
                minLength={10}
                name="newPassword"
                onChange={setPassword}
                placeholder="Strong Password (10+ chars)"
                type="password"
                value={password}
                disabled={!isSignUp}
              />
              <SubmitButton pending={pending} label="SIGN UP" color="bg-indigo hover:bg-indigo/90" />

              {hasGoogleAuth && (
                <div className="flex flex-col gap-2 mt-1">
                  <div className="relative my-1 flex items-center py-1">
                    <div className="flex-grow border-t border-ink/10"></div>
                    <span className="mx-4 flex-shrink-0 text-[0.65rem] sm:text-xs font-semibold text-ink/60 uppercase">Or continue with</span>
                    <div className="flex-grow border-t border-ink/10"></div>
                  </div>
                  <div ref={googleButtonSignUpRef} className="flex justify-center w-full empty:hidden"></div>
                  {!gsiActive && <GoogleOAuthButton role={role} returnTo={returnTo} label="Sign up with Google" />}
                </div>
              )}
            </form>
          )}

          {isSignUp && <Feedback error={error} message={message} />}
        </div>

        {/* -------------------- SIGN IN PANEL -------------------- */}
        <div
          className={`flex w-full flex-col justify-center px-6 pb-8 pt-2 sm:absolute sm:right-0 sm:top-0 sm:h-full sm:w-1/2 sm:px-12 sm:py-8 sm:transition-all sm:duration-700 sm:ease-in-out ${
            !isSignUp
              ? "flex sm:translate-x-0 sm:opacity-100 sm:pointer-events-auto"
              : "hidden sm:flex sm:-translate-x-full sm:opacity-0 sm:invisible sm:pointer-events-none"
          }`}
        >
          <div className="hidden sm:flex justify-center mb-2">
            <PetSaathiLogo compact={true} />
          </div>
          <h2 className="mb-1 text-center font-display text-2xl font-bold text-ink sm:mb-2 sm:text-3xl">
            {mode === "emailCode"
              ? (verificationPending ? "Enter your email code" : "Log in with an email code")
              : mode === "setPassword"
              ? "Choose a new password"
              : "Sign In"}
          </h2>
          <p className="mb-4 text-center text-[0.7rem] font-semibold uppercase tracking-wider text-ink/70 sm:mb-6 sm:text-xs">
            {mode === "emailCode"
              ? (verificationPending ? "Enter the code we emailed you" : "We'll email you a one-time code — no password needed")
              : mode === "setPassword"
              ? "Your identity was verified by email code"
              : "Use your verified account"}
          </p>

          {mode === "emailCode" ? (
            verificationPending ? (
              <form onSubmit={handleVerification} className="flex flex-col gap-3 sm:gap-4">
                <Field
                  aria-label="Email code"
                  autoComplete="one-time-code"
                  icon={<KeyRound />}
                  inputMode="numeric"
                  maxLength={6}
                  name="otp"
                  onChange={setOtp}
                  pattern="[0-9]{6}"
                  placeholder="6-digit code"
                  type="text"
                  value={otp}
                  disabled={isSignUp}
                />
                <SubmitButton pending={pending} label="VERIFY & CONTINUE" color="bg-indigo hover:bg-indigo/90" />
                <button
                  type="button"
                  onClick={() => { setVerificationPending(false); setError(null); setMessage(null); }}
                  className="text-center text-xs font-bold text-indigo transition hover:text-coral"
                >
                  Entered wrong email? Request a new code
                </button>
              </form>
            ) : (
              <form onSubmit={handleEmailCodeRequest} className="flex flex-col gap-3 sm:gap-4">
                <Field
                  aria-label="Email address"
                  autoComplete="email"
                  icon={<Mail />}
                  maxLength={254}
                  name="email"
                  onChange={setEmail}
                  placeholder="Email Address"
                  type="email"
                  value={email}
                  disabled={isSignUp}
                />
                <SubmitButton pending={pending} label="EMAIL ME A CODE" color="bg-indigo hover:bg-indigo/90" />
                <button
                  type="button"
                  onClick={() => { setMode("signin"); setError(null); setMessage(null); }}
                  className="text-center text-xs font-bold text-indigo transition hover:text-coral"
                >
                  ← Back to Password Sign In
                </button>
              </form>
            )
          ) : mode === "setPassword" ? (
            <form onSubmit={handleSetPassword} className="flex flex-col gap-3 sm:gap-4">
              <Field
                aria-label="New password"
                autoComplete="new-password"
                icon={<Lock />}
                maxLength={128}
                minLength={10}
                name="newPassword"
                onChange={setPassword}
                placeholder="New password (10+ chars, Aa1!)"
                type="password"
                value={password}
                disabled={isSignUp}
              />
              <Field
                aria-label="Confirm new password"
                autoComplete="new-password"
                icon={<Lock />}
                maxLength={128}
                minLength={10}
                name="confirmPassword"
                onChange={setConfirmPassword}
                placeholder="Repeat new password"
                type="password"
                value={confirmPassword}
                disabled={isSignUp}
              />
              <SubmitButton pending={pending} label="SAVE NEW PASSWORD" color="bg-indigo hover:bg-indigo/90" />
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="flex flex-col gap-3 sm:gap-4">
              <Field
                aria-label="Email address"
                autoComplete="email"
                icon={<Mail />}
                maxLength={254}
                name="email"
                onChange={setEmail}
                placeholder="Email Address"
                type="email"
                value={email}
                disabled={isSignUp}
              />
              <Field
                aria-label="Password"
                autoComplete="current-password"
                icon={<Lock />}
                maxLength={128}
                name="password"
                onChange={setPassword}
                placeholder="Password"
                type="password"
                value={password}
                disabled={isSignUp}
              />
              <SubmitButton pending={pending} label="SIGN IN" color="bg-[#301F30] hover:bg-[#301F30]/90" />
              <button
                type="button"
                onClick={startEmailCodeLogin}
                className="text-center text-xs font-bold text-indigo transition hover:text-coral"
              >
                Forgot password? Log in with an email code
              </button>

              {hasGoogleAuth && (
                <div className="flex flex-col gap-2 mt-1">
                  <div className="relative my-1 flex items-center py-1">
                    <div className="flex-grow border-t border-ink/10"></div>
                    <span className="mx-4 flex-shrink-0 text-[0.65rem] sm:text-xs font-semibold text-ink/60 uppercase">Or continue with</span>
                    <div className="flex-grow border-t border-ink/10"></div>
                  </div>
                  <div ref={googleButtonSignInRef} className="flex justify-center w-full empty:hidden"></div>
                  {!gsiActive && <GoogleOAuthButton role={role} returnTo={returnTo} label="Sign in with Google" />}
                </div>
              )}
            </form>
          )}

          {!isSignUp && <Feedback error={error} message={message} />}
        </div>

        {/* -------------------- DESKTOP SLIDING OVERLAY -------------------- */}
        <div
          className={`hidden sm:flex absolute left-0 top-0 z-30 h-full w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#5B3D7A] to-[#301F30] px-10 text-center text-white shadow-[0_0_40px_rgba(91,61,122,0.5)] transition-all duration-700 ease-in-out ${
            isSignUp
              ? "translate-x-full rounded-[30%_0_0_30%]"
              : "translate-x-0 rounded-[0_30%_30%_0]"
          }`}
        >
          <div className="pointer-events-none mb-3 drop-shadow-2xl">
            <LottiePetAnimation />
          </div>
          <div
            key={isSignUp ? "signup" : "signin"}
            className="flex flex-col items-center opacity-0 animate-[auth-panel-fade-up_0.5s_ease_0.2s_forwards]"
          >
            <h2 className="mb-3 font-display text-3xl font-bold tracking-tight lg:text-4xl">
              {isSignUp ? "Welcome Back!" : "Hello, Friend!"}
            </h2>
            <p className="mb-6 max-w-[280px] text-sm font-medium leading-relaxed text-white/80">
              {isSignUp
                ? "Sign in to continue caring for your furry family."
                : "Create your verified PetSaathi account and begin your care journey."}
            </p>
            <button
              type="button"
              onClick={() => {
                setMode(isSignUp ? "signin" : "signup");
                setError(null);
                setMessage(null);
              }}
              className="rounded-full border-2 border-white px-10 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-[#5B3D7A] active:scale-95"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
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
  disabled,
  ...props
}: {
  icon: React.ReactElement<{ className?: string }>;
  onChange: (value: string) => void;
  disabled?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === "password";
  const inputType = isPassword && showPassword ? "text" : props.type;

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/70 pointer-events-none">{icon}</span>
      <input
        {...props}
        type={inputType}
        required={!disabled}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={`h-11 sm:h-12 w-full rounded-xl bg-ink/5 pl-12 text-base sm:text-[15px] text-ink outline-none transition focus:ring-2 focus:ring-indigo/40 disabled:opacity-50 ${isPassword ? 'pr-12' : 'pr-4'}`}
      />
      {isPassword && (
        <button
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/60 transition hover:text-ink/90"
          tabIndex={-1}
          disabled={disabled}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      )}
    </div>
  );
}

function SubmitButton({ pending, label, color }: { pending: boolean; label: string; color: string }) {
  return (
    <button type="submit" disabled={pending} className={`mt-1 sm:mt-2 flex h-11 sm:h-12 w-full items-center justify-center rounded-xl font-bold tracking-wide text-white transition disabled:opacity-50 ${color}`}>
      {pending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : label}
    </button>
  );
}

function Feedback({ error, message }: { error: string | null; message: string | null }) {
  return (
    <>
      {error && <p className="mt-3 rounded-xl bg-coral/10 p-3 text-xs sm:text-sm font-semibold text-coral" role="alert">{error}</p>}
      {message && <p className="mt-3 rounded-xl bg-leaf/10 p-3 text-xs sm:text-sm font-semibold text-leaf" role="status">{message}</p>}
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
