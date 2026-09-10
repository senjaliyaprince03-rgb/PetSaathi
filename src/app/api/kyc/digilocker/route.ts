import { NextRequest, NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";

const DIGILOCKER_AUTH_URL = "https://api.digitallocker.gov.in/public/oauth2/1/authorize";

export async function GET(request: NextRequest) {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // State = base64(userId:timestamp) — prevents CSRF
  const state = Buffer.from(`${identity.id}:${Date.now()}`).toString("base64");

  if (!process.env.DIGILOCKER_CLIENT_ID || !process.env.DIGILOCKER_REDIRECT_URI) {
    return NextResponse.json({ error: "digilocker_not_configured", message: "DigiLocker is not configured in the environment variables." }, { status: 503 });
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.DIGILOCKER_CLIENT_ID!,
    redirect_uri: process.env.DIGILOCKER_REDIRECT_URI!,
    state,
    // Request Aadhaar document specifically
    dl_id: "ADHAR",
  });

  // Redirect user to DigiLocker consent page
  return NextResponse.redirect(`${DIGILOCKER_AUTH_URL}?${params.toString()}`);
}