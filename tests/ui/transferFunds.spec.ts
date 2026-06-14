import { test, expect } from '../../fixtures/customerId.fixture';
import { CreateAccount } from '../../pages/createAccount.page';
import { TransferFunds } from '../../pages/transferFunds.page';

test('TC-UI-01: Transfer Funds between accounts', async ({ page }) => {
  // Step 1: Open a new account to use as the destination
  await page.goto('/parabank/openaccount.htm');
  const createAccount = new CreateAccount(page);
  const newAccountId = await createAccount.createAccountUser();

  // Step 2: Go to Transfer Funds page and transfer $10
  await page.goto('/parabank/transfer.htm');
  const transferFunds = new TransferFunds(page);
  await transferFunds.transferFunds('10', newAccountId);

  // Step 3: Validate success message
  await expect(page.getByRole('heading', { name: 'Transfer Complete!' })).toBeVisible({ timeout: 10000 });
});

test('TC-UI-02: Transfer Funds with blank amount shows error', async ({ page }) => {
  // Navigate to Transfer Funds page
  await page.goto('/parabank/transfer.htm');
  const transferFunds = new TransferFunds(page);

  // Submit with an empty amount field
  await transferFunds.transferFunds('');

  // ParaBank shows a server-side error page for invalid input
  await expect(page.getByRole('heading', { name: 'Error!' })).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('An internal error has occurred and has been logged.')).toBeVisible();
});

test('TC-UI-03: Transfer Funds with alphabetic amount shows error', async ({ page }) => {
  // Navigate to Transfer Funds page
  await page.goto('/parabank/transfer.htm');
  const transferFunds = new TransferFunds(page);

  // Submit with alphabetic characters in the amount field
  await transferFunds.transferFunds('abc');

  // ParaBank shows a server-side error page for invalid input
  await expect(page.getByRole('heading', { name: 'Error!' })).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('An internal error has occurred and has been logged.')).toBeVisible();
});
