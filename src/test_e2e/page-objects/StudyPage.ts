import { type Page, type Locator } from "@playwright/test";

export class StudyPage {
  readonly page: Page;
  readonly cardFront: Locator;
  readonly cardBack: Locator;
  readonly flipButton: Locator;
  readonly markKnownButton: Locator;
  readonly markUnknownButton: Locator;
  readonly completionMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cardFront = page.getByTestId("study-card-front");
    this.cardBack = page.getByTestId("study-card-back");
    this.flipButton = page.getByTestId("flip-card-button");
    this.markKnownButton = page.getByTestId("mark-known-button");
    this.markUnknownButton = page.getByTestId("mark-unknown-button");
    this.completionMessage = page.getByTestId("study-completion-message");
  }

  async goto() {
    await this.page.goto("/study");
  }

  async getCardFrontContent() {
    return this.cardFront.textContent();
  }

  async getCardBackContent() {
    return this.cardBack.textContent();
  }

  async flipCard() {
    await this.flipButton.click();
  }

  async markKnown() {
    await this.markKnownButton.click();
  }

  async markUnknown() {
    await this.markUnknownButton.click();
  }

  async getCompletionMessage() {
    return this.completionMessage.textContent();
  }
}
