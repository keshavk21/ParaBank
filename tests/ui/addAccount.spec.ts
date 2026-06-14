import { test, expect } from '@playwright/test';
import { CreateAccount} from '../../pages/createAccount.page';

test('has title', async ({ page }) => {
  await page.goto('/parabank/openaccount.htm');
  const createAccount = new CreateAccount(page)
  await createAccount.createAccountUser()
});