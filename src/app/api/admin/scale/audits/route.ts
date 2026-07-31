import { NextResponse } from "next/server";
import { recordSafetyAudit } from "@/modules/scale/safety.service";
import { ScaleError } from "@/modules/scale/city-ops.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sitterId, auditorId, auditDate, score, notes } = body;

    const audit = await recordSafetyAudit(sitterId, auditorId, new Date(auditDate), score, notes);

    return NextResponse.json(audit, { status: 201 });
  } catch (error: any) {
    if (error instanceof ScaleError) {
      return NextResponse.json({ error: error.code, message: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "internal_error", message: error.message }, { status: 500 });
  }
}
