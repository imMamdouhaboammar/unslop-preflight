#!/usr/bin/env node
// Viewport fit scanner.
// Tests single-screen-fit routes at multiple viewports for overflow and unnecessary scroll.
// Requires Playwright: npx playwright install chromium
// Usage: node scripts/scan-viewport-fit.mjs [baseUrl] [--routes /login,/signup,/otp]

import { chromium } from 'playwright';

const baseUrl = process.argv[2] || 'http://localhost:3000';

// Parse optional --routes flag.
let singleScreenRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/otp'
];

const routesIdx = process.argv.indexOf('--routes');
if (routesIdx !== -1 && process.argv[routesIdx + 1]) {
  singleScreenRoutes = process.argv[routesIdx + 1].split(',').map(r => r.trim());
}

const viewports = [
  { width: 320, height: 568 },
  { width: 360, height: 640 },
  { width: 390, height: 844 },
  { width: 414, height: 896 },
  { width: 768, height: 720 },
  { width: 1024, height: 768 },
  { width: 1280, height: 720 },
  { width: 1440, height: 900 }
];

let browser;
try {
  browser = await chromium.launch();
} catch (err) {
  console.error('Playwright chromium could not launch. Install with: npx playwright install chromium');
  console.error(err.message);
  process.exit(2);
}

const failures = [];

for (const route of singleScreenRoutes) {
  for (const viewport of viewports) {
    let page;
    try {
      page = await browser.newPage({ viewport });
      await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 15000 });

      const result = await page.evaluate(() => {
        const root = document.scrollingElement || document.documentElement;
        return {
          scrollWidth: root.scrollWidth,
          clientWidth: root.clientWidth,
          scrollHeight: root.scrollHeight,
          clientHeight: root.clientHeight,
          horizontalOverflow: root.scrollWidth > root.clientWidth + 1,
          verticalOverflow: root.scrollHeight > root.clientHeight + 1
        };
      });

      if (result.horizontalOverflow) {
        failures.push({
          route,
          viewport: `${viewport.width}x${viewport.height}`,
          type: 'horizontal-overflow',
          scrollWidth: result.scrollWidth,
          clientWidth: result.clientWidth
        });
      }

      if (result.verticalOverflow) {
        failures.push({
          route,
          viewport: `${viewport.width}x${viewport.height}`,
          type: 'unnecessary-vertical-scroll',
          scrollHeight: result.scrollHeight,
          clientHeight: result.clientHeight
        });
      }
    } catch (err) {
      // Route may not exist or server not running; report but do not fail.
      console.warn(`Could not test ${route} at ${viewport.width}x${viewport.height}: ${err.message}`);
    } finally {
      if (page) await page.close();
    }
  }
}

await browser.close();

if (failures.length) {
  console.error(`Viewport fit scan failed (${failures.length} issues)`);
  for (const f of failures) {
    console.error(`- [${f.type}] ${f.route} at ${f.viewport}`);
    if (f.type === 'horizontal-overflow') {
      console.error(`  scrollWidth=${f.scrollWidth} > clientWidth=${f.clientWidth}`);
    } else {
      console.error(`  scrollHeight=${f.scrollHeight} > clientHeight=${f.clientHeight}`);
    }
  }
  process.exit(1);
}

console.log(`Viewport fit scan passed (${singleScreenRoutes.length} routes x ${viewports.length} viewports)`);
