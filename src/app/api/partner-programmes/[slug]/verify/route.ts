import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import { verifyMember } from "@/modules/b2b/programmes";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  // Normally this would happen via an email click or SSO, but we provide an endpoint to verify
  const { slug } = await params;
  const body = await req.json();
  const membershipId = body.membershipId;
  const token = body.token;
  
  if (!membershipId) {
    return NextResponse.json({ error: "Missing membershipId" }, { status: 400 });
  }

  try {
    // In a real app we'd check the token/OTP here
    // Verify membership
    const updated = await verifyMember(membershipId, true);
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
