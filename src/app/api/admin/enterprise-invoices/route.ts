import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import { createInvoice, listInvoices } from "@/modules/b2b/invoicing";
import type { InvoiceStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.some((r) => ["PARTNER_MANAGER", "FINANCE_ADMIN", "SUPER_ADMIN"].includes(r))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const organizationId = url.searchParams.get("organizationId") ?? undefined;
  const status = url.searchParams.get("status") as InvoiceStatus | undefined;
  const overdue = url.searchParams.get("overdue") === "true";
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") ?? "20", 10);

  const result = await listInvoices({ organizationId, status, overdue, page, pageSize });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.some((r) => ["PARTNER_MANAGER", "FINANCE_ADMIN", "SUPER_ADMIN"].includes(r))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();

  try {
    const invoice = await createInvoice({
      organizationId: body.organizationId,
      contractId: body.contractId,
      supplierGstin: body.supplierGstin,
      customerGstin: body.customerGstin,
      placeOfSupply: body.placeOfSupply,
      billingAddress: body.billingAddress,
      serviceAddress: body.serviceAddress,
      sacCode: body.sacCode,
      taxableValuePaise: body.taxableValuePaise,
      supplierState: body.supplierState,
      gstRateBps: body.gstRateBps,
      dueDate: new Date(body.dueDate),
      poReference: body.poReference,
      notes: body.notes,
    });
    return NextResponse.json(invoice, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invoice creation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
