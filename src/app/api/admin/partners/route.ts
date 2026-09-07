import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

const createSchema = z.object({
  legalName: z.string().min(2),
  displayName: z.string().min(2),
  slug: z.string().optional(),
  category: z.string().min(2),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
});

export async function GET(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["OPERATIONS_ADMIN", "SUPER_ADMIN"])) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const where: any = {};
  if (category) where.category = category;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { legalName: { contains: search, mode: "insensitive" } },
      { displayName: { contains: search, mode: "insensitive" } },
      { contactEmail: { contains: search, mode: "insensitive" } },
    ];
  }

  const partners = await prisma.partner.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { verifications: true, services: true },
      },
    },
  });

  return NextResponse.json({ partners });
}

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["OPERATIONS_ADMIN", "SUPER_ADMIN"])) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const json = await request.json().catch(() => ({}));
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  }

  const { legalName, displayName, category, contactEmail, contactPhone } = parsed.data;
  
  let slug = parsed.data.slug;
  if (!slug) {
    slug = displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const suffix = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    slug = `${slug}-${suffix}`;
  }

  try {
    const partner = await prisma.partner.create({
      data: {
        legalName,
        displayName,
        slug,
        category,
        contactEmail,
        contactPhone,
        status: "DRAFT",
      },
    });

    // Dual-shape payload: flat fields (id/status/…) for direct consumers,
    // plus the nested `partner` key for callers following the collection
    // convention used by GET.
    return NextResponse.json({ ...partner, partner }, { status: 201 });
  } catch (error) {
    console.error("[PARTNER_CREATE_ERROR]", error);
    return NextResponse.json({ error: "failed_to_create_partner" }, { status: 500 });
  }
}
