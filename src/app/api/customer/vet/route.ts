import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

const schema = z.object({
  petId: z.string().uuid(),
  urgency: z.enum(["RED", "AMBER", "GREEN"]),
  symptoms: z.string().trim().min(5),
  consultationMode: z.enum(["ONLINE", "HOME_VISIT", "CLINIC_REFERRAL"]),
  scheduledAt: z.coerce.date().min(new Date()).optional(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });

  if (parsed.data.urgency === "RED") {
    return NextResponse.json({ error: "not_supported", message: "Emergency cases cannot be booked online." }, { status: 400 });
  }

  // Find a vet support partner service
  const partnerService = await prisma.partnerService.findFirst({
    where: { serviceCode: "VET_SUPPORT", status: "ACTIVE" },
  });

  if (!partnerService) {
    return NextResponse.json({ error: "service_unavailable", message: "Vet support is currently unavailable." }, { status: 503 });
  }

  const reference = `PO-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const order = await prisma.partnerOrder.create({
    data: {
      reference,
      partnerServiceId: partnerService.id,
      customerId: identity.id,
      petId: parsed.data.petId,
      status: "REQUESTED",
      scheduledAt: parsed.data.scheduledAt,
      instructions: parsed.data.symptoms,
      metadata: {
        urgency: parsed.data.urgency,
        consultationMode: parsed.data.consultationMode,
        notes: parsed.data.notes,
      },
    },
  });

  return NextResponse.json({ order: { id: order.id, reference: order.reference, status: order.status } }, { status: 201 });
}

export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const orders = await prisma.partnerOrder.findMany({
    where: { 
      customerId: identity.id,
      partnerService: { serviceCode: "VET_SUPPORT" }
    },
    orderBy: { createdAt: "desc" },
    include: {
      pet: { select: { name: true } },
      partnerService: { include: { partner: { select: { displayName: true } } } }
    },
  });

  return NextResponse.json({ orders });
}
