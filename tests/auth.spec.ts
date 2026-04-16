import { test, expect } from '@playwright/test';

const BASE_URL = 'https://quran-lights.web.app/login.html';

test.describe('Login Page - Language Switcher', () => {
  test('desktop - toggle and close', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    
    const dropdown = page.locator('#lang-menu');
    await expect(dropdown).toBeHidden();
    
    await page.locator('#lang-btn').click();
    await page.waitForTimeout(500);
    await expect(dropdown).toBeVisible();
    
    await page.locator('.auth-card').click();
    await page.waitForTimeout(300);
    await expect(dropdown).toBeHidden();
  });

  test('mobile - toggle', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    const dropdown = page.locator('#lang-menu');
    await expect(dropdown).toBeHidden();
    
    await page.locator('#lang-btn').click();
    await page.waitForTimeout(500);
    await expect(dropdown).toBeVisible();
  });

  test('mobile - check overlap with form inputs', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    await page.locator('#lang-btn').click();
    await page.waitForTimeout(300);
    
    const dropdown = page.locator('#lang-menu');
    const emailInput = page.locator('#your_name');
    const passInput = page.locator('#your_pass');
    
    const dBox = await dropdown.boundingBox();
    const emailBox = await emailInput.boundingBox();
    const passBox = await passInput.boundingBox();
    
    console.log('Dropdown box:', dBox);
    console.log('Email input:', emailBox);
    console.log('Password input:', passBox);
    
    // Check vertical overlap ONLY (this is the real issue)
    if (dBox && emailBox) {
      const emailVerticalOverlap = dBox.y + dBox.height > emailBox.y;
      console.log('Vertically overlaps email:', emailVerticalOverlap);
      const NO_OVERLAP_EXPECTED = !(dBox.y + dBox.height > emailBox.y);
      expect(NO_OVERLAP_EXPECTED, 'Dropdown should NOT vertically overlap email input').toBe(true);
    }
  });
});