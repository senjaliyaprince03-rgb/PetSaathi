import { NextRequest, NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";
import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { consumeKycState, KYC_STATE_COOKIE } from "@/modules/auth/kyc-state";

export async function GET(request: NextRequest) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const sitter = await prisma.sitterProfile.findUnique({ where: { userId: identity.id }, select: { id: true } });
  if (!sitter) return NextResponse.json({ error: "sitter_not_found" }, { status: 404 });
  const state = request.nextUrl.searchParams.get("state");
  if (!await consumeKycState(state, request.cookies.get(KYC_STATE_COOKIE)?.value, identity.id, sitter.id)) return NextResponse.json({ error: "invalid_or_replayed_state" }, { status: 400 });
  const redirect = (status: string) => {
    const response = NextResponse.redirect(new URL("/saathi?verification=" + status, request.url));
    response.cookies.set(KYC_STATE_COOKIE, "", { path: "/api/kyc/digilocker", maxAge: 0 });
    return response;
  };
  const code = request.nextUrl.searchParams.get("code");
  if (!code || request.nextUrl.searchParams.has("error")) return redirect("cancelled");
  const { DIGILOCKER_CLIENT_ID: clientId, DIGILOCKER_CLIENT_SECRET: clientSecret, DIGILOCKER_REDIRECT_URI: redirectUri } = process.env;
  if (!clientId || !clientSecret || !redirectUri) return redirect("unavailable");
  try {
    const tokenResponse = await fetch("https://api.digitallocker.gov.in/public/oauth2/1/token", { method: "POST", signal: AbortSignal.timeout(10_000), headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, grant_type: "authorization_code", client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri }) });
    if (!tokenResponse.ok) throw new Error("token_failed");
    const token = await tokenResponse.json();
    if (typeof token.access_token !== "string") throw new Error("token_missing");
    const document = await fetch("https://api.digitallocker.gov.in/public/oauth2/1/xml/ADHAR", { signal: AbortSignal.timeout(10_000), headers: { Authorization: "Bearer " + token.access_token } });
    if (!document.ok) throw new Error("document_failed");
    const xml = await document.text();
    if (xml.length > 1_000_000 || /<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error("invalid_document");
    const parsed = await parseStringPromise(xml, { explicitArray: false });
    const data = parsed?.UidData ?? parsed?.UIDData ?? parsed?.Certificate?.CertificateData?.KycRes?.UidData;
    const uid = data?.$?.uid ?? data?.uid;
    const name = data?.Poi?.$?.name ?? data?.$?.name ?? data?.name;
    if (typeof uid !== "string" || !/^[0-9]{12}$/.test(uid) || typeof name !== "string" || name.trim().length < 2) throw new Error("identity_missing");
    await prisma.$transaction(async tx => {
      const changed = await tx.sitterVerification.updateMany({ where: { sitterId: sitter.id, type: "AADHAAR" }, data: { status: "PASSED", checkedAt: new Date(), provider: "DIGILOCKER", evidencePath: "DigiLocker authenticated identity document", publicLabel: "XXXX-XXXX-" + uid.slice(-4) } });
      if (changed.count !== 1) throw new Error("verification_record_missing");
      await tx.auditLog.create({ data: { actorId: identity.id, actorRole: "SITTER", action: "verification.digilocker_received", resourceType: "sitter", resourceId: sitter.id, after: { provider: "DIGILOCKER", identityParsed: true } } });
    });
    return redirect("verified");
  } catch { return redirect("failed"); }
}
