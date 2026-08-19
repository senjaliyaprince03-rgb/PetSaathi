import fetch from 'node-fetch';

const PORT = 3022; // Using 3022 based on the logs
const BASE_URL = `http://localhost:${PORT}`;

async function runAdminSmokeTest() {
  console.log("🚀 Starting Admin E2E Smoke Test...");
  const headers = { 'Content-Type': 'application/json', 'Origin': BASE_URL };

  try {
    // 1. Admin Signup
    console.log("\n1️⃣ Admin Signup...");
    const signupRes = await fetch(`${BASE_URL}/api/auth/password/signup`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        displayName: 'Admin Tester',
        email: 'admin.test@petsaathi.com',
        password: 'AdminPassword123!',
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
          email: 'admin.test@petsaathi.com',
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

    // 3. Testing Admin Metrics API (Should be 403 Forbidden since the new user doesn't have Admin roles yet)
    console.log("\n3️⃣ Testing Admin Metrics API (Expecting 403)...");
    const getMetricsRes = await fetch(`${BASE_URL}/api/ai/metrics`, {
      method: 'GET',
      headers: { ...headers, 'Cookie': cookies }
    });
    const getMetricsData = await getMetricsRes.json();
    console.log(`Metrics GET Response [${getMetricsRes.status}]:`, getMetricsData);
    
    console.log("\n✅ Admin Smoke Test Completed.");
  } catch (error) {
    console.error("❌ Test Failed:", error.message);
  }
}

runAdminSmokeTest();
