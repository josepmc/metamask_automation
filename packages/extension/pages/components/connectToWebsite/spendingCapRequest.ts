import { AbstractComponent } from '@josepmc/shared';

export class SpendingCapRequest extends AbstractComponent {
  async waitFor(timeout?: number) {
    await this.page.getByText('Spending cap request').waitFor({ state: 'visible', timeout });
    return this;
  }
  async isVisible() {
    return this.page.getByText('Spending cap request').isVisible();
  }
  async continue(): Promise<void> {
    await this.page.getByTestId('confirm-footer-button').click();
    await this.page.waitForEvent('close');
  }
}
