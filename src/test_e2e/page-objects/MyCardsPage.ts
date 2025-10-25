import { type Page, type Locator } from "@playwright/test";

export class MyCardsPage {
  readonly page: Page;
  readonly flashcardList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.flashcardList = page.getByTestId("flashcard-list");
  }

  async goto() {
    await this.page.goto("/my-cards");
  }

  async getFlashcardByQuestion(question: string): Promise<Locator> {
    return this.flashcardList.getByText(question);
  }

  async getFlashcardCount(): Promise<number> {
    return this.flashcardList.locator('[data-testid="flashcard-item"]').count();
  }
}
