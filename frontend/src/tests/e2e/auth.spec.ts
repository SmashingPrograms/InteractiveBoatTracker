// frontend/src/tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    // Mock successful login
    await page.route('**/api/v1/auth/login', async route => {
      await route.fulfill({
        json: { access_token: 'mock-token', token_type: 'bearer' }
      });
    });

    await page.route('**/api/v1/auth/me', async route => {
      await route.fulfill({
        json: {
          id: 1,
          email: 'admin@pier11marina.com',
          full_name: 'Admin User',
          role: 'admin',
          is_active: true
        }
      });
    });

    await page.goto('/');
    
    await expect(page.locator('h2')).toContainText('Pier 11 Marina');
    
    await page.fill('input[name="username"]', 'admin@pier11marina.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Interactive Map')).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.route('**/api/v1/auth/login', async route => {
      await route.fulfill({
        status: 401,
        json: { detail: 'Incorrect email or password' }
      });
    });

    await page.goto('/');
    
    await page.fill('input[name="username"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Incorrect email or password')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Mock successful login first
    await page.route('**/api/v1/auth/login', async route => {
      await route.fulfill({
        json: { access_token: 'mock-token', token_type: 'bearer' }
      });
    });

    await page.route('**/api/v1/auth/me', async route => {
      await route.fulfill({
        json: {
          id: 1,
          email: 'admin@pier11marina.com',
          full_name: 'Admin User',
          role: 'admin',
          is_active: true
        }
      });
    });

    await page.goto('/');
    await page.fill('input[name="username"]', 'admin@pier11marina.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Logout
    await page.click('text=Sign Out');
    
    // Should return to login page
    await expect(page.locator('h2')).toContainText('Pier 11 Marina');
    await expect(page.locator('input[name="username"]')).toBeVisible();
  });
});