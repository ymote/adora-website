import { chromium } from 'playwright';

const URL = 'https://ymote.github.io/adora-website/';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });

  // Switch to light
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  });
  await page.waitForTimeout(500);

  const result = await page.evaluate(() => {
    const heroDark = document.querySelector('.hero-dark');
    const heroLight = document.querySelector('.hero-light');
    return {
      heroDarkExists: !!heroDark,
      heroLightExists: !!heroLight,
      heroDarkDisplay: heroDark ? getComputedStyle(heroDark).display : 'N/A',
      heroLightDisplay: heroLight ? getComputedStyle(heroLight).display : 'N/A',
      theme: document.documentElement.getAttribute('data-theme'),
    };
  });
  console.log('Deployed light mode result:', result);
  
  await page.screenshot({ path: '/tmp/deployed-light.png', fullPage: false });
  console.log('Screenshot: /tmp/deployed-light.png');

  await browser.close();
})();
