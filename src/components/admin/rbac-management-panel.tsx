"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Users,
  Search,
  KeyRound,
  Activity,
  Layers,
  AlertTriangle,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { roles, permissions, type Role, type Permission, rolePermissions } from "@/modules/rbac/permissions";

interface UserRecord {
  id: string;
  displayName: string;
  email: string | null;
  status: string;
  createdAt: string;
  roles: Role[];
  customPermissions: Array<{
    permission: string;
    reason: string;
    expiresAt: string | null;
    grantedAt: string;
  }>;
  effectivePermissions: string[];
}

interface AuditRecord {
  id: string;
  actorId: string | null;
  actorRole: string | null;
  action: string;
  resourceType: string;
  resourceId: string;
  before: any;
  after: any;
  reason: string | null;
  createdAt: string;
}

export function RbacManagementPanel({ currentUserId }: { currentUserId: string }) {
  const [activeTab, setActiveTab] = useState<"governance" | "matrix" | "users" | "audit">("governance");

  // Users state
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Role assignment modal / drawer
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom permission grant modal
  const [customPermToGrant, setCustomPermToGrant] = useState<Permission>("booking:override");
  const [customPermReason, setCustomPermReason] = useState("");
  const [showCustomPermModal, setShowCustomPermModal] = useState(false);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  // Fetch Users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    setActionError(null);
    try {
      const url = new URL("/api/admin/rbac/users", window.location.origin);
      if (searchQuery) url.searchParams.set("q", searchQuery);
      if (selectedRoleFilter) url.searchParams.set("role", selectedRoleFilter);
      url.searchParams.set("limit", "25");

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        setActionError(data.message || "Failed to load users");
      }
    } catch (err: any) {
      setActionError(err.message || "Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch Audit Logs
  const fetchAuditLogs = async () => {
    setLoadingAudit(true);
    try {
      const res = await fetch("/api/admin/rbac/audit-logs?limit=40");
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAudit(false);
    }
  };

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "audit") {
      fetchAuditLogs();
    }
  }, [activeTab]);

  const handleRoleAction = async (targetUserId: string, targetRole: Role, action: "ASSIGN" | "REVOKE") => {
    setIsSubmitting(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch("/api/admin/rbac/assign-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId,
          role: targetRole,
          action,
          reason: reason || `Super Admin ${action === "ASSIGN" ? "assigned" : "revoked"} role`,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Role update rejected");
      }
      setActionSuccess(`Role ${targetRole} successfully ${action === "ASSIGN" ? "assigned" : "revoked"}`);
      setReason("");
      fetchUsers();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomPermissionAction = async (targetUserId: string, perm: Permission, action: "GRANT" | "REVOKE") => {
    setIsSubmitting(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch("/api/admin/rbac/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId,
          permission: perm,
          action,
          reason: customPermReason || "Super Admin policy override",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Permission update rejected");
      }
      setActionSuccess(`Custom permission ${perm} successfully ${action === "GRANT" ? "granted" : "revoked"}`);
      setCustomPermReason("");
      setShowCustomPermModal(false);
      fetchUsers();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-indigo/10 pb-4">
        <button
          onClick={() => setActiveTab("governance")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold tracking-wider uppercase transition-all ${
            activeTab === "governance"
              ? "bg-forest text-white shadow-lifted"
              : "bg-paper text-ink/70 hover:bg-forest/5 hover:text-ink"
          }`}
        >
          <Layers className="h-4 w-4" />
          RBAC Hierarchy
        </button>
        <button
          onClick={() => setActiveTab("matrix")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold tracking-wider uppercase transition-all ${
            activeTab === "matrix"
              ? "bg-forest text-white shadow-lifted"
              : "bg-paper text-ink/70 hover:bg-forest/5 hover:text-ink"
          }`}
        >
          <KeyRound className="h-4 w-4" />
          Permission Matrix (12 Roles)
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold tracking-wider uppercase transition-all ${
            activeTab === "users"
              ? "bg-forest text-white shadow-lifted"
              : "bg-paper text-ink/70 hover:bg-forest/5 hover:text-ink"
          }`}
        >
          <Users className="h-4 w-4" />
          User Access &amp; Roles
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold tracking-wider uppercase transition-all ${
            activeTab === "audit"
              ? "bg-forest text-white shadow-lifted"
              : "bg-paper text-ink/70 hover:bg-forest/5 hover:text-ink"
          }`}
        >
          <Activity className="h-4 w-4" />
          Audit Trail
        </button>
      </div>

      {/* Global Alerts */}
      {actionError && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-800">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
          <span>{actionError}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-xs font-medium text-green-800">
          <ShieldCheck className="h-5 w-5 shrink-0 text-green-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* TAB 1: GOVERNANCE & HIERARCHY */}
      {activeTab === "governance" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-indigo/10 bg-paper p-8 shadow-lifted">
            <div className="flex items-center gap-3 text-leaf">
              <Sparkles className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-ink/70">
                Architectural Principle: Separation of Governance &amp; Operations
              </span>
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
              Multi-Tiered Access &amp; Platform Authority Model
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              In PetSaathi, <strong>Super Admin is a security and governance authority</strong>, not an operational step
              in pet-care delivery. Super Admin provisions platform roles, enforces least privilege, configures regional
              parameters, and audits actions. The operational workflow (Booking → Matching → Verification → Service Delivery)
              is executed autonomously by Customers, Saathi Caregivers, and Operational Admins.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Tier 1 */}
            <div className="rounded-3xl border-2 border-forest/20 bg-gradient-to-b from-forest/5 to-transparent p-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-forest px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Tier 1 • Rank 100
                </span>
                <ShieldAlert className="h-6 w-6 text-forest" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">Super Admin</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/70">
                Absolute platform authority. Controls role creation, custom permission overrides, feature flags, global pricing,
                and immutable audit logs.
              </p>
              <div className="mt-4 border-t border-forest/10 pt-3">
                <span className="text-[10px] font-semibold text-forest uppercase">Authority: Global Unrestricted</span>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="rounded-3xl border border-indigo/10 bg-paper p-6 shadow-lifted">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-indigo/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                  Tier 2 • Rank 60-70
                </span>
                <ShieldCheck className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">Department Admins</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/70">
                Functional specialists: Operations Admin (Dispatch), Safety Admin (Incidents/Holds), Finance Admin (Refunds/Ledger),
                Verification Admin (KYC), Content Admin, Partner Manager.
              </p>
              <div className="mt-4 border-t border-indigo/10 pt-3">
                <span className="text-[10px] font-semibold text-indigo-700 uppercase">Authority: Domain Scoped</span>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="rounded-3xl border border-indigo/10 bg-paper p-6 shadow-lifted">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  Tier 3 • Rank 40-50
                </span>
                <Layers className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">Territory Operators</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/70">
                Regional coordinators: City Managers, Society Managers, Franchise Operating Partners. Bound strictly to assigned
                cities and service zones via DB scoping.
              </p>
              <div className="mt-4 border-t border-amber-500/10 pt-3">
                <span className="text-[10px] font-semibold text-amber-700 uppercase">Authority: Multi-Tenant Scoped</span>
              </div>
            </div>

            {/* Tier 4 */}
            <div className="rounded-3xl border border-indigo/10 bg-paper p-6 shadow-lifted">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-leaf/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-leaf">
                  Tier 4 • Rank 10-20
                </span>
                <Users className="h-6 w-6 text-leaf" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">Care Participants</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/70">
                End users: Saathi Caregivers (Accept assignments, submit walk proof cards) and Pet Parents (Manage own pets,
                book care, approve replacements).
              </p>
              <div className="mt-4 border-t border-leaf/10 pt-3">
                <span className="text-[10px] font-semibold text-leaf uppercase">Authority: Resource-Owner Isolated</span>
              </div>
            </div>
          </div>

          {/* Privilege Escalation Safeguards */}
          <div className="rounded-3xl border border-indigo/10 bg-paper p-6 shadow-lifted">
            <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
              <Shield className="h-5 w-5 text-forest" />
              Enforced Privilege Escalation Safeguards
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3 text-xs text-ink/80">
              <div className="rounded-2xl bg-indigo/5 p-4">
                <div className="font-bold text-ink mb-1">1. Rank Invariant Enforcement</div>
                An admin cannot grant, modify, or revoke a role of equal or greater rank than their own. Only Super Admin (Rank 100) can grant Super Admin.
              </div>
              <div className="rounded-2xl bg-indigo/5 p-4">
                <div className="font-bold text-ink mb-1">2. IDOR / BOLA Prevention</div>
                Resource-owner permissions (e.g. <code>pet:write:own</code>) strictly cross-check the caller&apos;s identity against target record ownership.
              </div>
              <div className="rounded-2xl bg-indigo/5 p-4">
                <div className="font-bold text-ink mb-1">3. Mandatory Audit Logging</div>
                Every role addition, revocation, or custom permission override writes an immutable entry into the audit trail with before/after state and documented reason.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROLE VS PERMISSION MATRIX */}
      {activeTab === "matrix" && (
        <div className="rounded-3xl border border-indigo/10 bg-paper p-6 shadow-lifted overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-indigo/10">
            <div>
              <h2 className="font-display text-xl font-bold text-ink">Role &amp; Permission Capabilities Matrix</h2>
              <p className="text-xs text-ink/70 mt-1">Cross-matrix mapping of all 12 platform roles against discrete permissions</p>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-indigo/10 bg-indigo/5">
                  <th className="p-3 font-bold text-ink min-w-[200px]">Permission</th>
                  {roles.map((r) => (
                    <th key={r} className="p-2 font-bold text-ink/80 text-center text-[10px] min-w-[90px]">
                      {r.replace("_ADMIN", "").replace("_MANAGER", "")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo/5">
                {permissions.map((perm) => (
                  <tr key={perm} className="hover:bg-indigo/5 transition-colors">
                    <td className="p-3 font-mono text-[11px] font-medium text-ink flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                      {perm}
                    </td>
                    {roles.map((role) => {
                      const hasPerm =
                        role === "SUPER_ADMIN" ||
                        (rolePermissions[role] as readonly string[])?.includes(perm);
                      return (
                        <td key={role} className="p-2 text-center">
                          {hasPerm ? (
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-leaf/10 text-leaf text-xs font-bold">
                              ✓
                            </span>
                          ) : (
                            <span className="text-ink/20 font-mono text-[10px]">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USER ACCESS & ROLE MANAGEMENT */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-indigo/10 bg-paper p-6 shadow-lifted">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                <input
                  type="text"
                  placeholder="Search user by display name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
                  className="w-full rounded-2xl border border-indigo/10 bg-indigo/5 pl-10 pr-4 py-2.5 text-xs text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-forest/20"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value)}
                  className="rounded-2xl border border-indigo/10 bg-indigo/5 px-3 py-2.5 text-xs font-medium text-ink focus:outline-none"
                >
                  <option value="">All Roles</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>

                <button
                  onClick={fetchUsers}
                  disabled={loadingUsers}
                  className="flex items-center gap-2 rounded-2xl bg-forest px-4 py-2.5 text-xs font-bold text-white hover:bg-forest/90 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingUsers ? "animate-spin" : ""}`} />
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="grid gap-4">
            {loadingUsers ? (
              <div className="p-12 text-center text-xs text-ink/60">Loading user accounts...</div>
            ) : users.length === 0 ? (
              <div className="rounded-3xl border border-indigo/10 bg-paper p-12 text-center text-xs text-ink/60">
                No users found matching query.
              </div>
            ) : (
              users.map((u) => (
                <div
                  key={u.id}
                  className="rounded-3xl border border-indigo/10 bg-paper p-6 shadow-lifted transition-all hover:border-forest/30"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-display text-base font-bold text-ink">{u.displayName}</span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            u.status === "ACTIVE"
                              ? "bg-leaf/10 text-leaf"
                              : "bg-amber-500/10 text-amber-700"
                          }`}
                        >
                          {u.status}
                        </span>
                      </div>
                      <p className="text-xs text-ink/60 mt-1">{u.email || "No email linked"}</p>
                    </div>

                    {/* Roles Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {u.roles.map((r) => (
                        <span
                          key={r}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-forest/20 bg-forest/5 px-2.5 py-1 text-[10px] font-bold text-forest"
                        >
                          <ShieldCheck className="h-3 w-3" />
                          {r}
                          <button
                            onClick={() => handleRoleAction(u.id, r, "REVOKE")}
                            disabled={isSubmitting}
                            title={`Revoke ${r}`}
                            className="ml-1 text-ink/40 hover:text-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      {/* Quick Assign Dropdown */}
                      <div className="flex items-center gap-2 ml-2">
                        <select
                          id={`assign-role-${u.id}`}
                          className="rounded-xl border border-indigo/10 bg-indigo/5 px-2 py-1 text-[10px] font-medium text-ink focus:outline-none"
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              const r = e.target.value as Role;
                              handleRoleAction(u.id, r, "ASSIGN");
                              e.target.value = "";
                            }
                          }}
                        >
                          <option value="" disabled>
                            + Assign Role
                          </option>
                          {roles
                            .filter((r) => !u.roles.includes(r))
                            .map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Custom Permissions held */}
                  {u.customPermissions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-indigo/5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-ink/60">
                        Explicit Custom Grants:
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {u.customPermissions.map((cp) => (
                          <span
                            key={cp.permission}
                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[10px] font-mono text-indigo-800"
                          >
                            <KeyRound className="h-2.5 w-2.5" />
                            {cp.permission}
                            <button
                              onClick={() =>
                                handleCustomPermissionAction(u.id, cp.permission as Permission, "REVOKE")
                              }
                              className="ml-1 text-red-500 hover:text-red-700"
                              title="Revoke custom grant"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Effective permissions count and action */}
                  <div className="mt-4 pt-3 border-t border-indigo/5 flex items-center justify-between text-[11px] text-ink/60">
                    <span>
                      Effective Capabilities: <strong>{u.effectivePermissions.length}</strong> active permissions
                    </span>
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setShowCustomPermModal(true);
                      }}
                      className="text-xs font-semibold text-forest hover:underline"
                    >
                      Grant Custom Permission Override →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Modal for Custom Permission Override */}
          {showCustomPermModal && selectedUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
              <div className="w-full max-w-md rounded-3xl bg-paper p-6 shadow-2xl border border-indigo/10 space-y-4">
                <div className="flex items-center justify-between border-b border-indigo/10 pb-3">
                  <h3 className="font-display text-base font-bold text-ink">
                    Grant Custom Permission Override
                  </h3>
                  <button
                    onClick={() => setShowCustomPermModal(false)}
                    className="text-ink/40 hover:text-ink text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-xs text-ink/70">
                  Target User: <strong>{selectedUser.displayName}</strong> ({selectedUser.email || selectedUser.id})
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink/60">
                    Select Permission
                  </label>
                  <select
                    value={customPermToGrant}
                    onChange={(e) => setCustomPermToGrant(e.target.value as Permission)}
                    className="w-full rounded-xl border border-indigo/10 bg-indigo/5 p-2.5 text-xs font-mono text-ink focus:outline-none"
                  >
                    {permissions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink/60">
                    Documented Business Reason (Mandatory)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Document why this explicit custom permission is required..."
                    value={customPermReason}
                    onChange={(e) => setCustomPermReason(e.target.value)}
                    className="w-full rounded-xl border border-indigo/10 bg-indigo/5 p-2.5 text-xs text-ink focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCustomPermModal(false)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-indigo/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting || !customPermReason.trim()}
                    onClick={() =>
                      handleCustomPermissionAction(selectedUser.id, customPermToGrant, "GRANT")
                    }
                    className="rounded-xl bg-forest px-4 py-2 text-xs font-bold text-white hover:bg-forest/90 disabled:opacity-50"
                  >
                    {isSubmitting ? "Granting..." : "Confirm Grant"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: LIVE AUDIT TRAIL */}
      {activeTab === "audit" && (
        <div className="rounded-3xl border border-indigo/10 bg-paper p-6 shadow-lifted space-y-4">
          <div className="flex items-center justify-between border-b border-indigo/10 pb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-ink">RBAC &amp; Governance Audit Logs</h2>
              <p className="text-xs text-ink/70 mt-1">
                Immutable chronological log of role assignments, revocations, and policy overrides
              </p>
            </div>
            <button
              onClick={fetchAuditLogs}
              disabled={loadingAudit}
              className="flex items-center gap-2 rounded-2xl bg-forest px-3.5 py-2 text-xs font-bold text-white hover:bg-forest/90 transition-all"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingAudit ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {loadingAudit ? (
            <div className="p-12 text-center text-xs text-ink/60">Loading audit trail...</div>
          ) : auditLogs.length === 0 ? (
            <div className="p-12 text-center text-xs text-ink/60">No audit events recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-indigo/10 bg-indigo/5 text-ink/80 text-[10px] uppercase font-bold tracking-wider">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Actor &amp; Role</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Resource</th>
                    <th className="p-3">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo/5">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-indigo/5 font-mono text-[11px]">
                      <td className="p-3 text-ink/60 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("en-IN", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-ink">{log.actorRole || "SYSTEM"}</span>
                        <div className="text-[10px] text-ink/40 truncate max-w-[120px]">{log.actorId}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`rounded px-2 py-0.5 font-bold ${
                            log.action.includes("assigned") || log.action.includes("granted")
                              ? "bg-leaf/10 text-leaf"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 text-ink/80">
                        {log.resourceType}: <span className="text-[10px] text-ink/50">{log.resourceId}</span>
                      </td>
                      <td className="p-3 font-sans text-xs text-ink/70 max-w-xs truncate">
                        {log.reason || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
