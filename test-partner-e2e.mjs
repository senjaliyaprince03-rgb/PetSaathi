import fetch from 'node-fetch';

const PORT = 3022; // Using 3022 based on the logs
const BASE_URL = `http://localhost:${PORT}`;

async function runPartnerSmokeTest() {
  console.log("🚀 Starting Partner E2E Smoke Test...");
  const headers = { 'Content-Type': 'application/json', 'Origin': BASE_URL };

  try {
    // 1. Partner Signup
    console.log("\n1️⃣ Partner Signup...");
    const signupRes = await fetch(`${BASE_URL}/api/auth/password/signup`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        displayName: 'Partner Tester',
        email: 'partner.test@petsaathi.com',
        password: 'PartnerPassword123!',
      })
    });
    
    const signupData = await signupRes.json();
    console.log(`Signup Response [${signupRes.status}]:`, signupData);
    let cookieHeader = signupRes.headers.get('set-cookie') || '';
    let cookies = cookieHeader.split(',').map(c => c.split(';')[0]).join('; ');

    // 2. Verify OTP
    if (signupRes.status === 201 && signupData.requiresVerification) {
      console.log("\n2️⃣ Verifying OTP...");
      const verifyRes = await fetch(`${BASE_URL}/api/auth/email/verify`, {
        method: 'POST',
        headers: { ...headers, 'Cookie': cookies },
        body: JSON.stringify({
          email: 'partner.test@petsaathi.com',
          otp: signupData.developmentOtp || '123456'
        })
      });
      const verifyData = await verifyRes.json();
      console.log(`Verify Response [${verifyRes.status}]:`, verifyData);
      
      const newCookieHeader = verifyRes.headers.get('set-cookie') || '';
      if (newCookieHeader) {
        const authCookie = newCookieHeader.split(',').map(c => c.split(';')[0]).find(c => c.includes('petsaathi_session'));
        if (authCookie) cookies += `; ${authCookie}`;
      }
    }

    // Since the new user has a CUSTOMER role by default, the API might reject them if it requires SITTER role.
    // The profile endpoint checks for SITTER role. We'll test it anyway to ensure RBAC is working (should return 403 or 200).
    console.log("\n3️⃣ Testing Profile API (GET)...");
    const getProfileRes = await fetch(`${BASE_URL}/api/saathi/profile`, {
      method: 'GET',
      headers: { ...headers, 'Cookie': cookies }
    });
    const getProfileData = await getProfileRes.json();
    console.log(`Profile GET Response [${getProfileRes.status}]:`, getProfileData);
    
    console.log("\n✅ Partner Smoke Test Completed.");
  } catch (error) {
    console.error("❌ Test Failed:", error.message);
  }
}

runPartnerSmokeTest();
