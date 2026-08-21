import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export async function GET(request: Request, props: { params: Promise<{ orderId: string }> }) {
  const params = await props.params;
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const order = await prisma.partnerOrder.findFirst({
    where: {
      id: params.orderId,
      customerId: identity.id,
      status: "COMPLETED",
      partnerService: {
        serviceCode: "GROOMING_HOME",
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "report_not_found", message: "Grooming report not found or order not completed." }, { status: 404 });
  }

  const metadata = order.metadata as Record<string, any> || {};
  const report = metadata.report || null;

  if (!report) {
    return NextResponse.json({ error: "report_not_available", message: "The grooming report is not yet available for this session." }, { status: 404 });
  }

  return NextResponse.json({ report });
}
