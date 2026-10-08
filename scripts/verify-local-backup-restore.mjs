import dns from "node:dns";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { PrismaClient } from "@prisma/client";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // ignore
}

dotenv.config({ path: path.resolve(process.cwd(), ".env"), quiet: true });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true, quiet: true });

const SOURCE_DB_NAME = "petsaathi_backup_source";
const RESTORE_DB_NAME = "petsaathi_restore_test";

const FORBIDDEN_DB_NAMES = new Set(["petsaathi", "admin", "local", "config"]);

function buildDbUrl(baseUri, targetDbName) {
  if (FORBIDDEN_DB_NAMES.has(targetDbName.toLowerCase())) {
    throw new Error(`Refusing to touch protected database: ${targetDbName}`);
  }
  const parsed = new URL(baseUri);
  parsed.pathname = `/${targetDbName}`;
  return parsed.toString();
}

function serializeExtended(value) {
  if (value instanceof ObjectId) {
    return { $oid: value.toHexString() };
  }
  if (value instanceof Date) {
    return { $date: value.toISOString() };
  }
  if (Array.isArray(value)) {
    return value.map(serializeExtended);
  }
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = serializeExtended(v);
    }
    return out;
  }
  return value;
}

function deserializeExtended(value) {
  if (Array.isArray(value)) {
    return value.map(deserializeExtended);
  }
  if (value && typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 1 && keys[0] === "$oid" && typeof value.$oid === "string") {
      return new ObjectId(value.$oid);
    }
    if (keys.length === 1 && keys[0] === "$date" && typeof value.$date === "string") {
      return new Date(value.$date);
    }
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = deserializeExtended(v);
    }
    return out;
  }
  return value;
}

const REQUIRED_COLLECTIONS = [
  "users",
  "user_roles",
  "customer_profiles",
  "sitter_profiles",
  "pets",
  "bookings",
  "booking_assignments",
  "payments",
  "refunds",
  "payouts",
  "audit_logs",
  "auth_sessions",
  "auth_challenges",
  "notification_outbox",
  "societies",
  "service_types",
  "service_prices",
];

async function ensureCriticalIndexes(db) {
  await Promise.all([
    db.collection("bookings").createIndex(
      { idempotency_key: 1 },
      { unique: true, name: "bookings_idempotency_key_key" },
    ),
    db.collection("auth_sessions").createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0, name: "auth_sessions_ttl" },
    ),
    db.collection("auth_challenges").createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0, name: "auth_challenges_ttl" },
    ),
    db.collection("auth_credentials").createIndex(
      { userId: 1 },
      { unique: true, name: "auth_credentials_user" },
    ),
    db.collection("oauth_states").createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0, name: "oauth_states_expiry" },
    ),
  ]);
}

