import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("=== PHASE 3: API SECURITY & CONTRACT TESTS ===\n");
  const findings = [];

  // 1. Cron Authentication Test
  console.log("--- 1. Testing /api/cron/* Authentication ---");
  try {
    const cronNoAuth = await fetch(`${BASE_URL}/api/cron/expire-employees`, { method: "POST" });
    const cronNoAuthBody = await cronNoAuth.text();
    console.log(`POST /api/cron/expire-employees (no auth) -> Status: ${cronNoAuth.status}, Body: ${cronNoAuthBody.slice(0, 100)}`);
    if (cronNoAuth.status === 200) {
      findings.push({
        id: "CRON_NO_AUTH",
        severity: "CRITICAL",
        title: "/api/cron/expire-employees runs without authentication header",
        status: cronNoAuth.status,
        body: cronNoAuthBody,
      });
    }

    const cronWrongSecret = await fetch(`${BASE_URL}/api/cron/expire-employees`, {
      method: "POST",
      headers: { Authorization: "Bearer wrong-secret" },
    });
    console.log(`POST /api/cron/expire-employees (wrong secret) -> Status: ${cronWrongSecret.status}`);
  } catch (err) {
    console.error("Cron test error:", err.message);
  }

  // 2. Unauthenticated Access to Protected Endpoints (Test A)
  console.log("\n--- 2. Testing Protected Endpoints without Auth ---");
  const protectedEndpoints = [
    { method: "GET", path: "/api/admin/users" },
    { method: "GET", path: "/api/admin/kpis" },
    { method: "GET", path: "/api/admin/finance" },
    { method: "GET", path: "/api/admin/safety" },
    { method: "GET", path: "/api/customer/dashboard" },
    { method: "GET", path: "/api/customer/loyalty" },
    { method: "GET", path: "/api/customer/pets/sync" },
    { method: "GET", path: "/api/saathi/profile" },
    { method: "GET", path: "/api/saathi/availability" },
    { method: "GET", path: "/api/saathi/assignments" },
    { method: "GET", path: "/api/bookings" },
    { method: "GET", path: "/api/pets" },
    { method: "GET", path: "/api/b2b/memberships" },
  ];

  for (const ep of protectedEndpoints) {
    try {
      const res = await fetch(`${BASE_URL}${ep.path}`, { method: ep.method });
      const text = await res.text();
      console.log(`${ep.method} ${ep.path} -> Status: ${res.status}`);
      if (res.status === 200) {
        findings.push({
          id: "AUTH_BYPASS_PROTECTED_ENDPOINT",
          severity: "CRITICAL",
          title: `Endpoint ${ep.path} returned 200 without authentication`,
          endpoint: ep.path,
          status: res.status,
          body: text.slice(0, 150),
        });
      }
    } catch (err) {
      console.log(`${ep.method} ${ep.path} -> ERROR: ${err.message}`);
    }
  }

  // 3. Webhook Signature Verification
  console.log("\n--- 3. Testing Webhook Signature Verification ---");
  try {
    const rzpNoSig = await fetch(`${BASE_URL}/api/webhooks/razorpay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "payment.captured", payload: {} }),
    });
    const rzpNoSigText = await rzpNoSig.text();
    console.log(`POST /api/webhooks/razorpay (no signature) -> Status: ${rzpNoSig.status}, Body: ${rzpNoSigText}`);
    if (rzpNoSig.status === 200) {
      findings.push({
        id: "UNVERIFIED_RAZORPAY_WEBHOOK",
        severity: "CRITICAL",
        title: "/api/webhooks/razorpay accepted payload with no signature",
        status: rzpNoSig.status,
      });
    }

    const rzpFakeSig = await fetch(`${BASE_URL}/api/webhooks/razorpay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": "bad_signature_0000000000000000000000000000000000000000000000000000",
      },
      body: JSON.stringify({ event: "payment.captured", payload: {} }),
    });
    console.log(`POST /api/webhooks/razorpay (invalid signature) -> Status: ${rzpFakeSig.status}`);
    if (rzpFakeSig.status === 200) {
      findings.push({
        id: "INVALID_RAZORPAY_SIGNATURE_ACCEPTED",
        severity: "CRITICAL",
        title: "/api/webhooks/razorpay accepted payload with invalid signature",
        status: rzpFakeSig.status,
      });
    }
  } catch (err) {
    console.log("Razorpay webhook test error:", err.message);
  }

  // 4. Rate Limiting Tests (Test K)
  console.log("\n--- 4. Testing Rate Limiting (50 rapid requests) ---");
  const rateLimitTargets = [
    { name: "/api/contact", method: "POST", body: { type: "GENERAL", name: "Test User", email: "test@example.com", message: "Rate limit test message 1234567890", consentToContact: true } },
    { name: "/api/auth/otp/request", method: "POST", body: { phone: "9876543210" } },
  ];

  for (const target of rateLimitTargets) {
    let rateLimitedCount = 0;
    let statuses = [];
    for (let i = 0; i < 25; i++) {
      try {
        const res = await fetch(`${BASE_URL}${target.name}`, {
          method: target.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(target.body),
        });
        statuses.push(res.status);
        if (res.status === 429) rateLimitedCount++;
      } catch {}
    }
    const uniqueStatuses = Array.from(new Set(statuses));
    console.log(`${target.name} x25 -> Statuses: [${uniqueStatuses.join(", ")}], 429 count: ${rateLimitedCount}`);
    if (rateLimitedCount === 0) {
      findings.push({
        id: "RATE_LIMIT_NOT_ENFORCED",
        severity: "MEDIUM",
        title: `Rate limit not triggered after 25 rapid requests to ${target.name}`,
        target: target.name,
      });
    }
  }

  // 5. Upload File Restrictions (Test J)
  console.log("\n--- 5. Testing Upload Restrictions ---");
  try {
    const uploadRes = await fetch(`${BASE_URL}/api/uploads/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: "malicious.exe",
        contentType: "application/x-msdownload",
        fileSizeBytes: 1024,
      }),
    });
    const uploadText = await uploadRes.text();
    console.log(`POST /api/uploads/sign with .exe -> Status: ${uploadRes.status}, Body: ${uploadText.slice(0, 150)}`);
    if (uploadRes.status === 200 || uploadRes.status === 201) {
      findings.push({
        id: "DANGEROUS_FILE_EXTENSION_ACCEPTED",
        severity: "HIGH",
        title: "/api/uploads/sign signed upload URL for executable file (.exe)",
        status: uploadRes.status,
        body: uploadText,
      });
    }

    const svgRes = await fetch(`${BASE_URL}/api/uploads/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: "image.svg",
        contentType: "image/svg+xml",
        fileSizeBytes: 1024,
      }),
    });
    console.log(`POST /api/uploads/sign with image/svg+xml -> Status: ${svgRes.status}`);

    const hugeRes = await fetch(`${BASE_URL}/api/uploads/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: "huge.jpg",
        contentType: "image/jpeg",
        fileSizeBytes: 100 * 1024 * 1024, // 100MB
      }),
    });
    console.log(`POST /api/uploads/sign with 100MB file -> Status: ${hugeRes.status}`);
  } catch (err) {
    console.log("Upload test error:", err.message);
  }

  // 6. Huge Payload Test (Test G)
  console.log("\n--- 6. Testing Huge Payload (1MB payload) ---");
  try {
    const hugePayload = "A".repeat(1024 * 1024);
    const hugeRes = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "GENERAL", name: "Spam", email: "spam@example.com", message: hugePayload, consentToContact: true }),
    });
    console.log(`POST /api/contact (1MB body) -> Status: ${hugeRes.status}`);
  } catch (err) {
    console.log("Huge payload test error:", err.message);
  }

  // 7. Wrong HTTP Method Test (Test D)
  console.log("\n--- 7. Testing Wrong HTTP Method ---");
  try {
    const wrongMethodRes = await fetch(`${BASE_URL}/api/contact`, { method: "PUT" });
    console.log(`PUT /api/contact -> Status: ${wrongMethodRes.status}`);
  } catch (err) {
    console.log("Method test error:", err.message);
  }

  // 8. Static Code Audit: Static Analysis of all 184 route handlers
  console.log("\n--- 8. Static Code Audit of all 184 API Routes ---");
  function walk(dir) {
    let res = [];
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, f.name);
      if (f.isDirectory()) res.push(...walk(p));
      else if (f.name === "route.ts") res.push(p);
    }
    return res;
  }

  const allRoutes = walk("src/app/api");
  const auditMatrix = [];
  const potentialIdorRoutes = [];
  const unvalidatedRoutes = [];

  for (const rPath of allRoutes) {
    const rel = rPath.replace(/\\/g, "/");
    const code = fs.readFileSync(rPath, "utf-8");

    const hasAuthCheck = /getCurrentIdentity|auth\(|getServerSession|getAuthSession|requireRole|requireSession/i.test(code);
    const hasZodValidation = /schema\.parse|schema\.safeParse|z\.object|leadInputSchema/i.test(code);
    const hasPrismaDirectQuery = /prisma\.\w+\.(findUnique|findFirst|update|delete)\(\{/g.test(code);

    // Look for IDOR pattern: where: { id: ... } without ownerId / customerId / userId
    const isParamRoute = rel.includes("/[id]/");
    let suspectedIdor = false;
    if (isParamRoute && !rel.includes("/admin/")) {
      const idorMatches = code.match(/where:\s*\{[^}]*id:[^}]*\}/g);
      if (idorMatches) {
        for (const m of idorMatches) {
          if (!m.includes("ownerId") && !m.includes("userId") && !m.includes("customerId") && !m.includes("sitterId")) {
            suspectedIdor = true;
          }
        }
      }
    }

    if (suspectedIdor) {
      potentialIdorRoutes.push(rel);
    }

    const methods = [];
    if (/export async function GET/g.test(code)) methods.push("GET");
    if (/export async function POST/g.test(code)) methods.push("POST");
    if (/export async function PUT/g.test(code)) methods.push("PUT");
    if (/export async function PATCH/g.test(code)) methods.push("PATCH");
    if (/export async function DELETE/g.test(code)) methods.push("DELETE");

    auditMatrix.push({
      route: rel.replace(/^src\/app/, ""),
      methods: methods.join(", ") || "UNKNOWN",
      hasAuthCheck,
      hasZodValidation,
      suspectedIdor,
    });
  }

  console.log(`Total Routes Analyzed: ${auditMatrix.length}`);
  console.log(`Routes with suspected IDOR (filtering by param id without tenant/user check): ${potentialIdorRoutes.length}`);
  potentialIdorRoutes.forEach(r => console.log(`   - ${r}`));

  fs.writeFileSync("qa/api-audit-matrix.json", JSON.stringify(auditMatrix, null, 2));
  fs.writeFileSync("qa/api-test-findings.json", JSON.stringify(findings, null, 2));
}

runTests();
