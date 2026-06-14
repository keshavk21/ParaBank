import { test, expect } from '@playwright/test';
import { Login} from '../../pages/login.page';
import fs from "fs";
const userData = JSON.parse(fs.readFileSync('test-data/login.json', 'utf-8'));
const invalidUserData = JSON.parse(fs.readFileSync('test-data/invalidlogin.json', 'utf-8'));

test.use({ storageState: { cookies: [], origins: [] } });

test('has title', async ({ page }) => {
  await page.goto('/parabank/index.htm');
  await expect(page).toHaveTitle('ParaBank | Welcome | Online Banking');
  const loginUser = new Login(page)
  await loginUser.loginUser(userData);
});

test('should show error on invalid login', async ({ page }) => {
  await page.goto('/parabank/index.htm');
  const loginUser = new Login(page);
  await loginUser.loginUser(invalidUserData);
  await expect(page.locator('.error')).toBeVisible();
});
