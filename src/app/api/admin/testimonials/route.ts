import { NextResponse } from "next/server";
import { recordConsent, publishTestimonial } from "@/modules/content/testimonial.service";

export async function POST(req: Request) {
  try {
    const adminId = req.headers.get("x-user-id");
    // Ensure admin role check here in real code
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const body = await req.json();

    if (action === "consent") {
      const { userId, scope, evidenceRef } = body;
      if (!userId || !scope || !evidenceRef) {
        return NextResponse.json({ error: "bad_request", message: "Missing required fields" }, { status: 400 });
      }

      const consent = await recordConsent(userId, scope, evidenceRef);
      return NextResponse.json({ consent }, { status: 201 });
    } 
    
    if (action === "publish") {
      const { consentId, displayName, quote, context, city, bookingId } = body;
      if (!consentId || !displayName || !quote) {
        return NextResponse.json({ error: "bad_request", message: "Missing required fields" }, { status: 400 });
      }

      const testimonial = await publishTestimonial(consentId, displayName, quote, context, city, bookingId);
      return NextResponse.json({ testimonial }, { status: 201 });
    }

    return NextResponse.json({ error: "bad_request", message: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    if (error.code === "user_not_found" || error.code === "consent_not_found") {
      return NextResponse.json({ error: "not_found", message: error.message }, { status: 404 });
    }
    if (error.code === "consent_invalid") {
      return NextResponse.json({ error: "bad_request", message: error.message }, { status: 400 });
    }
    console.error("Error in POST testimonial API:", error);
    return NextResponse.json(
      { error: "internal_error", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
