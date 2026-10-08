# MongoDB Backup, Restore & Disaster Recovery Runbook

> **Target Audience**: SRE / DevOps / On-Call Engineers  
> **Classification**: Operations Runbook  
> **Local Logical Rehearsal Status**: `IMPLEMENTED_AND_VERIFIED` (`scripts/verify-local-backup-restore.mjs`)  
> **Atlas Cloud Snapshot / PITR Status**: `DEFERRED CLOUD OWNER ACTION` (requires paid Atlas M10+ / Cloud Backup tier)

---

## A. Current Local / Synthetic Logical Backup & Restore Rehearsal (`VERIFIED`)

Because the current MongoDB Atlas cluster runs on a tier without paid Continuous Cloud Backups, PetSaathi provides a reproducible, non-destructive logical backup and restore verification harness in `scripts/verify-local-backup-restore.mjs` (`npm run dr:rehearsal:local`).

### 1. Safety Guarantees
- **Never** mutates, drops, or writes to the production `petsaathi` database (`FORBIDDEN_DB_NAMES` hard-blocks `petsaathi`, `admin`, `local`, and `config`).
- Uses isolated disposable databases (`petsaathi_backup_source` and `petsaathi_restore_test`) and an OS temporary directory that are automatically dropped and removed in a `finally` block.

### 2. Rehearsal Execution Command
```bash
npm run dr:rehearsal:local
# or directly:
node scripts/verify-local-backup-restore.mjs
```

### 3. Rehearsal Workflow & Verified Invariants
1. **Seed Synthetic Source Dataset (`petsaathi_backup_source`)**:
   Populates all 17 launch-critical collections (`users`, `user_roles`, `customer_profiles`, `sitter_profiles`, `pets`, `bookings`, `booking_assignments`, `payments`, `refunds`, `payouts`, `audit_logs`, `auth_sessions`, `auth_challenges`, `notification_outbox`, `societies`, `service_types`, `service_prices`) plus `auth_credentials`, `oauth_states`, and `addresses`.
2. **Logical Backup Export**:
   Serializes all collection documents (preserving BSON `ObjectId` and `Date` types) and non-default index specifications to a temporary backup artifact (`logical-backup.json`).
3. **Simulated Data Loss**:
   Drops `petsaathi_backup_source` and verifies zero collections remain.
4. **Restore Into Isolated Target (`petsaathi_restore_test`)**:
   Restores all documents and recreates all collection indexes into `petsaathi_restore_test`.
5. **Post-Restore Verification**:
   - Verifies 100% document count parity across all 17 launch-critical collections.
   - Verifies all 5 critical unique and TTL indexes:
     - `bookings.bookings_idempotency_key_key` (unique)
     - `auth_sessions.auth_sessions_ttl` (TTL)
     - `auth_challenges.auth_challenges_ttl` (TTL)
     - `auth_credentials.auth_credentials_user` (unique)
     - `oauth_states.oauth_states_expiry` (TTL)
   - Verifies `0` duplicate booking `idempotency_key` groups.
   - Executes read-only Prisma Client queries (`user.count()`, `booking.count()`, `payment.count()`, `auditLog.count()`, `serviceType.count()`) against `petsaathi_restore_test`.
   - Measured local rehearsal metrics: `rtoSeconds: 7.75`, `rpoSeconds: 0`, `collectionsVerified: 17`, `duplicateIdempotencyGroups: 0`.

### 4. Ad-Hoc Pre-Migration Logical Backup (`mongodump` / `mongorestore`)
When `mongodb-database-tools` (`mongodump` / `mongorestore`) are installed on an operator workstation, run a manual archive before schema or index changes:

```bash
# Export compressed archive
mongodump --uri="$MONGODB_URI" --archive="backup_$(date +%Y%m%d_%H%M%S).gz" --gzip

# Restore into an isolated staging/restore target database
mongorestore --uri="$MONGODB_RESTORE_URI" --archive="backup_20261007_000000.gz" --gzip --drop
```

---

## B. Future / Production Atlas Cloud Backup & PITR Plan (`DEFERRED CLOUD OWNER ACTION`)

> **Note**: The following procedures require upgrading the MongoDB Atlas cluster to a paid tier with **Atlas Cloud Backups / Continuous Cloud Backup (PITR)** enabled. Until that billing/tier upgrade is completed by the cloud owner, treat this section as the target production runbook.

### 1. Target Atlas Backup Policy (Post-Upgrade)

| Backup Tier | Frequency | Retention Window | Storage Location | Encryption |
|-------------|-----------|------------------|------------------|------------|
| **Continuous Oplog** | Real-time streaming | 24 hours | Dedicated Atlas Backup Store | AES-256 (At-Rest) |
| **Hourly Snapshots** | Every 1 hour | 48 hours | Multi-AZ Cloud Storage | AES-256 (At-Rest) |
| **Daily Snapshots** | Daily at 02:00 IST | 30 days | Geo-replicated AWS/GCP | KMS Managed Key |
| **Weekly Snapshots** | Sunday 03:00 IST | 90 days | Cold Archive Bucket | KMS Managed Key |
| **Monthly Snapshots** | 1st of month | 365 days (1 year) | Cold Compliance Archive | Immutable Object Lock |

### 2. Emergency Point-in-Time Restore (Atlas M10+ Only)

#### Step 1: Declare Incident & Pause Writes
Place the deployment into maintenance mode or pause webhook/mutation ingestion to prevent new writes during recovery cutover.

#### Step 2: Determine Exact Point-in-Time
Inspect Sentry and MongoDB `audit_logs` to identify the exact UTC timestamp prior to corruption (subtracting a 2-minute safety margin).

#### Step 3: Trigger Restore to Staging Cluster via Atlas CLI
```bash
atlas backups restores start \
  --clusterName PetSaathi-Prod \
  --deliveryType pointInTime \
  --pointInTimeUTC 2026-10-07T09:00:00Z \
  --targetClusterName PetSaathi-Restored-Staging \
  --targetProjectId <PROJECT_ID>
```

#### Step 4: Verify Restored Data & Indexes
Run read-only index and collection verification against the restored staging cluster:
```bash
MONGODB_URI="$STAGING_RESTORE_URI" node scripts/verify-booking-indexes.mjs
```

#### Step 5: Cut Over Application Connection Strings
Update `MONGODB_URI` and `MONGODB_PRISMA_URI` in the cloud deployment environment and run:
```bash
npm run doctor:production
npm run test:concurrency
```

