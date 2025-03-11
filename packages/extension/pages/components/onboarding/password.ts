import { AbstractComponent } from '@josepmc/shared';
import { FinishRestore } from './finishRestore';

export class Password extends AbstractComponent {
  async waitFor() {
    await this.page.getByRole('heading', { name: 'Create password' }).waitFor({ state: 'visible' });
    return this;
  }
  async fillPassword(password: string) {
    await this.page.getByTestId('create-password-new').fill(password);
    return this;
  }
  async fillConfirmPassword(password: string) {
    await this.page.getByTestId('create-password-confirm').fill(password);
    return this;
  }
  async acceptTerms() {
    await this.page.getByTestId("create-password-terms").click();
    return this;
  }
  async confirm() {
    await this.page.getByText('Import my wallet').click();
    return new FinishRestore(this.page).waitFor();
  }
}
