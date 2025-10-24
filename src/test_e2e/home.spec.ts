import { test, expect } from '@playwright/test';
import { HomePage } from './page-objects/HomePage';

test.describe('Home page', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('has title', async () => {
    await expect(homePage.page).toHaveTitle(/Astro/);
  });

  test('has header', async () => {
    await expect(await homePage.getHeader()).toBeVisible();
  });
});