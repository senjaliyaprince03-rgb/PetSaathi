import { NextResponse } from "next/server";
import { z } from "zod";
import { requestCommunityJoin } from "@/modules/marketing/community";

const schema = z.object({
  email: z.string().email().optional(),
  phoneE164: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  groupSlug: z.string().min(1),
  source: z.string().optional(),
}).refine(data => data.email || data.phoneE164, {
  message: "Either email or phone is required",
  path: ["email"],
});

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

    const data = parsed.data;
    const membership = await requestCommunityJoin(data.groupSlug, {
      email: data.email,
      phoneE164: data.phoneE164,
      firstName: data.firstName,
      lastName: data.lastName,
      source: data.source ?? "COMMUNITY_JOIN",
    });
    
    return NextResponse.json({ id: membership.id, status: membership.status }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: "NOT_FOUND", message: "Group not found" }, { status: 404 });
    }
    console.error("Community join error:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
