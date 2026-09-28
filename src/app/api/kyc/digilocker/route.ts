import { NextRequest, NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import { prisma } from "@/lib/db";
import { createKycState, KYC_STATE_COOKIE } from "@/modules/auth/kyc-state";

export async function GET(request: NextRequest) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const sitter = await prisma.sitterProfile.findUnique({ where: { userId: identity.id }, select: { id: true } });
  if (!sitter) return NextResponse.json({ error: "sitter_not_found" }, { status: 404 });
  if (!process.env.DIGILOCKER_CLIENT_ID || !process.env.DIGILOCKER_REDIRECT_URI) return NextResponse.json({ error: "digilocker_not_configured" }, { status: 503 });
  const state = await createKycState(identity.id, sitter.id);
  const params = new URLSearchParams({ response_type: "code", client_id: process.env.DIGILOCKER_CLIENT_ID, redirect_uri: process.env.DIGILOCKER_REDIRECT_URI, state, dl_id: "ADHAR" });
  const response = NextResponse.redirect("https://api.digitallocker.gov.in/public/oauth2/1/authorize?" + params);
  response.cookies.set(KYC_STATE_COOKIE, state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/api/kyc/digilocker", maxAge: 600 });
  return response;
}
