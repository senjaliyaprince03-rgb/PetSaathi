import { NextResponse } from "next/server";

import { revokeCurrentSession } from "@/modules/auth/mongodb-auth";

// GET: browser-friendly logout link (redirects home after revoking the session).
export async function GET(request: Request) {
  await revokeCurrentSession();
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}

// POST: NextAuth-compatible signout endpoint (the framework's client helper
// posts here; the explicit route previously shadowed it and returned 405).
export async function POST() {
  await revokeCurrentSession();
  return NextResponse.json({ signedOut: true });
}
