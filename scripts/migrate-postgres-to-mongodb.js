// One-time, non-destructive relational-to-document migration utility.
// The source database is read-only; the target must be empty.

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { randomUUID } = require("node:crypto");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Long, MongoClient } = require("mongodb");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Pool } = require("pg");

const sourceUrl = process.env.SOURCE_POSTGRES_URL;
const targetUrl = process.env.MONGODB_URI;
const dryRun = process.argv.includes("--dry-run");

if (!sourceUrl || !targetUrl) {
  throw new Error("SOURCE_POSTGRES_URL and MONGODB_URI are required.");
}

function targetDatabaseName() {
  const configured = process.env.MONGODB_DATABASE?.trim();
  if (configured) return configured;
  const pathname = new URL(targetUrl).pathname.replace(/^\//, "");
  if (!pathname) throw new Error("MONGODB_DATABASE is required when MONGODB_URI has no database path.");
  return decodeURIComponent(pathname);
}

async function tableMetadata(pool) {
  const [tables, columns, keys] = await Promise.all([
    pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        AND table_name <> '_prisma_migrations'
      ORDER BY table_name
    `),
    pool.query(`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
    `),
    pool.query(`
      SELECT tc.table_name, kcu.column_name, kcu.ordinal_position
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
       AND tc.table_schema = kcu.table_schema
      WHERE tc.table_schema = 'public' AND tc.constraint_type = 'PRIMARY KEY'
      ORDER BY tc.table_name, kcu.ordinal_position
    `),
  ]);

  const columnsByTable = new Map();
  for (const column of columns.rows) {
    const table = columnsByTable.get(column.table_name) ?? new Map();
    table.set(column.column_name, column.data_type);
    columnsByTable.set(column.table_name, table);
  }
  const keysByTable = new Map();
  for (const key of keys.rows) {
    const tableKeys = keysByTable.get(key.table_name) ?? [];
    tableKeys.push(key.column_name);
    keysByTable.set(key.table_name, tableKeys);
  }

  return tables.rows.map(({ table_name: tableName }) => ({
    tableName,
    columns: columnsByTable.get(tableName) ?? new Map(),
    primaryKeys: keysByTable.get(tableName) ?? [],
  }));
}

function toMongoDocument(row, metadata) {
  const document = { ...row };
  for (const [column, type] of metadata.columns) {
    if (document[column] == null) continue;
    if (["numeric", "decimal", "real", "double precision"].includes(type)) {
      document[column] = Number(document[column]);
    } else if (type === "bigint" && !metadata.primaryKeys.includes(column)) {
      document[column] = Long.fromString(String(document[column]));
    }
  }

  if (metadata.tableName === "users") delete document.auth_user_id;
  if (metadata.primaryKeys.length === 1) {
    const [primaryKey] = metadata.primaryKeys;
    document._id = String(document[primaryKey]);
    delete document[primaryKey];
  } else {
    document._id = randomUUID();
  }
  return document;
}

async function assertEmptyTarget(database, metadata) {
  for (const { tableName } of metadata) {
    if ((await database.collection(tableName).estimatedDocumentCount()) > 0) {
      throw new Error(`Target collection ${tableName} is not empty. Migration stopped without deleting data.`);
    }
  }
}

async function migrateTable(pool, database, metadata) {
  const escaped = `"${metadata.tableName.replaceAll('"', '""')}"`;
  const countResult = await pool.query(`SELECT COUNT(*)::bigint AS count FROM "public".${escaped}`);
  const total = Number(countResult.rows[0].count);
  console.log(`${metadata.tableName}: ${total} rows${dryRun ? " (dry run)" : ""}`);
  if (dryRun || total === 0) return total;

  const batchSize = 1_000;
  for (let offset = 0; offset < total; offset += batchSize) {
    const rows = await pool.query(`SELECT * FROM "public".${escaped} OFFSET $1 LIMIT $2`, [offset, batchSize]);
    const documents = rows.rows.map((row) => toMongoDocument(row, metadata));
    if (documents.length) await database.collection(metadata.tableName).insertMany(documents, { ordered: true });
  }
  return total;
}

async function main() {
  const pool = new Pool({ connectionString: sourceUrl, max: 2, application_name: "petsaathi-atlas-migration" });
  const client = new MongoClient(targetUrl, { appName: "PetSaathi migration" });
  try {
    const metadata = await tableMetadata(pool);
    await client.connect();
    const database = client.db(targetDatabaseName());
    await database.command({ ping: 1 });
    if (!dryRun) await assertEmptyTarget(database, metadata);

    let migrated = 0;
    for (const table of metadata) migrated += await migrateTable(pool, database, table);
    console.log(`Migration ${dryRun ? "plan" : "copy"} completed: ${migrated} rows across ${metadata.length} collections.`);
  } finally {
    await Promise.all([pool.end(), client.close()]);
  }
}

main().catch((error) => {
  console.error(`Migration failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
