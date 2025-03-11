import { AbstractComponent } from '@josepmc/shared';

import { ConnectToWebsite } from './components/connectToWebsite/connectToWebsite';
import { NetworkSelector } from './components/networkSelector/networkSelector';
import { ConnectToNetwork } from './components/connectToWebsite/connectToNetwork';
import { Page } from '@playwright/test';
import { TransactionRequest } from './components/connectToWebsite/transactionRequest';
import { ApproveTransaction } from './components/connectToWebsite/approveTransaction';
import { SpendingCapRequest } from './components/connectToWebsite/spendingCapRequest';

export class Homepage extends AbstractComponent {
  async goTo() {
    await this.page.goto('/');
    return this;
  }

  async waitFor() {
    await this.page.getByTestId('app-header-copy-button').waitFor({ state: 'visible' });
    await this.page.locator('.loading-overlay').waitFor({ state: 'hidden' });
    return this;
  }

  async getConnectScreen() {
    // In this case, it always opens in a new page
    // As this is an external trigger, the page should already be open by the time we get here
    const newPage = await this.getNewPage();
    return new ConnectToWebsite(newPage).waitFor();
  }

  async getChangeNetworkScreen() {
    // In this case, it always opens in a new page
    // As this is an external trigger, the page should already be open by the time we get here
    const newPage = await this.getNewPage();
    return new ConnectToNetwork(newPage).waitFor();
  }

  async getTransactionRequestScreen() {
    // In this case, it always opens in a new page
    // As this is an external trigger, the page should already be open by the time we get here
    const newPage = await this.getNewPage();
    return new TransactionRequest(newPage).waitFor();
  }

  async getSpendingCapRequest() {
    // In this case, it always opens in a new page
    // As this is an external trigger, the page should already be open by the time we get here
    let newPage = await this.getNewPage();
    return new SpendingCapRequest(newPage).waitFor();
  }

  async getApproveTransactionScreen() {
    // In this case, it always opens in a new page
    // As this is an external trigger, the page should already be open by the time we get here
    let newPage = await this.getNewPage(60 * 1000);
    return new ApproveTransaction(newPage).waitFor();
  }

  async exportStorageState() {
    // Only works in builds without LavaMoat
    return this.page.evaluate(() => chrome.storage.local.get());
  }

  async copyAddressClipboard() {
    await this.page.context().grantPermissions(['clipboard-read']);
    await this.page.getByTestId('app-header-copy-button').click();
  }

  async getCurrentNetwork() {
    return this.page.getByTestId('network-display').textContent();
  }

  async waitForNetwork(network: string) {
    await (this.page as Page).getByTestId('network-display').filter({ hasText: network }).waitFor();
    await this.waitFor();
  }

  async openNetworkSelector() {
    await this.page.getByTestId('network-display').click();
    return new NetworkSelector(this.page).waitFor();
  }

  async openMenu() {
    await this.page.getByTestId('account-options-menu-button').click();
  }

  async lock() {
    await this.page.getByText('Lock MetaMask').click();
  }
}
