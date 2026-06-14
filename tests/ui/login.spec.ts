import { test, expect } from '@playwright/test';
import { Login } from '../../pages/login.page';
import fs from 'fs';

// login.json is generated at runtime by global.setup.ts — do NOT read at module
// load time or it will crash on a clean CI clone where the file doesn't exist yet.
let userData: { userName: string; password: string };
let invalidUserData: { userName: string; password: string };

test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(() => {
  userData = JSON.parse(fs.readFileSync('test-data/login.json', 'utf-8'));
  invalidUserData = JSON.parse(fs.readFileSync('test-data/invalidlogin.json', 'utf-8'));
});

test('has title', async ({ page }) => {
  await page.goto('/parabank/index.htm');
  await expect(page).toHaveTitle('ParaBank | Welcome | Online Banking');
  const loginUser = new Login(page);
  await loginUser.loginUser(userData);
});

test('should show error on invalid login', async ({ page }) => {
  await page.goto('/parabank/index.htm');
  const loginUser = new Login(page);
  await loginUser.loginUser(invalidUserData);
  await expect(page.locator('.error')).toBeVisible();
});
