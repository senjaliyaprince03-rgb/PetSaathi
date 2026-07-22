import { NextResponse } from "next/server";
import { z } from "zod";
import { submitEnquiry } from "@/modules/marketing/crm";
import { LeadType } from "@prisma/client";

const schema = z.object({
  email: z.string().email().optional(),
  phoneE164: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  type: z.nativeEnum(LeadType),
  notes: z.string().optional(),
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

    const lead = await submitEnquiry(parsed.data);
    return NextResponse.json({ id: lead.id, status: "success" }, { status: 201 });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
