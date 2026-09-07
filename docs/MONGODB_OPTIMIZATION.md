# MongoDB Optimization Guide

This document outlines the high-volume query paths in PetSaathi and the indexes that support them.

## Index Strategy

PetSaathi uses MongoDB with Prisma ORM. All indexes are defined in `prisma/schema.prisma` and automatically created during migrations.

## High-Volume Query Paths

### 1. Booking Queries

**Query patterns:**
- Customer dashboard: fetch all bookings by customer, sorted by creation date
- Operations dashboard: filter bookings by status and scheduled start time
- Service-specific views: filter bookings by service type and scheduled start

**Indexes:**
```prisma
@@index([customerId, createdAt])
@@index([status, scheduledStart])
@@index([serviceTypeId, scheduledStart])
```

**Rationale:**
- First index supports customer dashboards (`WHERE customerId = ? ORDER BY createdAt DESC`)
- Second index supports operations filtering (`WHERE status = ? AND scheduledStart >= ?`)
- Third index supports service-specific filtering (`WHERE serviceTypeId = ? AND scheduledStart >= ?`)

### 2. Tracking Points

**Query patterns:**
- Fetch all GPS points for a tracking session, ordered by timestamp
- Real-time tracking: fetch latest points for active sessions

**Indexes:**
```prisma
@@index([sessionId, recordedAt])
```

**Rationale:**
- Supports efficient range queries for GPS tracks (`WHERE sessionId = ? ORDER BY recordedAt ASC`)
- Critical for real-time tracking performance (fetching every 10-30 seconds)

### 3. Payment Queries

**Query patterns:**
- Fetch all payments for a booking by status
- Payment reconciliation: filter by status and creation time

**Indexes:**
```prisma
@@index([bookingId, status])
```

**Rationale:**
- Supports payment dashboard queries (`WHERE bookingId = ? AND status = ?`)
- Used for refund eligibility checks and reconciliation

### 4. Notification Outbox

**Query patterns:**
- Fetch queued notifications for processing
- Retry failed notifications after delay

**Indexes:**
```prisma
@@index([status, scheduledAt])
```

**Rationale:**
- Supports outbox processor (`WHERE status = 'QUEUED' AND scheduledAt <= NOW() ORDER BY scheduledAt ASC LIMIT 100`)
- Critical for notification reliability

### 5. Incident Queries

**Query patterns:**
- Operations dashboard: filter incidents by status, severity, and detection time
- Fetch incidents for specific booking

**Indexes:**
```prisma
@@index([status, severity, detectedAt])
@@index([bookingId])
```

**Rationale:**
- First index supports operations filtering (`WHERE status = ? AND severity = ? ORDER BY detectedAt DESC`)
- Second index supports booking-specific incident lookups

### 6. Entitlement Ledger

**Query patterns:**
- Calculate current balance: sum all deltas for a subscription and entitlement key
- Audit trail: fetch all transactions for a subscription, ordered by timestamp

**Indexes:**
```prisma
@@index([subscriptionId, entitlementKey, createdAt])
```

**Rationale:**
- Supports balance calculation (`WHERE subscriptionId = ? AND entitlementKey = ? ORDER BY createdAt DESC LIMIT 1`)
- Append-only ledger: index supports both writes and reads efficiently

## Query Performance Guidelines

### 1. Always Use Indexes

❌ **Bad:**
```typescript
const bookings = await db.booking.findMany({
  where: { customerId },
  orderBy: { scheduledStart: 'desc' }, // scheduledStart not in compound index with customerId
});
```

✅ **Good:**
```typescript
const bookings = await db.booking.findMany({
  where: { customerId },
  orderBy: { createdAt: 'desc' }, // createdAt is in compound index with customerId
});
```

### 2. Avoid Full Collection Scans

❌ **Bad:**
```typescript
const incidents = await db.incident.findMany({
  where: { category: 'PET_INJURY' }, // category is not indexed
});
```

✅ **Good:**
```typescript
const incidents = await db.incident.findMany({
  where: { 
    status: 'REPORTED', // status is part of compound index
    severity: 'HIGH' 
  },
});
```

### 3. Limit Result Sets

❌ **Bad:**
```typescript
const points = await db.trackingPoint.findMany({
  where: { sessionId },
}); // Could return thousands of GPS points
```

✅ **Good:**
```typescript
const points = await db.trackingPoint.findMany({
  where: { sessionId },
  orderBy: { recordedAt: 'desc' },
  take: 100, // Limit to most recent 100 points
});
```

### 4. Use Projections to Reduce Data Transfer

❌ **Bad:**
```typescript
const bookings = await db.booking.findMany({
  where: { status: 'CONFIRMED' },
  include: { // Fetches all related data
    customer: true,
    pet: true,
    assignments: true,
    payments: true,
    reports: true,
  },
});
```

✅ **Good:**
```typescript
const bookings = await db.booking.findMany({
  where: { status: 'CONFIRMED' },
  select: { // Only fetch required fields
    id: true,
    reference: true,
    scheduledStart: true,
    customer: { select: { name: true } },
  },
});
```

## Monitoring & Alerts

### Query Performance Monitoring

1. **Slow Query Log**: MongoDB logs queries taking >100ms by default
2. **Prisma Metrics**: Enable query tracing in production:

```typescript
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'warn', emit: 'stdout' },
  ],
});

db.$on('query', (e) => {
  if (e.duration > 100) {
    console.warn(`Slow query detected (${e.duration}ms): ${e.query}`);
  }
});
```

### Index Health Monitoring

Run monthly index utilization analysis:

```javascript
db.bookings.aggregate([
  { $indexStats: {} },
  { $sort: { 'accesses.ops': -1 } }
])
```

Look for:
- Unused indexes (0 operations) → consider removal
- Missing indexes (frequent collection scans in slow query log) → add index

## Future Optimization Opportunities

### 1. Geospatial Indexes for GPS Queries

If we need to query tracking points by geographic location (e.g., "find all Saathis within 5km of customer"), add a 2dsphere index:

```prisma
model TrackingPoint {
  // ...
  @@index([location], type: "2dsphere") // Requires MongoDB 4.4+
}
```

### 2. Text Search Indexes

For full-text search on incident descriptions or booking notes:

```prisma
model Incident {
  // ...
  @@index([description], type: "text")
}
```

### 3. TTL Indexes for Automatic Cleanup

For temporary data like tracking points older than 90 days:

```prisma
model TrackingPoint {
  // ...
  @@index([recordedAt], type: "ttl", expireAfterSeconds: 7776000) // 90 days
}
```

Note: Prisma does not yet support TTL indexes directly. Use native MongoDB commands for now.

## Resources

- [MongoDB Index Best Practices](https://www.mongodb.com/docs/manual/indexes/)
- [Prisma Performance Guide](https://www.prisma.io/docs/guides/performance-and-optimization)
- [MongoDB Explain Plans](https://www.mongodb.com/docs/manual/reference/explain-results/)
