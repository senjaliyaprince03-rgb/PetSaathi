import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";
import { preparePrismaEnvironment } from "./prepare-prisma-uri.mjs";

dotenv.config({ path: path.resolve(process.cwd(), ".env"), quiet: true });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true, quiet: true });

const portIndex = process.argv.findIndex((arg) => arg === "--port" || arg === "-p");
const port = portIndex >= 0 ? process.argv[portIndex + 1] : process.env.PORT || "3000";

const isWindows = process.platform === "win32";
const childEnv = { ...process.env, NODE_ENV: "production", PORT: String(port), PLAYWRIGHT_TEST: "1" };
await preparePrismaEnvironment(childEnv);
if (childEnv.MONGODB_PRISMA_URI) {
  childEnv.DATABASE_URL = childEnv.MONGODB_PRISMA_URI;
  childEnv.MONGODB_URI = childEnv.MONGODB_PRISMA_URI;
}

const child = spawn(
  isWindows ? (process.env.ComSpec ?? "cmd.exe") : "npx",
  isWindows
    ? ["/d", "/s", "/c", `npx next start -p ${port}`]
    : ["next", "start", "-p", String(port)],
  {
    cwd: process.cwd(),
    env: childEnv,
    stdio: "inherit",
    shell: false,
  }
);

child.on("exit", (code) => {
  process.exit(code ?? 0);
});

const forwardSignal = (signal) => {
  if (!child.killed) child.kill(signal);
};
process.once("SIGINT", () => forwardSignal("SIGINT"));
process.once("SIGTERM", () => forwardSignal("SIGTERM"));
