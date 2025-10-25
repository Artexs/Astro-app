import { test, expect } from "@playwright/test";
import { HomePage } from "./page-objects/HomePage";

test.describe("Home page", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("has title", async () => {
    await expect(homePage.page).toHaveTitle(/Astro/);
  });

  test.skip("has header", async () => {
    await expect(homePage.getHeader()).toBeVisible();
  });

  test("has intro text", async () => {
    await expect(homePage.introText).toBeVisible();
  });

  test("has tech stack section", async () => {
    await expect(homePage.techStackSection).toBeVisible();
  });

  test("has tools section", async () => {
    await expect(homePage.toolsSection).toBeVisible();
  });

  test("has conclusion text", async () => {
    await expect(homePage.conclusionText).toBeVisible();
  });

  test("matches screenshot", async ({ page }) => {
    await expect(page).toHaveScreenshot();
  });
});
