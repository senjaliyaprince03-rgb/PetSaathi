import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

const inputSchema = z.object({
  name: z.string().trim().min(3).max(100),
  slug: z.string().trim().min(3).max(50).regex(/^[a-z0-9-]+$/),
  city: z.string().trim().min(2).max(50),
  locality: z.string().trim().min(2).max(100),
  address: z.string().trim().optional(),
  partnershipModel: z.string().trim().max(80).optional(),
  bookingCap: z.number().int().min(0).max(100_000).optional(),
  status: z.enum(["PILOT", "ACTIVE", "PAUSED", "INACTIVE"]).default("PILOT"),
  contactName: z.string().trim().optional(),
  contactPhone: z.string().trim().optional(),
  managerEmail: z.string().email().optional(), // Used to assign the manager
});

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SUPER_ADMIN", "OPERATIONS_ADMIN"])) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  }

  const { name, slug, city, locality, address, partnershipModel, bookingCap, status, contactName, contactPhone, managerEmail } = parsed.data;

  // Ensure slug is unique
  const existing = await prisma.society.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "slug_taken" }, { status: 409 });
  }

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create the Society
    const society = await tx.society.create({
      data: {
        name,
        slug,
        city,
        locality,
        address,
        partnershipModel,
        bookingCap,
        status,
        contactName,
        contactPhone,
        pilotStartsAt: new Date(),
        pilotEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days pilot
      },
    });

    // 2. Assign Manager if provided
    if (managerEmail) {
      const managerUser = await tx.user.findUnique({ where: { email: managerEmail }, include: { roles: true } });
      if (managerUser) {
        // Ensure they have the SOCIETY_MANAGER role
        if (!managerUser.roles.some(r => r.role === "SOCIETY_MANAGER")) {
          await tx.userRole.create({
            data: { userId: managerUser.id, role: "SOCIETY_MANAGER" }
          });
        }
        // Link them to the society
        await tx.societyMember.create({
          data: {
            societyId: society.id,
            userId: managerUser.id,
            status: "ACTIVE",
          },
        });
      }
    }

    // 3. Audit Log
    await tx.auditLog.create({
      data: {
        actorId: identity.id,
        actorRole: identity.roles.includes("SUPER_ADMIN") ? "SUPER_ADMIN" : "OPERATIONS_ADMIN",
        action: "society.created",
        resourceType: "society",
        resourceId: society.id,
        after: { name, slug, city, status },
      },
    });

    return society;
  });

  return NextResponse.json({ society: result }, { status: 201 });
}
