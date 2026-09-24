import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/portal-shell";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { RbacManagementPanel } from "@/components/admin/rbac-management-panel";

export const dynamic = "force-dynamic";

export default async function AdminRbacPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SUPER_ADMIN"])) {
    redirect("/login?returnTo=/admin/rbac");
  }

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="max-w-7xl pb-16 space-y-6">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/70">
            System Security &amp; Access Control
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] text-ink">
            Role-Based Access Control (RBAC)
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/70">
            Manage platform authorities, inspect the 12-role capability matrix, review active permissions,
            and monitor immutable security audit trails.
          </p>
        </div>

        <RbacManagementPanel currentUserId={identity.id} />
      </div>
    </PortalShell>
  );
}
