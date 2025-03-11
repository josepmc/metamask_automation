import { AbstractComponent } from '@josepmc/shared';

export class ApproveTransaction extends AbstractComponent {
  async waitFor(timeout?: number) {
    await this.page.getByText('Transaction request').waitFor({ state: 'visible', timeout });
    return this;
  }
  async isVisible() {
    return this.page.getByText('Transaction request').isVisible();
  }
  async getTransactionAmount(): Promise<string> {
    return (await this.page.getByTestId('simulation-details-amount-pill').textContent()) || '';
  }
  async continue(): Promise<void> {
    await this.page.getByTestId('confirm-footer-button').click();
    await this.page.waitForEvent('close');
  }
}
