import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import { getContract, activateContract, terminateContract } from "@/modules/b2b/contracts";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.some((r) => ["PARTNER_MANAGER", "FINANCE_ADMIN", "SUPER_ADMIN"].includes(r))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const contract = await getContract(id);
  if (!contract) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(contract);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.some((r) => ["PARTNER_MANAGER", "SUPER_ADMIN"].includes(r))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();

  try {
    if (body.action === "activate") {
      const result = await activateContract(id);
      return NextResponse.json(result);
    }
    if (body.action === "terminate") {
      const result = await terminateContract(id, body.reason);
      return NextResponse.json(result);
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Action failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
