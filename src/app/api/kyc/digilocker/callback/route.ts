import { NextRequest, NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";
import { prisma } from "@/lib/db";

const TOKEN_URL = "https://api.digitallocker.gov.in/public/oauth2/1/token";
const AADHAAR_URL = "https://api.digitallocker.gov.in/public/oauth2/1/xml/ADHAR";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (!process.env.DIGILOCKER_CLIENT_ID || !process.env.DIGILOCKER_CLIENT_SECRET || !process.env.DIGILOCKER_REDIRECT_URI) {
    return NextResponse.json({ error: "digilocker_not_configured", message: "DigiLocker is not configured in the environment variables." }, { status: 503 });
  }

  if (error || !code || !state) {
    // Redirect to verification page with error message
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/saathi/verification?error=digilocker_failed`
    );
  }

  // Decode state to get userId
  const [userId] = Buffer.from(state, "base64").toString().split(":");

  // Exchange authorization code for access token
  const tokenResponse = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      client_id: process.env.DIGILOCKER_CLIENT_ID!,
      client_secret: process.env.DIGILOCKER_CLIENT_SECRET!,
      redirect_uri: process.env.DIGILOCKER_REDIRECT_URI!,
    }),
  });

  const tokens = await tokenResponse.json();
  if (!tokens.access_token) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/saathi/verification?error=token_failed`
    );
  }

  // Fetch Aadhaar XML data using the access token
  const aadhaarResponse = await fetch(AADHAAR_URL, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  const aadhaarXml = await aadhaarResponse.text();

  // Parse XML using xml2js for reliable extraction
  const parsed = await parseStringPromise(aadhaarXml, { explicitArray: false });
  const aadhaarData = parsed?.UIDData ?? parsed?.Aadhaar ?? parsed;
  const aadhaarNumber = aadhaarData?.uid ?? aadhaarData?.UID ?? null;
  const aadhaarName = aadhaarData?.name ?? aadhaarData?.Name ?? null;

  // Store verification result in SitterVerification record
  await prisma.sitterVerification.updateMany({
    where: {
      sitterId: userId,
      type: "AADHAAR",
    },
    data: {
      status: "PASSED",
      checkedAt: new Date(),
      evidencePath: aadhaarName ?? "DigiLocker verified",
      provider: "DIGILOCKER",
      // Store masked Aadhaar (last 4 digits only) in publicLabel for compliance
      publicLabel: aadhaarNumber ? `XXXX-XXXX-${String(aadhaarNumber).slice(-4)}` : "DigiLocker verified",
    },
  });

  // Redirect to success page
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/saathi/verification?success=aadhaar_verified`
  );
}