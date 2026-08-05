import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { findEligibleSitters, proposeSitter, MatchingError } from "@/modules/matching/service";
import { z } from "zod";
import { authorizeApi } from "@/modules/auth/authorization";

const allowedRoles = ["OPERATIONS_ADMIN", "SUPER_ADMIN"] as const;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authorization = await authorizeApi(allowedRoles);
  if (!authorization.authorized) return authorization.response;

  try {
    const sitters = await findEligibleSitters((await params).id);
    return NextResponse.json({ sitters }, { status: 200 });
  } catch (error: any) {
    if (error instanceof MatchingError) {
      return NextResponse.json({ error: error.code, message: error.message }, { status: 400 });
    }
    console.error("Error in GET match API:", error);
    return NextResponse.json({ error: "internal_error", message: "An unexpected error occurred" }, { status: 500 });
  }
}

const proposeSchema = z.object({
  sitterId: z.string().uuid(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authorization = await authorizeApi(allowedRoles);
  if (!authorization.authorized) return authorization.response;

  try {
    const body = await req.json();
    const parsed = proposeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_data", details: parsed.error.issues }, { status: 422 });
    }

    const { sitterId } = parsed.data;
    const booking = await proposeSitter((await params).id, sitterId, authorization.identity.id);
    return NextResponse.json({ booking }, { status: 200 });
  } catch (error: any) {
    if (error instanceof MatchingError) {
      return NextResponse.json({ error: error.code, message: error.message }, { status: 400 });
    }
    console.error("Error in POST match API:", error);
    return NextResponse.json({ error: "internal_error", message: "An unexpected error occurred" }, { status: 500 });
  }
}
