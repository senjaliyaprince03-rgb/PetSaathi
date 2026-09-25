# PetSaathi Platform: Role-Based Access Control (RBAC) Architecture

## 1. Executive Summary & Architectural Paradigm

PetSaathi enforces a multi-tiered, capability-driven **Role-Based Access Control (RBAC)** architecture designed around three core tenets:

1. **Separation of Governance & Operations**:
   `SUPER_ADMIN` acts strictly as a **governance and security authority**. The Super Admin configures roles, inspects audit trails, toggles feature gates, and manages global infrastructure. **Super Admin is NEVER an operational gatekeeper in the daily pet care lifecycle** (e.g., booking a walk, accepting an assignment, or delivering a report card). The operational loop runs autonomously through customers, sitters, and departmental administrators.
2. **Explicit Distinction: Role $\ne$ Permission**:
   A **Role** is a convenient grouping of capabilities assigned to a user identity. A **Permission** is an atomic, resource-level capability (e.g. `booking:dispatch`, `finance:refund`, `pet:write:own`). The system authorizes actions based on *effective permissions*, not raw role strings.
3. **Multi-Tenancy & Least Privilege**:
   Access to resources is bounded by ownership (`:own`), territory scopes (City / Service Zone), and organization memberships. Privilege escalation is prevented at the database and application layers.

---

## 2. Diagram 1: Administrative Governance & RBAC Hierarchy

This diagram details the top-down administrative governance, permission distribution, and privilege boundaries.

```mermaid
flowchart TD
    classDef superAdmin fill:#1e3a2f,stroke:#2d5a46,color:#ffffff,stroke-width:2px;
    classDef deptAdmin fill:#1e293b,stroke:#334155,color:#ffffff,stroke-width:2px;
    classDef territory fill:#78350f,stroke:#92400e,color:#ffffff,stroke-width:2px;
    classDef endUser fill:#064e3b,stroke:#047857,color:#ffffff,stroke-width:2px;
    classDef audit fill:#312e81,stroke:#4338ca,color:#ffffff,stroke-width:2px;

    SA["SUPER ADMIN<br/>(Rank 100 • Platform Governance)"]:::superAdmin

    subgraph GovernanceAuthority["Platform Governance & Security Controls"]
        PC["Platform Config & Feature Flags<br/><code>system:feature_flags</code>"]
        RA["Role & Permission Management<br/><code>roles:assign</code> / <code>roles:revoke</code>"]
        AL["Application-Level Append-Only Audit Trail<br/><code>system:audit_logs</code>"]:::audit
        PE["Privilege Escalation Guard<br/>Rank Invariant Enforcement"]
    end

    SA --> PC
    SA --> RA
    SA --> AL
    SA --> PE

    subgraph DepartmentAdmins["Tier 2: Functional Department Admins (Rank 60-70)"]
        OA["OPERATIONS ADMIN<br/>• Booking Dispatch<br/>• Matching Decision<br/>• Live Monitor"]:::deptAdmin
        SA_ADMIN["SAFETY ADMIN<br/>• Incident Response<br/>• Sitter Holds<br/>• Safety Audits"]:::deptAdmin
        FA["FINANCE ADMIN<br/>• Pricing Catalogs<br/>• Refunds & Payouts<br/>• B2B Invoicing"]:::deptAdmin
        VA["VERIFICATION ADMIN<br/>• Sitter Applications<br/>• Identity KYC<br/>• Practical Exams"]:::deptAdmin
        CA["CONTENT ADMIN<br/>• Editorial & CMS<br/>• Review Moderation<br/>• City Landing Pages"]:::deptAdmin
        PM["PARTNER MANAGER<br/>• B2B Enterprise<br/>• Corporate Benefit Plans<br/>• Vendor Partners"]:::deptAdmin
    end

    RA -.->|Provisions Roles| DepartmentAdmins

    subgraph TerritoryOperators["Tier 3: Multi-Tenant Territory Operators (Rank 40-50)"]
        CM["CITY MANAGER<br/>(City-Level Scoped)"]:::territory
        OP["OPERATING PARTNER<br/>(Franchise Zone Scoped)"]:::territory
        SM["SOCIETY MANAGER<br/>(Residential Society Scoped)"]:::territory
    end

    OA -.->|Delegates Regional Tasks| TerritoryOperators

    subgraph CareParticipants["Tier 4: Care Participants (Rank 10-20)"]
        SITTER["SAATHI CAREGIVER<br/>• Accept Visits<br/>• Live GPS Telemetry<br/>• Report Cards"]:::endUser
        CUSTOMER["PET PARENT<br/>• Pet Passports<br/>• Book Services<br/>• Approve Saathis"]:::endUser
    end

    TerritoryOperators -.->|Coordinates Hyperlocal| CareParticipants

    %% Audit Log Connections
    SA -.->|All Security Events| AL
    DepartmentAdmins -.->|All Admin Actions| AL
    CareParticipants -.->|State Transitions| AL
```

---

## 3. Diagram 2: Operational Care Workflow

This diagram maps the autonomous operational lifecycle of a pet care service, showing where departmental admins provide operational oversight without requiring Super Admin intervention.

