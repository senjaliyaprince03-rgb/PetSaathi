import { chromium } from 'playwright';

(async () => {
  try {
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    
    // Set the cookie
    await context.addCookies([{
      name: 'petsaathi_session',
      value: '3FEolcqUssddQS7ZWoTzoQcTlNEYdKEbw00ycY9d114',
      domain: '127.0.0.1',
      path: '/'
    }]);

    const page = await context.newPage();
    console.log('Navigating to dashboard on 3110...');
    await page.goto('http://127.0.0.1:3110/dashboard', { waitUntil: 'networkidle' });
    
    console.log('Taking screenshot...');
    await page.screenshot({ path: 'C:/Users/Prince/.gemini/antigravity/brain/396f24b4-e297-4b98-8b7c-29873a396d05/playwright-live-dashboard.png', fullPage: true });

    await browser.close();
    console.log('Done!');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
