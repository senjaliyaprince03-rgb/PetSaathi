import type { AccountStatus, Role } from "@prisma/client";
import { decode } from "next-auth/jwt";
import { cookies, headers } from "next/headers";

import { isDatabaseConfigured, prisma } from "@/lib/db";
import { currentSessionUserId } from "@/modules/auth/mongodb-auth";
import { getAuthSecret } from "@/lib/auth-secret";

export type AppIdentity = {
  id: string;
  displayName: string;
  status: AccountStatus;
  roles: Role[];
};

export async function getCurrentIdentity(request?: Request): Promise<AppIdentity | null> {
  try {
    if (!isDatabaseConfigured()) return null;

    let userId: string | null = null;

    // In test and development environments, allow test runners to specify identity via header
    if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development") {
      if (request) {
        userId = request.headers.get("x-test-user-id");
      }
      if (!userId) {
        try {
          const headerStore = await headers();
          const testUser = headerStore.get("x-test-user-id");
          if (testUser) userId = testUser;
        } catch {
          // headers() unavailable or not inside Next.js request context
        }
      }
    }

    // 1. Check native MongoDB session cookie
    if (!userId) {
      try {
        userId = await currentSessionUserId();
      } catch {
        // cookies() unavailable outside request scope
      }
    }

    // 2. Check NextAuth JWT token safely via decode()
    if (!userId) {
      try {
        const cookieStore = await cookies();
        const cookieToken =
          cookieStore.get(process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token")?.value ??
          cookieStore.get("next-auth.session-token")?.value;

        if (cookieToken) {
          const secret = getAuthSecret();
          const decoded = await decode({ token: cookieToken, secret });
          if (decoded && (decoded.id || decoded.sub)) {
            userId = (decoded.id as string) || (decoded.sub as string);
          }
        }
      } catch {
        // NextAuth token decode fallback
      }
    }

    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        displayName: true,
        status: true,
        roles: { select: { role: true } }
      }
    });

    if (!user || user.status !== "ACTIVE") return null;
    return { ...user, roles: user.roles.map(({ role }) => role) };
  } catch {
    return null;
  }
}

export function hasAnyRole(identity: AppIdentity, allowed: readonly Role[]) {
  return identity.roles.some((role) => allowed.includes(role));
}
