const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";

async function testNativeSessionRbac() {
  console.log("================================================================================");
  console.log("               PETSAATHI QA AUDIT — WAVE 2: RBAC FIREWALL VERIFICATION         ");
  console.log("================================================================================");

  // 1. Create and authenticate a CUSTOMER user using native session
  const email = `qa-rbac-cust-${Date.now()}@petsaathi.com`;
  const signupRes = await fetch(`${BASE_URL}/api/auth/password/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL },
    body: JSON.stringify({
      displayName: "QA RBAC Customer",
      email,
      password: "Password123!",
      role: "CUSTOMER",
    }),
  });
  const signupData = await signupRes.json();
  const otp = signupData.developmentOtp || "123456";

  const verifyRes = await fetch(`${BASE_URL}/api/auth/email/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL },
    body: JSON.stringify({ email, otp }),
  });

  const setCookieHeader = verifyRes.headers.get("set-cookie") || "";
  const sessionMatch = setCookieHeader.match(/petsaathi_session=([^;]+)/);
  if (!sessionMatch) {
    console.error("FAILED to obtain petsaathi_session cookie:", setCookieHeader);
    process.exit(1);
  }
  const nativeCookie = `petsaathi_session=${sessionMatch[1]}`;
  console.log("Native session obtained successfully for CUSTOMER role.");
  console.log("Cookie prefix:", nativeCookie.substring(0, 40) + "...");

  const endpoints = [
    { path: "/admin", expect: [307, 302, 403] },
    { path: "/api/admin/cities", expect: [403] },
    { path: "/operator", expect: [307, 302, 403] },
    { path: "/partners", expect: [307, 302, 403] },
  ];

  let passed = true;
  for (const ep of endpoints) {
    const res = await fetch(`${BASE_URL}${ep.path}`, {
      headers: { Cookie: nativeCookie },
      redirect: "manual",
    });

    const location = res.headers.get("location") || "none";
    const isExpected = ep.expect.includes(res.status);
    console.log(`GET ${ep.path} -> Status: ${res.status} | Location: ${location} | Result: ${isExpected ? "[PASS]" : "[FAIL]"}`);
    if (!isExpected) passed = false;
  }

  console.log("\n================================================================================");
  console.log(`RBAC Firewall Summary: ${passed ? "ALL 4 ENDPOINTS BLOCKED / REDIRECTED (PASS)" : "RBAC BYPASS DETECTED (FAIL)"}`);
  console.log("================================================================================");
  if (!passed) process.exit(1);
}

testNativeSessionRbac().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
