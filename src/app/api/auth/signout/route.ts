import { NextResponse } from "next/server";

import { revokeCurrentSession } from "@/modules/auth/mongodb-auth";

// GET: browser-friendly logout link (redirects home after revoking the session).
export async function GET(request: Request) {
  await revokeCurrentSession();
  const response = NextResponse.redirect(new URL("/", request.url), { status: 303 });
  response.cookies.delete("petsaathi_session");
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("__Secure-next-auth.session-token");
  return response;
}

// POST: NextAuth-compatible signout endpoint (the framework's client helper
// posts here; the explicit route previously shadowed it and returned 405).
export async function POST() {
  await revokeCurrentSession();
  const response = NextResponse.json({ signedOut: true });
  response.cookies.delete("petsaathi_session");
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("__Secure-next-auth.session-token");
  return response;
}
