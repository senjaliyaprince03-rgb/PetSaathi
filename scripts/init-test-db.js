// eslint-disable-next-line @typescript-eslint/no-require-imports
const { spawnSync } = require("node:child_process");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { MongoClient } = require("mongodb");

const DEFAULT_MONGODB_URI =
  "mongodb://127.0.0.1:47017/petsaathi_test?replicaSet=rs0&directConnection=true";
const databaseUrl = process.env.TEST_MONGODB_URI ?? process.env.MONGODB_URI ?? DEFAULT_MONGODB_URI;

function assertDisposableDatabase(rawUrl) {
  const url = new URL(rawUrl);
  const localHost = url.hostname === "127.0.0.1" || url.hostname === "localhost";
  const testDatabase = url.pathname === "/petsaathi_test" || url.pathname === "/petsaathi_ci";
  if (!["mongodb:", "mongodb+srv:"].includes(url.protocol) || !localHost || !testDatabase) {
    throw new Error("Refusing database setup: use a local disposable MongoDB database named petsaathi_test or petsaathi_ci.");
  }
}

function run(command, args, env = process.env) {
  const result = spawnSync(command, args, { cwd: process.cwd(), env, stdio: "inherit", shell: false });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} exited with status ${result.status}`);
}

async function initializeReplicaSet() {
  const parsed = new URL(databaseUrl);
  const bootstrapUrl = `mongodb://${parsed.hostname}:${parsed.port || "27017"}/admin?directConnection=true`;
  let client;
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      client = await new MongoClient(bootstrapUrl, { serverSelectionTimeoutMS: 1_000 }).connect();
      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1_000));
    }
  }
  if (!client) throw new Error("Disposable MongoDB did not become reachable within 30 seconds.");

  try {
    try {
      await client.db("admin").command({
        replSetInitiate: { _id: "rs0", members: [{ _id: 0, host: "127.0.0.1:27017" }] },
      });
    } catch (error) {
      if (!String(error).includes("already initialized")) throw error;
    }
  } finally {
    await client.close();
  }

  for (let attempt = 1; attempt <= 30; attempt += 1) {
    const replicaClient = new MongoClient(databaseUrl, { serverSelectionTimeoutMS: 1_000 });
    try {
      await replicaClient.connect();
      const hello = await replicaClient.db("admin").command({ hello: 1 });
      if (hello.isWritablePrimary) {
        await replicaClient.db(parsed.pathname.slice(1)).dropDatabase();
        await replicaClient.close();
        return;
      }
    } catch {
      // The election is still in progress.
    }
    await replicaClient.close().catch(() => undefined);
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  throw new Error("Disposable MongoDB replica set did not elect a primary within 30 seconds.");
}

async function main() {
  assertDisposableDatabase(databaseUrl);
  await initializeReplicaSet();
  const env = { ...process.env, MONGODB_URI: databaseUrl, MONGODB_DATABASE: new URL(databaseUrl).pathname.slice(1) };
  const prismaCli = require.resolve("prisma/build/index.js");
  console.log("Generating Prisma Client for MongoDB...");
  run(process.execPath, [prismaCli, "generate"], env);
  console.log("Applying MongoDB indexes with Prisma db push...");
  run(process.execPath, [prismaCli, "db", "push", "--accept-data-loss"], env);
  console.log("Applying partial unique indexes for optional values...");
  run(process.execPath, ["scripts/apply-mongodb-indexes.js"], env);
  console.log("Seeding non-commercial reference data...");
  run(process.execPath, [prismaCli, "db", "seed"], env);
  console.log("Verifying MongoDB connectivity, replica set, and indexes...");
  run(process.execPath, ["scripts/verify-test-db.js"], env);
  console.log("Disposable MongoDB test database is ready.");
}

main().catch((error) => {
  console.error(`Test database initialization failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
