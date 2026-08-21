import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

const schema = z.object({
  serviceType: z.enum(["WORKSHOP", "INDIVIDUAL", "PROGRAMME"]),
  workshopType: z.string().optional(),
  petId: z.string().uuid(),
  goals: z.string().min(3),
  concerns: z.string().optional(),
  scheduledAt: z.coerce.date().min(new Date()).optional(),
});

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });

  const partnerService = await prisma.partnerService.findFirst({
    where: { serviceCode: "TRAINING_ASSESSMENT", status: "ACTIVE" },
  });

  if (!partnerService) {
    return NextResponse.json({ error: "service_unavailable", message: "Training services are currently unavailable." }, { status: 503 });
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
      instructions: `Goals: ${parsed.data.goals}\nConcerns: ${parsed.data.concerns || 'None'}`,
      metadata: {
        serviceType: parsed.data.serviceType,
        workshopType: parsed.data.workshopType,
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
      partnerService: { serviceCode: "TRAINING_ASSESSMENT" }
    },
    orderBy: { createdAt: "desc" },
    include: {
      pet: { select: { name: true } },
      partnerService: { include: { partner: { select: { displayName: true } } } }
    },
  });

  return NextResponse.json({ orders });
}
