import { type Page, type Locator } from "@playwright/test";

export class RegisterPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId("email-input");
    this.passwordInput = page.getByTestId("password-input");
    this.registerButton = page.getByTestId("register-button");
    this.errorMessage = page.getByTestId("error-message");
    this.successMessage = page.getByTestId("success-message");
  }

  async goto() {
    await this.page.goto("/register");
  }

  async register(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.registerButton.click();
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }

  async getSuccessMessage() {
    return this.successMessage.textContent();
  }
}
