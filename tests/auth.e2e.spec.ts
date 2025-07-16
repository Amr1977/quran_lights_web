import { test, expect } from '@playwright/test';

// Set the Firebase environment to 'test' before each test
// This assumes the app reads window.FIREBASE_ENV before initializing Firebase

test.describe('Auth Flow', () => {
  const baseUrl = 'http://localhost:5000'; // Change if using a different dev server
  const testEmail = `e2e_test_user_${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  test('Sign Up and Dashboard Access', async ({ page }) => {
    await page.goto(`${baseUrl}/signup.html`);
    await page.evaluate(() => { window.FIREBASE_ENV = 'test'; });
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="pass"]', testPassword);
    await page.fill('input[name="re_pass"]', testPassword);
    await page.click('button[type="submit"], input[type="submit"]');
    // Wait for redirect or dashboard element
    await page.waitForURL('**/dashboard.html', { timeout: 10000 });
    await expect(page).toHaveURL(/dashboard\.html/);
    await expect(page.locator('#current_user')).toContainText(testEmail);
  });

  test('Sign In and Dashboard Access', async ({ page }) => {
    await page.goto(`${baseUrl}/login.html`);
    await page.evaluate(() => { window.FIREBASE_ENV = 'test'; });
    await page.fill('input[name="your_name"], input[name="email"]', testEmail);
    await page.fill('input[name="your_pass"], input[name="pass"]', testPassword);
    await page.click('button[type="submit"], input[type="submit"]');
    // Wait for redirect or dashboard element
    await page.waitForURL('**/dashboard.html', { timeout: 10000 });
    await expect(page).toHaveURL(/dashboard\.html/);
    await expect(page.locator('#current_user')).toContainText(testEmail);
  });
}); 