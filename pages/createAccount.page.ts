import { expect, Page, Locator } from "@playwright/test";

export class CreateAccount {
    page: Page;
    accountType: Locator;
    fromAccountId: Locator;
    openAccount: Locator;
    accountId: Locator;

    constructor(page: Page) {
        this.page = page;
        this.accountType = page.locator('#type');
        this.fromAccountId = page.locator('#fromAccountId');
        this.openAccount = page.locator('input[value="Open New Account"]');
        this.accountId = page.locator('#newAccountId');
    }

    async createAccountUser(): Promise<string> {
        await this.page.locator('#type option').first().waitFor({ state: 'attached' });
        await this.accountType.selectOption('0');

        // #fromAccountId is populated via async JS — wait for it before selecting
        await this.page.locator('#fromAccountId option').first().waitFor({ state: 'attached' });
        await this.fromAccountId.selectOption({ index: 0 });

        await this.openAccount.click();

        await expect(this.accountId).toHaveText(/\d+/, { timeout: 10000 });

        const accountNumber = await this.accountId.textContent();
        console.log(`Created Account Number: ${accountNumber}`);

        return accountNumber ?? '';
    }
}