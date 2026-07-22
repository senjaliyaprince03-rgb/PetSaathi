import type { AccountStatus, Role } from "@prisma/client";

import { isDatabaseConfigured, prisma } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AppIdentity = {
  id: string;
  authUserId: string;
  displayName: string;
  status: AccountStatus;
  roles: Role[];
};

export async function getCurrentIdentity(): Promise<AppIdentity | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase || !isDatabaseConfigured()) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const user = await prisma.user.findUnique({
    where: { authUserId: data.user.id },
    select: {
      id: true,
      authUserId: true,
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
