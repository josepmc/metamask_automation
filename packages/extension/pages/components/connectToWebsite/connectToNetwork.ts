import { AbstractComponent } from '@josepmc/shared';

export class ConnectToNetwork extends AbstractComponent {
  async waitFor(timeout?: number) {
    await this.page.getByText('Review permissions').waitFor({ state: 'visible', timeout });
    return this;
  }
  async isVisible() {
    return this.page.getByText('Review permissions').isVisible();
  }
  async continue(): Promise<void> {
    await this.page.getByTestId('page-container-footer-next').click();
    await this.page.waitForEvent('close');
  }
}
