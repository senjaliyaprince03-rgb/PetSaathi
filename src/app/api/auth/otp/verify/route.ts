import { NextResponse } from "next/server";
import { z } from "zod";

import { verifyOtpAndCreateSession } from "@/modules/auth/mongodb-auth";
import { consumeRateLimit, requestIp } from "@/modules/security/rate-limit";

const verifySchema = z.object({ phone: z.string().regex(/^\+91[6-9]\d{9}$/), otp: z.string().regex(/^\d{6}$/) });

export async function POST(request: Request) {
  const parsed = verifySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_verification" }, { status: 422 });
  const [ipLimit, phoneLimit] = await Promise.all([
    consumeRateLimit("otp-verify-ip", requestIp(request), 12, 15 * 60_000),
    consumeRateLimit("otp-verify-phone", parsed.data.phone, 6, 15 * 60_000)
  ]);
  if (!ipLimit.allowed || !phoneLimit.allowed) return NextResponse.json({ error: "too_many_attempts" }, { status: 429, headers: { "Retry-After": String(Math.max(ipLimit.retryAfterSeconds, phoneLimit.retryAfterSeconds)) } });
  const verified = await verifyOtpAndCreateSession("phone", parsed.data.phone, parsed.data.otp);
  if (!verified) return NextResponse.json({ error: "invalid_or_expired_otp" }, { status: 401 });
  return NextResponse.json({ verified: true });
}
