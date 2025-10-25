import { type Page, type Locator } from "@playwright/test";

export class AccountPage {
  readonly page: Page;
  readonly changePasswordButton: Locator;
  readonly deleteAccountButton: Locator;
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmNewPasswordInput: Locator;
  readonly savePasswordButton: Locator;
  readonly deleteAccountConfirmInput: Locator;
  readonly confirmDeleteButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.changePasswordButton = page.getByTestId("change-password-button");
    this.deleteAccountButton = page.getByTestId("delete-account-button");
    this.currentPasswordInput = page.getByTestId("current-password-input");
    this.newPasswordInput = page.getByTestId("new-password-input");
    this.confirmNewPasswordInput = page.getByTestId("confirm-new-password-input");
    this.savePasswordButton = page.getByTestId("save-password-button");
    this.deleteAccountConfirmInput = page.getByTestId("delete-account-confirm-input");
    this.confirmDeleteButton = page.getByTestId("confirm-delete-button");
    this.successMessage = page.getByTestId("success-message");
    this.errorMessage = page.getByTestId("error-message");
  }

  async goto() {
    await this.page.goto("/account");
  }

  async changePassword(currentPassword: string, newPassword: string) {
    await this.changePasswordButton.click(); // Assuming a button to reveal the form
    await this.currentPasswordInput.fill(currentPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmNewPasswordInput.fill(newPassword);
    await this.savePasswordButton.click();
  }

  async deleteAccount(confirmText: string) {
    await this.deleteAccountButton.click(); // Assuming a button to reveal the form
    await this.deleteAccountConfirmInput.fill(confirmText);
    await this.confirmDeleteButton.click();
  }

  async getSuccessMessage() {
    return this.successMessage.textContent();
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }
}
