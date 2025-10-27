import { test, expect } from '@playwright/test';
import { login, isLoggedIn } from './helpers/auth';

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await login(page);
    
    // Verify we're logged in (not on login page)
    const isAuth = await isLoggedIn(page);
    expect(isAuth).toBe(true);
    
    // Wait for app to fully load
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to members page after login', async ({ page }) => {
    await login(page);
    
    // Navigate to members
    await page.goto('http://localhost:5173/members');
    
    // Wait for members table to load
    await expect(page.locator('text=Membros')).toBeVisible({ timeout: 10000 });
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Try to login with wrong password
    await page.goto('http://localhost:5173');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await expect(page.locator('text=Verifique seu usuário e chave de acesso')).toBeVisible({ timeout: 5000 });
  });
});
