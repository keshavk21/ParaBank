import { test as setup, request as requestContext } from '@playwright/test';
import { Register } from '../pages/register.page';
import { Login } from '../pages/login.page';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://parabank.parasoft.com/parabank/services/bank';

const userData = JSON.parse(fs.readFileSync('test-data/register.json', 'utf-8'));
const { userName, password } = userData.validData;

setup('authenticate user', async ({ page }) => {
  // Step 1: Try registration first
  await page.goto('/parabank/index.htm');
  const registerUser = new Register(page);
  await registerUser.registerUser(userData.validData);

  // If username already exists, ParaBank shows a span.error — fall back to login
  const registrationFailed = await page.locator('span.error').first().isVisible();

  if (registrationFailed) {
    await page.goto('/parabank/index.htm');
    const login = new Login(page);
    await login.loginUser({ userName, password });
  }

  // Navigate to overview and confirm we are logged in
  await page.goto('/parabank/overview.htm');
  await page.waitForURL('**/overview.htm', { timeout: 30000 });

  // Save auth state
  await page.context().storageState({ path: '.auth/user.json' });

  // Keep login.json in sync so the customerId fixture always has valid credentials
  fs.writeFileSync('test-data/login.json', JSON.stringify({ userName, password }, null, 4));

  // Fetch customerId once here so API tests don't need a live login call per test
  const apiContext = await requestContext.newContext();
  const res = await apiContext.get(`${BASE_URL}/login/${userName}/${password}`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok()) {
    await apiContext.dispose();
    throw new Error(
      `Setup failed: API login returned ${res.status()} for user "${userName}". ` +
      `customer.json was NOT written — fix credentials or the ParaBank server before running tests.`
    );
  }

  const customer = await res.json();
  fs.writeFileSync('test-data/customer.json', JSON.stringify({ customerId: customer.id }, null, 4));
  console.log(`Customer ID cached: ${customer.id}`);

  await apiContext.dispose();
});
