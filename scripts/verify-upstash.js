/* eslint-disable @typescript-eslint/no-require-imports */
// Verifies the Upstash Redis REST credentials used by src/middleware.ts for
// shared cross-instance rate limiting.
//
//   node scripts/verify-upstash.js
//
// Exit codes: 0 = verified or correctly skipped, 1 = configured but broken.
const path = require("node:path");

const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env"), quiet: true });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true, quiet: true });

async function main() {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) {
    console.log(
      JSON.stringify(
        {
          status: "skipped",
          detail:
            "UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not configured. Middleware falls back to the per-instance in-memory limiter (single-instance protection only). Create an Upstash database — prefer the Mumbai (ap-south-1) region for India traffic — and set both variables.",
        },
        null,
        2,
      ),
    );
    return;
  }

  try {
    // Raw REST ping: avoids importing the app's ETS-only modules into a
    // plain node script while exercising the exact endpoint @upstash/redis uses.
    const response = await fetch(`${url.replace(/\/$/, "")}/ping`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.log(JSON.stringify({ status: "failed", detail: `Upstash ping returned HTTP ${response.status}. Check UPSTASH_REDIS_REST_TOKEN.` }, null, 2));
      process.exitCode = 1;
      return;
    }
    const body = await response.json().catch(() => null);
    if (body?.result !== "PONG") {
      console.log(JSON.stringify({ status: "failed", detail: `Unexpected ping response: ${JSON.stringify(body)}` }, null, 2));
      process.exitCode = 1;
      return;
    }
    console.log(JSON.stringify({ status: "ok", detail: "Upstash Redis reachable — shared rate limiting active." }, null, 2));
  } catch (error) {
    console.log(JSON.stringify({ status: "failed", detail: `Upstash ping failed: ${error instanceof Error ? error.message : String(error)}` }, null, 2));
    process.exitCode = 1;
  }
}

main();
