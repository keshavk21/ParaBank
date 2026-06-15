import { test, expect, BASE_URL } from '../../fixtures/customerId.fixture';

test('Get accounts list via API', async ({ request, customerId }) => {
  const response = await request.get(`${BASE_URL}/customers/${customerId}/accounts`, {
    headers: { Accept: 'application/json' },
  });

  expect(response.status()).toBe(200);
  const accounts = await response.json();

  expect(accounts.length).toBeGreaterThan(0);
});

test('TC-API-NEG-03: Get accounts list with invalid customer ID should return 400', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/customers/0/accounts`, {
    headers: { Accept: 'application/json' },
  });

  expect(response.status()).toBe(400);
});