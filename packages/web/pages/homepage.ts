import { AbstractComponent } from '@josepmc/shared';

import { HomepageLocators } from 'locators';
import { TokenInput } from './components/tokenInput';
import { Deposit } from './components/deposit';

export class Homepage extends AbstractComponent {
  public tokenInput = new TokenInput(this.page);
  public deposit = new Deposit(this.page);

  async goto() {
    await this.page.goto('/', { waitUntil: 'networkidle' });
    return this;
  }

  async waitFor() {
    await this.page.locator(HomepageLocators.body).waitFor({ state: 'visible' });
    return this;
  }

  async isLoggedIn() {
    return await Promise.race([
      this.page
        .locator(HomepageLocators.connected)
        .waitFor({ state: 'visible' })
        .then(() => true),
      this.page
        .locator(HomepageLocators.loading)
        .waitFor({ state: 'visible' })
        .then(() => false),
    ]);
  }

  async getClipboard(): Promise<string> {
    return await this.page.evaluate(() => navigator.clipboard.readText());
  }

  async acceptNotifications() {
    await this.page.context().grantPermissions(['notifications']);
  }
}
