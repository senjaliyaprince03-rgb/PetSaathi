// eslint-disable-next-line @typescript-eslint/no-require-imports
const { spawnSync } = require("node:child_process");

const DEFAULT_MONGODB_URI =
  "mongodb://127.0.0.1:47017/petsaathi_test?replicaSet=rs0&directConnection=true";
const databaseUrl = process.env.TEST_MONGODB_URI ?? process.env.MONGODB_URI ?? DEFAULT_MONGODB_URI;

function assertDisposableDatabase(rawUrl) {
  const url = new URL(rawUrl);
  const localHost = url.hostname === "127.0.0.1" || url.hostname === "localhost";
  const testDatabase = url.pathname === "/petsaathi_test" || url.pathname === "/petsaathi_ci";
  if (!["mongodb:", "mongodb+srv:"].includes(url.protocol) || !localHost || !testDatabase) {
    throw new Error("Refusing integration tests: MONGODB_URI must target a local disposable petsaathi_test or petsaathi_ci database.");
  }
}

try {
  assertDisposableDatabase(databaseUrl);
  const vitestCli = require.resolve("vitest/vitest.mjs");
  const result = spawnSync(process.execPath, [vitestCli, "run", "--config", "vitest.integration.config.ts"], {
    cwd: process.cwd(),
    env: { ...process.env, MONGODB_URI: databaseUrl, MONGODB_DATABASE: new URL(databaseUrl).pathname.slice(1) },
    stdio: "inherit",
    shell: false,
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} catch (error) {
  console.error(`Integration test runner failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
