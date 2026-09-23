import { NextResponse } from "next/server";
import { signInWithGoogle } from "@/modules/auth/mongodb-auth";
import { logger } from "@/lib/logger";

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

  let state: { role?: string; returnTo?: string } = {};
  if (stateRaw) {
    try {
      state = JSON.parse(Buffer.from(stateRaw, "base64url").toString("utf-8"));
    } catch {
      // Ignored
    }
  }

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
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userinfoResponse.ok) {
      logger.error("[GOOGLE_OAUTH_CALLBACK] Failed to fetch userinfo");
      return NextResponse.redirect(new URL("/login?error=userinfo_failed", baseUrl));
    }

    const profile = await userinfoResponse.json();
    if (!profile.email) {
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
    let destination = state.returnTo || "/dashboard";
    if (!state.returnTo) {
      if (result.roles?.includes("SUPER_ADMIN") || result.roles?.includes("OPERATIONS_ADMIN")) {
        destination = "/admin";
      } else if (result.roles?.includes("SITTER")) {
        destination = "/saathi";
      } else {
        destination = "/dashboard";
      }
    }

    return NextResponse.redirect(new URL(destination, baseUrl));
  } catch (err: any) {
    logger.error("[GOOGLE_OAUTH_CALLBACK] Unexpected authentication error", { error: err.message });
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(err.message || "auth_failed")}`, baseUrl));
  }
}
