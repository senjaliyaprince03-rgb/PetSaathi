import { NextResponse } from "next/server";

import { revokeCurrentSession } from "@/modules/auth/mongodb-auth";

function clearSessionCookies(response: NextResponse) {
  const cookieNames = [
    "petsaathi_session",
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.csrf-token",
    "__Host-next-auth.csrf-token",
    "next-auth.callback-url",
  ];

  for (const name of cookieNames) {
    response.cookies.set(name, "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }
}

// GET: browser-friendly logout link (redirects to returnTo or /login after revoking the session).
export async function GET(request: Request) {
  await revokeCurrentSession();
  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get("returnTo") || "/";
  const response = NextResponse.redirect(new URL(returnTo, request.url), { status: 303 });
  clearSessionCookies(response);
  return response;
}

// POST: NextAuth-compatible signout endpoint
export async function POST() {
  await revokeCurrentSession();
  const response = NextResponse.json({ signedOut: true });
  clearSessionCookies(response);
  return response;
}

