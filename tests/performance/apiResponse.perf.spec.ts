import { test, expect, BASE_URL } from '../../fixtures/customerId.fixture';

// PERF-03: Measure API response time for getting accounts list
test('PERF-03: Get accounts list API should respond within 2 seconds', async ({ request, customerId }) => {
  const startTime = Date.now();
  const response = await request.get(`${BASE_URL}/customers/${customerId}/accounts`, {
    headers: { Accept: 'application/json' },
  });
  const responseTime = Date.now() - startTime;
  console.log(`Get accounts list response time: ${responseTime}ms`);
  expect(response.status()).toBe(200);
  expect(responseTime).toBeLessThan(2000);
});

// PERF-04: Measure API response time for getting a single account
test('PERF-04: Get single account API should respond within 2 seconds', async ({ request, customerId }) => {
  const listResponse = await request.get(`${BASE_URL}/customers/${customerId}/accounts`, {
    headers: { Accept: 'application/json' },
  });
  const accounts = await listResponse.json();
  const accountId = accounts[0].id;
  const startTime = Date.now();
  const response = await request.get(`${BASE_URL}/accounts/${accountId}`, {
    headers: { Accept: 'application/json' },
  });
  const responseTime = Date.now() - startTime;
  console.log(`Get single account response time: ${responseTime}ms`);
  expect(response.status()).toBe(200);
  expect(responseTime).toBeLessThan(2000);
});
