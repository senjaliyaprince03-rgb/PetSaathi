// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");
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
    throw new Error("Refusing database verification: use a local disposable MongoDB test database.");
  }
}

async function main() {
  assertDisposableDatabase(databaseUrl);
  const prisma = new PrismaClient({ datasourceUrl: databaseUrl });
  const client = new MongoClient(databaseUrl);
  try {
    await client.connect();
    const database = client.db(new URL(databaseUrl).pathname.slice(1));
    const [ping, hello, users, userIndexes] = await Promise.all([
      database.command({ ping: 1 }),
      client.db("admin").command({ hello: 1 }),
      prisma.user.count(),
      database.collection("users").indexes(),
    ]);
    if (ping.ok !== 1 || !hello.isWritablePrimary) throw new Error("MongoDB replica-set primary is unavailable.");
    if (users < 2) throw new Error(`Expected at least two seeded users, found ${users}.`);
    if (!userIndexes.some((index) => index.unique && index.key.email === 1)) {
      throw new Error("The unique users.email index is missing.");
    }
    console.log(`MongoDB verification passed: writable replica primary, ${users} seeded users, ${userIndexes.length} user indexes.`);
  } finally {
    await Promise.all([prisma.$disconnect(), client.close()]);
  }
}

main().catch((error) => {
  console.error(`Database verification failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
