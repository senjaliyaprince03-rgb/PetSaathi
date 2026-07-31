import { NextResponse } from "next/server";
import { enrollMember, verifyMembership } from "@/modules/b2b/membership.service";
import { B2bError } from "@/modules/b2b/contract.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, membershipId, programmeId, customerId, verificationMethod } = body;

    // Handle verification
    if (action === "VERIFY" && membershipId) {
      const membership = await verifyMembership(membershipId);
      return NextResponse.json(membership);
    }

    // Default to enrollment
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
