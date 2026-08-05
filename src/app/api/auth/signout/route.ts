import { NextResponse } from "next/server";

import { revokeCurrentSession } from "@/modules/auth/mongodb-auth";

export async function GET(request: Request) {
  await revokeCurrentSession();
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
