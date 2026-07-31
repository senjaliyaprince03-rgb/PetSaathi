import { NextResponse } from "next/server";
import { onboardPartner } from "@/modules/scale/franchise.service";
import { ScaleError } from "@/modules/scale/city-ops.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, partnerId } = body;

    if (action === "ONBOARD" && partnerId) {
      const partner = await onboardPartner(partnerId);
      return NextResponse.json(partner);
    }

    return NextResponse.json({ error: "invalid_action", message: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    if (error instanceof ScaleError) {
      return NextResponse.json({ error: error.code, message: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "internal_error", message: error.message }, { status: 500 });
  }
}
