import { test, expect } from '@playwright/test';

test('frontend should be running', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Wait a bit for React to render
  await page.waitForTimeout(2000);
  
  // Take a screenshot for debugging
  await page.screenshot({ path: 'test-results/login-page.png' });
  
  // Check if page title exists
  const title = await page.title();
  console.log('Page title:', title);
  
  // Should not be a blank page
  expect(title).toBeTruthy();
  
  // Check if we can see login form
  const inputs = await page.locator('input').count();
  console.log('Number of inputs found:', inputs);
  
  // Should have at least some inputs (username and password)
  expect(inputs).toBeGreaterThan(0);
});

test('backend should be accessible', async ({ request }) => {
  const response = await request.post('http://localhost:3000/graphql', {
    data: {
      query: '{ __typename }'
    }
  });
  
  expect(response.ok()).toBeTruthy();
  
  const data = await response.json();
  expect(data.data.__typename).toBe('Query');
  console.log('Backend is accessible');
});
