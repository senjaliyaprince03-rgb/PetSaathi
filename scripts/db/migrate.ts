import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required to run migrations.");

function getDbName(uriStr: string): string {
  if (process.env.MONGODB_DATABASE) return process.env.MONGODB_DATABASE;
  const url = new URL(uriStr);
  return decodeURIComponent(url.pathname.replace(/^\//, ""));
}

export interface MigrationModule {
  name: string;
  up: (db: Db) => Promise<void>;
  down?: (db: Db) => Promise<void>;
}

async function runMigrations() {
  console.log("🚀 [PetSaathi Migration Engine] Starting schema migration check...\n");
  const client = new MongoClient(uri!);
  await client.connect();
  const db = client.db(getDbName(uri!));

  // Ensure migrations tracking collection exists with unique index
  const migrationsCollection = db.collection("_migrations");
  await migrationsCollection.createIndex({ name: 1 }, { unique: true });

  const migrationsDir = path.resolve(process.cwd(), "migrations");
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".ts") || f.endsWith(".js"))
    .sort();

  if (files.length === 0) {
    console.log("ℹ️ No migration files found in migrations/ directory.");
    await client.close();
    return;
  }

  const appliedMigrations = await migrationsCollection.find({}).toArray();
  const appliedNames = new Set(appliedMigrations.map((m) => m.name));

  let appliedCount = 0;

  for (const file of files) {
    if (appliedNames.has(file)) {
      continue;
    }

    console.log(`⏳ Applying migration: ${file}...`);
    const startTime = Date.now();
    const filePath = path.join(migrationsDir, file);
    
    // Dynamically import migration script
    const migrationModule = await import(pathToFileURL(filePath).href);
    if (typeof migrationModule.up !== "function") {
      throw new Error(`Migration ${file} does not export an 'up' function.`);
    }

    await migrationModule.up(db);
    const durationMs = Date.now() - startTime;

    await migrationsCollection.insertOne({
      name: file,
      appliedAt: new Date(),
      durationMs,
    });

    console.log(`✅ Completed migration ${file} (${durationMs}ms)`);
    appliedCount++;
  }

  if (appliedCount === 0) {
    console.log("✨ Database schema is up to date. No pending migrations.");
  } else {
    console.log(`\n🎉 Successfully applied ${appliedCount} migration(s).`);
  }

  await client.close();
}

runMigrations().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
