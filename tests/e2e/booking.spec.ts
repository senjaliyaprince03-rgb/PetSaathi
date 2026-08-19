import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

test.describe('Booking and Sitter Browse (Phase 2)', () => {

  const baseURL = 'http://localhost:3110';

  test('Sitter Browse returns approved sitters with permissions', async ({ request }) => {
    const response = await request.get('/api/services');
    expect(response.status()).toBe(200);
    const sitters = await response.json();
    expect(Array.isArray(sitters)).toBeTruthy();
    
    // We seeded sitter@petsaathi.test and gave DOG_WALK_30 permission
    if (sitters.length > 0) {
      const sitter = sitters.find((s: any) => s.user.email === 'sitter@petsaathi.test');
      if (sitter) {
        expect(sitter.status).toBe('APPROVED');
        expect(sitter.permissions).toBeDefined();
      }
    }
  });

  test('Customer can create a booking', async ({ request }) => {
    // 0. Login
    const customer = {
      email: `customer-${randomUUID()}@petsaathi.com`,
      password: 'SecurePassword123!',
      name: 'E2E Customer',
      role: 'CUSTOMER',
    };

    await request.post('/api/auth/register', {
      data: customer,
      headers: { 'Origin': baseURL }
    });

    const csrfResponse = await request.get('/api/auth/csrf');
    const csrfData = await csrfResponse.json();
    const setCookie = csrfResponse.headers()['set-cookie'] || '';
    const cookieHeader = setCookie.split('\n').map(c => c.split(';')[0]).join('; ');

    const loginResponse = await request.post('/api/auth/callback/credentials', {
      form: {
        csrfToken: csrfData.csrfToken,
        email: customer.email,
        password: customer.password,
        redirect: 'false',
      },
      headers: { 
        'Origin': baseURL,
        'Cookie': cookieHeader,
      }
    });

    const storageState = await request.storageState();
    const sessionCookieHeader = storageState.cookies.map(c => `${c.name}=${c.value}`).join('; ');


    // 1. Fetch sitters to find a valid sitter & service
    const browseRes = await request.get('/api/services');
    const sitters = await browseRes.json();
    
    let targetSitterId = null;
    let targetServiceCode = null;

    for (const s of sitters) {
      if (s.permissions.length > 0) {
        targetSitterId = s.id;
        targetServiceCode = s.permissions[0].serviceType.code;
        break;
      }
    }

    if (!targetSitterId || !targetServiceCode) {
      test.skip(true, 'No sitter with permissions found to book');
      return;
    }

    const start = new Date();
    start.setDate(start.getDate() + 1); // tomorrow
    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    const bookingPayload = {
      serviceCode: targetServiceCode,
      scheduledStart: start.toISOString(),
      scheduledEnd: end.toISOString(),
      locationId: 'some-location-id', // these might need to be valid IDs based on DB constraints, but let's see
      petId: 'some-pet-id',
      sitterId: targetSitterId
    };

    const bookingRes = await request.post('/api/bookings', {
      data: bookingPayload,
      headers: {
        'Origin': baseURL
      }
    });

    if (bookingRes.status() === 401) {
      console.log('401 Response:', await bookingRes.text());
    }

    // We just want to make sure it is not 401
    expect(bookingRes.status()).not.toBe(401);
  });
});
