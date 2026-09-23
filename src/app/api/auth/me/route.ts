import { NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const identity = await getCurrentIdentity(request);
    if (!identity) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: identity.id,
        displayName: identity.displayName,
        status: identity.status,
        roles: identity.roles,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false, user: null, error: error.message || "Failed to resolve session" },
      { status: 500 }
    );
  }
}
