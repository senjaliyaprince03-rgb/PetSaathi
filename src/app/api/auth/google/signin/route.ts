import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { signInWithGoogle } from "@/modules/auth/mongodb-auth";
import { consumeRateLimit, requestIp } from "@/modules/security/rate-limit";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  try {
    const { credential } = await request.json();
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
    if (!payload || !payload.email) {
      return NextResponse.json({ error: "invalid_credential" }, { status: 401 });
    }

    await signInWithGoogle(payload.email, payload.name || "Pet Parent", payload.picture);
    
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error("Google sign in error:", error);
    return NextResponse.json({ error: "invalid_credential" }, { status: 401 });
  }
}
