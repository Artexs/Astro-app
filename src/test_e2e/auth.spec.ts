import { test, expect } from "@playwright/test";
import { LoginPage } from "./page-objects/LoginPage";
import { RegisterPage } from "./page-objects/RegisterPage";
import { registerUser, loginUser, signOut } from "./utils/api";
import { faker } from "@faker-js/faker";

test.describe("Authentication Flows", () => {
  test.skip("should allow a new user to register and then log in", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);

    const email = faker.internet.email();
    const password = faker.internet.password();

    // 1. Register a new user
    await registerPage.goto();
    await registerPage.register(email, password);
    // Assuming successful registration redirects to login or shows a success message
    // For now, we'll expect a redirect to /registration-success or /login
    await expect(page).toHaveURL(/.*(registration-success|login)/);

    // 2. Log in with the newly registered user
    await loginPage.goto();
    await loginPage.login(email, password);
    await expect(page).toHaveURL("/create"); // Assuming successful login redirects to home

    // Clean up (sign out)
    await signOut();
  });

  test("should prevent login with invalid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login("invalid@example.com", "wrongpassword");

    await expect(page).toHaveURL(/\/login(\?.*)?$/);
    // This assumes there's an error message displayed on the login page
    // await expect(loginPage.errorMessage).toBeVisible();
  });

  test("should allow a logged-in user to log out", async ({ page }) => {
    const loginPage = new LoginPage(page);

    const email = process.env.E2E_USERNAME as string;
    const password = process.env.E2E_PASSWORD as string;

    // Ensure the user exists by registering them (idempotent for testing)
    // await registerUser(email, password);

    // 1. Log in the user via UI
    await loginPage.goto();
    await loginPage.login(email, password);
    await expect(page).toHaveURL("/create", { timeout: 3000 }); // Assuming successful login redirects to /create

    // 2. Perform logout
    await page.getByRole("button", { name: "Account" }).click();
    await page.getByRole("menuitem", { name: "Logout" }).click();

    // 3. Verify redirection to login page
    await expect(page).toHaveURL("/login"); // Assuming logout redirects to login page

    // Clean up: sign out (though already logged out, this ensures a clean state if the test fails mid-logout)
    await signOut();
  });
});
