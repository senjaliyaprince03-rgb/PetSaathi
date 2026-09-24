# PetSaathi Platform: Role & Permission Capabilities Matrix

This document provides the definitive, production-grade mapping between all **12 system roles** and the **granular resource-level permissions** enforced by the PetSaathi RBAC engine.

---

## 1. System Roles Overview

| Role | Tier | Rank | Governance & Operational Scope |
| :--- | :--- | :---: | :--- |
| **`SUPER_ADMIN`** | Tier 1 | 100 | **Platform Governance:** Unrestricted platform authority. Role & permission management, feature flags, system config, global audit trail, emergency overrides. |
| **`OPERATIONS_ADMIN`** | Tier 2 | 70 | **Operational Dispatch:** Central booking queue management, manual sitter matching, live telemetry oversight, emergency reassignments. |
| **`SAFETY_ADMIN`** | Tier 2 | 70 | **Trust & Safety:** Incident response, veterinary escalation, safety audits, provider safety holds/suspensions. |
| **`FINANCE_ADMIN`** | Tier 2 | 70 | **Commerce & Ledger:** Service pricing catalogs, subscription plans, refund execution, payout approvals, B2B invoicing. |
| **`VERIFICATION_ADMIN`** | Tier 2 | 60 | **Caregiver Onboarding:** Sitter application reviews, KYC identity verification, practical assessments, boarding property evaluations. |
| **`CONTENT_ADMIN`** | Tier 2 | 60 | **Editorial & Brand:** Journal publishing, testimonial curation, marketing banners, localized city landing pages. |
| **`PARTNER_MANAGER`** | Tier 2 | 60 | **B2B & Partnerships:** Corporate benefit programme management, employee stipend quotas, vendor partnerships. |
| **`CITY_MANAGER`** | Tier 3 | 50 | **Regional Operations:** City-level capacity management, regional matching queue, localized service availability. |
| **`SOCIETY_MANAGER`** | Tier 3 | 40 | **Gated Communities:** Residential society onboarding, resident gate protocols, community vaccination camps. |
| **`OPERATOR`** | Tier 3 | 40 | **Franchise Operating Partner:** Local partner delivering services in assigned service zones, managing local sitter pools. |
| **`SITTER`** | Tier 4 | 20 | **Saathi Caregiver:** Assigned visit execution, check-in/check-out telemetry, report card submissions, payout requests. |
| **`CUSTOMER`** | Tier 4 | 10 | **Pet Parent:** Pet profile & health passport management, care bookings, sitter replacement approvals, review submissions. |

---

## 2. Granular Permissions Dictionary

### 2.1 User & Identity Management
- `users:read:own`: Read own profile and settings.
- `users:write:own`: Update own profile and notification preferences.
- `users:read:any`: View user listings across the platform.
- `users:write:any`: Update user status or admin notes.
- `users:manage_roles`: Assign or revoke user roles.

### 2.2 Roles & RBAC Governance
- `roles:read`: Inspect role definitions and granted permissions.
- `roles:assign`: Assign a role to a user (subject to hierarchy rank rules).
- `roles:revoke`: Revoke a role from a user (subject to hierarchy rank rules).

### 2.3 Pets & Health Records
- `pet:read:own`: View pets registered by the authenticated user.
- `pet:write:own`: Add or edit pets registered by the authenticated user.
- `pet:read:any`: View any pet passport on the platform for care or emergency.
- `pet:write:any`: Update any pet record for veterinary or safety intervention.
- `medical:read:own`: View medical, vaccination, and diet records for own pets.
- `medical:write:own`: Upload vaccination certificates and medical notes for own pets.
- `medical:read:any`: Access pet medical records for safety or boarding verification.
- `medical:write:any`: Record clinical or safety audit annotations on pet records.

### 2.4 Bookings & Service Delivery
- `booking:read:own`: View bookings booked by the authenticated customer.
- `booking:create`: Book and pay for dog walking, boarding, or grooming services.
- `booking:cancel:own`: Cancel an upcoming booking within cancellation policy rules.
- `booking:operate`: Manage bookings in operational queues, review requests, and transition states.
- `booking:dispatch`: Propose and assign caregivers to bookings.
- `booking:override`: Emergency state override (e.g. force cancellation, manual completion).

