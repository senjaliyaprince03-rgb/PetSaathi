import { NextResponse } from "next/server";
import { z } from "zod";

import { signInWithPassword } from "@/modules/auth/mongodb-auth";
import { consumeRateLimit, requestIp } from "@/modules/security/rate-limit";

const signinSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  const parsed = signinSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_credentials" }, { status: 422 });

  const rate = await consumeRateLimit("password-signin-ip", requestIp(request), 10, 15 * 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "too_many_attempts" },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  const authenticated = await signInWithPassword(parsed.data.email, parsed.data.password);
  if (!authenticated) return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  return NextResponse.json({ authenticated: true });
}
