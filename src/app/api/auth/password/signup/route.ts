import { NextResponse } from "next/server";
import { z } from "zod";

import { registerWithPassword } from "@/modules/auth/mongodb-auth";
import { consumeRateLimit, requestIp } from "@/modules/security/rate-limit";
import { logger } from "@/lib/logger";

const signupSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  password: z.string().min(10).max(128),
});

export async function POST(request: Request) {
  const parsed = signupSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_signup", issues: parsed.error.flatten() }, { status: 422 });
  }

  const rate = await consumeRateLimit("password-signup-ip", requestIp(request), 5, 60 * 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "too_many_requests" },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  try {
    const result = await registerWithPassword(parsed.data);
    if (!result.created) return NextResponse.json({ error: result.reason }, { status: 409 });
    return NextResponse.json(
      {
        created: true,
        requiresVerification: true,
        ...(result.verification.mode === "development"
          ? { developmentOtp: result.verification.code }
          : {}),
      },
      { status: 201 },
    );
  } catch (error) {
    logger.exception("auth.password_signup_failed", error, {
      requestId: request.headers.get("x-request-id") ?? undefined,
    });
    return NextResponse.json({ error: "signup_unavailable" }, { status: 503 });
  }
}
