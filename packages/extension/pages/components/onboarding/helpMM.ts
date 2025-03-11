import { AbstractComponent } from '@josepmc/shared';
import { SeedPhrase } from './seedPhrase';

export class HelpMM extends AbstractComponent {
  async waitFor() {
    await this.page.getByText('Help us improve MetaMask').waitFor({ state: 'visible' });
    return this;
  }
  async deny() {
    await this.page.getByText('No thanks').click();
    return new SeedPhrase(this.page).waitFor();
  }
  async accept() {
    await this.page.getByText('I agree').click();
    return new SeedPhrase(this.page).waitFor();
  }
}
