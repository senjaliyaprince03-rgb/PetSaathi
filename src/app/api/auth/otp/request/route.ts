import { NextResponse } from "next/server";
import { z } from "zod";

import { requestPhoneOtp } from "@/modules/auth/mongodb-auth";
import { consumeRateLimit, requestIp } from "@/modules/security/rate-limit";

const requestSchema = z.object({ phone: z.string().regex(/^\+91[6-9]\d{9}$/) });

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "invalid_phone",
        message: "Enter a valid Indian mobile number starting with +91 (for example +919876543210).",
        issues: { fieldErrors: { phone: ["Use the format +91 followed by 10 digits, e.g. +919876543210."] } },
      },
      { status: 422 },
    );
  }
  const [ipLimit, phoneLimit] = await Promise.all([
    consumeRateLimit("otp-request-ip", requestIp(request), 5, 15 * 60_000),
    consumeRateLimit("otp-request-phone", parsed.data.phone, 3, 15 * 60_000)
  ]);
  if (!ipLimit.allowed || !phoneLimit.allowed) return NextResponse.json({ error: "too_many_requests", message: "Too many code requests. Please wait a few minutes before requesting another one." }, { status: 429, headers: { "Retry-After": String(Math.max(ipLimit.retryAfterSeconds, phoneLimit.retryAfterSeconds)) } });
  try {
    await requestPhoneOtp(parsed.data.phone);
  } catch {
    return NextResponse.json({ error: "otp_delivery_failed", message: "We couldn't send the code right now. Please try again in a moment." }, { status: 502 });
  }
  return NextResponse.json({ sent: true });
}
