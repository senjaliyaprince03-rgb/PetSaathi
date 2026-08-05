import { NextResponse } from "next/server";
import { recordSafetyAudit } from "@/modules/scale/safety.service";
import { ScaleError } from "@/modules/scale/city-ops.service";
import { authorizeApi } from "@/modules/auth/authorization";
import { z } from "zod";

const allowedRoles = ["SAFETY_ADMIN", "OPERATIONS_ADMIN", "SUPER_ADMIN"] as const;
const auditSchema = z.object({
  sitterId: z.string().uuid(),
  auditDate: z.coerce.date(),
  score: z.number().min(0).max(100),
  notes: z.string().max(2000).optional(),
});

export async function POST(req: Request) {
  const authorization = await authorizeApi(allowedRoles);
  if (!authorization.authorized) return authorization.response;

  try {
    const parsed = auditSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "invalid_data", details: parsed.error.issues }, { status: 422 });
    const { sitterId, auditDate, score, notes } = parsed.data;

    const audit = await recordSafetyAudit(sitterId, authorization.identity.id, auditDate, score, notes);

    return NextResponse.json(audit, { status: 201 });
  } catch (error: any) {
    if (error instanceof ScaleError) {
      return NextResponse.json({ error: error.code, message: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "internal_error", message: error.message }, { status: 500 });
  }
}
