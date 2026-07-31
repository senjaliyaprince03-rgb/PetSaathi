import { createServerClient } from "@supabase/ssr";
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
    img-src 'self' blob: data: https://*.supabase.co https://maps.googleapis.com;
    font-src 'self' data: https://fonts.gstatic.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://checkout.razorpay.com ${process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""};
    connect-src 'self' https://*.supabase.co https://api.razorpay.com https://lumberjack.razorpay.com wss://*.supabase.co;
    frame-src https://api.razorpay.com https://checkout.razorpay.com https://*.razorpay.com;
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
  if (
    isProtectedApiMutation &&
    Number.isFinite(contentLength) &&
    contentLength > 256 * 1_024
  ) {
    const rejected = NextResponse.json(
      { error: "payload_too_large" },
      { status: 413, headers: { "Cache-Control": "no-store" } },
    );
    applySecurityHeaders(rejected, cspHeader, requestId);
    return rejected;
  }

  let response = NextResponse.next({ request: { headers } });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const hasAuthCookie = request.cookies
    .getAll()
    .some(
      ({ name }) =>
        name.startsWith("sb-") && name.includes("-auth-token"),
    );

  if (url && anonKey && hasAuthCookie) {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers } });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        }
      }
    });
    await settleWithin(supabase.auth.getUser().catch(() => null), 1_500);
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

async function settleWithin<T>(operation: Promise<T>, timeoutMs: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      operation,
      new Promise<void>((resolve) => {
        timeout = setTimeout(resolve, timeoutMs);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
