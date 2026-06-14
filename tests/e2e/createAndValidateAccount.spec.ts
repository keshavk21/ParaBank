import { test, expect, BASE_URL } from '../../fixtures/customerId.fixture';
import { CreateAccount } from '../../pages/createAccount.page';

test('TC-API-01: Validate New Account Exists via API', async ({ page, request, customerId }) => {
  // Step 1: Create account via UI and capture account ID
  await page.goto('/parabank/openaccount.htm');
  const createAccount = new CreateAccount(page);
  const newAccountId = await createAccount.createAccountUser();

  // Step 2: Call GET Accounts API
  const response = await request.get(`${BASE_URL}/customers/${customerId}/accounts`, {
    headers: { Accept: 'application/json' },
  });

  // Step 3: Validate API response and search for captured Account ID
  expect(response.status()).toBe(200);
  const accounts = await response.json();
  const accountIds = accounts.map((a: any) => a.id.toString());
  expect(accountIds).toContain(newAccountId);
});
