import { Building2, Handshake, ShieldAlert } from "lucide-react";
import { redirect } from "next/navigation";

import { AdminPartnerTable } from "@/components/portal/admin-partner-table";
import { MetricCard } from "@/components/portal/dashboard-ui";
import { PortalShell } from "@/components/portal/portal-shell";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["OPERATIONS_ADMIN", "SUPER_ADMIN"])) {
    redirect("/login?returnTo=/admin/partners");
  }

  const partners = await prisma.partner.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { verifications: true, services: true },
      },
    },
  });

  const totalPartners = partners.length;
  const activePartners = partners.filter((p) => p.status === "ACTIVE").length;
  const pendingVerifications = partners.reduce((acc, p) => acc + (p.status === "DRAFT" ? 1 : 0), 0); // Simplified metric

  return (
    <PortalShell mode="admin" displayName={identity.displayName}>
      <div className="max-w-7xl pb-12">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/80">partner management</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">Partner Directory</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/80 mb-10">Manage external service partners, verifications, and marketplace presence.</p>

        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard icon={Building2} label="Total Partners" value={totalPartners.toString()} hint="Registered organizations" tone="indigo" />
          <MetricCard icon={Handshake} label="Active Marketplace" value={activePartners.toString()} hint="Approved for marketplace" tone="leaf" />
          <MetricCard icon={ShieldAlert} label="Draft/Pending" value={pendingVerifications.toString()} hint="Awaiting verification" tone="saffron" />
        </div>

        <AdminPartnerTable partners={partners} />
      </div>
    </PortalShell>
  );
}
