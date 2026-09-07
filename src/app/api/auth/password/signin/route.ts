import { NextResponse } from "next/server";
import { z } from "zod";

import * as Sentry from "@sentry/nextjs";
import { signInWithPassword } from "@/modules/auth/mongodb-auth";
import { consumeRateLimit, requestIp } from "@/modules/security/rate-limit";
import { errorResponseForCaughtError, jsonError } from "@/lib/api-error";
import { logger } from "@/lib/logger";

const signinSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  let parsed;
  try {
    parsed = signinSchema.safeParse(await request.json().catch(() => null));
  } catch (error) {
    return errorResponseForCaughtError(error, logger, "auth.password_signin_failed", {
      requestId: request.headers.get("x-request-id") ?? undefined,
    });
  }
  if (!parsed.success) return jsonError("invalid_credentials", "Incorrect email or password.", 401);

  const rate = await consumeRateLimit("password-signin-ip", requestIp(request), 10, 15 * 60_000);
  if (!rate.allowed) {
    return jsonError("too_many_attempts", "Too many sign-in attempts. Please wait a few minutes and try again.", 429, {
      headers: { "Retry-After": String(rate.retryAfterSeconds) },
    });
  }

  try {
    const result = await signInWithPassword(parsed.data.email, parsed.data.password);
    if (!result.success) return jsonError("invalid_credentials", "Incorrect email or password.", 401);
    // Set Sentry user context for error tracking
    Sentry.setUser({ id: result.userId, email: parsed.data.email });
    return NextResponse.json({ authenticated: true, roles: result.roles });
  } catch (error) {
    return errorResponseForCaughtError(error, logger, "auth.password_signin_failed", {
      requestId: request.headers.get("x-request-id") ?? undefined,
    });
  }
}
