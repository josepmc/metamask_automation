import { readFileSync } from 'fs';
import { resolve } from 'path';

import { Homepage, Homepage as Wallet } from '@josepmc/extension/pages/homepage';
import { LockedWallet } from '@josepmc/extension/pages/lockScreen';
import { Homepage as Website } from '@josepmc/web/pages/homepage';
import { test as base } from './base';
import { FinishRestore } from '@josepmc/extension/pages/components/onboarding/finishRestore';
import { Password } from '@josepmc/extension/pages/components/onboarding/password';
import { WalletOnboardingPage } from '@josepmc/extension/pages/walletOnboard';
import { createBdd } from 'playwright-bdd';

type Ctx = {
  extension: Wallet;
  app: Website;
};

const test = base.extend<{
  wallet: string;
  walletPassword: string;
  setupAuthWallet: (chain?: string, autoSignIn?: boolean) => Promise<Ctx>;
  initWallet: (wallet: string, walletPassword: string) => Promise<Homepage>;
  signIn: (chain: string, app: Website, extension: Homepage) => Promise<void>;
  ctx: Ctx;
}>({
  wallet: process.env.WALLET || '',
  walletPassword: 'testwallet1',

  setupAuthWallet: async ({ context, walletPassword, page, extensionId, logger, signIn, ctx }, use) => {
    await use(async (chain?: string, autoSignIn?: boolean) => {
      const extension = await new LockedWallet(context, page, extensionId).setupTest(walletPassword);
      logger.info(`Wallet is ready`);
      const newPage = await context.newPage();
      const app = new Website(newPage);

      ctx.extension = extension;
      ctx.app = app;
      if (autoSignIn) {
        expect(chain).toBeDefined();
        await signIn(chain as string, app, extension);
      }
      return { extension, app };
    });
  },

  ctx: async ({}, use) => {
    const ctx = {} as Ctx;
    await use(ctx);
  },

  initWallet: async ({ context, page, extensionId }, use) => {
    await use(async (wallet, walletPassword) => {
      // Custom timeout for the test;

      test.setTimeout(90000);
      let walletPage: WalletOnboardingPage;

      await test.step('0 - Start page', async () => {
        walletPage = new WalletOnboardingPage(context, page, extensionId);
        await walletPage.goto();
        await walletPage.waitFor();
        // This one fails a few times, we need to wait for the page to be fully loaded
        await (await walletPage.cleanupOtherPages()).hasScreenshot({ timeout: 20000 });
      });

      let passwordPage: Password;
      await test.step('1 - Fill in seed phrase', async () => {
        await walletPage.acceptTerms();
        const helpMM = await walletPage.iHaveAWallet();
        await helpMM.hasScreenshot();
        const seedPhrase = await helpMM.deny();
        await seedPhrase.fillSeedPhrase(wallet);
        passwordPage = await seedPhrase.confirm();
        // We're not taking a screenshot here because the seed phrase is sensitive
      });

      let finishRestore: FinishRestore;
      await test.step('2 - Create password', async () => {
        await passwordPage.fillPassword(walletPassword);
        await passwordPage.fillConfirmPassword(walletPassword);
        await passwordPage.acceptTerms();
        await passwordPage.hasScreenshot({ maxDiffPixelRatio: 0.01 });
        finishRestore = await passwordPage.confirm();
      });

      let homepage: Homepage;

      await test.step('3 - Finish onboarding', async () => {
        const tutorial = await finishRestore.continue();
        homepage = await tutorial.continue();
      });

      return await test
        .step('4 - Enable Test Networks', async () => {
          const selector = await homepage.openNetworkSelector();
          await selector.setTestNetworks();
          await selector.close();
        })
        .then(() => homepage.waitFor());
    });
  },

  signIn: async ({ logger }, use) => {
    await use(async (chain: string, marketPlace: Website, extension: Homepage) => {
      logger.info(`[${chain}] Signing in`);
      await marketPlace.connectWallet();

      logger.info(`[${chain}] Getting Sign screen`);
      const sign = await extension.getSignScreen();
      logger.info(`[${chain}] Signing`);
      await sign.sign();
      logger.info(`[${chain}] Checking if signed in`);
      if (!(await marketPlace.isLoggedIn())) {
        throw new Error('Failed to sign in');
      }

      logger.info(`[${chain}] Signed in`);
    });
  },
});

export const { expect } = test;
export const { Given, When, Then, Before } = createBdd(test);

export default test;
