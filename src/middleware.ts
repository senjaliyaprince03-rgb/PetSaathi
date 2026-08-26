import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { isTrustedBrowserMutation } from "@/modules/security/origin";
import { createMemoryRateLimiter } from "@/modules/security/memory-rate-limit";
import { getAuthSecret } from "@/lib/auth-secret";

const upstashConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
);

const ratelimit = upstashConfigured
  ? new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL as string,
        token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
      }),
      limiter: Ratelimit.slidingWindow(20, "10 s"),
      analytics: true,
    })
  : null;

// Bounded per-instance fallback so API abuse protection never silently
// disappears when Upstash is not configured.
const memoryRatelimit = createMemoryRateLimiter(20, 10_000, {
  onFirstUseWarn:
    "[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN not configured — using a per-instance in-memory limiter (20 req/10s per IP). Configure Upstash for shared multi-instance limits.",
});

export async function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  const requestId = crypto.randomUUID();
  headers.set("x-pathname", request.nextUrl.pathname);
  headers.set(
    "x-return-to",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  headers.set("x-request-id", requestId);

  const nonce = crypto.randomUUID();
  const cspHeader = `
    default-src 'self';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    object-src 'none';
    img-src 'self' blob: data: https://maps.googleapis.com https://*.tile.openstreetmap.org https://unpkg.com https://www.google-analytics.com https://www.google.com;
    font-src 'self' data: https://fonts.gstatic.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com;
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://checkout.razorpay.com https://accounts.google.com https://www.googletagmanager.com ${process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""};
    connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com https://www.google-analytics.com https://www.google.com https://accounts.google.com;
    frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://*.razorpay.com https://accounts.google.com https://*.google.com;
    ${process.env.NODE_ENV === "production" ? "upgrade-insecure-requests;" : ""}
  `.replace(/\s{2,}/g, " ").trim();

  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", cspHeader);

  const isProtectedApiMutation =
    request.nextUrl.pathname.startsWith("/api/") &&
    !request.nextUrl.pathname.startsWith("/api/webhooks/") &&
    !request.nextUrl.pathname.startsWith("/api/jobs/");

  if (request.nextUrl.pathname.startsWith("/api/") && process.env.PLAYWRIGHT_TEST !== "1") {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
    const { success, limit, reset, remaining } = upstashConfigured
      ? await ratelimit!.limit(`ratelimit_${ip}`)
      : await memoryRatelimit.limit(`ratelimit_${ip}`);
    if (!success) {
      const rejected = NextResponse.json(
        { error: "Too Many Requests" },
        { status: 429, headers: { "X-RateLimit-Limit": limit.toString(), "X-RateLimit-Remaining": remaining.toString(), "X-RateLimit-Reset": reset.toString() } }
      );
      applySecurityHeaders(rejected, cspHeader, requestId);
      return rejected;
    }
  }

  if (
    isProtectedApiMutation &&
    !isTrustedBrowserMutation(
      request.method,
      request.url,
      request.headers.get("origin"),
      request.headers,
    )
  ) {
    const rejected = NextResponse.json(
      { error: "untrusted_origin" },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
    applySecurityHeaders(rejected, cspHeader, requestId);
    return rejected;
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  const isSignedUpload = /^\/api\/uploads\/[0-9a-f-]+$/i.test(request.nextUrl.pathname);
  const payloadLimit = isSignedUpload ? 16 * 1024 * 1024 : 256 * 1024;
  if (
    isProtectedApiMutation &&
    Number.isFinite(contentLength) &&
    contentLength > payloadLimit
  ) {
    const rejected = NextResponse.json(
      { error: "payload_too_large" },
      { status: 413, headers: { "Cache-Control": "no-store" } },
    );
    applySecurityHeaders(rejected, cspHeader, requestId);
    return rejected;
  }

  const protectedPagePrefixes = [
    "/admin",
    "/addresses",
    "/bookings",
    "/customer",
    "/dashboard",
    "/notifications",
    "/operator",
    "/partners",
    "/pets",
    "/saathi",
    "/settings",
    "/society",
    "/support",
  ];
  
  const isNextAuthSession = request.cookies.has("next-auth.session-token") || request.cookies.has("__Secure-next-auth.session-token");
  const isLegacySession = request.cookies.has("petsaathi_session");
  const isAuthenticated = isNextAuthSession || isLegacySession;

  const isAdminApi = request.nextUrl.pathname.startsWith("/api/admin");
  if (isAdminApi && !isAuthenticated) {
    const rejected = NextResponse.json(
      { error: "unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
    applySecurityHeaders(rejected, cspHeader, requestId);
    return rejected;
  }

  const isProtectedPage =
    request.method === "GET" &&
    protectedPagePrefixes.some(
      (prefix) =>
        request.nextUrl.pathname === prefix ||
        request.nextUrl.pathname.startsWith(`${prefix}/`),
    );

  if (isProtectedPage && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set(
      "returnTo",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    const redirected = NextResponse.redirect(loginUrl);
    applySecurityHeaders(redirected, cspHeader, requestId);
    return redirected;
  }

  // RBAC checks
  if (isProtectedPage || isAdminApi) {
    const token = await getToken({ req: request as any, secret: getAuthSecret() });
    
    if (token) {
      const userRole = token.role as string;
      const path = request.nextUrl.pathname;

      if ((path.startsWith("/admin") || isAdminApi) && userRole !== "SUPER_ADMIN") {
        const url = request.nextUrl.clone();
        url.pathname = userRole === "SITTER" ? "/saathi/profile" : "/dashboard";
        return NextResponse.redirect(url);
      }

      if (path.startsWith("/dashboard") && userRole !== "CUSTOMER" && userRole !== "SUPER_ADMIN") {
         const url = request.nextUrl.clone();
         url.pathname = "/saathi/profile";
         return NextResponse.redirect(url);
      }

      if (path.startsWith("/saathi/profile") && userRole !== "SITTER" && userRole !== "SUPER_ADMIN") {
         const url = request.nextUrl.clone();
         url.pathname = "/dashboard";
         return NextResponse.redirect(url);
      }
    }
  }

  const response = NextResponse.next({ request: { headers } });

  if (isProtectedPage || isAdminApi) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  applySecurityHeaders(response, cspHeader, requestId);
  return response;
}

function applySecurityHeaders(
  response: NextResponse,
  cspHeader: string,
  requestId: string,
) {
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self)",
  );
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }
  response.headers.set("X-Request-Id", requestId);
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
