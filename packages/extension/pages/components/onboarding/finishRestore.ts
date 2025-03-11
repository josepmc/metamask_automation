import { AbstractComponent } from '@josepmc/shared';
import { InstallComplete } from './installComplete';

export class FinishRestore extends AbstractComponent {
  // Wait for the page to be visible
  async waitFor() {
    await this.page.getByText('Your wallet is ready').waitFor({ state: 'visible' });
    return this;
  }

  // Click the continue button
  async continue() {
    await this.page.getByTestId('onboarding-complete-done').click();
    return new InstallComplete(this.page).waitFor();
  }
}
