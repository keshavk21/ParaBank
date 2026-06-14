import { test, expect, BASE_URL } from '../../fixtures/customerId.fixture';
import { CreateAccount } from '../../pages/createAccount.page';

test('TC-API-02: Validate Account Type and Details via API', async ({ page, request, customerId }) => {
  // Step 1: Create account via UI and capture account ID
  await page.goto('/parabank/openaccount.htm');
  const createAccount = new CreateAccount(page);
  const newAccountId = await createAccount.createAccountUser();

  // Step 2: Call GET /accounts/{accountId}
  const accountResponse = await request.get(`${BASE_URL}/accounts/${newAccountId}`, {
    headers: { Accept: 'application/json' },
  });

  // Step 3: Validate account type is CHECKING and belongs to the logged-in customer
  expect(accountResponse.status()).toBe(200);
  const account = await accountResponse.json();
  expect(account.type).toBe('CHECKING');
  expect(account.customerId).toBe(customerId);
});

test('TC-API-NEG-03: GET account with non-existent account ID should return 400', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/accounts/0000000`, {
    headers: { Accept: 'application/json' },
  });

  expect(response.status()).toBe(400);
});

test('TC-API-NEG-04: GET account with invalid (non-numeric) account ID should return 404', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/accounts/invalid-id`, {
    headers: { Accept: 'application/json' },
  });

  expect(response.status()).toBe(404);
});
