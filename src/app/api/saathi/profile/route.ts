import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

const profileSchema = z.object({
  bio: z.string().max(1000).optional().nullable(),
  yearsExperience: z.number().min(0).max(50),
  serviceLocality: z.string().max(100).optional().nullable(),
  serviceRadiusKm: z.number().min(1).max(100),
});

export async function GET(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  
  try {
    const profile = await prisma.sitterProfile.findUnique({
      where: { userId: identity.id }
    });
    
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("[SitterProfile GET]", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    const json = await request.json();
    const parsed = profileSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_input", details: parsed.error.issues }, { status: 400 });
    }

    const data = parsed.data;
    
    // Update or create SitterProfile if it doesn't exist
    const updatedSitter = await prisma.sitterProfile.upsert({
      where: { userId: identity.id },
      update: {
        bio: data.bio,
        yearsExperience: data.yearsExperience,
        serviceLocality: data.serviceLocality,
        serviceRadiusKm: data.serviceRadiusKm,
      },
      create: {
        userId: identity.id,
        bio: data.bio,
        yearsExperience: data.yearsExperience,
        serviceLocality: data.serviceLocality,
        serviceRadiusKm: data.serviceRadiusKm,
        status: "APPLICANT",
      }
    });

    return NextResponse.json({ success: true, profile: updatedSitter });
  } catch (error) {
    console.error("[SitterProfile PUT]", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
