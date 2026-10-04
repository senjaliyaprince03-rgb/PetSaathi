# PetSaathi Role Matrix

This document defines the 12 official platform roles, their anti-escalation ranks, canonical landing routes, and explicit permission assignments within PetSaathi. Roles are strictly persisted in the database (`UserRole` model) and never inferred from unverified client storage.

> **Source of Truth:**
> - `prisma/schema.prisma` (`enum Role`)
> - `src/modules/rbac/permissions.ts` (`roles`, `ROLE_HIERARCHY_RANK`, `rolePermissions`)
> - `src/modules/auth/admin-access.ts` (`getDefaultDashboardForRoles`, `getPrimaryRole`)
> - `src/modules/rbac/authorize.ts` (`assignUserRole`, `revokeUserRole`)

---

## 1. The 12 Platform Roles & Hierarchy Ranks

**Important:** `ROLE_HIERARCHY_RANK` is strictly an **anti-escalation boundary** for role management (`canActorManageRole`), **not** automatic permission inheritance. Every role receives only its explicitly declared permissions.

| Role | Rank | Canonical Landing | Domain Scope |
|---|---:|---|---|
| `SUPER_ADMIN` | 100 | `/admin` | Full platform governance, RBAC administration, privacy, feature flags, and system configuration |
| `OPERATIONS_ADMIN` | 70 | `/admin` | Booking operations, live monitoring, dispatch, matching overrides, and lead management |
| `SAFETY_ADMIN` | 70 | `/admin/safety` | Incident response, safety holds, emergency escalations, and trust & safety reviews |
| `FINANCE_ADMIN` | 70 | `/admin/finance` | Payment reconciliation, refunds, weekly payout ledger workflow, B2B invoicing, and catalog pricing |
| `VERIFICATION_ADMIN` | 60 | `/admin/verification` | Caregiver (Saathi) identity, document, and background check verification decisions |
| `CONTENT_ADMIN` | 60 | `/admin/content` | Editorial content, journal publishing, and verified testimonial moderation |
| `PARTNER_MANAGER` | 60 | `/admin/b2b` | B2B partnerships, corporate accounts, and partner service order management |
| `CITY_MANAGER` | 50 | `/admin/cities` | City-scoped operational oversight, territory matching decisions, and city launch readiness |
| `SOCIETY_MANAGER` | 40 | `/society` | Society-scoped resident directory, gate protocols, community events, and preferred Saathi pool |
| `OPERATOR` | 40 | `/operator` | Territory-scoped booking operations and local operational read access |
| `SITTER` | 20 | `/saathi` | Caregiver (Saathi) portal: assigned offers, availability, active service updates, care reports, and earnings |
| `CUSTOMER` | 10 | `/dashboard` | Pet parent portal: pet profiles, medical records, booking creation, approvals, checkout, and live care tracking |

---

## 2. Explicit Role Permission Mapping

### `CUSTOMER` (Rank 10)
- `users:read:own`, `users:write:own`
- `pet:read:own`, `pet:write:own`
- `medical:read:own`, `medical:write:own`
- `booking:read:own`, `booking:create`, `booking:cancel:own`

### `SITTER` (Rank 20)
- `users:read:own`, `users:write:own`
- `assignment:read:assigned`, `assignment:accept:assigned`
- `service:update:assigned`

### `OPERATOR` (Rank 40)
- `booking:operate`, `operator:read`

### `SOCIETY_MANAGER` (Rank 40)
- `society:read`, `society:operate`, `booking:operate`

### `CITY_MANAGER` (Rank 50)
- `users:read:any`, `booking:operate`, `matching:decide`, `operator:read`, `operator:operate`

### `PARTNER_MANAGER` (Rank 60)
- `users:read:any`, `b2b:read`, `b2b:operate`, `partner:operate`, `operator:read`

### `VERIFICATION_ADMIN` (Rank 60)
- `users:read:any`, `verification:read`, `verification:decide`

### `CONTENT_ADMIN` (Rank 60)
- `content:read`, `content:write`, `content:publish`, `content:operate`

### `FINANCE_ADMIN` (Rank 70)
- `users:read:any`, `finance:read`, `finance:operate`, `finance:refund`, `finance:payout`, `b2b:invoicing`

### `SAFETY_ADMIN` (Rank 70)
- `users:read:any`, `pet:read:any`, `medical:read:any`, `incident:read`, `incident:operate`, `incident:override`, `safety:hold_manage`, `verification:read`

### `OPERATIONS_ADMIN` (Rank 70)
- `users:read:any`, `pet:read:any`, `booking:operate`, `booking:dispatch`, `booking:override`, `matching:decide`, `matching:override`, `verification:read`, `incident:read`, `operator:read`, `operator:operate`

### `SUPER_ADMIN` (Rank 100)
- All declared platform permissions (`permissions` array in `src/modules/rbac/permissions.ts`).

---

## 3. Role Assignment & Anti-Escalation Policy

Role mutations via `POST /api/admin/rbac/assign-role` (`assignUserRole` / `revokeUserRole` in `src/modules/rbac/authorize.ts`) enforce:
1. **Explicit Permission Requirement:** Actor must hold `roles:assign` (for assignment) or `roles:revoke` (for revocation). By default in static `rolePermissions`, only `SUPER_ADMIN` holds `roles:assign` and `roles:revoke`.
2. **Strict Rank Boundary (`canActorManageRole`):** Non-`SUPER_ADMIN` actors cannot assign or revoke `SUPER_ADMIN`, and their maximum role rank must be strictly greater than the target role's rank (`actorMaxRank > targetRank`).
3. **Self-Modification Prohibition:** Non-`SUPER_ADMIN` actors cannot assign roles to themselves (`actorIdentity.id === targetUserId` is rejected).
4. **Last Super Admin Guard:** Revoking `SUPER_ADMIN` from the last active `SUPER_ADMIN` account is blocked.
5. **Fail-Closed Audit Logging:** Every role assignment or revocation writes an immutable `AuditLog` record inside the transaction; if audit persistence fails, the transaction rolls back.
