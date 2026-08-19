import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = 'http://127.0.0.1:3110';
const outDir = path.join(process.cwd(), 'output', 'report_screenshots');

const shots = [
  { name: '01-home.png', url: '/', label: 'Home page' },
  { name: '02-services.png', url: '/services', label: 'Services page' },
  { name: '03-book.png', url: '/book', label: 'Booking page' },
  { name: '04-login.png', url: '/login', label: 'Login page' },
  { name: '05-become-a-saathi.png', url: '/become-a-saathi', label: 'Become a Saathi page' },
  { name: '06-membership.png', url: '/membership', label: 'Membership page' },
];

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 2200 },
    deviceScaleFactor: 1,
  });

  for (const shot of shots) {
    const target = `${baseUrl}${shot.url}`;
    console.log(`Capturing ${shot.label}: ${target}`);
    try {
      await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(5000);
      await page.screenshot({
        path: path.join(outDir, shot.name),
        fullPage: true,
      });
      console.log(`Saved ${shot.name}`);
    } catch (error) {
      console.error(`Failed on ${shot.url}:`, error?.message ?? error);
    }
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