async function seedSyntheticSourceData(db) {
  const now = new Date();
  const future = new Date(now.getTime() + 3600_000);

  const customerId = new ObjectId().toHexString();
  const sitterUserId = new ObjectId().toHexString();
  const customerProfileId = new ObjectId().toHexString();
  const sitterProfileId = new ObjectId().toHexString();
  const petId = new ObjectId().toHexString();
  const societyId = new ObjectId().toHexString();
  const serviceTypeId = new ObjectId().toHexString();
  const servicePriceId = new ObjectId().toHexString();
  const addressId = new ObjectId().toHexString();
  const bookingId = new ObjectId().toHexString();
  const assignmentId = new ObjectId().toHexString();
  const paymentId = new ObjectId().toHexString();
  const refundId = new ObjectId().toHexString();
  const payoutId = new ObjectId().toHexString();
  const auditLogId = new ObjectId().toHexString();
  const outboxId = new ObjectId().toHexString();

  await db.collection("users").insertMany([
    {
      _id: customerId,
      email: "dr.customer@rehearsal.petsaathi.local",
      phone_e164: "+919000000001",
      display_name: "DR Customer",
      status: "ACTIVE",
      locale: "en-IN",
      timezone: "Asia/Kolkata",
      created_at: now,
      updated_at: now,
    },
    {
      _id: sitterUserId,
      email: "dr.sitter@rehearsal.petsaathi.local",
      phone_e164: "+919000000002",
      display_name: "DR Sitter",
      status: "ACTIVE",
      locale: "en-IN",
      timezone: "Asia/Kolkata",
      created_at: now,
      updated_at: now,
    },
  ]);

  await db.collection("user_roles").insertMany([
    { _id: new ObjectId().toHexString(), user_id: customerId, role: "CUSTOMER", granted_at: now },
    { _id: new ObjectId().toHexString(), user_id: sitterUserId, role: "SITTER", granted_at: now },
  ]);

  await db.collection("customer_profiles").insertOne({
    _id: customerProfileId,
    user_id: customerId,
    preferred_language: "en",
  });

  await db.collection("sitter_profiles").insertOne({
    _id: sitterProfileId,
    user_id: sitterUserId,
    status: "APPROVED",
    years_experience: 3,
    service_locality: "Indiranagar",
    service_radius_km: 5,
    reliability_score: 99.0,
    application_at: now,
  });

  await db.collection("pets").insertOne({
    _id: petId,
    owner_id: customerId,
    name: "Milo",
    species: "DOG",
    breed: "Indie",
    sex: "MALE",
    sterilised: true,
    active: true,
    created_at: now,
    updated_at: now,
  });

  await db.collection("societies").insertOne({
    _id: societyId,
    name: "Palm Meadows Rehearsal Society",
    city: "Bangalore",
    locality: "Whitefield",
    pincode: "560066",
    tier: "GOLD",
    active: true,
    created_at: now,
    updated_at: now,
  });

  await db.collection("service_types").insertOne({
    _id: serviceTypeId,
    code: "DOG_WALKING",
    name: "Dog Walking",
    duration_minutes: 45,
    active: true,
  });

  await db.collection("service_prices").insertOne({
    _id: servicePriceId,
    service_type_id: serviceTypeId,
    city: "Bangalore",
    tier: "STANDARD",
    amount_paise: 39900,
    currency: "INR",
    effective_from: now,
    active: true,
  });

  await db.collection("addresses").insertOne({
    _id: addressId,
    user_id: customerId,
    label: "Home",
    line1: "101 Rehearsal Enclave",
    locality: "Indiranagar",
    city: "Bangalore",
    state: "Karnataka",
    postal_code: "560038",
    country_code: "IN",
    created_at: now,
    updated_at: now,
  });

  await db.collection("bookings").insertOne({
    _id: bookingId,
    reference: "PS-DR-0001",
    idempotency_key: "idem-dr-rehearsal-0001",
    customer_id: customerProfileId,
    service_type_id: serviceTypeId,
    address_id: addressId,
    status: "CONFIRMED",
    scheduled_start: now,
    scheduled_end: future,
    subtotal_paise: 39900,
    discount_paise: 0,
    tax_paise: 0,
    total_paise: 39900,
    currency: "INR",
    created_at: now,
    updated_at: now,
  });

  await db.collection("booking_assignments").insertOne({
    _id: assignmentId,
    booking_id: bookingId,
    sitter_id: sitterProfileId,
    status: "ACCEPTED",
    offered_at: now,
    responded_at: now,
  });

  await db.collection("payments").insertOne({
    _id: paymentId,
    booking_id: bookingId,
    provider: "RAZORPAY",
    provider_order_id: "order_dr_0001",
    provider_payment_id: "pay_dr_0001",
    status: "CAPTURED",
    amount_paise: 39900,
    currency: "INR",
    idempotency_key: "pay-idem-dr-0001",
    captured_at: now,
    created_at: now,
    updated_at: now,
  });

  await db.collection("refunds").insertOne({
    _id: refundId,
    payment_id: paymentId,
    amount_paise: 10000,
    reason: "Partial adjustment rehearsal",
    status: "PROCESSED",
    idempotency_key: "ref-idem-dr-0001",
    processed_at: now,
    created_at: now,
  });

  await db.collection("payouts").insertOne({
    _id: payoutId,
    sitter_id: sitterProfileId,
    booking_id: bookingId,
    amount_paise: 29900,
    currency: "INR",
    status: "SETTLED",
    idempotency_key: "payout-idem-dr-0001",
    settled_at: now,
    created_at: now,
  });

  await db.collection("audit_logs").insertOne({
    _id: auditLogId,
    actor_id: customerId,
    actor_role: "CUSTOMER",
    action: "booking.create",
    entity_type: "booking",
    entity_id: bookingId,
    created_at: now,
  });

  await db.collection("auth_sessions").insertOne({
    _id: "dr-session-hash-0001",
    userId: customerId,
    createdAt: now,
    lastSeenAt: now,
    expiresAt: future,
  });

  await db.collection("auth_challenges").insertOne({
    _id: "email:dr.customer@rehearsal.petsaathi.local",
    channel: "email",
    subject: "dr.customer@rehearsal.petsaathi.local",
    codeHash: "0123456789abcdef",
    attempts: 0,
    createdAt: now,
    expiresAt: future,
  });

  await db.collection("auth_credentials").insertOne({
    _id: "dr.customer@rehearsal.petsaathi.local",
    email: "dr.customer@rehearsal.petsaathi.local",
    userId: customerId,
    passwordHash: "scrypt:00:00",
    createdAt: now,
    updatedAt: now,
  });

  await db.collection("oauth_states").insertOne({
    _id: "dr-oauth-state-0001",
    expiresAt: future,
  });

  await db.collection("notification_outbox").insertOne({
    _id: outboxId,
    user_id: customerId,
    channel: "EMAIL",
    template_key: "booking.confirmed",
    destination: "dr.customer@rehearsal.petsaathi.local",
    payload: { reference: "PS-DR-0001" },
    status: "SENT",
    idempotency_key: "outbox-idem-dr-0001",
    sent_at: now,
    created_at: now,
  });

  await ensureCriticalIndexes(db);
}

