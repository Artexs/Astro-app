import { type Page, type Locator } from "@playwright/test";

export class ResetPasswordPage {
  readonly page: Page;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly resetButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newPasswordInput = page.getByTestId("new-password-input");
    this.confirmPasswordInput = page.getByTestId("confirm-password-input");
    this.resetButton = page.getByTestId("reset-password-button");
    this.successMessage = page.getByTestId("success-message");
    this.errorMessage = page.getByTestId("error-message");
  }

  async goto(token: string) {
    // Assuming the reset password link contains a token parameter
    await this.page.goto(`/reset-password?token=${token}`);
  }

  async resetPassword(newPassword: string) {
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(newPassword);
    await this.resetButton.click();
  }

  async getSuccessMessage() {
    return this.successMessage.textContent();
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }
}
