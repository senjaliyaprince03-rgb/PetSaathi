import { NextResponse } from "next/server";
import { attachExpertReview } from "@/modules/content/expert.service";

import { getCurrentIdentity } from "@/modules/auth/session";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const identity = await getCurrentIdentity();
    if (!identity || !identity.roles.some(r => ["SUPER_ADMIN", "CONTENT_ADMIN", "OPERATIONS_ADMIN"].includes(r))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { reviewerId, reviewerName, credentials, scope, verdict, notes } = body;

    if (!reviewerId || !reviewerName || !credentials || !scope || !verdict || !notes) {
      return NextResponse.json({ error: "bad_request", message: "Missing required fields" }, { status: 400 });
    }

    const review = await attachExpertReview(
      (await params).id,
      reviewerId,
      reviewerName,
      credentials,
      scope,
      verdict,
      notes
    );

    return NextResponse.json({ review }, { status: 201 });
  } catch (error: any) {
    if (error.code === "entry_not_found") {
      return NextResponse.json({ error: "not_found", message: error.message }, { status: 404 });
    }
    console.error("Error in POST expert review API:", error);
    return NextResponse.json(
      { error: "internal_error", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
