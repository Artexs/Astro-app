import { type Page, type Locator } from "@playwright/test";

export class ReviewPage {
  readonly page: Page;
  readonly cardFront: Locator;
  readonly cardBack: Locator;
  readonly flipButton: Locator;
  readonly easyButton: Locator;
  readonly mediumButton: Locator;
  readonly hardButton: Locator;
  readonly completionMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cardFront = page.getByTestId("review-card-front");
    this.cardBack = page.getByTestId("review-card-back");
    this.flipButton = page.getByTestId("flip-card-button");
    this.easyButton = page.getByTestId("easy-button");
    this.mediumButton = page.getByTestId("medium-button");
    this.hardButton = page.getByTestId("hard-button");
    this.completionMessage = page.getByTestId("review-completion-message");
  }

  async goto() {
    await this.page.goto("/review");
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

  async markEasy() {
    await this.easyButton.click();
  }

  async markMedium() {
    await this.mediumButton.click();
  }

  async markHard() {
    await this.hardButton.click();
  }

  async getCompletionMessage() {
    return this.completionMessage.textContent();
  }
}
