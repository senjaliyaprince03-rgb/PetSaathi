import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import { executeAccountErasure } from "@/modules/privacy/dpdp";

/**
 * POST /api/privacy/erase-account — DPDP Act 2023 Right to Erasure
 * Deactivates account, anonymizes personal identifiers, deletes addresses,
 * revokes active consents, and records a permanent compliance audit log.
 */
export async function POST(req: NextRequest) {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let targetUserId = identity.id;

  try {
    const body = await req.json().catch(() => ({}));
    if (body.userId && body.userId !== identity.id) {
      // Only SUPER_ADMIN may trigger erasure for another account
      const isSuperAdmin = identity.roles.includes("SUPER_ADMIN");
      if (!isSuperAdmin) {
        return NextResponse.json(
          { error: "Forbidden: Super Admin privileges required to erase another account" },
          { status: 403 }
        );
      }
      targetUserId = body.userId;
    }

    const result = await executeAccountErasure(targetUserId, identity.id);
    return NextResponse.json({
      message: "Account and PII successfully erased under DPDP Act 2023",
      ...result,
    });
  } catch (error) {
    console.error("[DPDP Erasure Error]:", error);
    return NextResponse.json(
      { error: "Failed to complete account erasure request" },
      { status: 500 }
    );
  }
}
