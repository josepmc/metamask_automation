import { AbstractComponent } from '@josepmc/shared';

import { TokenInputLocators } from 'locators';

export class TokenInput extends AbstractComponent {
  async waitFor() {
    await this.page.locator(TokenInputLocators.address).waitFor({ state: 'visible' });
    return this;
  }

  // Getters

  async getAddress(): Promise<string> {
    const address = (await this.page.locator(TokenInputLocators.address).textContent()) || '';
    const evmAddress = address.match(/0x[a-fA-F0-9]{40}/)?.[0];
    return evmAddress || '';
  }

  async getClipboard(): Promise<string> {
    return await this.page.evaluate(() => navigator.clipboard.readText());
  }

  // Visibility

  async isAddressInputVisible() {
    return await this.page.locator(TokenInputLocators.inputField).isVisible();
  }

  async isNetworkErrorVisible() {
    return await this.page.locator(TokenInputLocators.networkError).isVisible();
  }

  async isSwitchNetworkButtonVisible() {
    return await this.page.locator(TokenInputLocators.changeNetwork).isVisible();
  }

  async isSubmitEnabled() {
    return await this.page.locator(TokenInputLocators.submit).isEnabled();
  }

  // Actions

  async acceptNotifications() {
    await this.page.context().grantPermissions(['notifications']);
  }

  async inputAddress(address: string) {
    await this.page.locator(TokenInputLocators.inputField).fill(address);
  }

  async changeNetwork() {
    await this.page.locator(TokenInputLocators.changeNetwork).click();
  }

  async exampleToken() {
    await this.page.locator(TokenInputLocators.exampleToken).click();
  }

  async submit() {
    await this.page.locator(TokenInputLocators.submit).click();
  }
}
