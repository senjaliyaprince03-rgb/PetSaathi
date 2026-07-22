import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import { changeStage } from "@/modules/b2b/pipeline";
import type { OpportunityStage } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.some((r) => ["PARTNER_MANAGER", "SUPER_ADMIN"].includes(r))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();

  try {
    const updated = await changeStage(id, body.newStage as OpportunityStage, {
      lossReason: body.lossReason,
      nextAction: body.nextAction,
      nextActionAt: body.nextActionAt ? new Date(body.nextActionAt) : undefined,
      notes: body.notes,
    });
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stage change failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
