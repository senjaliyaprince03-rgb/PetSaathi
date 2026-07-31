import { NextResponse } from "next/server";
import { getSocietyDashboard } from "@/modules/b2b/service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ societyId: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");
    // In a real implementation, we would check if this user is a society manager for this society.
    if (!userId) {
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
