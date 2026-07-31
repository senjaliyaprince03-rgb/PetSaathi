import "server-only";

import type { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { getCurrentIdentity, type AppIdentity } from "@/modules/auth/session";

export type ApiAuthorization =
  | {
      authorized: true;
      identity: AppIdentity;
      actorRole: Role;
    }
  | {
      authorized: false;
      response: NextResponse;
    };

export function authorizedActorRole(
  identity: Pick<AppIdentity, "roles">,
  allowedRoles: readonly Role[],
): Role | null {
  return allowedRoles.find((role) => identity.roles.includes(role)) ?? null;
}

export async function authorizeApi(
  allowedRoles: readonly Role[],
): Promise<ApiAuthorization> {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "unauthorized" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      ),
    };
  }

  const actorRole = authorizedActorRole(identity, allowedRoles);
  if (!actorRole) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "forbidden" },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      ),
    };
  }

  return { authorized: true, identity, actorRole };
}
