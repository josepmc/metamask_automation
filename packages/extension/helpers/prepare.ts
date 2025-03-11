import unzip from '@tomjs/unzip-crx';
import { createWriteStream, existsSync, mkdtempSync, readdirSync, renameSync, rmdirSync } from 'fs';
import internal, { pipeline } from 'node:stream';
import fetch from 'node-fetch';
import { tmpdir } from 'os';
import path from 'path';
import { promisify } from 'util';
import { Logger } from 'winston';
import { resolve } from 'node:path';

export default class PrepareWallet {
  public downloadFolder: string;
  private logger: Logger;
  private crxFile: string;
  constructor(downloadFolder: string, defaultPath: string, logger: Logger) {
    this.downloadFolder = downloadFolder;
    this.logger = logger;
    const existsExtension = existsSync(resolve(defaultPath, 'metamask.zip'));
    if (process.env.EXTENSION_PATH) {
      let extensionPath = process.env.EXTENSION_PATH;
      if (!path.isAbsolute(extensionPath)) {
        extensionPath = path.resolve(process.cwd(), extensionPath);
      }
      this.logger.info(`Using extension from path ${extensionPath}`);
      this.crxFile = extensionPath;
      if (!existsSync(this.crxFile)) {
        throw new Error(`Extension path "${this.crxFile}" does not exist`);
      }
    } else if (process.env.CHROME_STORE !== 'true' && existsExtension) {
      this.logger.info('Using extension from default path');
      this.crxFile = resolve(defaultPath, 'metamask.zip');
    } else {
      this.logger.info('Using extension from chrome store');
      this.crxFile = path.join(this.downloadFolder, 'wallet.crx');
    }
  }
  // Extract the filename from the URL
  readonly extensionId = 'nkbihfbeogaeaoehlefnkodbefgpgknn';
  // Download wallet from the chrome web store
  private async downloadWallet() {
    this.logger.info('Downloading wallet');
    // TODO: Use a locally built wallet in the future
    const url = `https://clients2.google.com/service/update2/crx?response=redirect&os=win&arch=x86-64&os_arch=x86-64&nacl_arch=x86-64&prod=chromiumcrx&prodchannel=unknown&prodversion=9999.0.9999.0&acceptformat=crx2,crx3&x=id%3D${this.extensionId}%26uc`;

    // Download the file
    const streamPipeline = promisify(pipeline);

    const response = await fetch(url, { redirect: 'follow' });

    if (!response.ok) {
      throw new Error(`unexpected response ${response.statusText}`);
    }

    await streamPipeline(response.body as internal.PipelineSource<any>, createWriteStream(this.crxFile));
    this.logger.info('Downloaded wallet');
  }

  public async prepareExtension(savedState: string = '') {
    // Uncompress the extension, change the extension id and recompress it
    // This is needed because when running locally in the future the extension id may change
    if (!existsSync(this.crxFile)) {
      await this.downloadWallet();
    }

    // Uncompress the extension
    let uncompressFolder = '';
    if (!savedState) {
      this.logger.info('Using tmp directory');
      uncompressFolder = mkdtempSync(path.join(tmpdir(), 'wallet-'));
    } else {
      this.logger.info(`Using state ${savedState}`);
      uncompressFolder = path.resolve(this.downloadFolder, 'extension', savedState);
    }

    if (!existsSync(uncompressFolder) || !savedState) {
      this.logger.info(`Uncompressing extension to ${uncompressFolder}`);
      await unzip(this.crxFile, uncompressFolder);
    } else {
      // Folder exists and we're reusing the state
      this.logger.info(`Using existing state ${savedState}`);
    }

    if (!existsSync(path.join(uncompressFolder, 'manifest.json'))) {
      if (existsSync(path.join(uncompressFolder, 'dist/manifest.json'))) {
        // Move all the files to the root folder
        const distFolder = path.join(uncompressFolder, 'dist');
        const files = readdirSync(distFolder);
        files.forEach(file => {
          renameSync(path.join(distFolder, file), path.join(uncompressFolder, file));
        });
        rmdirSync(distFolder);
      } else {
        throw new Error('Error uncompressing the extension, manifest.json not found');
      }
    }

    // Read version from the manifest.json
    const manifest = require(path.join(uncompressFolder, 'manifest.json'));
    this.logger.info(`Extension version: ${manifest.version}`);

    return { uncompressFolder, manifest };
  }
}
