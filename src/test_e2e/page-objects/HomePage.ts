import { type Page, type Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly getStartedLink: Locator;
  readonly gettingStartedHeader: Locator;
  readonly pomLink: Locator;
  readonly tocList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedLink = page.getByRole('link', { name: 'Get started' });
    this.gettingStartedHeader = page.getByRole('heading', { name: 'Installation' });
    this.pomLink = page.getByRole('link', { name: 'Playwright Test' }).first();
    this.tocList = page.locator('div.toc:has-text("Table of Contents")');
  }

  async goto() {
    await this.page.goto('/');
  }

  async getTitle() {
    return await this.page.title();
  }

  async getHeader() {
    return this.page.getByRole('heading', { name: 'Witaj w 10xDevs Astro Starter!' });
  }
}
