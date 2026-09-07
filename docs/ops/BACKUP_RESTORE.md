# MongoDB Atlas Backup & Emergency Recovery Runbook

> **Target Audience**: SRE / DevOps / On-Call Engineers  
> **Classification**: Operations Runbook (Task 3.2 & Task 8.2)  
> **RPO Target**: < 1 hour (Continuous Cloud Backups)  
> **RTO Target**: < 30 minutes to hot standby cluster

---

## 1. Backup Policy & Architecture

PetSaathi utilizes **MongoDB Atlas Continuous Cloud Backups** configured across multi-AZ replica sets.

| Backup Tier | Frequency | Retention Window | Storage Location | Encryption |
|-------------|-----------|------------------|------------------|------------|
| **Continuous Oplog** | Real-time streaming | 24 hours | Dedicated Atlas Backup Store | AES-256 (At-Rest) |
| **Hourly Snapshots** | Every 1 hour | 48 hours | Multi-AZ Cloud Storage | AES-256 (At-Rest) |
| **Daily Snapshots** | Daily at 02:00 IST | 30 days | Geo-replicated AWS/GCP | KMS Managed Key |
| **Weekly Snapshots** | Sunday 03:00 IST | 90 days | Cold Archive Bucket | KMS Managed Key |
| **Monthly Snapshots** | 1st of month | 365 days (1 year) | Cold Compliance Archive | Immutable Object Lock |

---

## 2. Emergency Restore Scenarios

### Scenario A: Accidental Data Deletion / Corrupted Deployment
*Example: Malformed migration dropped or overwrote documents.*

#### Step 1: Declare Incident & Stop Traffic
1. Route ingress to maintenance page via Cloudflare or ALB listener rules.
2. In AWS ALB / NGINX:
   ```bash
   # Temporarily disable traffic upstream to prevent writing dirty data
   systemctl stop nginx
   ```

#### Step 2: Determine Exact Point-in-Time
Inspect Sentry / MongoDB Atlas Audit Logs to identify exact timestamp of corruption (e.g. `2026-09-05T01:14:22Z`). Subtract 2 minutes for safety margin (e.g. `2026-09-05T01:12:00Z`).

#### Step 3: Trigger Point-in-Time Restore via Atlas CLI / API
```bash
# Using Atlas CLI (mongocli / atlas)
atlas backups restores start \
  --clusterName PetSaathi-Prod \
  --deliveryType pointInTime \
  --pointInTimeUTC 2026-09-05T01:12:00Z \
  --targetClusterName PetSaathi-Restored-Staging \
  --targetProjectId <PROJECT_ID>
```

#### Step 4: Verify Restored Data Integrity
Connect to `PetSaathi-Restored-Staging` and run verification queries:
```bash
# Verify record counts match pre-incident metrics
node -e '
const { MongoClient } = require("mongodb");
async function check() {
  const client = new MongoClient(process.env.STAGING_RESTORE_URI);
  await client.connect();
  const db = client.db("petsaathi");
  const users = await db.collection("users").countDocuments();
  const bookings = await db.collection("bookings").countDocuments();
  console.log({ users, bookings });
  await client.close();
}
check();
'
```

#### Step 5: Switch App Connection Strings
Update environment variables in Doppler / AWS Secrets Manager:
```bash
DATABASE_URL="mongodb+srv://app_user:secret@petsaathi-restored-prod.mongodb.net/petsaathi?retryWrites=true&w=majority"
```
Redeploy application or trigger zero-downtime rolling restart.

---

### Scenario B: Full Cluster Disaster Recovery (Cloud Region Outage)
*Example: AWS ap-south-1 (Mumbai) complete regional failure.*

1. **Restore Snapshot to Secondary Region**:
   ```bash
   atlas backups restores start \
     --clusterName PetSaathi-Prod \
     --deliveryType automated \
     --snapshotId <LATEST_HEALTHY_SNAPSHOT_ID> \
     --targetClusterName PetSaathi-DR-Hyd \
     --targetProjectId <PROJECT_ID>
   ```
2. **Update DNS / Route53**:
   Switch `api.petsaathi.com` CNAME to failover ALB in Hyderabad / secondary region.
3. **Run Sanity Checks**:
   ```bash
   npm run doctor:production
   npm run test:concurrency
   ```

---

## 3. Automated Local Snapshot Tool (Ad-hoc Pre-migration)

Before running critical schema changes or data transformations, create a manual snapshot:

```bash
# Export compressed archive with oplog
mongodump --uri="$MONGODB_URI" --archive="backup_$(date +%Y%m%d_%H%M%S).gz" --gzip --oplog

# Emergency Restore Command (from archive)
mongorestore --uri="$MONGODB_TARGET_URI" --archive="backup_20260905_000000.gz" --gzip --oplogReplay --drop
```

---

## 4. Verification & Testing Cadence

1. **Automated Drill**: Every 1st Tuesday of the month, a scheduled GitHub Action executes an automated restore of yesterday's daily snapshot to an isolated staging sandbox cluster.
2. **Integrity Validation**: Runs `scripts/db/verify-indexes-explain.ts` and `npm run test:simulate` against the restored sandbox.
3. **Audit Log**: Results published to `#ops-alerts` Slack channel.
