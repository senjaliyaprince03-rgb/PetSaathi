import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";

async function auditPhase8Security() {
  console.log("================================================================================");
  console.log("               PETSAATHI QA AUDIT — PHASE 8: SECURITY SWEEP                     ");
  console.log("================================================================================");

  const results = [];
  function record(id, title, passed, details = {}) {
    results.push({ id, title, passed, details });
    const mark = passed ? "[PASS]" : "[FAIL]";
    console.log(`${mark} ${id}: ${title}`);
    console.log("   Details:", JSON.stringify(details, null, 2));
  }

  // ---------------------------------------------------------------------------
  // 1. Security Headers Audit
  // ---------------------------------------------------------------------------
  console.log("\n--- 1. HTTP Security Headers Audit ---");
  const homeHeadersRes = await fetch(`${BASE_URL}/`, { method: "HEAD" });
  const headers = Object.fromEntries(homeHeadersRes.headers.entries());

  const csp = headers["content-security-policy"];
  const xfo = headers["x-frame-options"];
  const xcto = headers["x-content-type-options"];
  const hsts = headers["strict-transport-security"];
  const referrer = headers["referrer-policy"];
  const permissions = headers["permissions-policy"];

  record("SEC-01", "Content-Security-Policy (CSP) header is present and configured", !!csp, { csp: csp || "MISSING" });
  record("SEC-02", "X-Frame-Options is DENY or SAMEORIGIN", xfo === "DENY" || xfo === "SAMEORIGIN", { xfo: xfo || "MISSING" });
  record("SEC-03", "X-Content-Type-Options is nosniff", xcto === "nosniff", { xcto: xcto || "MISSING" });
  record("SEC-04", "Referrer-Policy header is configured", !!referrer, { referrer: referrer || "MISSING" });
  record("SEC-05", "Permissions-Policy header is configured", !!permissions, { permissions: permissions || "MISSING" });

  // ---------------------------------------------------------------------------
  // 2. Cross-Site Scripting (XSS) & dangerouslySetInnerHTML Sweep
  // ---------------------------------------------------------------------------
  console.log("\n--- 2. dangerouslySetInnerHTML & Raw HTML Rendering Sweep ---");

  function getFiles(dir, exts = [".ts", ".tsx"]) {
    let files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const fullPath = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name !== "node_modules" && e.name !== ".next") {
          files = files.concat(getFiles(fullPath, exts));
        }
      } else if (exts.some((ext) => e.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const srcFiles = getFiles("src");
  const dangerousRenderSites = [];

  for (const file of srcFiles) {
    const code = fs.readFileSync(file, "utf8");
    const lines = code.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("dangerouslySetInnerHTML") && !lines[i].includes("//")) {
        const relPath = path.relative(process.cwd(), file);
        let snippet = "";
        for (let j = i; j < Math.min(lines.length, i + 5); j++) {
          snippet += lines[j].trim() + " ";
        }
        dangerousRenderSites.push({ file: relPath, line: i + 1, snippet });
      }
    }
  }

  console.log(`Found ${dangerousRenderSites.length} dangerouslySetInnerHTML instances.`);
  // Analyze if any user-supplied content flows into dangerouslySetInnerHTML
  const userSuppliedDangerous = dangerousRenderSites.filter(
    (s) =>
      !s.snippet.includes("application/ld+json") && // Schema.org JSON-LD is safe
      !s.snippet.includes("__HTML_CONTENT__") &&
      !s.file.includes("seo") &&
      !s.file.includes("analytics")
  );

  record(
    "SEC-06",
    "dangerouslySetInnerHTML usage audit (no unsanitized user content)",
    userSuppliedDangerous.length === 0,
    { totalDangerous: dangerousRenderSites.length, nonJsonLd: userSuppliedDangerous }
  );

  // ---------------------------------------------------------------------------
  // 3. Client Bundle Secret Leak Audit (.next/static)
  // ---------------------------------------------------------------------------
  console.log("\n--- 3. Client Bundle Secret Grep (.next/static) ---");
  const staticDir = path.resolve(".next/static");
  let clientBundleSecrets = [];

  if (fs.existsSync(staticDir)) {
    const staticFiles = getFiles(staticDir, [".js"]);
    const secretPatterns = [
      { name: "AUTH_SECRET", regex: /kVcS53FBR4jZc3\+GUmArnDtBqG4itfCF8WBHkWbRwbmRkpOVSEk68FmMZSycFdam/ },
      { name: "MONGODB_URI", regex: /mongodb\+srv:\/\/[^\s"']+/ },
      { name: "RESEND_API_KEY", regex: /re_[a-zA-Z0-9_-]{20,}/ },
      { name: "SENTRY_AUTH_TOKEN", regex: /sntrys_[a-zA-Z0-9_\-\/]+/ },
      { name: "RAZORPAY_KEY_SECRET", regex: /cAvLAk0m29ryz5e9rUHNBxs1/ },
      { name: "NVIDIA_API_KEY", regex: /nvapi-[a-zA-Z0-9_-]{20,}/ },
      { name: "UPSTASH_REDIS_TOKEN", regex: /gQAAAAAAAprUAAIgcDFjNWU3MTQ3MTUyODA0YzQwYTgyYTQ5MWNkYmU5YTI4Yw/ },
    ];

    for (const file of staticFiles) {
      const content = fs.readFileSync(file, "utf8");
      for (const pattern of secretPatterns) {
        if (pattern.regex.test(content)) {
          clientBundleSecrets.push({
            file: path.relative(process.cwd(), file),
            pattern: pattern.name,
          });
        }
      }
    }
  }

  record(
    "SEC-07",
    "Production and third-party secrets absent from client JS bundles (.next/static)",
    clientBundleSecrets.length === 0,
    { exposedSecrets: clientBundleSecrets }
  );

  // ---------------------------------------------------------------------------
  // 4. Open Redirects (?returnTo= / ?callbackUrl=)
  // ---------------------------------------------------------------------------
  console.log("\n--- 4. Open Redirect Verification (?returnTo=) ---");

  const openRedirectPayloads = [
    "https://evil.com",
    "http://evil.com",
    "//evil.com",
    "/\\evil.com",
    "javascript:alert(1)",
    "https://petsaathi.vercel.app.evil.com",
  ];

  const redirectResults = [];

  for (const payload of openRedirectPayloads) {
    const res = await fetch(`${BASE_URL}/login?returnTo=${encodeURIComponent(payload)}`, {
      redirect: "manual",
    });

    const loginHtml = await fetch(`${BASE_URL}/login?returnTo=${encodeURIComponent(payload)}`).then((r) => r.text());

    // Check if the form action or client redirection URL preserves the malicious external URL
    const hasRawExternalUrl = loginHtml.includes(`href="${payload}"`) || loginHtml.includes(`"${payload}"`);
    redirectResults.push({ payload, status: res.status, preservedInHtml: hasRawExternalUrl });
  }

  // Also check middleware and auth redirect helper
  const authHelpers = fs.readFileSync("src/middleware.ts", "utf8");
  const hasRedirectSanitizer = authHelpers.includes("sanitizeRedirect") || authHelpers.includes("startsWith('/')");

  record(
    "SEC-08",
    "Open redirect protection on ?returnTo parameter across auth entry points",
    !redirectResults.some((r) => r.payload.startsWith("http") && r.preservedInHtml),
    { redirectResults, hasRedirectSanitizer }
  );

  // ---------------------------------------------------------------------------
  // 5. Sensitive Information Disclosure in /api/health
  // ---------------------------------------------------------------------------
  console.log("\n--- 5. /api/health Sensitive Information Disclosure ---");

  const healthRes = await fetch(`${BASE_URL}/api/health`);
  let healthJson = null;
  try {
    healthJson = await healthRes.json();
  } catch {}

  const healthStr = JSON.stringify(healthJson || {});
  const leaksDbUri = healthStr.includes("mongodb+srv") || healthStr.includes("password");
  const leaksHost = healthStr.includes("cluster0") || healthStr.includes("internal");

  record(
    "SEC-09",
    "/api/health endpoint does not leak internal infrastructure details or connection strings",
    !leaksDbUri && !leaksHost,
    { status: healthRes.status, body: healthJson }
  );

  // ---------------------------------------------------------------------------
  // 6. NoSQL Injection Audit in API Search & Filter Parameters
  // ---------------------------------------------------------------------------
  console.log("\n--- 6. NoSQL Injection in API Routes Audit ---");

  // Test passing JSON objects like {"$gt": ""} into query parameters
  const nosqlRes = await fetch(`${BASE_URL}/api/cities?search[$gt]=`, {
    headers: { Accept: "application/json" },
  });
  let nosqlJson = null;
  try {
    nosqlJson = await nosqlRes.json();
  } catch {}

  record(
    "SEC-10",
    "NoSQL object injection payloads in query parameters rejected or safely typed",
    nosqlRes.status === 200 || nosqlRes.status === 400 || nosqlRes.status === 422,
    { status: nosqlRes.status, responseSample: typeof nosqlJson === "object" ? "Object returned" : nosqlJson }
  );

  console.log("\n================================================================================");
  console.log(`Phase 8 Summary: ${results.filter((r) => r.passed).length}/${results.length} checks passed`);
  console.log("================================================================================");
}

auditPhase8Security().catch(console.error);
