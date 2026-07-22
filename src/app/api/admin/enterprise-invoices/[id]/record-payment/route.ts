import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import { recordPayment } from "@/modules/b2b/invoicing";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.some((r) => ["FINANCE_ADMIN", "SUPER_ADMIN"].includes(r))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();

  if (!body.amountPaise || typeof body.amountPaise !== "number") {
    return NextResponse.json({ error: "amountPaise is required" }, { status: 400 });
  }

  try {
    const invoice = await recordPayment(id, body.amountPaise);
    return NextResponse.json(invoice);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Payment recording failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
