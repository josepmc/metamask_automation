import { Page } from '@playwright/test';

import { BaseWithContext } from '@josepmc/shared';
import { Password } from './components/onboarding/password';
import { HelpMM } from './components/onboarding/helpMM';

export class WalletOnboardingPage extends BaseWithContext {
  async goto(newPage = true) {
    let pagePromise: Promise<Page> | undefined;
    if (newPage) {
      pagePromise = this.context.waitForEvent('page', { timeout: 20000 }) as Promise<Page>;
    }

    await this.page.goto(`chrome-extension://${this.extensionId}/home.html`);
    if (newPage && pagePromise !== undefined) {
      try {
        this.page = (await pagePromise) as Page;
      } catch {
        // This is fine, it just means the page was already open
      }
    }

    return this;
  }

  async waitFor() {
    // NOTE: This is under a feature flag
    await this.page.getByText("Let's get started").waitFor({ state: 'visible' });
    return this;
  }

  async isOnboardingPage() {
    return this.page.url().includes('#onboarding');
  }

  async acceptTerms() {
    await this.page.getByText("I agree to MetaMask's Terms of use").click();
    return this;
  }

  async createNewWallet() {
    await this.page.getByText('Create a New Wallet').click();
    return new Password(this.page).waitFor();
  }

  async iHaveAWallet() {
    await this.page.getByText('Import an Existing Wallet').click();
    return new HelpMM(this.page).waitFor();
  }
}
