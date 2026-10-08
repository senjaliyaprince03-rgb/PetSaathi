import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

import * as Sentry from "@sentry/nextjs";
import { signInWithGoogle } from "@/modules/auth/mongodb-auth";
import { consumeRateLimit, requestIp } from "@/modules/security/rate-limit";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  try {
    const { credential, selectedRole } = await request.json();
    if (!credential) {
      return NextResponse.json({ error: "missing_credential" }, { status: 400 });
    }

    const rate = await consumeRateLimit("google-signin-ip", requestIp(request), 10, 15 * 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "too_many_attempts" },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
      );
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email || payload.email_verified !== true || !payload.sub) {
      return NextResponse.json({ error: "invalid_credential" }, { status: 401 });
    }

    const safeRole = selectedRole === "SITTER" ? "SITTER" : "CUSTOMER";
    const result = await signInWithGoogle(payload.email, payload.name || "Pet Parent", payload.picture, safeRole);
    
    // Set Sentry user context for error tracking
    Sentry.setUser({ id: result.userId, email: payload.email });
    
    return NextResponse.json({ authenticated: true, roles: result.roles });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.startsWith("ACCOUNT_")) {
      return NextResponse.json({ error: "account_suspended" }, { status: 403 });
    }
    if (message.includes("Admin accounts")) {
      return NextResponse.json({ error: "admin_restricted" }, { status: 403 });
    }
    console.error("Google sign in error:", error);
    return NextResponse.json({ error: "invalid_credential" }, { status: 401 });
  }
}
