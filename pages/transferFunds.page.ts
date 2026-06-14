import { Page, Locator } from "@playwright/test";

export class TransferFunds {
    page: Page;
    amount: Locator;
    toAccountId: Locator;
    transferButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.amount = page.locator('#amount');
        this.toAccountId = page.locator('#toAccountId');
        this.transferButton = page.locator('//input[@class="button"]');
    }

    async transferFunds(amountValue: string, toAccountId?: string) {
        await this.amount.fill(amountValue);

        // Wait for the toAccount dropdown to populate
        await this.page.locator('#toAccountId option').nth(1).waitFor({ state: 'attached' });

        if (toAccountId) {
            await this.toAccountId.selectOption({ value: toAccountId });
        } else {
            await this.toAccountId.selectOption({ index: 1 });
        }

        await this.transferButton.click();
    }
}
