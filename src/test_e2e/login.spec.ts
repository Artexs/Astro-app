import { test, expect } from "@playwright/test";
import { LoginPage } from "./page-objects/LoginPage";

// function sleep(ms: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

test.describe("Login page", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("should display login form", async () => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test("should show error on failed login", async () => {
    await loginPage.login("invalid@example.com", "invalidpassword");
    const error = loginPage.page.getByTestId("login-error");
    await expect(error).toBeVisible();
  });

  test.skip("should login successfully", async ({ page }) => {
    await loginPage.login(process.env.E2E_USERNAME as string, process.env.E2E_PASSWORD as string);
    await expect(page).toHaveURL("/create");
  });
});
