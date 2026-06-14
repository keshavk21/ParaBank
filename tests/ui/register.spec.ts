import { test, expect } from '@playwright/test';
import { Register} from '../../pages/register.page';
import fs from "fs";
const userData = JSON.parse(fs.readFileSync('test-data/register.json', 'utf-8'));

// Clear storageState so the Register link is visible (not already logged in)
test.use({ storageState: { cookies: [], origins: [] } });

test('shows all required field errors on empty submit', async ({ page }) => {
  await page.goto('/parabank/register.htm');
  await page.locator('input[value="Register"]').click();

  await expect(page.getByText('First name is required.')).toBeVisible();
  await expect(page.getByText('Last name is required.')).toBeVisible();
  await expect(page.getByText('Address is required.')).toBeVisible();
  await expect(page.getByText('City is required.')).toBeVisible();
  await expect(page.getByText('State is required.')).toBeVisible();
  await expect(page.getByText('Zip Code is required.')).toBeVisible();
  await expect(page.getByText('Social Security Number is required.')).toBeVisible();
  await expect(page.getByText('Username is required.')).toBeVisible();
  await expect(page.getByText('Password is required.')).toBeVisible();
  await expect(page.getByText('Password confirmation is required.')).toBeVisible();
});

// test.fail() inverts the result:
// This assertion WILL fail (empty form can't register successfully) → Playwright marks it as PASSED
test.fail('empty form submission should NOT register successfully', async ({ page }) => {
  await page.goto('/parabank/register.htm');
  await page.locator('input[value="Register"]').click();

  // Intentionally wrong assertion — expects success on empty submit, which never happens
  await expect(page.locator('h1.title')).toHaveText('Welcome');
});

test('has title', async ({ page }) => {
  await page.goto('/parabank/index.htm');
  await expect(page).toHaveTitle('ParaBank | Welcome | Online Banking');

  // Use a unique username to avoid "This username already exists" error
  const uniqueData = { ...userData.validData, userName: `Keshav_${Date.now()}` };
  const registerUser = new Register(page)
  await registerUser.registerUser(uniqueData);
});