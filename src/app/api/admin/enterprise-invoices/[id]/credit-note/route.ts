import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import { issueCreditNote } from "@/modules/b2b/invoicing";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.some((r) => ["FINANCE_ADMIN", "SUPER_ADMIN"].includes(r))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();

  try {
    const creditNote = await issueCreditNote(id, body.reason);
    return NextResponse.json(creditNote, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Credit note generation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
