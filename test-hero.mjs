import { chromium } from 'playwright';

const URL = 'http://localhost:4325/adora-website';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });

  // Test 1: Default theme (black) — check hero bg src + logo visibility
  console.log('=== DEFAULT THEME (black) ===');
  const defaultTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('data-theme:', defaultTheme);

  // Check all hero-related elements
  const heroDark = await page.evaluate(() => {
    const el = document.querySelector('.hero-dark');
    return el ? { display: getComputedStyle(el).display, exists: true } : { exists: false };
  });
  console.log('hero-dark:', heroDark);

  const heroLight = await page.evaluate(() => {
    const el = document.querySelector('.hero-light');
    return el ? { display: getComputedStyle(el).display, exists: true } : { exists: false };
  });
  console.log('hero-light:', heroLight);

  const logoLight = await page.evaluate(() => {
    const el = document.querySelector('.header-logo-light');
    return el ? { display: getComputedStyle(el).display, src: el.src } : { exists: false };
  });
  console.log('logo-light (white):', logoLight);

  const logoDark = await page.evaluate(() => {
    const el = document.querySelector('.header-logo-dark');
    return el ? { display: getComputedStyle(el).display, src: el.src } : { exists: false };
  });
  console.log('logo-dark:', logoDark);

  // Test 2: Switch to light theme
  console.log('\n=== SWITCHING TO LIGHT ===');
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  });
  await page.waitForTimeout(500);

  const lightTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('data-theme:', lightTheme);

  const heroDarkAfter = await page.evaluate(() => {
    const el = document.querySelector('.hero-dark');
    return el ? { display: getComputedStyle(el).display } : { exists: false };
  });
  console.log('hero-dark:', heroDarkAfter);

  const heroLightAfter = await page.evaluate(() => {
    const el = document.querySelector('.hero-light');
    return el ? { display: getComputedStyle(el).display } : { exists: false };
  });
  console.log('hero-light:', heroLightAfter);

  const logoLightAfter = await page.evaluate(() => {
    const el = document.querySelector('.header-logo-light');
    return el ? { display: getComputedStyle(el).display } : { exists: false };
  });
  console.log('logo-light (white):', logoLightAfter);

  const logoDarkAfter = await page.evaluate(() => {
    const el = document.querySelector('.header-logo-dark');
    return el ? { display: getComputedStyle(el).display } : { exists: false };
  });
  console.log('logo-dark:', logoDarkAfter);

  // Check the actual CSS rules that match
  console.log('\n=== CSS RULE CHECK ===');
  const cssCheck = await page.evaluate(() => {
    const sheets = Array.from(document.styleSheets);
    const rules = [];
    for (const sheet of sheets) {
      try {
        for (const rule of sheet.cssRules) {
          const text = rule.cssText || '';
          if (text.includes('hero-dark') || text.includes('hero-light') || text.includes('header-logo')) {
            rules.push(text.substring(0, 200));
          }
        }
      } catch(e) {}
    }
    return rules;
  });
  console.log('Matching CSS rules:');
  cssCheck.forEach(r => console.log(' ', r));

  // Take screenshots
  await page.evaluate(() => document.documentElement.removeAttribute('data-theme'));
  await page.waitForTimeout(200);
  await page.screenshot({ path: '/tmp/hero-dark.png', fullPage: false });
  console.log('\nScreenshot dark: /tmp/hero-dark.png');

  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await page.waitForTimeout(200);
  await page.screenshot({ path: '/tmp/hero-light.png', fullPage: false });
  console.log('Screenshot light: /tmp/hero-light.png');

  await browser.close();
})();
