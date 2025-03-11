import { LockedWallet } from '@josepmc/extension/pages/lockScreen';
import { UnlockScreen } from '@josepmc/extension/pages/unlock';
import test from 'fixtures/onboarding';
import assert from 'node:assert';
import { existsSync, rmdirSync } from 'node:fs';
import { resolve } from 'node:path';

test.describe('Setup', () => {
  // Do not require the context here, we need to reset it before it's initialized
  test.beforeEach(async ({ wallet, walletPassword, contextState, stateStoragePath }) => {
    // Ensure the variables are set (fail the test if not)
    assert(wallet, 'WALLET environment variable is required');
    assert(walletPassword, 'WALLET_PASSWORD environment variable is required');
    const contextStatePath = resolve(stateStoragePath, contextState);
    if (existsSync(contextStatePath)) {
      rmdirSync(contextStatePath, { recursive: true });
    }
  });

  test('Initialize wallet - Type seed phrase @sanity @setup', async ({ wallet, walletPassword, initWallet }) => {
    const homepage = await initWallet(wallet, walletPassword);
    await homepage.openMenu();
    await homepage.lock();
    await new UnlockScreen(homepage.page).waitFor();
    // Wait for the wallet to be saved
    await homepage.page.waitForTimeout(5000);
  });
});
