import { Page } from '@playwright/test';

export class AccountOverview {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Returns the balance text of the first account row (e.g. "$515.00")
    async getFirstAccountBalance(): Promise<string> {
        // Wait for the accounts table to load (AJAX-populated, can be slow on shared env)
        const firstAccountRow = this.page.locator('#accountTable tbody tr td a').first();
        await firstAccountRow.waitFor({ state: 'visible', timeout: 30000 });

        // The balance is in the 2nd <td> of the first data row (row that has an account link)
        const balanceText = await this.page.locator('#accountTable tbody tr').first().locator('td').nth(1).textContent();
        return balanceText?.trim() ?? '';
    }

    // Returns the account ID (href number) of the first account row
    async getFirstAccountId(): Promise<string> {
        // Wait for the first account link to appear (AJAX-populated, can be slow on shared env)
        const firstAccountLink = this.page.locator('#accountTable tbody tr td a').first();
        await firstAccountLink.waitFor({ state: 'visible', timeout: 30000 });
        const href = await firstAccountLink.getAttribute('href');
        // href is like "/parabank/activity.htm?id=12345" or "activity.htm?id=12345"
        const id = href?.split('id=')[1] ?? '';
        return id;
    }
}
