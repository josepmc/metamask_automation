import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';
import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import winston from 'winston';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';

const dotenvPath = resolve(__dirname, '.env');
if (existsSync(dotenvPath)) {
  console.log(`Loading environment variables from ${dotenvPath}`);
  try {
    config({ path: dotenvPath });
  } catch (error) {
    console.error(`Error reading ${dotenvPath}`, error);
    throw error;
  }
} else {
  console.warn('No .env file found. Create using `cp .env.example .env`');
}

const isCI = process.env.CI === 'true';
const isSharded = process.env.SHARDED === 'true';

// NOTE: Enable this if using snapshots
// const updateSnapshots = process.env.UPDATE_SNAPSHOTS === 'true';
// const ignoreSnapshots = process.env.IGNORE_SNAPSHOTS === 'true' || (!isCI && !updateSnapshots);

const reportFolder = resolve(__dirname, 'playwright-report');
const tmpFolder = resolve(__dirname, 'tmp');
const defaultPath = __dirname;
const isSlow = process.env.SLOW === 'true';

// Do not remove this folder as it holds the downloaded extension
// We don't want to download it every single time as we'll get rate limited
if (!existsSync(tmpFolder)) {
  mkdirSync(tmpFolder);
}

const stateStorage = resolve(tmpFolder, 'storage-state');
if (!existsSync(stateStorage)) {
  mkdirSync(stateStorage);
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: resolve(reportFolder, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: resolve(reportFolder, 'combined.log'),
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

export default (async () => {
  return defineConfig<{
    tmpFolder: string;
    reportFolder: string;
    stateStoragePath: string;
    extensionFolder: string;
    logger: winston.Logger;
    timeoutMultiplier: number;
    manifest: {};
    extensionId: string;
    rootPath: string;
    contextState: string;
  }>({
    fullyParallel: true,
    // If running on ubuntu-latest, we need to substantially increase the timeout
    timeout: (isSlow ? 5 : isCI ? 3 : 2) * 60 * 1000,
    forbidOnly: isCI,
    workers: 1, // Even in CI is faster to run the tests sequentially
    maxFailures: 1, // Needed because our tests require a specific order
    retries: isCI ? 5 : 0,
    outputDir: reportFolder,
    reporter: [
      ['list'],
      isCI ? ['github'] : ['null'],
      isSharded ? ['blob'] : ['null'],
      ['html', { host: '0.0.0.0', outputFolder: reportFolder + '-html' }],
      cucumberReporter('html', { outputFile: resolve(reportFolder, 'cucumber.html') }),
      ['junit', { outputFile: resolve(reportFolder, 'junit.xml') }],
    ],
    use: {
      trace: 'retain-on-failure',
      video: 'off', // Disable video recording
      tmpFolder,
      reportFolder,
      stateStoragePath: stateStorage,
      logger,
      rootPath: defaultPath,
      timeoutMultiplier: isSlow ? 2 : isCI ? 1.5 : 1,
      baseURL: process.env.BASE_URL || 'http://localhost:3000',
      extraHTTPHeaders: {},
    },
    projects: [
      {
        name: 'Main Tests',
        use: {
          ...devices['Desktop Chrome'],
          userAgent: (devices['Desktop Chrome'].userAgent += ' Playwright/1'),
          contextState: 'imported-wallet',
        },
        dependencies: ['Restore Wallet'],
        testDir: defineBddConfig({
          features: './features/**/*.feature',
          steps: './features/steps/**/*.ts',
          aiFix: {
            promptAttachment: true,
          },
        }),
      },
      // Don't set it first so that the extension automatically picks the other project
      {
        name: 'Restore Wallet',
        testDir: 'setup',
        testMatch: 'restoreWallet.setup.ts',
        use: {
          ...devices['Desktop Chrome'],
          contextState: 'imported-wallet',
        },
      },
    ],
    updateSnapshots: 'none',
    ignoreSnapshots: true,
  });
})();