### 2.5 Saathi (Sitter) Assignments
- `assignment:read:assigned`: View bookings directly assigned to the caregiver.
- `assignment:accept:assigned`: Accept or decline an incoming assignment offer.
- `service:update:assigned`: Record GPS start/stop, potty logs, photos, and report cards.
- `matching:decide`: Run matching engine and confirm caregiver proposals.
- `matching:override`: Manually bypass automated caregiver ranking.
- `verification:read`: View sitter applications and background check submissions.
- `verification:decide`: Approve, pause, or reject sitter certifications.

### 2.6 Safety & Trust
- `incident:read`: View safety escalation queues and incident reports.
- `incident:operate`: Triage incidents, assign responders, and record incident events.
- `incident:override`: Close incidents, release holds, or mandate corrective actions.
- `safety:hold_manage`: Place or lift emergency safety holds on sitters or customers.

### 2.7 Finance, Invoicing & Payouts
- `finance:read`: View platform ledger, transactions, and payment orders.
- `finance:operate`: Configure service rates, pricing tiers, and tax basis points.
- `finance:refund`: Authorize and trigger Razorpay refunds to customers.
- `finance:payout`: Authorize weekly direct-to-bank Saathi earnings payouts.
- `b2b:invoicing`: Generate corporate enterprise invoices and reconcile stipend ledgers.

### 2.8 B2B, Community & Content
- `b2b:read`: View corporate partners, employee rosters, and wallet balances.
- `b2b:operate`: Manage partner programmes, subsidy rates, and corporate contracts.
- `partner:operate`: Onboard operating franchise partners and manage territory boundaries.
- `society:read`: View residential gated societies and registered pet resident directories.
- `society:operate`: Provision society gate protocols and schedule community camps.
- `content:read`: View blog drafts, city landing pages, and customer testimonials.
- `content:write`: Author blog posts, editorial FAQs, and marketing resources.
- `content:publish`: Publish content live to search engines and public portals.
- `content:operate`: Curate and approve customer reviews and testimonials.

### 2.9 Territory & System
- `operator:read`: View territory health metrics, active caregivers, and capacity limits.
- `operator:operate`: Configure localized capacity limits and emergency closures.
- `system:admin`: Global platform administrative privileges.
- `system:feature_flags`: Toggle runtime feature flags across environments.
- `system:audit_logs`: Query immutable security and governance audit logs.
- `system:config`: Modify global platform settings and API integrations.

---

## 3. Comprehensive Role-Permission Matrix

