import { NextResponse } from "next/server";
import { z } from "zod";

import { requestEmailOtp } from "@/modules/auth/mongodb-auth";
import { consumeRateLimit, requestIp } from "@/modules/security/rate-limit";

const resendSchema = z.object({
  email: z.string().trim().email(),
  purpose: z.enum(["registration", "login", "password-reset", "email-change"]).optional().default("login"),
});

export async function POST(request: Request) {
  const parsed = resendSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 422 });
  }

  const { email, purpose } = parsed.data;

  // 1. 60-second cooldown per email
  const cooldown = await consumeRateLimit(`otp-cooldown-${purpose}`, email, 1, 60_000);
  if (!cooldown.allowed) {
    return NextResponse.json(
      { error: "rate_limited", message: `Please wait ${cooldown.retryAfterSeconds} seconds before requesting a new code.` },
      { status: 429, headers: { "Retry-After": String(cooldown.retryAfterSeconds) } }
    );
  }

  // 2. Max 3 OTPs per 10-minute window
  const windowLimit = await consumeRateLimit(`otp-window-${purpose}`, email, 3, 10 * 60_000);
  if (!windowLimit.allowed) {
    return NextResponse.json(
      { error: "too_many_requests", message: `Too many requests. Try again after ${Math.ceil(windowLimit.retryAfterSeconds / 60)} minutes.` },
      { status: 429, headers: { "Retry-After": String(windowLimit.retryAfterSeconds) } }
    );
  }

  // 3. IP level rate limit
  const ipLimit = await consumeRateLimit("otp-resend-ip", requestIp(request), 5, 15 * 60_000);
  if (!ipLimit.allowed) {
    return NextResponse.json(
      { error: "too_many_requests", message: "Too many attempts from this connection." },
      { status: 429 }
    );
  }

  try {
    const delivery = await requestEmailOtp(email, purpose);
    return NextResponse.json({
      success: true,
      message: "A new verification code has been sent to your email.",
      ...(delivery.mode === "development" ? { developmentOtp: delivery.code } : {}),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "otp_delivery_failed", message: "Could not send verification code. Please try again." },
      { status: 502 }
    );
  }
}
