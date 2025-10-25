import { type Page, type Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly introText: Locator;
  readonly techStackSection: Locator;
  readonly toolsSection: Locator;
  readonly conclusionText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.introText = page.getByTestId('intro-text');
    this.techStackSection = page.getByTestId('tech-stack-section');
    this.toolsSection = page.getByTestId('tools-section');
    this.conclusionText = page.getByTestId('conclusion-text');
  }

  async goto() {
    await this.page.goto('/');
  }

  async getTitle() {
    return await this.page.title();
  }

  async getHeader() {
    return this.page.getByTestId('welcome-header');
  }
}
