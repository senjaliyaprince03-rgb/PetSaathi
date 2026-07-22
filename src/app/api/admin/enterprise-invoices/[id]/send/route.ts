import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import { sendInvoice } from "@/modules/b2b/invoicing";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.some((r) => ["PARTNER_MANAGER", "FINANCE_ADMIN", "SUPER_ADMIN"].includes(r))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;

  try {
    const invoice = await sendInvoice(id);
    return NextResponse.json(invoice);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Send failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