async function main() {
  const baseUri =
    process.env.MONGODB_PRISMA_URI?.trim() ||
    process.env.MONGODB_URI?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    "";
  if (!baseUri) {
    throw new Error("MONGODB_URI is required");
  }

  const sourceUri = buildDbUrl(baseUri, SOURCE_DB_NAME);
  const restoreUri = buildDbUrl(baseUri, RESTORE_DB_NAME);

  const client = new MongoClient(sourceUri, { serverSelectionTimeoutMS: 10000 });
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "petsaathi-dr-rehearsal-"));
  const backupFilePath = path.join(tmpDir, "logical-backup.json");

  let restorePrisma = null;
  const startedAtMs = Date.now();

  try {
    await client.connect();
    const sourceDb = client.db(SOURCE_DB_NAME);
    const restoreDb = client.db(RESTORE_DB_NAME);

    if (sourceDb.databaseName === "petsaathi" || restoreDb.databaseName === "petsaathi") {
      throw new Error("ABORT: Production database name detected!");
    }

    // Clean start on both disposable databases
    await sourceDb.dropDatabase();
    await restoreDb.dropDatabase();

    // Phase 31: Seed synthetic dataset across all required collections
    await seedSyntheticSourceData(sourceDb);

    // Record pre-backup counts
    const preBackupCounts = {};
    for (const colName of REQUIRED_COLLECTIONS) {
      preBackupCounts[colName] = await sourceDb.collection(colName).countDocuments();
      if (preBackupCounts[colName] < 1) {
        throw new Error(`Expected at least 1 document in ${colName} before backup`);
      }
    }

    // Phase 32: Execute logical backup to disk
    const collections = await sourceDb.listCollections().toArray();
    const backupPayload = {
      createdAt: new Date().toISOString(),
      sourceDatabase: SOURCE_DB_NAME,
      collections: {},
    };

    for (const colInfo of collections) {
      const name = colInfo.name;
      const docs = await sourceDb.collection(name).find({}).toArray();
      const indexes = await sourceDb.collection(name).indexes();
      backupPayload.collections[name] = {
        docs: serializeExtended(docs),
        indexes: indexes.filter((idx) => idx.name !== "_id_"),
      };
    }

    await fs.writeFile(backupFilePath, JSON.stringify(backupPayload, null, 2), "utf8");
    const stat = await fs.stat(backupFilePath);
    if (stat.size <= 0) {
      throw new Error("Backup file is empty");
    }

    // Phase 33: Simulate data loss on disposable source DB
    await sourceDb.dropDatabase();
    const remainingAfterDrop = await sourceDb.listCollections().toArray();
    if (remainingAfterDrop.length !== 0) {
      throw new Error("Simulated data loss failed to drop source database collections");
    }

    // Phase 34: Restore from backup file into petsaathi_restore_test
    const restoreStartMs = Date.now();
    const parsedBackup = JSON.parse(await fs.readFile(backupFilePath, "utf8"));

    for (const [colName, colData] of Object.entries(parsedBackup.collections)) {
      const docs = deserializeExtended(colData.docs);
      if (docs.length > 0) {
        await restoreDb.collection(colName).insertMany(docs);
      }
      for (const idx of colData.indexes) {
        const { key, name, unique, sparse, expireAfterSeconds } = idx;
        const opts = { name };
        if (unique) opts.unique = true;
        if (sparse) opts.sparse = true;
        if (typeof expireAfterSeconds === "number") opts.expireAfterSeconds = expireAfterSeconds;
        await restoreDb.collection(colName).createIndex(key, opts);
      }
    }
    const rtoSeconds = Number(((Date.now() - restoreStartMs) / 1000).toFixed(2));

    // Phase 35: Verify restored collections, document counts, and critical indexes
    const postRestoreCounts = {};
    for (const colName of REQUIRED_COLLECTIONS) {
      postRestoreCounts[colName] = await restoreDb.collection(colName).countDocuments();
      if (postRestoreCounts[colName] !== preBackupCounts[colName]) {
        throw new Error(
          `Count mismatch for ${colName}: pre=${preBackupCounts[colName]}, post=${postRestoreCounts[colName]}`,
        );
      }
    }

    const expectedIndexes = [
      { collection: "bookings", indexName: "bookings_idempotency_key_key", unique: true },
      { collection: "auth_sessions", indexName: "auth_sessions_ttl", ttl: true },
      { collection: "auth_challenges", indexName: "auth_challenges_ttl", ttl: true },
      { collection: "auth_credentials", indexName: "auth_credentials_user", unique: true },
      { collection: "oauth_states", indexName: "oauth_states_expiry", ttl: true },
    ];

    const verifiedIndexes = [];
    for (const spec of expectedIndexes) {
      const idxList = await restoreDb.collection(spec.collection).indexes();
      const found = idxList.find((i) => i.name === spec.indexName);
      if (!found) {
        throw new Error(`Missing critical index ${spec.collection}.${spec.indexName} after restore`);
      }
      if (spec.unique && !found.unique) {
        throw new Error(`Index ${spec.collection}.${spec.indexName} is not unique after restore`);
      }
      if (spec.ttl && typeof found.expireAfterSeconds !== "number") {
        throw new Error(`Index ${spec.collection}.${spec.indexName} is missing TTL expireAfterSeconds`);
      }
      verifiedIndexes.push(`${spec.collection}.${spec.indexName}`);
    }

    const dupGroups = await restoreDb
      .collection("bookings")
      .aggregate([
        { $match: { idempotency_key: { $type: "string" } } },
        { $group: { _id: "$idempotency_key", count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } },
      ])
      .toArray();

    if (dupGroups.length !== 0) {
      throw new Error(`Found ${dupGroups.length} duplicate booking idempotency groups after restore`);
    }

    // Phase 36: Verify application Prisma read queries against petsaathi_restore_test
    restorePrisma = new PrismaClient({
      datasourceUrl: restoreUri,
    });

    const [userCount, bookingCount, paymentCount, auditCount, serviceTypeCount] = await Promise.all([
      restorePrisma.user.count(),
      restorePrisma.booking.count(),
      restorePrisma.payment.count(),
      restorePrisma.auditLog.count(),
      restorePrisma.serviceType.count(),
    ]);

    if (
      userCount !== preBackupCounts.users ||
      bookingCount !== preBackupCounts.bookings ||
      paymentCount !== preBackupCounts.payments ||
      auditCount !== preBackupCounts.audit_logs ||
      serviceTypeCount !== preBackupCounts.service_types
    ) {
      throw new Error("Prisma read verification against restored database returned unexpected counts");
    }

    const totalElapsedSeconds = Number(((Date.now() - startedAtMs) / 1000).toFixed(2));

    console.log(
      JSON.stringify(
        {
          status: "PASS",
          mode: "LOCAL_SYNTHETIC_LOGICAL_BACKUP_RESTORE",
          sourceDatabase: SOURCE_DB_NAME,
          restoreDatabase: RESTORE_DB_NAME,
          backupArtifactBytes: stat.size,
          rtoSeconds,
          totalElapsedSeconds,
          rpoSeconds: 0,
          collectionsVerified: REQUIRED_COLLECTIONS.length,
          documentCountsMatch: true,
          criticalIndexesVerified: verifiedIndexes,
          duplicateIdempotencyGroups: dupGroups.length,
          prismaReadQueries: {
            users: userCount,
            bookings: bookingCount,
            payments: paymentCount,
            auditLogs: auditCount,
            serviceTypes: serviceTypeCount,
          },
        },
        null,
        2,
      ),
    );
  } finally {
    if (restorePrisma) {
      await restorePrisma.$disconnect().catch(() => {});
    }
    try {
      await client.db(SOURCE_DB_NAME).dropDatabase();
      await client.db(RESTORE_DB_NAME).dropDatabase();
    } catch {
      // ignore cleanup error
    }
    await client.close().catch(() => {});
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch((err) => {
  console.error("Local backup/restore rehearsal failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
