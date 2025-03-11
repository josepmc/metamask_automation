import { AbstractComponent } from './base';
import { BrowserContext, Page } from '@playwright/test';

export abstract class BaseWithContext extends AbstractComponent {
  readonly context: BrowserContext;
  readonly extensionId: string;

  constructor(context: BrowserContext, page: Page, extensionId: string) {
    super(page);
    this.context = context;
    this.extensionId = extensionId;
  }

  async cleanupOtherPages() {
    const pages = this.context.pages();
    for (const page of pages) {
      if (page !== this.page) {
        await page.close();
      }
    }
    return this;
  }
}
