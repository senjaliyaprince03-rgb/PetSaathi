import { NextResponse } from "next/server";
import { z } from "zod";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { submitTestimonial } from "@/modules/marketing/testimonials";

const schema = z.object({
  contact: z.object({
    email: z.string().email().optional(),
    phoneE164: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }).refine(data => data.email || data.phoneE164, {
    message: "Either email or phone is required",
    path: ["email"],
  }),
  story: z.string().min(10, "Story is too short"),
  rating: z.number().min(1).max(5),
  consentLevel: z.enum(["TEXT_ONLY", "FIRST_NAME_CITY", "PET_PHOTO", "FULL_MARKETING"]),
  bookingId: z.string().optional(),
});

export async function GET() {
  if (!isDatabaseConfigured()) return NextResponse.json({ stories: [], enabled: false });

  try {
    const flag = await prisma.featureFlag.findUnique({
      where: { key: "public_testimonials" },
      select: { enabled: true },
    });
    if (!flag?.enabled) return NextResponse.json({ stories: [], enabled: false });

    const now = new Date();
    const stories = await prisma.testimonial.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { not: null },
        consent: {
          grantedAt: { lte: now },
          withdrawnAt: null,
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        },
      },
      orderBy: { publishedAt: "desc" },
      take: 8,
      select: {
        id: true,
        displayName: true,
        quote: true,
        context: true,
        city: true,
      },
    });

    return NextResponse.json({ stories, enabled: true });
  } catch {
    return NextResponse.json({ stories: [], enabled: false, degraded: true });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", issues: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const testimonial = await submitTestimonial(parsed.data);
    return NextResponse.json({ id: testimonial.id, status: "success" }, { status: 201 });
  } catch (error) {
    console.error("Testimonial submission error:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
