// eslint-disable-next-line @typescript-eslint/no-require-imports
const { spawnSync } = require("node:child_process");

const DEFAULT_TEST_DATABASE_URL =
  "postgresql://petsaathi_test:test_password@127.0.0.1:55432/petsaathi_test";
const databaseUrl = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL ?? DEFAULT_TEST_DATABASE_URL;

function assertDisposableDatabase(rawUrl) {
  const url = new URL(rawUrl);
  const localHost = url.hostname === "127.0.0.1" || url.hostname === "localhost";
  const testDatabase = url.pathname === "/petsaathi_test" || url.pathname === "/petsaathi_ci";

  if (!["postgres:", "postgresql:"].includes(url.protocol) || !localHost || !testDatabase) {
    throw new Error(
      "Refusing database setup: use a local disposable database named petsaathi_test or petsaathi_ci."
    );
  }
}

function run(command, args, env = process.env) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env,
    stdio: "inherit",
    shell: false
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} exited with status ${result.status}`);
  }
}

function waitForPostgres() {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    const result = spawnSync(
      "docker",
      [
        "compose",
        "-f",
        "docker-compose.test.yml",
        "exec",
        "-T",
        "db-test",
        "pg_isready",
        "-U",
        "petsaathi_test",
        "-d",
        "petsaathi_test"
      ],
      { cwd: process.cwd(), stdio: "ignore", shell: false }
    );

    if (result.status === 0) {
      return;
    }

    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1_000);
  }

  throw new Error("Disposable PostgreSQL did not become ready within 30 seconds.");
}

try {
  assertDisposableDatabase(databaseUrl);
  const env = { ...process.env, DATABASE_URL: databaseUrl, DIRECT_URL: databaseUrl };
  const prismaCli = require.resolve("prisma/build/index.js");

  console.log("Waiting for the disposable PetSaathi PostgreSQL database...");
  waitForPostgres();
  console.log("Generating Prisma Client...");
  run(process.execPath, [prismaCli, "generate"], env);
  console.log("Replaying committed Prisma migrations...");
  run(process.execPath, [prismaCli, "migrate", "deploy"], env);
  console.log("Validating migration state...");
  run(process.execPath, [prismaCli, "migrate", "status"], env);
  console.log("Seeding non-commercial reference data...");
  run(process.execPath, [prismaCli, "db", "seed"], env);
  console.log("Verifying migration count, RLS, and security constraints...");
  run(process.execPath, ["scripts/verify-test-db.js"], env);
  console.log("Disposable test database is ready.");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Test database initialization failed: ${message}`);
  process.exitCode = 1;
}

