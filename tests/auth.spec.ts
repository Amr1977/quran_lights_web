import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/login.html');
  });

  test('footer is visible with version, portfolio link, and MIT license', async ({ page }) => {
    const footer = page.locator('.auth-footer');
    await expect(footer).toBeVisible();

    await expect(footer.locator('text=v1.1.0')).toBeVisible();
    await expect(footer.locator('text=MIT License')).toBeVisible();

    const link = footer.locator('a');
    await expect(link).toHaveText('Amr Lotfy');
    await expect(link).toHaveAttribute('href', 'https://amrlotfy.et3am.com');
    await expect(link).toHaveAttribute('target', '_blank');
  });

  test('language switcher toggle and close', async ({ page }) => {
    const dropdown = page.locator('#langMenu');
    await expect(dropdown).toBeHidden();

    await page.locator('#langDropdown').click();
    await expect(dropdown).toBeVisible();

    // Click page center (outside the dropdown) to close it
    const main = page.locator('.main');
    await main.click({ position: { x: 10, y: 10 } });
    await expect(dropdown).toBeHidden();
  });

  test('language switcher selecting a language works', async ({ page }) => {
    await page.locator('#langDropdown').click();
    const dropdown = page.locator('#langMenu');
    await expect(dropdown).toBeVisible();

    // Click English
    await page.locator('[data-lang="en"]').click();
    await expect(dropdown).toBeHidden();

    // Verify current language text updated
    await expect(page.locator('#current-lang')).toHaveText('English');
  });
});

test.describe('Signup Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/signup.html');
  });

  test('footer is visible with version, portfolio link, and MIT license', async ({ page }) => {
    const footer = page.locator('.auth-footer');
    await expect(footer).toBeVisible();

    await expect(footer.locator('text=v1.1.0')).toBeVisible();
    await expect(footer.locator('text=MIT License')).toBeVisible();

    const link = footer.locator('a');
    await expect(link).toHaveText('Amr Lotfy');
    await expect(link).toHaveAttribute('href', 'https://amrlotfy.et3am.com');
  });

  test('language switcher toggle and close', async ({ page }) => {
    const dropdown = page.locator('#langMenu');
    await expect(dropdown).toBeHidden();

    await page.locator('#langDropdown').click();
    await expect(dropdown).toBeVisible();

    const main = page.locator('.main');
    await main.click({ position: { x: 10, y: 10 } });
    await expect(dropdown).toBeHidden();
  });
});
