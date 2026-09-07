import type { AccountStatus, Role } from "@prisma/client";
import { getServerSession } from "next-auth";

import { isDatabaseConfigured, prisma } from "@/lib/db";
import { currentSessionUserId } from "@/modules/auth/mongodb-auth";
import { authOptions } from "@/lib/auth";

export type AppIdentity = {
  id: string;
  displayName: string;
  status: AccountStatus;
  roles: Role[];
};

export async function getCurrentIdentity(request?: Request): Promise<AppIdentity | null> {
  if (!isDatabaseConfigured()) return null;

  let userId: string | null = null;

  // In test and development environments, allow test runners to specify identity via header
  if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development") {
    if (request) {
      userId = request.headers.get("x-test-user-id");
    }
    if (!userId) {
      try {
        const { headers } = await import("next/headers");
        const headerStore = await headers();
        const testUser = headerStore.get("x-test-user-id");
        if (testUser) userId = testUser;
      } catch {
        // headers() unavailable or not inside Next.js request context
      }
    }
  }

  if (!userId) {
    try {
      const nextAuthSession = await getServerSession(authOptions);
      if (nextAuthSession?.user && (nextAuthSession.user as any).id) {
        userId = (nextAuthSession.user as any).id;
      }
    } catch {
      // NextAuth session resolution skipped or not present
    }
  }

  if (!userId) {
    try {
      userId = await currentSessionUserId();
    } catch {
      // cookies() unavailable outside request scope
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
}

export function hasAnyRole(identity: AppIdentity, allowed: readonly Role[]) {
  return identity.roles.some((role) => allowed.includes(role));
}
