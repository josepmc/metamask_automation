import { AbstractComponent } from '@josepmc/shared';
import { Homepage } from 'pages/homepage';

export class InstallComplete extends AbstractComponent {
  // Wait for the page to be visible
  async waitFor() {
    await this.page.getByText('Your MetaMask install is complete!').waitFor({ state: 'visible' });
    return this;
  }

  // Click the continue button
  async continue() {
    await this.page.getByText('Next').click();
    await this.page.getByTestId('pin-extension-done').click();
    return new Homepage(this.page).waitFor();
  }
}
