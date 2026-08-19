import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";
import { preparePrismaEnvironment } from "./prepare-prisma-uri.mjs";

dotenv.config({ path: path.resolve(process.cwd(), ".env"), quiet: true });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true, quiet: true });

const portIndex = process.argv.findIndex((argument) => argument === "--port" || argument === "-p");
const port = portIndex >= 0 ? process.argv[portIndex + 1] : process.env.PLAYWRIGHT_PORT ?? "3110";
const distDir = process.env.NEXT_DIST_DIR ?? ".next-playwright";
const isWindows = process.platform === "win32";
const npmCommand = isWindows ? process.env.ComSpec ?? "cmd.exe" : "npm";
const npmArgs = (script) => isWindows
  ? ["/d", "/s", "/c", `npm run ${script}`]
  : ["run", script];
// E2E exercises the production server; do not inherit a local .env NODE_ENV.
const childEnv = { ...process.env, NODE_ENV: "production", NEXT_DIST_DIR: distDir, PLAYWRIGHT_TEST: "1" };
await preparePrismaEnvironment(childEnv);

const build = spawnSync(npmCommand, npmArgs("build"), {
  cwd: process.cwd(),
  env: childEnv,
  stdio: "inherit",
  shell: false,
});

if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);

const serverArgs = isWindows
  ? ["/d", "/s", "/c", `npm run start -- --port ${String(port)}`]
  : ["run", "start", "--", "--port", String(port)];
const server = spawn(npmCommand, serverArgs, {
  cwd: process.cwd(),
  env: childEnv,
  stdio: "inherit",
  shell: false,
});

const forwardSignal = (signal) => {
  if (!server.killed) server.kill(signal);
};
process.once("SIGINT", () => forwardSignal("SIGINT"));
process.once("SIGTERM", () => forwardSignal("SIGTERM"));
server.once("exit", (code, signal) => {
  process.exit(signal ? 1 : code ?? 0);
});
