# Database Architecture, Indexing & Migration Strategy

> **Database**: MongoDB Atlas (Replica Set M10+)  
> **ORM / Driver**: Prisma Client (with `relationMode = "prisma"`) + MongoDB native driver  
> **Schema Definition**: `prisma/schema.prisma`  
> **Migration Engine**: `scripts/db/migrate.ts` (`npm run migrate`)

---

## 1. Schema Overview

PetSaathi models real-world dog-walking operations across Indian gated communities. The database schema encompasses:
- **Core Entities**: `User`, `CustomerProfile`, `SitterProfile`, `Pet`, `Society`
- **Booking & Operational Pipeline**: `Booking`, `BookingAssignment`, `BookingStatusHistory`, `ServiceEvent`, `TrackingSession`, `TrackingPoint`
- **Financial & Settlement**: `Payment`, `PaymentEvent`, `Refund`, `Payout`, `LedgerEntry`
- **Safety & Quality**: `Incident`, `IncidentEvent`, `CorrectiveAction`, `Complaint`, `Review`
- **Security & Access Control**: `AuditLog`, `DataAccessLog`, `RateLimitBucket`, `AdminPermission`

---

## 2. Index Strategy & Performance Tuning

All high-frequency queries in PetSaathi are optimized to avoid collection scans (`COLLSCAN`) and execute strictly via B-Tree index scans (`IXSCAN`).

### Critical Compound Indexes

| Collection | Index Name | Key Definition | Query Pattern |
|------------|------------|----------------|---------------|
| `bookings` | `bookings_status_created_at_idx` | `{ status: 1, created_at: -1 }` | Admin operations dispatch queue & active booking filters |
| `bookings` | `bookings_customer_id_status_idx` | `{ customer_id: 1, status: 1 }` | Customer dashboard "My Active Bookings" |
| `booking_assignments` | `booking_assignments_sitter_id_status_idx` | `{ sitter_id: 1, status: 1 }` | Saathi portal incoming job offers & active shifts |
| `tracking_sessions` | `tracking_sessions_booking_id_idx` | `{ booking_id: 1 }` | Live GPS tracking lookup during active walk |
| `tracking_points` | `tracking_points_session_id_recorded_at_idx` | `{ session_id: 1, recorded_at: 1 }` | Chronological breadcrumb path reconstruction |
| `society_sitter_pools`| `society_sitter_pools_society_id_status_idx` | `{ society_id: 1, status: 1 }` | Sitter eligibility matching within society geofence |
| `societies` | `societies_city_locality_status_idx` | `{ city: 1, locality: 1, status: 1 }` | Serviceability check by location and status |

### Verifying Query Execution Plans
Run the automated explain plan verification suite:
```bash
npx tsx scripts/db/verify-indexes-explain.ts
```
Expected output confirms `Stage: IXSCAN` for every audited query pattern.

---

## 3. Schema Migration Strategy

Because MongoDB is schema-flexible, production schema evolution must be managed with disciplined, version-controlled scripts that guarantee zero-downtime deployments.

### Principles:
1. **Additive, Non-Destructive**: Never rename or delete fields in-place. Follow the Expand/Contract (Parallel Run) pattern:
   - **Phase 1 (Expand)**: Add new optional field, write code to dual-write or read with fallback.
   - **Phase 2 (Migrate)**: Run migration script to backfill historical documents in batches.
   - **Phase 3 (Contract)**: Deprecate old field after all running code versions use the new field.
2. **Versioned Scripts**: Stored in `migrations/` named with timestamp format:
   `migrations/YYYYMMDD_NNN_descriptive_name.ts`
3. **Idempotent Execution**: Every migration script must be safe to re-run multiple times without producing duplicate entries or failing.
4. **Execution Tracking**: The `_migrations` collection tracks every executed migration script with its execution duration and timestamp.

### Running Migrations:
```bash
# Check status and apply all pending migrations in order:
npm run migrate

# Apply MongoDB partial unique indexes and validators:
npm run mongodb:indexes
```

### Adding a New Migration:
Create a new file in `migrations/`, e.g. `migrations/20261001_001_add_society_gate_codes.ts`:
```typescript
import { Db } from "mongodb";

export async function up(db: Db): Promise<void> {
  const societies = db.collection("societies");
  // Example additive backfill:
  await societies.updateMany(
    { gateCodesEnabled: { $exists: false } },
    { $set: { gateCodesEnabled: false } }
  );
}

export async function down(db: Db): Promise<void> {
  // Optional rollback logic if reversible
}
```
