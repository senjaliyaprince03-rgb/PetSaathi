import { NextResponse } from "next/server";
import { z } from "zod";

import { registerWithPassword } from "@/modules/auth/mongodb-auth";
import { consumeRateLimit, requestIp } from "@/modules/security/rate-limit";
import { errorResponseForCaughtError, jsonError } from "@/lib/api-error";
import { logger } from "@/lib/logger";

const signupSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  password: z.string()
    .min(10, "Password must be at least 10 characters long")
    .max(128, "Password must not exceed 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  role: z.enum(["CUSTOMER", "SITTER"]).optional(),
});

export async function POST(request: Request) {
  const parsed = signupSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return jsonError("invalid_signup", "Please check the highlighted fields and try again.", 422, {
      issues: parsed.error.flatten(),
    });
  }

  const rate = await consumeRateLimit("password-signup-ip", requestIp(request), 500, 60 * 60_000);
  if (!rate.allowed) {
    return jsonError("too_many_requests", "Too many signup attempts. Please try again later.", 429, {
      headers: { "Retry-After": String(rate.retryAfterSeconds) },
    });
  }

  try {
    const result = await registerWithPassword(parsed.data);
    if (!result.created) {
      return jsonError("account_exists", "An account with this email already exists.", 409);
    }
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
    return errorResponseForCaughtError(error, logger, "auth.password_signup_failed", {
      requestId: request.headers.get("x-request-id") ?? undefined,
    });
  }
}
