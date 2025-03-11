import { AbstractComponent } from '@josepmc/shared';
import { Homepage } from './homepage';

export class UnlockScreen extends AbstractComponent {
  // page in this case may be empty, but it's fine
  // because we're going to navigate to the extension page
  async waitFor() {
    await this.page.getByText('Welcome back!').waitFor({ state: 'visible' });
    await this.page.locator('.loading-overlay').waitFor({ state: 'hidden' });
    return this;
  }

  async fillPassword(walletPassword: string) {
    await this.page.getByTestId('unlock-password').fill(walletPassword);
    return this;
  }

  async unlock() {
    await this.page.getByText('Unlock').click();
    return await new Homepage(this.page).waitFor();
  }
}
