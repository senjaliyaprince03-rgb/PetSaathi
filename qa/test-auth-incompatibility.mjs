const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";

async function verifyIncompatibility() {
  console.log("Testing auth subsystem incompatibilities via HTTP...");

  // 1. Register a user via POST /api/auth/register (NextAuth bcrypt subsystem)
  const bcryptEmail = `compat-bcrypt-${Date.now()}@example.com`;
  const registerRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL },
    body: JSON.stringify({
      email: bcryptEmail,
      password: "TestPassword123!",
      name: "Bcrypt User",
      role: "CUSTOMER",
    }),
  });
  console.log("1. /api/auth/register status:", registerRes.status, await registerRes.json());

  // Try signing in with that user via POST /api/auth/password/signin (mongodb-auth scrypt subsystem)
  const signinRes = await fetch(`${BASE_URL}/api/auth/password/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL },
    body: JSON.stringify({
      email: bcryptEmail,
      password: "TestPassword123!",
    }),
  });
  console.log("2. /api/auth/password/signin status for bcrypt-registered user:", signinRes.status, await signinRes.json());

  // 3. Register a user via POST /api/auth/password/signup (mongodb-auth scrypt subsystem)
  const scryptEmail = `compat-scrypt-${Date.now()}@example.com`;
  const signupRes = await fetch(`${BASE_URL}/api/auth/password/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL },
    body: JSON.stringify({
      email: scryptEmail,
      password: "TestPassword123!",
      displayName: "Scrypt User",
      role: "CUSTOMER",
    }),
  });
  console.log("3. /api/auth/password/signup status:", signupRes.status, await signupRes.json());

  // Try signing in with that user via NextAuth credentials callback (/api/auth/callback/credentials)
  // Fetch CSRF token first
  const csrfRes = await fetch(`${BASE_URL}/api/auth/csrf`);
  const csrfJson = await csrfRes.json();
  const csrfToken = csrfJson.csrfToken;
  const csrfCookie = csrfRes.headers.get("set-cookie");

  const nextAuthRes = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Origin: BASE_URL,
      Cookie: csrfCookie ? csrfCookie.split(";")[0] : "",
    },
    body: new URLSearchParams({
      csrfToken,
      email: scryptEmail,
      password: "TestPassword123!",
      json: "true",
    }).toString(),
    redirect: "manual",
  });
  console.log("4. NextAuth credentials callback status for scrypt-registered user:", nextAuthRes.status, "Location:", nextAuthRes.headers.get("location"));
}

verifyIncompatibility().catch(console.error);
