import { NextRequest, NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";

const DIGILOCKER_AUTH_URL = "https://api.digitallocker.gov.in/public/oauth2/1/authorize";

export async function GET(request: NextRequest) {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // State = base64(userId:timestamp) — prevents CSRF
  const state = Buffer.from(`${identity.id}:${Date.now()}`).toString("base64");

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