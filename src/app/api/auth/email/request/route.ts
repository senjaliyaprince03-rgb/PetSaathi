import { NextResponse } from "next/server";
import { z } from "zod";

import { requestEmailOtp } from "@/modules/auth/mongodb-auth";
import { consumeRateLimit, requestIp } from "@/modules/security/rate-limit";
import { logger } from "@/lib/logger";

const requestSchema = z.object({ email: z.string().email("Enter a valid email address") });

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_email" }, { status: 422 });
  const [ipLimit, emailLimit] = await Promise.all([
    consumeRateLimit("email-otp-request-ip", requestIp(request), 5, 15 * 60_000),
    consumeRateLimit("email-otp-request-email", parsed.data.email, 3, 15 * 60_000)
  ]);
  if (!ipLimit.allowed || !emailLimit.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(Math.max(ipLimit.retryAfterSeconds, emailLimit.retryAfterSeconds)) } });
  try {
    const delivery = await requestEmailOtp(parsed.data.email);
    return NextResponse.json({
      sent: true,
      ...(delivery.mode === "development" ? { developmentOtp: delivery.code } : {}),
    });
  } catch (error) {
    logger.exception("auth.email_otp_delivery_failed", error, {
      requestId: request.headers.get("x-request-id") ?? undefined,
    });
    return NextResponse.json({ error: "otp_delivery_failed" }, { status: 502 });
  }
}
