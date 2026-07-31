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
      "Refusing integration tests: DATABASE_URL must target a local disposable petsaathi_test or petsaathi_ci database."
    );
  }
}

try {
  assertDisposableDatabase(databaseUrl);
  const vitestCli = require.resolve("vitest/vitest.mjs");
  const result = spawnSync(
    process.execPath,
    [vitestCli, "run", "--config", "vitest.integration.config.ts"],
    {
      cwd: process.cwd(),
      env: { ...process.env, DATABASE_URL: databaseUrl, DIRECT_URL: databaseUrl },
      stdio: "inherit",
      shell: false
    }
  );

  if (result.error) {
    throw result.error;
  }
  process.exitCode = result.status ?? 1;
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Integration test runner failed: ${message}`);
  process.exitCode = 1;
}
