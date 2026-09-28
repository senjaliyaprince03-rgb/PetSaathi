import { redirect } from "next/navigation";
import type { Route } from "next";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { getDefaultDashboardForRoles } from "@/modules/auth/admin-access";

export default async function SaathiLayout({ children }: { children: React.ReactNode }) {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/login");
  if (!hasAnyRole(identity, ["SITTER", "SUPER_ADMIN"])) redirect(getDefaultDashboardForRoles(identity.roles) as Route);
  return <>{children}</>;
}
