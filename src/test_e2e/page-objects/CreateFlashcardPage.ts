import { type Page, type Locator } from "@playwright/test";

export class CreateFlashcardPage {
  readonly page: Page;
  readonly questionInput: Locator;
  readonly answerInput: Locator;
  readonly tagsInput: Locator;
  readonly createButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.questionInput = page.getByTestId("question-input");
    this.createButton = page.getByTestId("create-flashcard-button");
    this.successMessage = page.getByTestId("success-message");
    this.errorMessage = page.getByTestId("error-message");
  }

  async goto() {
    await this.page.goto("/create");
  }

  async createFlashcard(question: string) {
    await this.questionInput.fill(question);
    await this.createButton.click();
    await this.page.waitForURL("/review", { timeout: 60000 });
  }

  async getSuccessMessage() {
    return this.successMessage.textContent();
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }
}
