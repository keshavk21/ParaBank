import { test, expect } from '@playwright/test';

// PERF-01: Measure login page load time
test('PERF-01: Login page should load within 3 seconds', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('https://parabank.parasoft.com/parabank/login.htm');
  await page.waitForLoadState('load');
  const loadTime = Date.now() - startTime;
  console.log(`Login page load time: ${loadTime}ms`);
  expect(loadTime).toBeLessThan(3000);
});

// PERF-02: Measure account overview page load time (uses saved auth session)
test('PERF-02: Account overview page should load within 4 seconds', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('https://parabank.parasoft.com/parabank/overview.htm');
  await page.waitForLoadState('load');
  const loadTime = Date.now() - startTime;
  console.log(`Account overview page load time: ${loadTime}ms`);
  expect(loadTime).toBeLessThan(4000);
});