| Permission | `SUPER_ADMIN` | `OPERATIONS_ADMIN` | `SAFETY_ADMIN` | `FINANCE_ADMIN` | `VERIFICATION_ADMIN` | `CONTENT_ADMIN` | `PARTNER_MANAGER` | `CITY_MANAGER` | `SOCIETY_MANAGER` | `OPERATOR` | `SITTER` | `CUSTOMER` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `users:read:own` | **✓** | **✓** | **✓** | **✓** | **✓** | **✓** | **✓** | **✓** | **✓** | **✓** | **✓** | **✓** |
| `users:write:own` | **✓** | **✓** | **✓** | **✓** | **✓** | **✓** | **✓** | **✓** | **✓** | **✓** | **✓** | **✓** |
| `users:read:any` | **✓** | **✓** | **✓** | **✓** | **✓** | - | **✓** | **✓** | - | - | - | - |
| `users:write:any` | **✓** | **✓** | - | - | - | - | - | - | - | - | - | - |
| `users:manage_roles` | **✓** | - | - | - | - | - | - | - | - | - | - | - |
| `roles:read` | **✓** | - | - | - | - | - | - | - | - | - | - | - |
| `roles:assign` | **✓** | - | - | - | - | - | - | - | - | - | - | - |
| `roles:revoke` | **✓** | - | - | - | - | - | - | - | - | - | - | - |
| `pet:read:own` | **✓** | - | - | - | - | - | - | - | - | - | - | **✓** |
| `pet:write:own` | **✓** | - | - | - | - | - | - | - | - | - | - | **✓** |
| `pet:read:any` | **✓** | **✓** | **✓** | - | - | - | - | - | - | - | - | - |
| `pet:write:any` | **✓** | - | **✓** | - | - | - | - | - | - | - | - | - |
| `medical:read:own` | **✓** | - | - | - | - | - | - | - | - | - | - | **✓** |
| `medical:write:own` | **✓** | - | - | - | - | - | - | - | - | - | - | **✓** |
| `medical:read:any` | **✓** | - | **✓** | - | **✓** | - | - | - | - | - | - | - |
| `medical:write:any` | **✓** | - | **✓** | - | - | - | - | - | - | - | - | - |
| `booking:read:own` | **✓** | - | - | - | - | - | - | - | - | - | - | **✓** |
| `booking:create` | **✓** | - | - | - | - | - | - | - | - | - | - | **✓** |
| `booking:cancel:own`| **✓** | - | - | - | - | - | - | - | - | - | - | **✓** |
| `booking:operate` | **✓** | **✓** | - | - | - | - | - | **✓*** | **✓*** | **✓*** | - | - |
| `booking:dispatch` | **✓** | **✓** | - | - | - | - | - | **✓*** | - | - | - | - |
| `booking:override` | **✓** | **✓** | - | - | - | - | - | - | - | - | - | - |
| `assignment:read:assigned` | **✓** | - | - | - | - | - | - | - | - | - | **✓** | - |
| `assignment:accept:assigned`| **✓** | - | - | - | - | - | - | - | - | - | **✓** | - |
| `service:update:assigned` | **✓** | - | - | - | - | - | - | - | - | - | **✓** | - |
| `matching:decide` | **✓** | **✓** | - | - | - | - | - | **✓*** | - | - | - | - |
| `matching:override`| **✓** | **✓** | - | - | - | - | - | - | - | - | - | - |
| `verification:read`| **✓** | **✓** | **✓** | - | **✓** | - | - | - | - | - | - | - |
| `verification:decide`| **✓** | - | - | - | **✓** | - | - | - | - | - | - | - |
| `incident:read` | **✓** | **✓** | **✓** | - | - | - | - | - | - | - | - | - |
| `incident:operate` | **✓** | - | **✓** | - | - | - | - | - | - | - | - | - |
| `incident:override`| **✓** | - | **✓** | - | - | - | - | - | - | - | - | - |
| `safety:hold_manage`| **✓** | - | **✓** | - | - | - | - | - | - | - | - | - |
| `finance:read` | **✓** | - | - | **✓** | - | - | - | - | - | - | - | - |
| `finance:operate` | **✓** | - | - | **✓** | - | - | - | - | - | - | - | - |
| `finance:refund` | **✓** | - | - | **✓** | - | - | - | - | - | - | - | - |
| `finance:payout` | **✓** | - | - | **✓** | - | - | - | - | - | - | - | - |
| `b2b:invoicing` | **✓** | - | - | **✓** | - | - | - | - | - | - | - | - |
| `b2b:read` | **✓** | - | - | - | - | - | **✓** | - | - | - | - | - |
| `b2b:operate` | **✓** | - | - | - | - | - | **✓** | - | - | - | - | - |
| `partner:operate` | **✓** | - | - | - | - | - | **✓** | - | - | - | - | - |
| `society:read` | **✓** | - | - | - | - | - | - | - | **✓** | - | - | - |
| `society:operate` | **✓** | - | - | - | - | - | - | - | **✓** | - | - | - |
| `content:read` | **✓** | - | - | - | - | **✓** | - | - | - | - | - | - |
| `content:write` | **✓** | - | - | - | - | **✓** | - | - | - | - | - | - |
| `content:publish` | **✓** | - | - | - | - | **✓** | - | - | - | - | - | - |
| `content:operate` | **✓** | - | - | - | - | **✓** | - | - | - | - | - | - |
| `operator:read` | **✓** | **✓** | - | - | - | - | **✓** | **✓*** | - | **✓*** | - | - |
| `operator:operate` | **✓** | **✓** | - | - | - | - | - | **✓*** | - | - | - | - |
| `system:admin` | **✓** | - | - | - | - | - | - | - | - | - | - | - |
| `system:feature_flags` | **✓** | - | - | - | - | - | - | - | - | - | - | - |
| `system:audit_logs`| **✓** | - | - | - | - | - | - | - | - | - | - | - |
| `system:config` | **✓** | - | - | - | - | - | - | - | - | - | - | - |

*\* Indicates that permission execution is dynamically constrained by Territory Scope (assigned city / service zone).*
