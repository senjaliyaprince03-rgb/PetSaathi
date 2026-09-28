import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { enrollMember, verifyMembership } from "@/modules/b2b/membership.service";
import { B2bError } from "@/modules/b2b/contract.service";

export async function POST(req: Request) {
  try {
    const identity = await getCurrentIdentity();
    if (!identity) {
      return NextResponse.json(
        { error: "unauthorized", message: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { action, membershipId, programmeId, customerId, verificationMethod } = body;

    const isCentralAdmin = identity.roles.some((r) =>
      ["SUPER_ADMIN", "OPERATIONS_ADMIN"].includes(r)
    );
    const isPartnerManager = identity.roles.includes("PARTNER_MANAGER");

    // Handle verification
    if (action === "VERIFY") {
      if (!membershipId) {
        return NextResponse.json(
          { error: "invalid_request", message: "membershipId is required" },
          { status: 400 }
        );
      }

      const membership = await prisma.programmeMembership.findUnique({
        where: { id: membershipId },
        include: {
          programme: {
            include: { organization: true },
          },
        },
      });

      if (!membership) {
        return NextResponse.json(
          { error: "not_found", message: "Membership not found" },
          { status: 404 }
        );
      }

      if (!isCentralAdmin && !isPartnerManager) {
        const isOrgOwner = membership.programme.organization.accountOwnerId === identity.id;
        const isProgManager = membership.programme.accountManagerId === identity.id;
        if (!isOrgOwner && !isProgManager) {
          return NextResponse.json(
            { error: "forbidden", message: "Access denied: cannot verify memberships for this programme" },
            { status: 403 }
          );
        }
      }

      const verified = await verifyMembership(membershipId);
      return NextResponse.json(verified);
    }

    // Default to enrollment
    if (!programmeId || !customerId || !verificationMethod) {
      return NextResponse.json(
        { error: "invalid_request", message: "programmeId, customerId, and verificationMethod are required" },
        { status: 400 }
      );
    }

    // Customer can only enroll themselves unless they are admin/manager
    if (customerId !== identity.id && !isCentralAdmin && !isPartnerManager) {
      const programme = await prisma.partnerProgramme.findUnique({
        where: { id: programmeId },
        include: { organization: true },
      });

      if (!programme) {
        return NextResponse.json(
          { error: "not_found", message: "Partner programme not found" },
          { status: 404 }
        );
      }

      const isOrgOwner = programme.organization.accountOwnerId === identity.id;
      const isProgManager = programme.accountManagerId === identity.id;
      if (!isOrgOwner && !isProgManager) {
        return NextResponse.json(
          { error: "forbidden", message: "Access denied: cannot enroll other users into this programme" },
          { status: 403 }
        );
      }
    }

    const membership = await enrollMember(
      programmeId,
      customerId,
      verificationMethod
    );

    return NextResponse.json(membership, { status: 201 });
  } catch (error: any) {
    if (error instanceof B2bError) {
      return NextResponse.json({ error: error.code, message: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "internal_error", message: error.message }, { status: 500 });
  }
}
