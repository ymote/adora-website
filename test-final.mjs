import { chromium } from 'playwright';
const URL = 'http://localhost:4325/adora-website';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });

  // Dark mode
  await page.screenshot({ path: '/tmp/final-dark.png', fullPage: false });

  // Light mode
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/final-light.png', fullPage: false });

  // Dark mode (indigo)
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/final-indigo.png', fullPage: false });

  await browser.close();
  console.log('Done. Check /tmp/final-dark.png, /tmp/final-light.png, /tmp/final-indigo.png');
})();
