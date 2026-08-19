import fs from "fs";

async function run() {
  const baseUrl = "http://localhost:3022";
  console.log(`Verifying E2E on ${baseUrl}...`);

  try {
    // 1. Signup Customer
    const email = `test@petsaathi.com`;
    const res1 = await fetch(`${baseUrl}/api/auth/password/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Origin": baseUrl },
      body: JSON.stringify({ displayName: "Test Customer", email, password: "SecurePassword123!" })
    });
    console.log("Signup:", res1.status, res1.headers.get("content-type"));
    const signupText = await res1.text().catch(() => null);
    console.log("Signup Text:", signupText);

    const resHealth = await fetch(`${baseUrl}/api/ai/health`);
    console.log("AI Health:", resHealth.status, await resHealth.text().catch(() => null));

  } catch (err) {
    console.error(err);
  }
}

run();
