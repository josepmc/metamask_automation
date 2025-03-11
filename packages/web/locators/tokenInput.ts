import { BaseLocators } from '@josepmc/shared/locators';

export class TokenInputLocators extends BaseLocators {
  protected static locatorsMapping = {
    address: 'xpath=//*[@data-test="MetaMaskConnector__Div__connect"]',
    inputField: 'xpath=//*[@data-test="InputAddress__Input__addressValue"]',
    networkError: 'xpath=//*[@data-test="MetaMaskConnector__Div__error"]',
    changeNetwork: 'xpath=//*[@data-test="MetaMaskConnector__Button__connect"]',
    submit: 'xpath=//*[@data-test="InputAddress__Button__submit"]',
    exampleToken: 'xpath=//*[@data-test="InputAddress__Span__exampleTokenLink"]',
  };

  public static get address(): string {
    return this.locatorsMapping.address;
  }

  public static get inputField(): string {
    return this.locatorsMapping.inputField;
  }

  public static get networkError(): string {
    return this.locatorsMapping.networkError;
  }

  public static get changeNetwork(): string {
    return this.locatorsMapping.changeNetwork;
  }

  public static get submit(): string {
    return this.locatorsMapping.submit;
  }

  public static get exampleToken(): string {
    return this.locatorsMapping.exampleToken;
  }
}
