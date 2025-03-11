import { AbstractComponent } from '@josepmc/shared';

export class NetworkSelector extends AbstractComponent {
  async waitFor() {
    await this.page.getByText('Add a custom network', { exact: true }).waitFor({ state: 'visible' });
    return this;
  }

  async close() {
    await this.page.locator('xpath=//header//*[@aria-label="Close"]').click();
  }

  async isTestNetworksEnabled() {
    return await this.page
      .locator('xpath=//*[text()="Show test networks"]//following-sibling::label[contains(@class,"-on")]')
      .isVisible();
  }

  async setTestNetworks(enabled: boolean = true) {
    if ((await this.isTestNetworksEnabled()) !== enabled) {
      await this.page.locator('xpath=//*[text()="Show test networks"]//following-sibling::label').click();
    }
    return this;
  }

  async selectNetwork(network: string) {
    await this.page.getByTestId(network).click();
  }
}
