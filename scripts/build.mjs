import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkLegalPlaceholders } from "./check-legal-placeholders.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: false,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function generatePrismaClient() {
  const result = spawnSync(
    process.execPath,
    [path.join(projectRoot, "node_modules/prisma/build/index.js"), "generate"],
    {
      cwd: projectRoot,
      encoding: "utf8",
      shell: false,
    },
  );

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) throw result.error;
  if (result.status === 0) return;

  // A running Windows dev server can hold Prisma's query-engine DLL open.
  // Continue only when the generated client already exists; all other
  // generation failures must still fail the production build.
  const generatedClient = path.join(projectRoot, "node_modules/.prisma/client/index.js");
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  const isLockedWindowsClient = /EPERM|query_engine-windows\.dll\.node|rename/i.test(output);
  if (isLockedWindowsClient && existsSync(generatedClient)) {
    console.warn("Prisma Client generation was skipped because the existing Windows client is locked by another process.");
    return;
  }

  process.exit(result.status ?? 1);
}

console.log("==> [1/5] Generating Prisma Client...");
generatePrismaClient();

console.log("==> [2/5] Checking statutory legal disclosures (BUG-034 / BUG-035)...");
checkLegalPlaceholders();

console.log("==> [3/5] Running ESLint...");
run(process.execPath, [path.join(projectRoot, "node_modules/eslint/bin/eslint.js"), ".", "--max-warnings=0"]);

console.log("==> [4/5] Running TypeScript typecheck...");
run(process.execPath, [path.join(projectRoot, "node_modules/typescript/bin/tsc"), "--noEmit"]);

console.log("==> [5/5] Running Next.js build...");
run(process.execPath, [
  path.join(projectRoot, "node_modules/next/dist/bin/next"),
  "build",
]);
