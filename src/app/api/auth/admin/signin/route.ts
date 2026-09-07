import { NextResponse } from "next/server";
import { z } from "zod";

import * as Sentry from "@sentry/nextjs";
import { signInAdmin } from "@/modules/auth/mongodb-auth";
import { consumeRateLimit, requestIp } from "@/modules/security/rate-limit";
import { errorResponseForCaughtError, jsonError } from "@/lib/api-error";
import { logger } from "@/lib/logger";

const adminSigninSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  let parsed;
  try {
    parsed = adminSigninSchema.safeParse(await request.json().catch(() => null));
  } catch (error) {
    return errorResponseForCaughtError(error, logger, "auth.admin_signin_failed", {
      requestId: request.headers.get("x-request-id") ?? undefined,
    });
  }
  if (!parsed.success) return jsonError("invalid_credentials", "Incorrect admin email or password.", 401);

  // Stricter rate limit for admin sign-in
  const rate = await consumeRateLimit("admin-signin-ip", requestIp(request), 5, 15 * 60_000);
  if (!rate.allowed) {
    return jsonError("too_many_attempts", "Too many admin sign-in attempts. Please wait and try again.", 429, {
      headers: { "Retry-After": String(rate.retryAfterSeconds) },
    });
  }

  try {
    const result = await signInAdmin(parsed.data.email, parsed.data.password);
    if (!result.success) return jsonError("invalid_credentials", "Incorrect admin email or password.", 401);
    // Set Sentry user context for error tracking
    Sentry.setUser({ id: result.userId, email: parsed.data.email });
    return NextResponse.json({ authenticated: true, roles: result.roles });
  } catch (error) {
    return errorResponseForCaughtError(error, logger, "auth.admin_signin_failed", {
      requestId: request.headers.get("x-request-id") ?? undefined,
    });
  }
}
