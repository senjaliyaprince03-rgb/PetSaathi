import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import {
  grantConsent,
  revokeConsent,
  getUserConsents,
} from "@/modules/privacy/dpdp";
import type { ConsentPurpose } from "@prisma/client";

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

  const body = await req.json();
  const { action, purpose, consentVersion, reason } = body as {
    action: "GRANT" | "REVOKE";
    purpose: ConsentPurpose;
    consentVersion?: string;
    reason?: string;
  };

  if (!action || !purpose) {
    return NextResponse.json(
      { error: "action and purpose are required" },
      { status: 400 },
    );
  }

  if (action === "GRANT") {
    const record = await grantConsent({
      userId: identity.id,
      purpose,
      consentVersion: consentVersion ?? "1.0",
      ipAddress: req.headers.get("x-forwarded-for") ?? undefined,
      userAgent: req.headers.get("user-agent") ?? undefined,
    });
    return NextResponse.json({ record }, { status: 201 });
  }

  if (action === "REVOKE") {
    await revokeConsent({
      userId: identity.id,
      purpose,
      reason,
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
