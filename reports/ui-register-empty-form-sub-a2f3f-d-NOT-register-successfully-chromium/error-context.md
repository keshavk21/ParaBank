# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\register.spec.ts >> empty form submission should NOT register successfully
- Location: tests\ui\register.spec.ts:27:6

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('h1.title')
Expected: "Welcome"
Received: "Signing up is easy!"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for locator('h1.title')
    13 × locator resolved to <h1 class="title">Signing up is easy!</h1>
       - unexpected value "Signing up is easy!"

```

```yaml
- heading "Signing up is easy!" [level=1]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { Register} from '../../pages/register.page';
  3  | import fs from "fs";
  4  | const userData = JSON.parse(fs.readFileSync('test-data/register.json', 'utf-8'));
  5  | 
  6  | // Clear storageState so the Register link is visible (not already logged in)
  7  | test.use({ storageState: { cookies: [], origins: [] } });
  8  | 
  9  | test('shows all required field errors on empty submit', async ({ page }) => {
  10 |   await page.goto('/parabank/register.htm');
  11 |   await page.locator('input[value="Register"]').click();
  12 | 
  13 |   await expect(page.getByText('First name is required.')).toBeVisible();
  14 |   await expect(page.getByText('Last name is required.')).toBeVisible();
  15 |   await expect(page.getByText('Address is required.')).toBeVisible();
  16 |   await expect(page.getByText('City is required.')).toBeVisible();
  17 |   await expect(page.getByText('State is required.')).toBeVisible();
  18 |   await expect(page.getByText('Zip Code is required.')).toBeVisible();
  19 |   await expect(page.getByText('Social Security Number is required.')).toBeVisible();
  20 |   await expect(page.getByText('Username is required.')).toBeVisible();
  21 |   await expect(page.getByText('Password is required.')).toBeVisible();
  22 |   await expect(page.getByText('Password confirmation is required.')).toBeVisible();
  23 | });
  24 | 
  25 | // test.fail() inverts the result:
  26 | // This assertion WILL fail (empty form can't register successfully) → Playwright marks it as PASSED
  27 | test.fail('empty form submission should NOT register successfully', async ({ page }) => {
  28 |   await page.goto('/parabank/register.htm');
  29 |   await page.locator('input[value="Register"]').click();
  30 | 
  31 |   // Intentionally wrong assertion — expects success on empty submit, which never happens
> 32 |   await expect(page.locator('h1.title')).toHaveText('Welcome');
     |                                          ^ Error: expect(locator).toHaveText(expected) failed
  33 | });
  34 | 
  35 | test('has title', async ({ page }) => {
  36 |   await page.goto('/parabank/index.htm');
  37 |   await expect(page).toHaveTitle('ParaBank | Welcome | Online Banking');
  38 | 
  39 |   // Use a unique username to avoid "This username already exists" error
  40 |   const uniqueData = { ...userData.validData, userName: `Keshav_${Date.now()}` };
  41 |   const registerUser = new Register(page)
  42 |   await registerUser.registerUser(uniqueData);
  43 | });
```