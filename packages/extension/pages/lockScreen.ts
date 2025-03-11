import { BaseWithContext } from '@josepmc/shared';
import { Homepage } from './homepage';
import { UnlockScreen } from './unlock';
import { BrowserContext, Page } from '@playwright/test';

export class LockedWallet extends BaseWithContext {
  private unlock: UnlockScreen;
  constructor(context: BrowserContext, page: Page, extensionId: string) {
    super(context, page, extensionId);
    this.unlock = new UnlockScreen(page);
  }
  async waitFor() {
    await this.unlock.waitFor();
    return this;
  }

  async goto() {
    this.logger.info(`Creating new page for extension ${this.extensionId}`);
    this.page = await this.context.newPage();
    this.logger.info(`Navigating to extension ${this.extensionId}`);
    await this.page.goto(`chrome-extension://${this.extensionId}/home.html`);
    this.logger.info(`Navigated to extension ${this.extensionId}`);
    this.unlock = new UnlockScreen(this.page);
    return this;
  }

  // Only supported on dev versions of MetaMask
  // async importStorageState(state: {}) {
  //   return this.page.evaluate((state: {}) => chrome.storage.local.set(state), state);
  // }

  // Convenience method that does the following:
  // Closes any other pages that are open
  // Opens two pages: the extension page and a main page
  // Waits for the extension page to load
  // Unlocks the extension
  async setupTest(walletPassword: string) {
    this.logger.info('Setting up test');
    await this.goto();
    await this.waitFor();
    await this.cleanupOtherPages();
    this.logger.info('Cleaned up other pages');
    await this.unlock.fillPassword(walletPassword);
    return await this.unlock.unlock();
  }
}
