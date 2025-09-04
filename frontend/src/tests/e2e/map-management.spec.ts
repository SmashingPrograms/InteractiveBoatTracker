// frontend/src/tests/e2e/map-management.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Map Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
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

    await page.route('**/api/v1/maps*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          json: [
            {
              id: 1,
              name: 'Pier 11 Marina',
              description: 'Main marina property',
              image_path: 'pier11.jpg',
              image_width: 794,
              image_height: 1123,
              is_active: true,
              created_at: '2024-01-01T00:00:00Z',
              boat_count: 25
            }
          ]
        });
      }
    });

    // Login
    await page.goto('/');
    await page.fill('input[name="username"]', 'admin@pier11marina.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('should navigate to maps page', async ({ page }) => {
    await page.click('text=See Other Maps');
    await expect(page.locator('h1')).toContainText('Marina Maps');
  });

  test('should display existing maps', async ({ page }) => {
    await page.click('text=See Other Maps');
    await expect(page.locator('text=Pier 11 Marina')).toBeVisible();
    await expect(page.locator('text=25 boats')).toBeVisible();
  });

  test('should open map creation form for admin', async ({ page }) => {
    await page.click('text=See Other Maps');
    await page.click('text=Add New Map');
    
    await expect(page.locator('text=Add New Map')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
  });

  test('should create a new map', async ({ page }) => {
    // Mock the creation endpoint
    await page.route('**/api/v1/maps', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          json: {
            id: 2,
            name: 'New Marina',
            description: 'Test description',
            image_path: 'new-marina.jpg',
            image_width: 800,
            image_height: 600,
            is_active: true,
            created_at: '2024-01-01T00:00:00Z',
            boat_count: 0
          }
        });
      }
    });

    await page.click('text=See Other Maps');
    await page.click('text=Add New Map');
    
    // Fill form
    await page.fill('input[name="name"]', 'New Marina');
    await page.fill('textarea[name="description"]', 'Test description');
    await page.fill('input[name="image_width"]', '800');
    await page.fill('input[name="image_height"]', '600');
    
    // Mock file input
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-marina.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-content')
    });
    
    await page.click('button:has-text("Create Map")');
    
    // Should close modal and refresh list
    await expect(page.locator('text=Add New Map')).not.toBeVisible();
  });

  test('should validate form inputs', async ({ page }) => {
    await page.click('text=See Other Maps');
    await page.click('text=Add New Map');
    
    // Try to submit empty form
    await page.click('button:has-text("Create Map")');
    
    await expect(page.locator('text=Map name is required')).toBeVisible();
    await expect(page.locator('text=Map image is required')).toBeVisible();
  });

  test('should handle map deletion', async ({ page }) => {
    // Mock delete endpoint
    await page.route('**/api/v1/maps/1', async route => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          json: { message: 'Map deleted successfully' }
        });
      }
    });

    await page.click('text=See Other Maps');
    
    // Click delete button (requires hover to show)
    const mapCard = page.locator('text=Pier 11 Marina').locator('..').locator('..');
    await mapCard.hover();
    await mapCard.locator('[title="Delete map"]').click();
    
    // Confirm deletion
    await page.click('button:has-text("Yes")');
    
    // Map should be removed from list
    await expect(page.locator('text=Pier 11 Marina')).not.toBeVisible();
  });

  test('should select map and navigate back', async ({ page }) => {
    await page.click('text=See Other Maps');
    await page.click('text=Select Map');
    
    // Should navigate back to map view
    await expect(page.locator('h1')).toContainText('Interactive Map');
  });
});