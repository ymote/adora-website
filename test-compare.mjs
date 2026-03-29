import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // EN dark
  await page.goto('http://localhost:4326/adora-website/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/tmp/en-dark.png', fullPage: false });

  // EN light
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/en-light.png', fullPage: false });

  // CN dark
  await page.goto('http://localhost:4326/adora-website/zh-cn/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/tmp/cn-dark.png', fullPage: false });

  // CN light
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/cn-light.png', fullPage: false });

  await browser.close();
  console.log('Done');
})();
