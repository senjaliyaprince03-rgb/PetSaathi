const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";

async function run() {
  console.log("=================================================");
  console.log("PETSAATHI QA AUDIT: PHASE 4 - AUTH & SESSION");
  console.log("Target Base URL:", BASE_URL);
  console.log("=================================================\n");

  const results = [];

  function record(id, title, pass, details) {
    results.push({ id, title, pass, details });
    console.log(`[${pass ? "PASS" : "FAIL"}] ${id}: ${title}`);
    if (details) console.log("   Details:", typeof details === "string" ? details : JSON.stringify(details, null, 2));
  }

  const defaultHeaders = {
    "Content-Type": "application/json",
    Origin: BASE_URL,
  };

  // -------------------------------------------------------------
  // 1. Password Edge Cases (Signup Validation)
  // -------------------------------------------------------------
  console.log("\n--- Section 1: Password Validation Edge Cases ---");
  
  // 1.1 Short password (5 chars)
  {
    const res = await fetch(`${BASE_URL}/api/auth/password/signup`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        displayName: "Short Pw Test",
        email: `qa-short-${Date.now()}@example.com`,
        password: "Aa1!b", // 5 chars
      }),
    });
    const body = await res.json();
    record(
      "AUTH-VAL-01",
      "Reject short password (<10 chars)",
      res.status === 422,
      { status: res.status, body }
    );
  }

  // 1.2 Weak password (10 chars, no special char)
  {
    const res = await fetch(`${BASE_URL}/api/auth/password/signup`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        displayName: "Weak Pw Test",
        email: `qa-weak-${Date.now()}@example.com`,
        password: "Password123", // no special char
      }),
    });
    const body = await res.json();
    record(
      "AUTH-VAL-02",
      "Reject password missing special character",
      res.status === 422,
      { status: res.status, body }
    );
  }

  // 1.3 Weak password (no uppercase)
  {
    const res = await fetch(`${BASE_URL}/api/auth/password/signup`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        displayName: "No Upper Test",
        email: `qa-noupper-${Date.now()}@example.com`,
        password: "password123!",
      }),
    });
    const body = await res.json();
    record(
      "AUTH-VAL-03",
      "Reject password missing uppercase character",
      res.status === 422,
      { status: res.status, body }
    );
  }

  // 1.4 Overly long password (>128 chars)
  {
    const res = await fetch(`${BASE_URL}/api/auth/password/signup`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        displayName: "Long Pw Test",
        email: `qa-long-${Date.now()}@example.com`,
        password: "A1!" + "a".repeat(130),
      }),
    });
    const body = await res.json();
    record(
      "AUTH-VAL-04",
      "Reject password exceeding 128 characters",
      res.status === 422,
      { status: res.status, body }
    );
  }

  // 1.5 Emoji in password
  {
    const res = await fetch(`${BASE_URL}/api/auth/password/signup`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        displayName: "Emoji Pw Test",
        email: `qa-emoji-${Date.now()}@example.com`,
        password: "Password123!🐶🐾",
      }),
    });
    const body = await res.json();
    record(
      "AUTH-VAL-05",
      "Accept valid password with Unicode / Emoji characters",
      res.status === 201,
      { status: res.status, body }
    );
  }

  // -------------------------------------------------------------
  // 2. Signup Flows & Role Assignment
  // -------------------------------------------------------------
  console.log("\n--- Section 2: Signup Flows & Role Assignment ---");

  // 2.1 Customer Signup Flow
  const customerEmail = `qa-customer-${Date.now()}@testpetsaathi.com`;
  let customerDevOtp = null;
  {
    const res = await fetch(`${BASE_URL}/api/auth/password/signup`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        displayName: "QA Customer Test",
        email: customerEmail,
        password: "SecurePassword123!",
        role: "CUSTOMER",
      }),
    });
    const body = await res.json();
    customerDevOtp = body.developmentOtp;
    record(
      "AUTH-SIGNUP-01",
      "Customer signup returns 201 with requiresVerification",
      res.status === 201 && body.created === true && body.requiresVerification === true,
      { status: res.status, body }
    );
  }

  // 2.2 Sitter Signup Flow
  const sitterEmail = `qa-sitter-${Date.now()}@testpetsaathi.com`;
  {
    const res = await fetch(`${BASE_URL}/api/auth/password/signup`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        displayName: "QA Sitter Test",
        email: sitterEmail,
        password: "SecurePassword123!",
        role: "SITTER",
      }),
    });
    const body = await res.json();
    record(
      "AUTH-SIGNUP-02",
      "Sitter (Saathi) signup returns 201 with requiresVerification",
      res.status === 201 && body.created === true,
      { status: res.status, body }
    );
  }

  // 2.3 Attempt ADMIN Signup via public endpoint (Privilege Escalation attempt)
  {
    const res = await fetch(`${BASE_URL}/api/auth/password/signup`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        displayName: "Malicious Admin Wannabe",
        email: `qa-hacker-${Date.now()}@example.com`,
        password: "SecurePassword123!",
        role: "ADMIN",
      }),
    });
    const body = await res.json();
    record(
      "AUTH-SIGNUP-03",
      "Reject role: ADMIN in public signup with 403",
      res.status === 403,
      { status: res.status, body }
    );
  }

  // 2.4 Duplicate Email Signup
  {
    const res = await fetch(`${BASE_URL}/api/auth/password/signup`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        displayName: "Duplicate User",
        email: customerEmail,
        password: "SecurePassword123!",
      }),
    });
    const body = await res.json();
    record(
      "AUTH-SIGNUP-04",
      "Reject duplicate email signup with 409",
      res.status === 409,
      { status: res.status, body }
    );
  }

  // -------------------------------------------------------------
  // 3. OTP Verification & Session Issuance
  // -------------------------------------------------------------
  console.log("\n--- Section 3: OTP Verification & Session Issuance ---");

  let sessionCookie = null;
  {
    const otpToUse = customerDevOtp || "123456";
    const res = await fetch(`${BASE_URL}/api/auth/email/verify`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        email: customerEmail,
        otp: otpToUse,
      }),
    });
    const setCookie = res.headers.get("set-cookie");
    sessionCookie = setCookie;
    const body = await res.json();
    record(
      "AUTH-OTP-01",
      "Verify OTP and issue session cookie",
      res.status === 200 && body.verified === true,
      { status: res.status, body, setCookie }
    );
  }

  // 3.2 Inspect Session Cookie Flags
  {
    const hasHttpOnly = sessionCookie?.toLowerCase().includes("httponly");
    const hasSameSite = sessionCookie?.toLowerCase().includes("samesite=lax") || sessionCookie?.toLowerCase().includes("samesite=strict");
    const hasSecure = sessionCookie?.toLowerCase().includes("secure");
    
    record(
      "AUTH-COOKIE-01",
      "Session cookie contains HttpOnly and SameSite flags",
      Boolean(hasHttpOnly && hasSameSite),
      { sessionCookie, hasHttpOnly, hasSameSite, hasSecure }
    );
  }

  // -------------------------------------------------------------
  // 4. Brute Force & Rate Limiting Tests
  // -------------------------------------------------------------
  console.log("\n--- Section 4: Brute Force & Rate Limiting ---");

  // 4.1 Password Signin Rate Limiting (threshold is 10 attempts per 15 min)
  {
    console.log("Sending 12 consecutive bad password attempts...");
    const attempts = [];
    for (let i = 1; i <= 12; i++) {
      const res = await fetch(`${BASE_URL}/api/auth/password/signin`, {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify({
          email: "customer.live@petsaathi.com",
          password: `WrongPassword${i}!`,
        }),
      });
      attempts.push({ attempt: i, status: res.status });
    }
    const throttled = attempts.filter((a) => a.status === 429);
    record(
      "AUTH-RATE-01",
      "Password signin rate-limits client IP after 10 failed attempts (HTTP 429)",
      throttled.length > 0,
      { totalAttempts: attempts.length, throttledCount: throttled.length, summary: attempts }
    );
  }

  // 4.2 OTP Brute Force Challenge Lockout (threshold is 6 attempts)
  {
    console.log("Testing OTP challenge lockout on fresh challenge...");
    const targetEmail = `qa-lockout-${Date.now()}@example.com`;
    // Request OTP first
    await fetch(`${BASE_URL}/api/auth/otp/request`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({ email: targetEmail, channel: "email" }),
    });

    // Submit 7 wrong codes
    const otpAttempts = [];
    for (let i = 1; i <= 7; i++) {
      const res = await fetch(`${BASE_URL}/api/auth/email/verify`, {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify({ email: targetEmail, otp: `00000${i}` }),
      });
      otpAttempts.push({ attempt: i, status: res.status });
    }
    record(
      "AUTH-RATE-02",
      "OTP challenge rejects brute-force attempts",
      otpAttempts.every((a) => a.status === 401 || a.status === 429),
      { otpAttempts }
    );
  }

  // -------------------------------------------------------------
  // 5. Unauthenticated Navigation & Cache Headers
  // -------------------------------------------------------------
  console.log("\n--- Section 5: Unauthenticated Navigation & Cache Headers ---");

  const protectedRoutes = [
    "/admin",
    "/admin/operations",
    "/operator",
    "/dashboard",
    "/customer/bookings",
    "/saathi/assignments",
  ];

  for (const path of protectedRoutes) {
    const res = await fetch(`${BASE_URL}${path}`, {
      redirect: "manual",
    });
    const status = res.status;
    const location = res.headers.get("location");
    const cacheControl = res.headers.get("cache-control");
    const pragma = res.headers.get("pragma");

    const isRedirect = status === 307 || status === 302;
    const redirectsToLogin = location?.includes("/login");
    const preventsCaching = cacheControl?.includes("no-store");

    record(
      `AUTH-NAV-${path.replace(/[^a-zA-Z0-9]/g, "-")}`,
      `Unauthenticated ${path} redirects to /login with no-store cache headers`,
      isRedirect && redirectsToLogin && preventsCaching,
      { status, location, cacheControl, pragma }
    );
  }

  // -------------------------------------------------------------
  // 6. Role Escalation / Authorization Boundaries
  // -------------------------------------------------------------
  console.log("\n--- Section 6: Role Escalation / Authorization Boundaries ---");

  // Extract session token from cookie
  let rawCookie = "";
  if (sessionCookie) {
    const match = sessionCookie.match(/petsaathi_session=[^;]+/);
    if (match) rawCookie = match[0];
  }

  // 6.1 Customer visiting /admin
  {
    const res = await fetch(`${BASE_URL}/admin`, {
      headers: rawCookie ? { Cookie: rawCookie } : {},
      redirect: "manual",
    });
    record(
      "AUTH-RBAC-01",
      "Customer session cannot access /admin (blocked or 404)",
      res.status === 404 || res.status === 307 || res.status === 403,
      { status: res.status, location: res.headers.get("location") }
    );
  }

  // 6.2 Customer calling /api/admin/metrics
  {
    const res = await fetch(`${BASE_URL}/api/admin/metrics`, {
      headers: rawCookie ? { Cookie: rawCookie } : {},
    });
    record(
      "AUTH-RBAC-02",
      "Customer session calling /api/admin/metrics is forbidden (403)",
      res.status === 403,
      { status: res.status }
    );
  }

  // 6.3 Check if /api/auth/register password hashing is incompatible with mongodb-auth
  {
    const regEmail = `qa-register-compat-${Date.now()}@example.com`;
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        email: regEmail,
        password: "Password123!",
        name: "Compat User",
        role: "CUSTOMER",
      }),
    });
    const regBody = await regRes.json();
    
    // Now try to sign in via /api/auth/password/signin
    const loginRes = await fetch(`${BASE_URL}/api/auth/password/signin`, {
      method: "POST",
      headers: { ...defaultHeaders, "x-forwarded-for": "192.168.1.99" },
      body: JSON.stringify({
        email: regEmail,
        password: "Password123!",
      }),
    });
    const loginBody = await loginRes.json();
    
    record(
      "AUTH-COMPAT-01",
      "User registered via /api/auth/register can sign in via /api/auth/password/signin",
      loginRes.status === 200 && loginBody.authenticated === true,
      {
        registerStatus: regRes.status,
        loginStatus: loginRes.status,
        loginBody,
      }
    );
  }

  console.log("\n=================================================");
  console.log(`TOTAL TESTS: ${results.length}`);
  console.log(`PASSED: ${results.filter((r) => r.pass).length}`);
  console.log(`FAILED: ${results.filter((r) => !r.pass).length}`);
  console.log("=================================================");
}

run().catch((err) => {
  console.error("FATAL ERROR IN TEST SCRIPT:", err);
  process.exit(1);
});
