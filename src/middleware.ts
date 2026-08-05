import { type NextRequest, NextResponse } from "next/server";

import { isTrustedBrowserMutation } from "@/modules/security/origin";

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
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, " ").trim();

  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", cspHeader);

  const isProtectedApiMutation =
    request.nextUrl.pathname.startsWith("/api/") &&
    !request.nextUrl.pathname.startsWith("/api/webhooks/") &&
    !request.nextUrl.pathname.startsWith("/api/jobs/");
  if (
    isProtectedApiMutation &&
    !isTrustedBrowserMutation(
      request.method,
      request.url,
      request.headers.get("origin"),
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
  const isProtectedPage =
    request.method === "GET" &&
    protectedPagePrefixes.some(
      (prefix) =>
        request.nextUrl.pathname === prefix ||
        request.nextUrl.pathname.startsWith(`${prefix}/`),
    );
  if (isProtectedPage && !request.cookies.has("petsaathi_session")) {
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

  const response = NextResponse.next({ request: { headers } });

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
