import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { findEligibleSitters, proposeSitter, MatchingError } from "@/modules/matching/service";
import { z } from "zod";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
  adminId: z.string().uuid(), // Ideally from session
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const parsed = proposeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_data", details: parsed.error.issues }, { status: 422 });
    }

    const { sitterId, adminId } = parsed.data;
    const booking = await proposeSitter((await params).id, sitterId, adminId);
    return NextResponse.json({ booking }, { status: 200 });
  } catch (error: any) {
    if (error instanceof MatchingError) {
      return NextResponse.json({ error: error.code, message: error.message }, { status: 400 });
    }
    console.error("Error in POST match API:", error);
    return NextResponse.json({ error: "internal_error", message: "An unexpected error occurred" }, { status: 500 });
  }
}
