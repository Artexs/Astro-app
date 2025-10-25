import { type Page, type Locator } from "@playwright/test";

export class ForgotPasswordPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly resetButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId("email-input");
    this.resetButton = page.getByTestId("reset-password-button");
    this.successMessage = page.getByTestId("success-message");
    this.errorMessage = page.getByTestId("error-message");
  }

  async goto() {
    await this.page.goto("/forgot-password");
  }

  async requestPasswordReset(email: string) {
    await this.emailInput.fill(email);
    await this.resetButton.click();
  }

  async getSuccessMessage() {
    return this.successMessage.textContent();
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }
}
