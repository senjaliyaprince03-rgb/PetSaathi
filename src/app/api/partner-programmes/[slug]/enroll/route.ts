import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import { enrollMember, getProgrammeBySlug } from "@/modules/b2b/programmes";
import type { EligibilityMethod } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  const body = await req.json();

  try {
    const programme = await getProgrammeBySlug(slug);
    if (programme.status !== "ACTIVE_PROGRAMME") {
      return NextResponse.json({ error: "Programme is not active" }, { status: 400 });
    }
    
    // In a real implementation, you would validate domain emails here or trigger OTP
    // For MVP, we just create the pending membership
    const method = (body.verificationMethod as EligibilityMethod) || programme.eligibilityMethod;
    
    const membership = await enrollMember(programme.id, identity.userId, method);
    return NextResponse.json(membership, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Enrollment failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
