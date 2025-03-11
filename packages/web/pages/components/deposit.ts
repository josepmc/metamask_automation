import { AbstractComponent } from '@josepmc/shared';

import { DepositLocators } from 'locators';

export class Deposit extends AbstractComponent {
  async waitFor() {
    await this.page.locator(DepositLocators.balance).waitFor({ state: 'visible' });
    return this;
  }

  // Getters

  async getTokenBalance() {
    const balance = (await this.page.locator(DepositLocators.balance).textContent()) || '';
    return parseFloat(balance);
  }

  async waitForTokenBalance(balance: string) {
    await this.page.locator(DepositLocators.balanceWithValue(balance)).waitFor({ state: 'visible' });
    return this;
  }

  // Visibility

  async isAddressBalanceVisible() {
    return await this.page.locator(DepositLocators.balance).isVisible();
  }

  async isDepositHistoryVisible() {
    return await this.page.locator(DepositLocators.depositHistory).isVisible();
  }

  async isDepositInputErrorVisible() {
    return await this.page.locator(DepositLocators.depositInputError).isVisible();
  }

  async isDepositButtonVisible() {
    return await this.page.locator(DepositLocators.depositButton).isVisible();
  }

  async waitForDepositButton() {
    await this.page.locator(DepositLocators.depositButton).waitFor({ state: 'visible' });
    return this;
  }

  // Actions

  async deposit() {
    await this.page.locator(DepositLocators.depositButton).click();
  }

  async inputDepositAmount(amount: number) {
    await this.page.locator(DepositLocators.depositInput).fill(amount.toString());
  }

  async getMoreTokens() {
    await this.page.waitForLoadState('networkidle');
    await this.page.locator(DepositLocators.depositHistory).waitFor({ state: 'visible' });
    await this.page.locator(DepositLocators.getMoreTokens).click();
  }
}
