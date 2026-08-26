import "server-only";

// NOTE: intentionally free of node:* imports — this module is imported by
// src/middleware.ts, which compiles for the Next.js edge runtime.

export const AUTH_SECRET_MIN_LENGTH = 32;

/**
 * Single source of truth for the authentication signing secret.
 *
 * Resolution order:
 *   1. NEXTAUTH_SECRET (preferred, next-auth v4 native variable)
 *   2. AUTH_SECRET     (accepted alias — the Mongo auth module and existing
 *                       deployments already provision this value)
 *
 * There is deliberately NO fallback value: a missing secret throws a clear
 * configuration error in every environment. A known default string would let
 * anyone forge session JWTs and OTP challenge HMACs, so the process refuses
 * to boot without a real secret instead.
 *
 * Both NextAuth (lib/auth), the edge middleware (getToken) and the Mongo auth
 * module (challenge/session HMACs) MUST resolve the same value, otherwise
 * RBAC checks silently fail while sessions still validate. Importing this
 * helper everywhere guarantees they agree.
 */
export function getAuthSecret(): string {
  const nextauthSecret = process.env.NEXTAUTH_SECRET?.trim();
  if (nextauthSecret && nextauthSecret.length >= AUTH_SECRET_MIN_LENGTH) {
    return nextauthSecret;
  }

  const authSecret = process.env.AUTH_SECRET?.trim();
  if (authSecret && authSecret.length >= AUTH_SECRET_MIN_LENGTH) {
    return authSecret;
  }

  const provided = nextauthSecret ?? authSecret;
  throw new Error(
    provided
      ? `Authentication secret is too weak: it must contain at least ${AUTH_SECRET_MIN_LENGTH} characters. Generate one with \`openssl rand -base64 32\` and set NEXTAUTH_SECRET.`
      : "Authentication secret is not configured. Set NEXTAUTH_SECRET (or the legacy AUTH_SECRET alias) to a strong value: `openssl rand -base64 32`. Refusing to sign sessions with an unknown default.",
  );
}
