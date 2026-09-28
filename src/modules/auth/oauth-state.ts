import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { getAuthSecret } from "@/lib/auth-secret";

export type OAuthStatePayload = {
  nonce: string;
  role: string;
  returnTo: string;
  ts: number;
};

const OAUTH_STATE_MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes

export function sanitizeReturnUrl(url?: string | null): string {
  if (!url || typeof url !== "string") {
    return "/dashboard";
  }
  const trimmed = url.trim();
  // Must start with a single slash and not followed by another slash or backslash
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return "/dashboard";
  }
  // Disallow CRLF or control characters
  if (/[\r\n\0]/.test(trimmed)) {
    return "/dashboard";
  }
  return trimmed;
}

export function createOAuthState(role = "CUSTOMER", returnTo = "/dashboard") {
  const nonce = randomBytes(24).toString("base64url");
  const sanitizedRole = role === "SITTER" ? "SITTER" : "CUSTOMER";
  const sanitizedReturnTo = sanitizeReturnUrl(returnTo);
  const ts = Date.now();

  const payload: OAuthStatePayload = {
    nonce,
    role: sanitizedRole,
    returnTo: sanitizedReturnTo,
    ts,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", getAuthSecret())
    .update(payloadBase64)
    .digest("base64url");

  const stateToken = `${payloadBase64}.${signature}`;

  return { stateToken, nonce };
}

export function verifyOAuthState(stateToken: string, expectedNonce?: string | null): OAuthStatePayload | null {
  if (!stateToken || typeof stateToken !== "string" || !expectedNonce) {
    return null;
  }

  const parts = stateToken.split(".");
  if (parts.length !== 2) {
    return null;
  }

  const [payloadBase64, signature] = parts;
  if (!payloadBase64 || !signature) {
    return null;
  }

  const expectedSig = createHmac("sha256", getAuthSecret())
    .update(payloadBase64)
    .digest("base64url");

  const sigBuf = Buffer.from(signature, "base64url");
  const expBuf = Buffer.from(expectedSig, "base64url");

  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const payload: OAuthStatePayload = JSON.parse(
      Buffer.from(payloadBase64, "base64url").toString("utf-8")
    );

    // Verify nonce matches cookie
    const nonceBuf = Buffer.from(payload.nonce);
    const expNonceBuf = Buffer.from(expectedNonce);
    if (nonceBuf.length !== expNonceBuf.length || !timingSafeEqual(nonceBuf, expNonceBuf)) {
      return null;
    }

    // Verify expiry (10 minutes)
    if (Date.now() - payload.ts > OAUTH_STATE_MAX_AGE_MS || payload.ts > Date.now() + 60_000) {
      return null;
    }

    return {
      nonce: payload.nonce,
      role: payload.role === "SITTER" ? "SITTER" : "CUSTOMER",
      returnTo: sanitizeReturnUrl(payload.returnTo),
      ts: payload.ts,
    };
  } catch {
    return null;
  }
}
