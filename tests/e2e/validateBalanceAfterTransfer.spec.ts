import { test, expect, BASE_URL } from '../../fixtures/customerId.fixture';
import { AccountOverview } from '../../pages/accountOverview.page';
import { CreateAccount } from '../../pages/createAccount.page';
import { TransferFunds } from '../../pages/transferFunds.page';

const TRANSFER_AMOUNT = '100';

test('TC-E2E-01: Validate balance update after fund transfer via UI and API', async ({ page, request, customerId }) => {

  //Step 1: Go to Account Overview and read UI balance 
  await page.goto('/parabank/overview.htm');
  const overview = new AccountOverview(page);
  const sourceAccountId = await overview.getFirstAccountId();
  const uiBalanceBefore = await overview.getFirstAccountBalance();
  console.log(`Sender Account ID  : ${sourceAccountId}`);
  console.log(`UI Balance (before): ${uiBalanceBefore}`);

  //Step 2: Create a new account 
  await page.goto('/parabank/openaccount.htm');
  const createAccount = new CreateAccount(page);
  const newAccountId = await createAccount.createAccountUser();
  console.log(`New Account ID: ${newAccountId}`);
  expect(newAccountId).toMatch(/^\d+$/);

  //Step 3: Transfer funds to the new account 
  await page.goto('/parabank/transfer.htm');
  const transfer = new TransferFunds(page);
  await transfer.transferFunds(TRANSFER_AMOUNT, newAccountId);
  await expect(page.locator('#showResult h1')).toHaveText('Transfer Complete!', { timeout: 10000 });
  console.log(`Transferred $${TRANSFER_AMOUNT} to account ${newAccountId}`);

  // Fetch source account balance after transfer via API
  const sourceRes = await request.get(`${BASE_URL}/accounts/${sourceAccountId}`, {
    headers: { Accept: 'application/json' },
  });
  expect(sourceRes.status()).toBe(200);
  const sourceAccount = await sourceRes.json();

  console.log(`Sender Account (${sourceAccountId})`);
  console.log(`Balance BEFORE transfer : ${uiBalanceBefore}`);
  console.log(`Balance AFTER  transfer : $${sourceAccount.balance}`);

  //Step 4: Validate new account balance via API 
  const apiRes = await request.get(`${BASE_URL}/accounts/${newAccountId}`, {
    headers: { Accept: 'application/json' },
  });

  expect(apiRes.status()).toBe(200);
  const account = await apiRes.json();
  console.log(`API Balance (new account): ${account.balance}`);
  console.log(`Customer ID (from fixture): ${customerId}`);
  expect(account.id.toString()).toBe(newAccountId);
  expect(account.customerId).toBe(customerId);
  expect(account.balance).toBeGreaterThanOrEqual(Number(TRANSFER_AMOUNT));
  console.log(`UI balance before transfer was: ${uiBalanceBefore}`);
});
