import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertContact, recordLeadMagnetRequest } from "@/modules/marketing/crm";

const schema = z.object({
  email: z.string().email().optional(),
  phoneE164: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  magnetSlug: z.string().min(1),
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
    const contact = await upsertContact({
      email: data.email,
      phoneE164: data.phoneE164,
      firstName: data.firstName,
      lastName: data.lastName,
      source: data.source ?? "LEAD_MAGNET",
    });

    const requestRecord = await recordLeadMagnetRequest(contact.id, data.magnetSlug);
    
    return NextResponse.json({ id: requestRecord.id, status: "success" }, { status: 201 });
  } catch (error) {
    console.error("Lead magnet error:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
