const { Given, When, Then, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const { expect } = require('@playwright/test');
const path = require('path');

setDefaultTimeout(60000);

let browser, page;

Before(async function () {
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    page = await context.newPage();
});

After(async function () {
    if (browser) {
        await browser.close();
    }
});

Given('I am on the landing page', async function () {
    const filePath = path.resolve(__dirname, '../../public/index.html');
    await page.goto(`file:///${filePath.replace(/\\/g, '/')}`);
    await page.waitForLoadState('networkidle');
});

Then('I should see the language switcher with globe icon', async function () {
    const languageSwitcher = await page.locator('.fa-globe').count();
    expect(languageSwitcher).toBeGreaterThan(0);
});

Then('the current language should be {string}', async function (language) {
    const currentLang = await page.locator('#current-lang').textContent();
    expect(currentLang.trim()).toBe(language);
});

When('I click on the language switcher', async function () {
    await page.locator('.dropdown-toggle:has(.fa-globe)').click();
    await page.waitForTimeout(500);
});

When('I select {string} from the dropdown', async function (language) {
    await page.locator(`.language-dropdown a:has-text("${language}")`).click();
    await page.waitForTimeout(1000); // Wait for translation to apply
});

Then('the page content should be in {string}', async function (language) {
    // Verify the current language display updated
    const currentLang = await page.locator('#current-lang').textContent();
    expect(currentLang).toContain(language);
});

Then('the page title should be {string}', async function (expectedTitle) {
    const title = await page.title();
    expect(title).toBe(expectedTitle);
});

Then('the language should persist after page reload', async function () {
    const titleBefore = await page.title();
    await page.reload();
    await page.waitForLoadState('networkidle');
    const titleAfter = await page.title();
    expect(titleAfter).toBe(titleBefore);
});

Then('the page direction should be {string}', async function (direction) {
    const dir = await page.locator('html').getAttribute('dir');
    expect(dir).toBe(direction);
});

Then('the navigation item {string} should be {string}', async function (arabicText, englishText) {
    const navItems = await page.locator('.navbar-nav a').allTextContents();
    const hasEnglishText = navItems.some(item => item.includes(englishText));
    expect(hasEnglishText).toBe(true);
});

Then('the home section title should contain {string}', async function (text) {
    const homeTitle = await page.locator('#home h1').textContent();
    expect(homeTitle).toContain(text);
});

Then('the feature section should contain {string}', async function (text) {
    const featureContent = await page.locator('#feature').textContent();
    expect(featureContent).toContain(text);
});

Then('the contact section should contain {string}', async function (text) {
    const contactContent = await page.locator('#contact').textContent();
    expect(contactContent).toContain(text);
});

Then('the meta description should contain {string}', async function (text) {
    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDesc).toContain(text);
});

Then('the HTML lang attribute should be {string}', async function (lang) {
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe(lang);
});