```mermaid
flowchart TD
    classDef customer fill:#064e3b,stroke:#047857,color:#ffffff,stroke-width:2px;
    classDef sitter fill:#0f766e,stroke:#115e59,color:#ffffff,stroke-width:2px;
    classDef system fill:#1e293b,stroke:#334155,color:#ffffff,stroke-width:2px;
    classDef admin fill:#78350f,stroke:#92400e,color:#ffffff,stroke-width:2px;
    classDef safety fill:#7f1d1d,stroke:#991b1b,color:#ffffff,stroke-width:2px;

    %% Booking Initiation
    C1["1. Customer Books Service<br/>(Pet details, date, time)"]:::customer
    C1 --> S1["2. Autonomous Risk Evaluation<br/>(Pet temperament, breed, medical)"]:::system

    %% Risk Triaging
    S1 -->|Standard Risk Level| S2["3. Autonomous Matching Engine<br/>(Caregiver proximity, score, skills)"]:::system
    S1 -->|High Risk Flag| OA1["Operations Admin / Safety Review<br/><code>booking:operate</code>"]:::admin
    OA1 --> S2

    %% Matching & Dispatch
    S2 --> S3["4. Saathi Proposal Dispatched<br/>(Offer routed to highest scoring Saathi)"]:::system
    OA2["Operations Admin / City Manager<br/>(Optional Manual Override)"]:::admin -.->|<code>matching:decide</code>| S3

    %% Sitter Acceptance
    S3 --> SI1["5. Saathi Caregiver Accepts Offer<br/><code>assignment:accept:assigned</code>"]:::sitter
    SI1 --> C2["6. Customer Approves & Confirms<br/>(Payment Held in Escrow)"]:::customer

    %% In-Service Delivery
    C2 --> SI2["7. Active Service Delivery<br/>• GPS Check-in<br/>• Live Telemetry<br/>• Potty/Water Updates"]:::sitter

    %% Incident Path
    SI2 -.->|Emergency / Incident| INC["Safety Escalation Triggered<br/><code>incident:operate</code>"]:::safety
    INC --> SA1["Safety Admin Intervenes<br/>• Veterinary Care Protocol<br/>• Sitter Hold / Replacement"]:::safety
    SA1 -.->|Resolved| SI3

    %% Completion & Review
    SI2 --> SI3["8. Service Completed<br/>• Photo Proof Uploaded<br/>• Session Report Card Submitted"]:::sitter
    SI3 --> C3["9. Customer Reviews & Rates<br/>• Ratings & Tips submitted"]:::customer

    %% Settlement
    C3 --> S4["10. Automated Settlement & Payout<br/>• Escrow released<br/>• Weekly direct-to-bank payout"]:::system
    FA1["Finance Admin Oversight<br/>(Audit Ledger & Refunds)"]:::admin -.->|<code>finance:payout</code>| S4
```

---

## 4. Multi-Tenancy & Data Isolation Boundaries

### 4.1 Territory Scoping (`resolveTerritoryScope`)
For regional roles (`OPERATOR`, `CITY_MANAGER`, `SOCIETY_MANAGER`), database queries are strictly filtered using territory scope resolvers:
- **`CITY_MANAGER`**: Constrained to city IDs explicitly assigned in the `CityManager` relation table.
- **`OPERATOR`**: Constrained to service zones and city boundaries tied to their active `OperatingPartner` contract.
- **`SUPER_ADMIN` & `OPERATIONS_ADMIN`**: Have `unrestricted: true`, allowing cross-city visibility.

### 4.2 Resource Ownership & IDOR Protection
Permissions suffixed with `:own` (such as `pet:read:own`, `pet:write:own`, `medical:write:own`, `booking:cancel:own`) enforce caller-resource identity checks:
```typescript
if (scope?.ownerId && permission.endsWith(":own")) {
  if (identity.id !== scope.ownerId) {
    return false; // Denied: Caller does not own this resource
  }
}
```

---

## 5. Privilege Escalation Safeguards

PetSaathi implements four strict guardrails against privilege escalation:

1. **Hierarchy Rank Invariant (`ROLE_HIERARCHY_RANK`)**:
   A user can only assign or revoke roles that are strictly lower in rank than their own highest held role.
   - `SUPER_ADMIN` (Rank 100) is the **only role** capable of granting or revoking `SUPER_ADMIN`.
   - `OPERATIONS_ADMIN` (Rank 70) cannot grant `OPERATIONS_ADMIN`, `SAFETY_ADMIN`, or `SUPER_ADMIN`.
2. **Dedicated Role Management Permissions**:
   Role modification requires `roles:assign` or `roles:revoke`. General operational admins cannot alter user security profiles.
3. **Application-Level Append-Only Audit Logging**:
   Every role grant, role revocation, and custom permission assignment writes an append-only log record into `audit_logs` containing `actorId`, `actorRole`, `action`, `before`, `after`, `reason`, and `requestId`.
4. **Custom Permission Gate**:
   Explicit user-level overrides via `AdminPermission` records can only be provisioned by a `SUPER_ADMIN` with a documented business reason and optional expiration date.

---

## 6. Server-Side Enforcement Architecture

All authorization is centralized in `src/modules/rbac/`:

- **`permissions.ts`**: Canonical list of 12 roles, 50+ granular permissions, rank hierarchies, and role-to-permission mappings.
- **`authorize.ts`**: Core runtime authorization engine:
  - `resolveUserPermissions(userId, roles)`: Resolves active role capabilities + database `AdminPermission` grants.
  - `canUser(identity, permission, scope)`: Validates capabilities, IDOR ownership, and territory scoping.
  - `authorizePermission(permission, scope)`: API route middleware returning typed authorization or 401/403 responses.
  - `assignUserRole(...)` / `revokeUserRole(...)`: Safe role mutations with rank checks and audit logging.
- **`audit-logger.ts`**: Centralized, structured audit writer and query engine for `prisma.auditLog`.
- **`admin-access.ts`**: Route-level edge authorization matching paths to authorized role subsets.
- **`territory-scope.ts`**: Prisma where-clause generator for multi-tenant territory filtering.
