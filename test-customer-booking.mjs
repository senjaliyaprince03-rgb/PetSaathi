import fetch from 'node-fetch';

const PORT = 3022;
const BASE_URL = `http://localhost:${PORT}`;

async function runBookingTest() {
  console.log("🚀 Starting Customer E2E Booking Test...");

  // 1. Signup customer
  console.log("\n1️⃣ Customer Signup...");
  const signupRes = await fetch(`${BASE_URL}/api/auth/password/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Origin': BASE_URL },
    body: JSON.stringify({
      displayName: 'Booking Tester',
      email: 'booking.test@petsaathi.com',
      password: 'StrongPassword123!',
    })
  });
  
  const signupData = await signupRes.json();
  console.log("Signup Response:", signupRes.status, signupData);
  
  let cookieHeader = signupRes.headers.get('set-cookie') || '';
  // Simple extraction for test
  const cookies = cookieHeader.split(',').map(c => c.split(';')[0]).join('; ');

  // 2. Verify OTP
  if (signupRes.status === 201 && signupData.requiresVerification) {
    console.log("\n2️⃣ Verifying OTP...");
    const verifyRes = await fetch(`${BASE_URL}/api/auth/email/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': BASE_URL, 'Cookie': cookies },
      body: JSON.stringify({
        email: 'booking.test@petsaathi.com',
        otp: signupData.developmentOtp || '123456'
      })
    });
    const verifyData = await verifyRes.json();
    console.log("Verify Response:", verifyRes.status, verifyData);
    
    // Update cookies after login
    const newCookieHeader = verifyRes.headers.get('set-cookie') || '';
    if (newCookieHeader) {
      const authCookie = newCookieHeader.split(',').map(c => c.split(';')[0]).find(c => c.includes('petsaathi_session'));
      if (authCookie) cookies += `; ${authCookie}`;
    }
  }

  // 3. Create a Booking (We need a valid service code and pet, but for a simple test we can try to hit the POST endpoint if it exists)
  // Let's check if the booking API exists
  console.log("\n3️⃣ Attempting Booking Creation...");
  const bookingRes = await fetch(`${BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Origin': BASE_URL, 'Cookie': cookies },
    body: JSON.stringify({
      serviceCode: 'DOG_WALK_30',
      petIds: [], // We might need a pet ID, but let's see what the API requires
      addressId: 'temp_address',
      scheduledStart: new Date(Date.now() + 86400000).toISOString(),
    })
  });
  
  if (bookingRes.status === 404) {
    console.log("Booking API not found (404). The booking endpoint might not be implemented yet.");
  } else {
    const bookingData = await bookingRes.json().catch(() => ({}));
    console.log("Booking Response:", bookingRes.status, bookingData);
  }

  console.log("\n✅ Test Completed.");
}

runBookingTest().catch(console.error);
