import { NextResponse } from "next/server";
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
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") || "CUSTOMER";
  const returnTo = searchParams.get("returnTo") || "/dashboard";

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId || clientId.startsWith("mock-")) {
    return NextResponse.json({ error: "Google OAuth is not configured with a valid client ID" }, { status: 500 });
  }

  // Derive origin: in development use current request origin (e.g. 127.0.0.1:3110); in production prefer configured base URL
  const requestUrl = new URL(request.url);
  const configuredUrl = getAppBaseUrl();
  const baseUrl = process.env.NODE_ENV === "development" ? requestUrl.origin : (configuredUrl || requestUrl.origin);
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  // State encodes destination and role
  const statePayload = Buffer.from(JSON.stringify({ role, returnTo, ts: Date.now() })).toString("base64url");

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("access_type", "offline");
  googleAuthUrl.searchParams.set("prompt", "select_account");
  googleAuthUrl.searchParams.set("state", statePayload);

  return NextResponse.redirect(googleAuthUrl.toString(), 302);
}
