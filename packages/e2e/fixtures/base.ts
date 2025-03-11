import { type BrowserContext, chromium } from '@playwright/test';
import winston from 'winston';

import { AbstractComponent } from '@josepmc/shared';

import { test as base } from 'playwright-bdd';
import PrepareWallet from '@josepmc/extension/helpers/prepare';
import { join, resolve } from 'path';
import { existsSync, mkdtempSync } from 'fs';
import { copy } from 'fs-extra';
import { tmpdir } from 'os';

let _manifest = {};
let _extensionFolder = '';
// Source: https://playwright.dev/docs/chrome-extensions#testing
export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  reportFolder: string;
  tmpFolder: string;
  stateStoragePath: string;
  extensionFolder: string;
  logger: winston.Logger;
  timeoutMultiplier: number;
  rootPath: string;
  contextState: string;
  manifest: {};
}>({
  reportFolder: ['', { option: true }],
  tmpFolder: ['', { option: true }],
  stateStoragePath: ['', { option: true }],
  extensionFolder: async ({}, use) => {
    await use(_extensionFolder);
  },
  contextState: ['', { option: true }],
  logger: [winston.createLogger({ level: 'info' }), { option: true }],
  timeoutMultiplier: [1, { option: true }],
  manifest: async ({}, use) => {
    await use(_manifest);
  },
  rootPath: [__dirname, { option: true }],
  context: async (
    {
      logger,
      context,
      tmpFolder,
      rootPath,
      stateStoragePath,
      contextState,
    }: {
      logger: winston.Logger;
      context: BrowserContext;
      tmpFolder: string;
      rootPath: string;
      stateStoragePath: string;
      contextState: string;
    },
    use: (r: {}) => Promise<void>,
  ): Promise<BrowserContext> => {
    await context.close();
    AbstractComponent.logger = logger;

    const { uncompressFolder, manifest } = await new PrepareWallet(tmpFolder, rootPath, logger).prepareExtension(
      contextState,
    );
    _manifest = manifest;
    _extensionFolder = uncompressFolder;
    const stateFolder = contextState ? resolve(stateStoragePath, contextState) : '';
    let userProfileDir = stateFolder;
    if (stateFolder && existsSync(stateFolder)) {
      // Copy it to a temporary directory
      const folder = mkdtempSync(join(tmpdir(), `storage-state-${contextState}-`));
      logger.info(`Copying ${stateFolder} folder to ${folder}`);
      await copy(stateFolder, folder);
      userProfileDir = folder;
    }

    // If Metamask wasn't using Lavamoat we could set the context directly through chrome.storage
    // Only available in dev versions of Metamask
    const args = [
      `--disable-extensions-except=${uncompressFolder}`,
      `--load-extension=${uncompressFolder}`,
      // Needed as we're restoring sessions during tests
      '--disable-session-crashed-bubble',
      '--hide-crash-restore-bubble',
    ];
    if (process.env.HEADLESS === 'true') {
      args.push('--headless=new');
    }

    const newContext = await chromium.launchPersistentContext(userProfileDir, {
      headless: false,
      args: args,
    });
    await use(newContext);
    await newContext.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) {
      background = await context.waitForEvent('serviceworker');
    }

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});
export const { expect } = test;
