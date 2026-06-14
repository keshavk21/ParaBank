// fixtures.ts
import { test as base, expect } from '@playwright/test';
import * as fs from 'fs';

const BASE_URL = 'https://parabank.parasoft.com/parabank/services/bank';

export const test = base.extend<{ customerId: number }>({
  customerId: async ({}, use) => {
    const { customerId } = JSON.parse(fs.readFileSync('test-data/customer.json', 'utf-8'));
    await use(customerId);
  },
});

export { expect, BASE_URL };