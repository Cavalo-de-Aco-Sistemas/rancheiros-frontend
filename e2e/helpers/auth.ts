import { Page, expect } from '@playwright/test';

/**
 * Get default test credentials from environment or defaults
 */
function getTestCredentials() {
  return {
    username: process.env.E2E_USERNAME || 'admin',
    password: process.env.E2E_PASSWORD || '12345',
  };
}

/**
 * Login helper function
 */
export async function login(page: Page, username?: string, password?: string) {
  const credentials = getTestCredentials();
  username = username || credentials.username;
  password = password || credentials.password;
  
  // Navigate to login page
  await page.goto('http://localhost:5173');
  
  // Wait for page to load completely
  await page.waitForLoadState('networkidle');
  
  // Wait for any input field to be visible (more flexible)
  await page.waitForSelector('input', { timeout: 15000 });
  
  // Wait a bit more for React to render
  await page.waitForTimeout(1000);
  
  // Fill in credentials - try multiple selector strategies
  const usernameInput = page.locator('input[type="text"]').or(page.locator('input[placeholder*="usuário"]')).first();
  await usernameInput.fill(username);
  
  const passwordInput = page.locator('input[type="password"]').first();
  await passwordInput.fill(password);
  
  // Click submit button
  await page.click('button[type="submit"]');
  
  // Wait for navigation to complete (should redirect to members or another page)
  await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 15000 });
  
  // Wait a bit for the app to fully load
  await page.waitForLoadState('networkidle');
}

/**
 * Check if user is logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  const url = page.url();
  return !url.includes('/login');
}

/**
 * Logout helper function
 */
export async function logout(page: Page) {
  // Look for logout button in header/menu
  const logoutButton = page.locator('button:has-text("Sair")').or(page.locator('button:has-text("Logout")'));
  
  if (await logoutButton.isVisible({ timeout: 1000 }).catch(() => false)) {
    await logoutButton.click();
    await page.waitForURL('**/login');
  }
}
