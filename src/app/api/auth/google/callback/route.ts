import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signInWithGoogle } from "@/modules/auth/mongodb-auth";
import { verifyOAuthState, sanitizeReturnUrl } from "@/modules/auth/oauth-state";
import { logger } from "@/lib/logger";
import { getDefaultDashboardForRoles } from "@/modules/auth/admin-access";

function getAppBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && envUrl.trim().length > 0) {
    let url = envUrl.trim().replace(/\/+$/, "");
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    return url;
  }
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercelUrl && vercelUrl.trim().length > 0) {
    return `https://${vercelUrl.trim().replace(/\/+$/, "")}`;
  }
  return "http://localhost:3000";
}

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const stateRaw = requestUrl.searchParams.get("state");

  const configuredUrl = getAppBaseUrl();
  const baseUrl = process.env.NODE_ENV === "development" ? requestUrl.origin : (configuredUrl || requestUrl.origin);

  if (error || !code) {
    logger.warn("[GOOGLE_OAUTH_CALLBACK] OAuth error or missing code", { error });
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error || "cancelled")}`, baseUrl));
  }

  const cookieStore = await cookies();
  const expectedNonce = cookieStore.get("google_oauth_nonce")?.value;
  const verifiedState = verifyOAuthState(stateRaw || "", expectedNonce);

  if (!verifiedState) {
    logger.warn("[GOOGLE_OAUTH_CALLBACK] Invalid, expired or forged OAuth state token");
    const errorRes = NextResponse.redirect(new URL("/login?error=invalid_oauth_state", baseUrl));
    errorRes.cookies.delete("google_oauth_nonce");
    return errorRes;
  }

  const state = verifiedState;

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    logger.error("[GOOGLE_OAUTH_CALLBACK] Missing Google OAuth credentials");
    return NextResponse.redirect(new URL("/login?error=oauth_configuration_error", baseUrl));
  }

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      signal: AbortSignal.timeout(10_000),
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      logger.error("[GOOGLE_OAUTH_CALLBACK] Token exchange failed", { status: tokenResponse.status, errText });
      return NextResponse.redirect(new URL("/login?error=token_exchange_failed", baseUrl));
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch user profile from Google
    const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      signal: AbortSignal.timeout(10_000),
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userinfoResponse.ok) {
      logger.error("[GOOGLE_OAUTH_CALLBACK] Failed to fetch userinfo");
      return NextResponse.redirect(new URL("/login?error=userinfo_failed", baseUrl));
    }

    const profile = await userinfoResponse.json();
    if (!profile.email || profile.email_verified !== true || typeof profile.sub !== "string") {
      return NextResponse.redirect(new URL("/login?error=missing_email", baseUrl));
    }

    // 3. Authenticate with PetSaathi auth system
    const result = await signInWithGoogle(
      profile.email,
      profile.name || "Pet Parent",
      profile.picture,
      state.role || "CUSTOMER"
    );

    // 4. Resolve destination
    const destination = state.returnTo && state.returnTo !== "/dashboard" ? state.returnTo : getDefaultDashboardForRoles(result.roles);

    const safeDestination = sanitizeReturnUrl(destination);
    const successRes = NextResponse.redirect(new URL(safeDestination, baseUrl));
    successRes.cookies.delete("google_oauth_nonce");
    return successRes;
  } catch (err: any) {
    logger.error("[GOOGLE_OAUTH_CALLBACK] Unexpected authentication error", { error: err.message });
    const errRes = NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(err.message || "auth_failed")}`, baseUrl));
    errRes.cookies.delete("google_oauth_nonce");
    return errRes;
  }
}
