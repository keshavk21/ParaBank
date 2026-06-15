// invalidLogin.spec.ts
import { test, expect } from '@playwright/test';
import * as fs from 'fs';

const BASE_URL = 'https://parabank.parasoft.com/parabank/services/bank';

test('TC-API-NEG-01: Login with invalid credentials should return 401', async ({ request }) => {
  const { userName, password } = JSON.parse(fs.readFileSync('test-data/invalidlogin.json', 'utf-8'));

  const response = await request.get(`${BASE_URL}/login/${userName}/${password}`, {
    headers: { Accept: 'application/json' },
  });
  expect(response.status()).toBe(400);
});

test('TC-API-NEG-02: Login with blank credentials should return 404', async ({ request }) => {
  const { userName, password } = JSON.parse(fs.readFileSync('test-data/blanklogin.json', 'utf-8'));
  const response = await request.get(`${BASE_URL}/login/${userName}/${password}`, {
    headers: { Accept: 'application/json' },
  });
  expect(response.status()).toBe(404);
});
