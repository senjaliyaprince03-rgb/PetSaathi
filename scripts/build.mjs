import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

// Enforce linting and typechecking as explicit build gates before production bundling.
console.log("==> [1/4] Running ESLint...");
run(process.execPath, [path.join(projectRoot, "node_modules/eslint/bin/eslint.js"), ".", "--max-warnings=0"]);

console.log("==> [2/4] Running TypeScript typecheck...");
run(process.execPath, [path.join(projectRoot, "node_modules/typescript/bin/tsc"), "--noEmit"]);

console.log("==> [3/4] Generating Prisma Client...");
generatePrismaClient();
process.env.PETSAATHI_BUILD_SKIP_TYPECHECK = "1";

console.log("==> [4/4] Running Next.js build...");
run(process.execPath, [
  path.join(projectRoot, "node_modules/next/dist/bin/next"),
  "build",
  "--no-lint",
]);
