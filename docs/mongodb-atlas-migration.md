# MongoDB Atlas migration runbook

The application, authentication state, rate limits, and private file objects now use MongoDB Atlas. Prisma uses its MongoDB connector and GridFS stores quarantined and promoted uploads.

## 1. Provision Atlas

1. Create separate development, preview, and production projects or clusters.
2. Create a least-privilege database user with `readWrite` on only the target database.
3. Enable continuous backups for production and configure an alert for replication lag, connection saturation, and storage growth.
4. Add approved application egress addresses to Atlas Network Access.
5. Store `MONGODB_URI`, `MONGODB_DATABASE`, `AUTH_SECRET`, and `UPLOAD_SIGNING_SECRET` in Vercel and GitHub Secrets.

## 2. Validate and create indexes

```powershell
$env:MONGODB_URI = "mongodb+srv://<user>:<password>@<cluster>/petsaathi?retryWrites=true&w=majority"
$env:MONGODB_DATABASE = "petsaathi"
npm run prisma:validate
npm run prisma:push
```

`prisma db push` is intentional: Prisma Migrate does not support the MongoDB connector.

## 3. Copy existing relational data

The importer is read-only against the source and refuses to write into any non-empty target collection.

```powershell
$env:SOURCE_POSTGRES_URL = "<temporary-read-only-source-connection>"
$env:MONGODB_URI = "<atlas-connection-string-with-database>"
$env:MONGODB_DATABASE = "petsaathi"
npm run db:migrate-to-atlas -- --dry-run
npm run db:migrate-to-atlas
npm run prisma:push
```

The copy preserves UUID identifiers and relation fields, converts numeric values to MongoDB doubles, converts non-key 64-bit integers to BSON Int64, and generates document IDs for former compound-key join tables. It never deletes source data.

## 4. Cut over safely

1. Put write-heavy workflows into maintenance mode.
2. Run the final data copy into an empty production database.
3. Apply indexes with `npm run prisma:push`.
4. deploy with the Atlas secrets, then verify `/api/ready`, signup, email OTP verification, sign-in, booking creation, payment webhooks, and GridFS quarantine promotion.
5. Keep the old source read-only until the retention window and reconciliation checks are complete.

## 5. Roll back

Do not mutate or delete the old source during cutover. If validation fails, restore the previous deployment and its previous database connection. If Atlas data must be rolled back later, restore a point-in-time snapshot into a new database and switch only after verification.
