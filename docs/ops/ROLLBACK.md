# PetSaathi Disaster Recovery & Rollback Playbook (Phase 6)

## 1. Instant Vercel Rollback (< 2 Minutes)
If a critical frontend or serverless API bug escapes to production:
1. Navigate to the Vercel Dashboard -> PetSaathi Project -> Deployments.
2. Identify the previous stable production deployment.
3. Click the three dots (...) on the previous deployment and select Instant Rollback.
4. Verification: Run curl https://petsaathi.com/api/health to verify 200 OK.

## 2. Database Rollback & Point-in-Time Recovery (PITR)
PetSaathi runs on MongoDB Atlas with Continuous Cloud Backups (PITR enabled):
1. Atlas Snapshot Restoration:
   - Navigate to MongoDB Atlas Console -> Database Deployments -> PetSaathi Production.
   - Click Backup tab -> Restore.
   - Select Point-in-Time Restore and specify the exact UTC/IST timestamp before the incident.
2. Schema Rollback:
   - Revert schema changes locally in prisma/schema.prisma.
   - Run npx prisma db push against staging first, verify indexes via node scripts/apply-mongodb-indexes.js.

## 3. Razorpay Emergency Fallback
If Razorpay experiences upstream downtime:
1. Enable concierge booking via WhatsApp (+91-9876543210) where bookings can be confirmed manually.
2. Sitter payouts remain protected and logged in the offline ledger.

## 4. Communication Protocol
In case of downtime exceeding 15 minutes, notify active booking participants via SMS/WhatsApp with direct caregiver emergency phone contact.