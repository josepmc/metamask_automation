import { BaseLocators } from '@josepmc/shared/locators';

export class HomepageLocators extends BaseLocators {
  protected static locatorsMapping = {
    body: 'xpath=//*[@data-test="AppPage__Div__content"]',
    connected: 'xpath=//*[contains(text(), "Connected as:")]',
    loading: 'xpath=//*[text()="Loading..."]',
  };

  public static get body(): string {
    return this.locatorsMapping.body;
  }

  public static get connected(): string {
    return this.locatorsMapping.connected;
  }

  public static get loading(): string {
    return this.locatorsMapping.body;
  }
}
