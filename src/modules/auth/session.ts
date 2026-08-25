import type { AccountStatus, Role } from "@prisma/client";

import { isDatabaseConfigured, prisma } from "@/lib/db";
import { currentSessionUserId } from "@/modules/auth/mongodb-auth";

export type AppIdentity = {
  id: string;
  displayName: string;
  status: AccountStatus;
  roles: Role[];
};

export async function getCurrentIdentity(): Promise<AppIdentity | null> {
  if (!isDatabaseConfigured()) return null;
  const userId = await currentSessionUserId();
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
