import { test, expect } from '../../fixtures/customerId.fixture';
import { CreateAccount } from '../../pages/createAccount.page';
import { TransferFunds } from '../../pages/transferFunds.page';

// PERF-05: Measure time for a fund transfer to complete
test('PERF-05: Fund transfer should complete within 5 seconds', async ({ page }) => {
  // Step 1: Create a destination account
  await page.goto('https://parabank.parasoft.com/parabank/openaccount.htm');
  const createAccount = new CreateAccount(page);
  const newAccountId = await createAccount.createAccountUser();

  // Step 2: Go to transfer page and start timing from click
  await page.goto('https://parabank.parasoft.com/parabank/transfer.htm');
  const transferFunds = new TransferFunds(page);

  const startTime = Date.now();

  await transferFunds.transferFunds('10', newAccountId);
  await page.getByRole('heading', { name: 'Transfer Complete!' }).waitFor({ timeout: 5000 });

  const transferTime = Date.now() - startTime;
  console.log(`Fund transfer completed in: ${transferTime}ms`);

  expect(transferTime).toBeLessThan(5000);
});
