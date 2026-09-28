import dns from "node:dns";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

try { dns.setServers(["8.8.8.8", "1.1.1.1"]); } catch {}

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ path: ".env", quiet: true });

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required");

const url = new URL(uri);
const databaseName = process.env.MONGODB_DATABASE || decodeURIComponent(url.pathname.slice(1)) || "petsaathi";

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });

async function run() {
  try {
    await client.connect();
    const db = client.db(databaseName);
    const collection = db.collection("bookings");

    console.log(`Connected to database: ${databaseName}, collection: bookings`);

    // 1. Scan for duplicates
    const duplicateGroups = await collection.aggregate([
      { $match: { idempotency_key: { $type: "string" } } },
      { $group: { _id: "$idempotency_key", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $count: "groups" },
    ], { maxTimeMS: 10000 }).toArray();

    const duplicates = duplicateGroups[0]?.groups ?? 0;
    console.log(`Duplicate groups found: ${duplicates}`);

    if (duplicates > 0) {
      throw new Error(`BLOCKED — DUPLICATE PRODUCTION IDEMPOTENCY DATA REQUIRES MANUAL RECONCILIATION (${duplicates} groups)`);
    }

    // 2. Check current indexes
    const initialIndexes = await collection.listIndexes().toArray();
    const existing = initialIndexes.find(
      (idx) => idx.unique && Object.keys(idx.key).length === 1 && idx.key.idempotency_key === 1
    );

    if (existing) {
      console.log(`Unique idempotency index already exists: ${existing.name}`);
    } else {
      console.log("Applying unique index on { idempotency_key: 1 } with partialFilterExpression...");
      const resultName = await collection.createIndex(
        { idempotency_key: 1 },
        {
          name: "bookings_idempotency_key_key",
          unique: true,
          partialFilterExpression: { idempotency_key: { $type: "string" } },
        }
      );
      console.log(`Index successfully created: ${resultName}`);
    }

    // 3. Verify metadata from collection
    const finalIndexes = await collection.listIndexes().toArray();
    const verified = finalIndexes.find((idx) => idx.name === "bookings_idempotency_key_key");

    if (!verified) {
      throw new Error("Failed to verify created index in collection metadata!");
    }

    console.log("VERIFIED_INDEX_METADATA:", JSON.stringify({
      name: verified.name,
      key: verified.key,
      unique: verified.unique,
      partialFilterExpression: verified.partialFilterExpression,
    }, null, 2));

  } finally {
    await client.close();
  }
}

run().catch((err) => {
  console.error("Index application error:", err.message);
  process.exitCode = 1;
});
