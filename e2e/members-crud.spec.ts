import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Members CRUD Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login using helper
    await login(page);
  });

  test('should create a new member', async ({ page }) => {
    // Navigate to members page
    await page.goto('http://localhost:5173/members');
    
    // Wait for table to load
    await expect(page.locator('text=Membros')).toBeVisible();
    
    // Click add button
    await page.click('button:has-text("Adicionar")');
    
    // Fill in the form
    await page.fill('input[name="name"]', 'Teste Member GraphQL');
    await page.fill('input[name="patch"]', 'TST');
    
    // Select a ranch (first option)
    await page.click('input[placeholder*="Rancho"]');
    await page.locator('[role="option"]').first().click();
    
    // Select phase
    await page.click('input[placeholder*="Fase"]');
    await page.locator('[role="option"]').first().click();
    
    // Fill phone
    await page.fill('input[name="phone"]', '(41) 99999-9999');
    
    // Fill residence
    await page.fill('input[name="residence"]', 'Curitiba - PR');
    
    // Click save button
    await page.click('button:has-text("Salvar")');
    
    // Wait for success notification
    await expect(page.locator('text=sucesso')).toBeVisible({ timeout: 10000 });
    
    // Verify member appears in table
    await expect(page.locator('text=Teste Member GraphQL')).toBeVisible({ timeout: 5000 });
  });

  test('should edit an existing member', async ({ page }) => {
    // Navigate to members page
    await page.goto('http://localhost:5173/members');
    
    // Wait for table to load
    await expect(page.locator('text=Membros')).toBeVisible();
    
    // Find and click edit button for "Teste Member GraphQL"
    const row = page.locator('text=Teste Member GraphQL').locator('..');
    await row.locator('button[title="Editar"]').first().click();
    
    // Edit patch field
    await page.fill('input[name="patch"]', 'TEST2');
    
    // Select new phase
    await page.click('input[placeholder*="Fase"]');
    await page.locator('[role="option"]').nth(1).click();
    
    // Click save button
    await page.click('button:has-text("Salvar")');
    
    // Wait for success notification
    await expect(page.locator('text=sucesso')).toBeVisible({ timeout: 10000 });
    
    // Verify changes appear in table
    await expect(page.locator('text=TEST2')).toBeVisible({ timeout: 5000 });
  });

  test('should delete an existing member', async ({ page }) => {
    // Navigate to members page
    await page.goto('http://localhost:5173/members');
    
    // Wait for table to load
    await expect(page.locator('text=Membros')).toBeVisible();
    
    // Find and click delete button for "Teste Member GraphQL"
    const row = page.locator('text=Teste Member GraphQL').locator('..');
    await row.locator('button[title="Deletar"]').first().click();
    
    // Confirm deletion
    await page.click('button:has-text("Confirmar")');
    
    // Wait for success notification
    await expect(page.locator('text=sucesso')).toBeVisible({ timeout: 10000 });
    
    // Verify member no longer appears in table
    await expect(page.locator('text=Teste Member GraphQL')).not.toBeVisible({ timeout: 5000 });
  });

  test('should handle null permissions gracefully', async ({ page }) => {
    // Navigate to users page (which uses null safety for permissions)
    await page.goto('http://localhost:5173/users');
    
    // Wait for page to load
    await expect(page.locator('text=Usuários')).toBeVisible();
    
    // Should not throw error even if permissions are null
    await expect(page.locator('table')).toBeVisible();
  });
});
