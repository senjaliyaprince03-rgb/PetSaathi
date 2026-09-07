# MongoDB Atlas Database Security & Hardening Architecture

> **Classification**: Security Architecture Document (Task 3.4)  
> **Status**: Production-Hardened  
> **Compliance Alignment**: India DPDP Act 2023, ISO 27001, SOC 2 Type II

---

## 1. Principle of Least Privilege: Role-Based DB Users

PetSaathi prohibits the use of administrative (`atlasAdmin` or `dbOwner`) users in production application runtime. The database access topology is partitioned across 4 distinct roles:

```
                  ┌─────────────────────────────────────────┐
                  │          MongoDB Atlas Cluster          │
                  └────┬───────────────┬───────────────┬────┘
                       │               │               │
      ┌────────────────┴┐     ┌────────┴────────┐     ┌┴────────────────┐
      │   App Runtime   │     │ Migration / CI  │     │ Analytics (Read)│
      │   (Read/Write)  │     │   (DDL/Admin)   │     │   (Read Only)   │
      └─────────────────┘     └─────────────────┘     └─────────────────┘
```

| User / Role | Scope | Privileges | Used By |
|-------------|-------|------------|---------|
| `petsaathi_app_prod` | `petsaathi` DB only | `readWrite` (no DDL drop/alter collection) | Next.js API server instances |
| `petsaathi_migrator` | `petsaathi` DB only | `dbAdmin`, `readWrite` | CI/CD pipeline for migrations & index creation |
| `petsaathi_analytics`| `petsaathi` DB only | `read` (restricted; excluding `users.passwordHash`) | Metabase / Data Engineering pipelines |
| `petsaathi_backup_agent`| Cluster-wide | `backup` role | Atlas automated snapshot daemon |

---

## 2. Network Isolation & Zero-Trust Access

1. **IP Access List Lockdown**:
   - Production forbids wildcard `0.0.0.0/0` access.
   - Access is restricted strictly to:
     - VPC Peering / AWS PrivateLink / GCP VPC Network Peering with the application subnet.
     - Static egress NAT Gateway IPs of production ECS/K8s/VM clusters.
     - Bastion Jump Host IP (secured by Hardware MFA / Tailscale WireGuard).
2. **Mandatory TLS 1.3 In-Transit**:
   - Connection string requires TLS verification:
     ```
     mongodb+srv://<user>:<password>@cluster.mongodb.net/petsaathi?tls=true&retryWrites=true&w=majority
     ```
   - Unencrypted connections on port 27017 are rejected at the edge.

---

## 3. Encryption at Rest & Key Management

- **Storage Engine Encryption**: WiredTiger encrypted storage enabled across all replica set nodes using **AES-256 in CBC mode**.
- **Customer-Managed Key (CMK)**: Integration with AWS KMS / GCP Cloud KMS for cryptographic key rotation every 90 days.
- **Client-Side Field Level Encryption (CSFLE)**: Sensitive PII (user phone numbers, Aadhaar/ID proof metadata) encrypted with client-side data keys before hitting the network socket.

---

## 4. Atlas Database Auditing

Audit logging is configured to record security-sensitive events in JSON format shipped to Amazon CloudWatch / Datadog Logs:

```json
{
  "atype": "authCheck",
  "ts": { "$date": "2026-09-05T00:00:00.000Z" },
  "local": { "ip": "10.0.4.12", "port": 27017 },
  "remote": { "ip": "10.0.2.85", "port": 45120 },
  "users": [{ "user": "petsaathi_app_prod", "db": "petsaathi" }],
  "roles": [{ "role": "readWrite", "db": "petsaathi" }],
  "param": {
    "command": "dropDatabase",
    "ns": "petsaathi"
  },
  "result": 13 // Unauthorized - prevented by role
}
```

Audit filter tracks:
- Authentication failures (`authFailure`)
- DDL modifications (`dropCollection`, `dropDatabase`, `collMod`)
- User/role modifications (`createUser`, `grantRolesToUser`)
