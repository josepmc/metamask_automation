import { Locator, Page, PageAssertionsToHaveScreenshotOptions } from '@playwright/test';
import assert from 'node:assert';
import { Logger } from 'winston';

export abstract class AbstractComponent {
  public static logger: Logger;

  public logger: Logger = AbstractComponent.logger;
  public page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async hasScreenshot(options?: PageAssertionsToHaveScreenshotOptions) {
    // await expect(this.page).toHaveScreenshot({
    //   maxDiffPixelRatio: 0.05,
    //   ...options,
    // });
    return this;
  }

  public abstract waitFor(): Promise<this>;

  public async getNewPage(timeout = 10000) {
    // Get all the pages that are open
    const pages = await this.page.context().pages();
    try {
      return await this.page.context().waitForEvent('page', { timeout });
    } catch {
      // Return the newest page if it exists
      const newPages = await this.page.context().pages();
      let newPage = null;
      for (const newPage_ of newPages) {
        for (const page of pages) {
          if (newPage_ !== page) {
            newPage = newPage_;
            break;
          }
        }
      }
      return newPage || newPages[newPages.length - 1];
    }
  }

  public async repeatWithTimeout(condition: () => Promise<boolean>, action?: () => Promise<void>, timeout = 15000) {
    return Promise.race<boolean>([
      new Promise(resolve => setTimeout(() => resolve(false), timeout)),
      new Promise<boolean>(resolve => {
        const interval = setInterval(async () => {
          if (action) {
            try {
              await action();
            } catch {}
          }

          if (await condition()) {
            clearInterval(interval);
            resolve(true);
          }
        }, 100);
      }),
    ]);
  }

  public async waitForPageClosed(page = this.page, timeout = 5000) {
    await this.repeatWithTimeout(async () => page.isClosed(), undefined, timeout);
    assert(await page.isClosed(), 'Page did not close');
  }

  public async hideElements(elements: Locator[]) {
    for (const element of elements) {
      await element.evaluateAll((elements: Element[]) => {
        for (const element of elements) {
          (element as HTMLElement).style.visibility = 'hidden';
        }
      });
    }
  }

  public async showElements(elements: Locator[]) {
    for (const element of elements) {
      await element.evaluateAll((elements: Element[]) => {
        for (const element of elements) {
          (element as HTMLElement).style.visibility = '';
        }
      });
    }
  }
}
