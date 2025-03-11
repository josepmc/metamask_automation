import { AbstractComponent } from '@josepmc/shared';
import { Password } from './password';

export class SeedPhrase extends AbstractComponent {
  async waitFor() {
    await this.page.getByText('Access your wallet with your Secret Recovery Phrase').waitFor({ state: 'visible' });
    return this;
  }

  async selectSeedPhraseLength(length: number) {
    await this.page.locator('xpath=//select[.//option[text()="I have a 12-word phrase"]]').selectOption(length.toString());
    return this;
  }

  async fillSeedPhrase(seedPhrase: string) {
    const splitSeedPhrase = seedPhrase.split(' ');
    await this.selectSeedPhraseLength(splitSeedPhrase.length);
    for(let [idx, word] of Object.entries(splitSeedPhrase)) {
      await this.page.getByTestId(`import-srp__srp-word-${idx}`).fill(word);
    }
    return this;
  }

  async confirm() {
    await this.page.getByTestId('import-srp-confirm').click();
    return new Password(this.page).waitFor();
  }
}
