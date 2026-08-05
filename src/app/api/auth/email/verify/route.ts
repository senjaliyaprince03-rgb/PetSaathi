import { NextResponse } from "next/server";
import { z } from "zod";

import { verifyOtpAndCreateSession } from "@/modules/auth/mongodb-auth";
import { consumeRateLimit, requestIp } from "@/modules/security/rate-limit";

const verifySchema = z.object({ email: z.string().email(), otp: z.string().regex(/^\d{6}$/) });

export async function POST(request: Request) {
  const parsed = verifySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_verification" }, { status: 422 });
  const [ipLimit, emailLimit] = await Promise.all([
    consumeRateLimit("email-otp-verify-ip", requestIp(request), 12, 15 * 60_000),
    consumeRateLimit("email-otp-verify-email", parsed.data.email, 6, 15 * 60_000)
  ]);
  if (!ipLimit.allowed || !emailLimit.allowed) return NextResponse.json({ error: "too_many_attempts" }, { status: 429, headers: { "Retry-After": String(Math.max(ipLimit.retryAfterSeconds, emailLimit.retryAfterSeconds)) } });
  const verified = await verifyOtpAndCreateSession("email", parsed.data.email, parsed.data.otp);
  if (!verified) return NextResponse.json({ error: "invalid_or_expired_otp" }, { status: 401 });
  return NextResponse.json({ verified: true });
}
