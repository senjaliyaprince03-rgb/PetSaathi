import { Users, Globe, Link2 } from "lucide-react";
import { redirect } from "next/navigation";

import { MembershipActions } from "@/components/portal/membership-actions";
import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminCommunityPage() {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["OPERATIONS_ADMIN", "CONTENT_ADMIN", "SUPER_ADMIN"])) {
    redirect("/login?returnTo=/admin/operations/community");
  }

  const groups = await prisma.communityGroup.findMany({
    include: {
      memberships: {
        include: { contact: true },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-cream/50 py-10">
      <div className="container-shell">
        <p className="eyebrow">community operations</p>
        <h1 className="section-title mt-5">Community Groups</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/60">
          Manage local pet-parent communities and process membership requests.
        </p>

        <div className="mt-10 space-y-8">
          {groups.length === 0 ? (
            <div className="rounded-5xl border border-dashed border-ink/15 bg-paper p-10 text-center">
              <Users className="mx-auto h-10 w-10 text-leaf" />
              <h2 className="mt-4 font-display text-3xl font-semibold">No community groups yet.</h2>
            </div>
          ) : (
            groups.map((group) => {
              const pending = group.memberships.filter((m) => m.status === "PENDING");
              const approved = group.memberships.filter((m) => m.status === "APPROVED");

              return (
                <article key={group.id} className="rounded-4xl border border-ink/10 bg-paper p-6 shadow-lifted">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo/10 text-indigo">
                        <Users className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="font-display text-2xl font-semibold">{group.name}</h2>
                        <p className="text-xs text-ink/40">/{group.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 rounded-full bg-indigo/10 px-3 py-1 text-xs font-bold text-indigo">
                        <Globe className="h-3 w-3" /> {group.platform}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${group.active ? "bg-leaf/15 text-leaf" : "bg-coral/15 text-coral"}`}>
                        {group.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {group.description && (
                    <p className="mt-3 text-sm leading-6 text-ink/60">{group.description}</p>
                  )}

                  {group.joinLink && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-ink/40">
                      <Link2 className="h-3 w-3" /> {group.joinLink}
                    </p>
                  )}

                  <div className="mt-4 flex gap-4 text-sm text-ink/50">
                    <span>{approved.length} members</span>
                    <span className="font-bold text-saffron">{pending.length} pending</span>
                  </div>

                  {pending.length > 0 && (
                    <div className="mt-5 space-y-3 border-t border-ink/10 pt-5">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral">Pending Requests</p>
                      {pending.map((membership) => (
                        <div key={membership.id} className="rounded-2xl border border-ink/5 bg-cream/30 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold">
                                {membership.contact.firstName} {membership.contact.lastName}
                              </p>
                              <p className="text-xs text-ink/40">
                                {membership.contact.email ?? membership.contact.phoneE164} · {membership.createdAt.toLocaleString("en-IN")}
                              </p>
                            </div>
                          </div>
                          <MembershipActions id={membership.id} status={membership.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
