import { NextResponse } from "next/server";
import { getSocietyDashboard } from "@/modules/b2b/service";

import { getCurrentIdentity } from "@/modules/auth/session";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ societyId: string }> }
) {
  try {
    const identity = await getCurrentIdentity();
    if (!identity) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dashboard = await getSocietyDashboard((await params).societyId);
    return NextResponse.json({ dashboard }, { status: 200 });
  } catch (error: any) {
    if (error.code === "society_not_found") {
      return NextResponse.json({ error: "not_found", message: error.message }, { status: 404 });
    }
    console.error("Error in GET society dashboard API:", error);
    return NextResponse.json(
      { error: "internal_error", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
