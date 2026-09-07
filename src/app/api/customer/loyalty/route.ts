import { NextResponse } from "next/server";
import { getLoyaltyBalance, getLoyaltyHistory } from "@/modules/loyalty/service";

import { getCurrentIdentity } from "@/modules/auth/session";

export async function GET(req: Request) {
  try {
    const identity = await getCurrentIdentity();
    if (!identity) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = identity.id;

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const balance = await getLoyaltyBalance(userId);
    const history = await getLoyaltyHistory(userId, limit);

    return NextResponse.json({
      balance,
      history
    }, { status: 200 });
  } catch (error) {
    console.error("Error in GET loyalty API:", error);
    return NextResponse.json(
      { error: "internal_error", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
