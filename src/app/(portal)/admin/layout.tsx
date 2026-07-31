import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import {
  adminRolesForPath,
  normalizeAdminReturnTo,
} from "@/modules/auth/admin-access";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const identity = await getCurrentIdentity();
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/admin";
  const returnTo = normalizeAdminReturnTo(
    headersList.get("x-return-to"),
    pathname,
  );

  if (!identity) {
    redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }

  const allowedRoles = adminRolesForPath(pathname);
  if (!allowedRoles || !hasAnyRole(identity, allowedRoles)) notFound();

  return <>{children}</>;
}
