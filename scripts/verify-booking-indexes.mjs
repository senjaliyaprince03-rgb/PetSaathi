import dns from "node:dns";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

try { dns.setServers(["8.8.8.8", "1.1.1.1"]); } catch {}

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ path: ".env", quiet: true });
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required");
const url = new URL(uri);
const databaseName = process.env.MONGODB_DATABASE || decodeURIComponent(url.pathname.slice(1));
const apply = process.argv.includes("--apply-test");
if (apply && (!['localhost', '127.0.0.1'].includes(url.hostname) || !['petsaathi_test', 'petsaathi_ci'].includes(databaseName))) {
  throw new Error("Index writes require a local disposable test database");
}
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
try {
  await client.connect();
  const db = client.db(databaseName);
  const collection = db.collection("bookings");
  const duplicateGroups = await collection.aggregate([
    { $match: { idempotency_key: { $type: "string" } } },
    { $group: { _id: "$idempotency_key", count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
    { $count: "groups" },
  ], { maxTimeMS: 10000 }).toArray();
  const duplicates = duplicateGroups[0]?.groups ?? 0;
  const indexes = await collection.listIndexes().toArray();
  const matching = indexes.find(index => index.unique && Object.keys(index.key).length === 1 && index.key.idempotency_key === 1);
  console.log(JSON.stringify({ mode: apply ? "test-only-apply" : "read-only", duplicateGroups: duplicates, uniqueIdempotencyIndex: matching?.name ?? null }));
  if (duplicates) throw new Error("Duplicate booking keys require reviewed remediation; no indexes changed");
  if (apply) {
    if (!matching) await collection.createIndex({ idempotency_key: 1 }, { name: "bookings_idempotency_key_key", unique: true, partialFilterExpression: { idempotency_key: { $type: "string" } } });
    await db.collection("oauth_states").createIndex({ expiresAt: 1 }, { name: "oauth_states_expiry", expireAfterSeconds: 0 });
    console.log("Test indexes verified/applied");
  } else if (!matching) process.exitCode = 2;
} catch (error) {
  console.error(JSON.stringify({ error: error instanceof Error ? error.name : "DatabaseError", operation: "booking-index-verification-failed" }));
  process.exitCode = 1;
} finally { await client.close(); }
