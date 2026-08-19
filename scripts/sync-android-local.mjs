import { spawnSync } from "node:child_process";

const localServerUrl = process.env.CAPACITOR_SERVER_URL ?? "http://10.0.2.2:3000";

const result = spawnSync("npx", ["cap", "sync", "android"], {
  env: {
    ...process.env,
    CAPACITOR_SERVER_URL: localServerUrl,
  },
  shell: process.platform === "win32",
  stdio: "inherit",
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
