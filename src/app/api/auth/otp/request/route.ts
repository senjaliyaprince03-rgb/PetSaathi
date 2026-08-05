import { NextResponse } from "next/server";
import { z } from "zod";

import { requestPhoneOtp } from "@/modules/auth/mongodb-auth";
import { consumeRateLimit, requestIp } from "@/modules/security/rate-limit";

const requestSchema = z.object({ phone: z.string().regex(/^\+91[6-9]\d{9}$/) });

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_phone" }, { status: 422 });
  const [ipLimit, phoneLimit] = await Promise.all([
    consumeRateLimit("otp-request-ip", requestIp(request), 5, 15 * 60_000),
    consumeRateLimit("otp-request-phone", parsed.data.phone, 3, 15 * 60_000)
  ]);
  if (!ipLimit.allowed || !phoneLimit.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(Math.max(ipLimit.retryAfterSeconds, phoneLimit.retryAfterSeconds)) } });
  try {
    await requestPhoneOtp(parsed.data.phone);
  } catch {
    return NextResponse.json({ error: "otp_delivery_failed" }, { status: 502 });
  }
  return NextResponse.json({ sent: true });
}
