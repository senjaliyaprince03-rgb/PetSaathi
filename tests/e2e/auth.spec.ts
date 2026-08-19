import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

test.describe('Authentication and Security (Phase 1)', () => {
  test('Unauthenticated user cannot access protected UI routes', async ({ page }) => {
    // Should redirect to login page
    await page.goto('/dashboard/customer');
    expect(page.url()).toContain('/login');
  });

  test('Unauthenticated user gets 401 on /api/admin/* routes', async ({ request }) => {
    const response = await request.get('/api/admin/users');
    expect(response.status()).toBe(401);
  });

  test('Registration, Login, and Session flow', async ({ page, request }) => {
    const testUser = {
      email: `test-${randomUUID()}@petsaathi.com`,
      password: 'SecurePassword123!',
      name: 'Test Customer',
      role: 'CUSTOMER',
    };

    // 1. REGISTER
    const baseURL = 'http://localhost:3110';
    const registerResponse = await request.post('/api/auth/register', {
      data: testUser,
      headers: { 'Origin': baseURL }
    });
    
    expect(registerResponse.status()).toBe(201);
    const registerData = await registerResponse.json();
    expect(registerData.message).toBe('User registered successfully');

    // 2. Duplicate registration fails
    const duplicateResponse = await request.post('/api/auth/register', {
      data: testUser,
      headers: { 'Origin': baseURL }
    });
    expect(duplicateResponse.status()).toBe(409);

    // 3. LOGIN via NextAuth's built-in /api/auth/callback/credentials endpoint
    const csrfResponse = await request.get('/api/auth/csrf');
    const csrfData = await csrfResponse.json();
    const csrfToken = csrfData.csrfToken;
    
    // Grab cookies from the CSRF response to send with login request
    const setCookie = csrfResponse.headers()['set-cookie'] || '';
    const cookieHeader = setCookie.split('\n').map(c => c.split(';')[0]).join('; ');

    const loginResponse = await request.post('/api/auth/callback/credentials', {
      form: {
        csrfToken: csrfToken,
        email: testUser.email,
        password: testUser.password,
        redirect: 'false',
      },
      headers: { 
        'Origin': baseURL,
        'Cookie': cookieHeader,
      }
    });

    expect(loginResponse.status()).toBe(200);

    // Playwright request context now has the next-auth.session-token cookie
    
    // 4. VERIFY SESSION EXISTS
    const sessionResponse = await request.get('/api/auth/session');
    const sessionData = await sessionResponse.json();
    expect(sessionData.user).toBeDefined();
    expect(sessionData.user.email).toBe(testUser.email);
    expect(sessionData.user.role).toBe('CUSTOMER');

    // 5. PROTECTED ROUTE 
    // Since the API request context shares cookies with the page context by default in some setups,
    // let's pass the cookies to the browser context to test UI.
    const storageState = await request.storageState();
    
    // Create a new browser context with the session cookies
    const context = await page.context();
    await context.addCookies(storageState.cookies);
    
    // Now visit the protected dashboard
    const dashboardResponse = await page.goto('/dashboard/customer');
    expect(dashboardResponse?.status()).toBe(200);
    // It shouldn't redirect to login anymore
    expect(page.url()).not.toContain('/login');
  });
});
