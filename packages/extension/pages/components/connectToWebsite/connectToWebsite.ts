import { AbstractComponent } from '@josepmc/shared';

export class ConnectToWebsite extends AbstractComponent {
  async waitFor(timeout?: number) {
    await this.page.getByText('Connect with Metamask').waitFor({ state: 'visible', timeout });
    return this;
  }
  async isVisible() {
    return this.page.getByText('Connect with Metamask').isVisible();
  }
  async continue(): Promise<void> {
    await this.page.getByTestId('confirm-btn').click();
    await this.page.waitForEvent('close');
  }
}
