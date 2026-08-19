import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

const ruleSchema = z.object({
  weekday: z.number().min(0).max(6),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  active: z.boolean().default(true),
});

const availabilitySchema = z.object({
  rules: z.array(ruleSchema),
});

export async function GET(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const sitter = await prisma.sitterProfile.findUnique({
    where: { userId: identity.id },
    select: { id: true },
  });

  if (!sitter) {
    return NextResponse.json({ rules: [] });
  }

  try {
    const rules = await prisma.availabilityRule.findMany({
      where: { sitterId: sitter.id },
      orderBy: { weekday: "asc" }
    });
    return NextResponse.json({ rules });
  } catch (error) {
    console.error("[Availability GET]", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const sitter = await prisma.sitterProfile.findUnique({
    where: { userId: identity.id },
    select: { id: true },
  });

  if (!sitter) {
    return NextResponse.json({ error: "sitter_not_found" }, { status: 404 });
  }

  try {
    const json = await request.json();
    const parsed = availabilitySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_input", details: parsed.error.issues }, { status: 400 });
    }

    // Wrap in a transaction to replace old rules
    await prisma.$transaction(async (tx) => {
      await tx.availabilityRule.deleteMany({
        where: { sitterId: sitter.id }
      });

      if (parsed.data.rules.length > 0) {
        await tx.availabilityRule.createMany({
          data: parsed.data.rules.map(rule => ({
            sitterId: sitter.id,
            weekday: rule.weekday,
            startTime: rule.startTime,
            endTime: rule.endTime,
            active: rule.active,
          }))
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Availability PUT]", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
