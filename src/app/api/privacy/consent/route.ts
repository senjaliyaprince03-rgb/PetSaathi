import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  getUserConsents,
  grantConsent,
  revokeConsent,
} from "@/modules/privacy/dpdp";
import { getCurrentIdentity } from "@/modules/auth/session";
import {
  consumeRateLimit,
  requestIp,
} from "@/modules/security/rate-limit";

const consentPurposeSchema = z.enum([
  "PHOTO_USAGE",
  "TESTIMONIAL",
  "MARKETING_EMAIL",
  "MARKETING_WHATSAPP",
  "MARKETING_SMS",
  "SOCIAL_MEDIA_FEATURE",
  "PAID_AD",
  "THIRD_PARTY_SHARE",
  "ANALYTICS",
]);

const updateConsentSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("GRANT"),
    purpose: consentPurposeSchema,
    consentVersion: z.string().trim().min(1).max(40).optional(),
  }),
  z.object({
    action: z.literal("REVOKE"),
    purpose: consentPurposeSchema,
    reason: z.string().trim().min(5).max(500).optional(),
  }),
]);

/**
 * GET /api/privacy/consent — List the current user's consent records.
 */
export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const consents = await getUserConsents(identity.id);
  return NextResponse.json({ consents });
}

/**
 * POST /api/privacy/consent — Grant or revoke consent.
 *
 * Body: { action: "GRANT" | "REVOKE", purpose: ConsentPurpose, consentVersion?: string, reason?: string }
 */
export async function POST(req: NextRequest) {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rate = await consumeRateLimit(
    "privacy-consent-user",
    identity.id,
    30,
    24 * 60 * 60_000,
  );
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "too_many_requests" },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      },
    );
  }

  const parsed = updateConsentSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (parsed.data.action === "GRANT") {
    const record = await grantConsent({
      userId: identity.id,
      purpose: parsed.data.purpose,
      consentVersion: parsed.data.consentVersion ?? "1.0",
      ipAddress: requestIp(req),
      userAgent: req.headers.get("user-agent")?.slice(0, 512),
    });
    return NextResponse.json({ record }, { status: 201 });
  }

  await revokeConsent({
    userId: identity.id,
    purpose: parsed.data.purpose,
    reason: parsed.data.reason,
  });
  return NextResponse.json({ ok: true });
}
