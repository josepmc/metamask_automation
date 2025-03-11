import { BaseLocators } from '@josepmc/shared/locators';

export class DepositLocators extends BaseLocators {
  protected static locatorsMapping = {
    balance: 'xpath=//*[@data-test="TokenBalance__Div__balanceAmount"]',
    depositHistory: 'xpath=//*[@data-test="DepositHistory__Table__history"]',
    depositInputError: 'xpath=//*[@data-test="DepositToken__Div__error"]',
    depositButton: 'xpath=//*[@data-test="DepositToken__Button__deposit"]',
    depositInput: 'xpath=//*[@data-test="DepositToken__Input__depositAmount"]',
    getMoreTokens: 'xpath=//*[@data-test="TokenBalance__Div__getMoreExampleTokensAction"]',
  };

  public static get balance(): string {
    return this.locatorsMapping.balance;
  }

  public static balanceWithValue(value: string): string {
    return `xpath=//*[@data-test="TokenBalance__Div__balanceAmount"][text()="${value}"]`;
  }

  public static get depositHistory(): string {
    return this.locatorsMapping.depositHistory;
  }

  public static get depositInputError(): string {
    return this.locatorsMapping.depositInputError;
  }

  public static get depositButton(): string {
    return this.locatorsMapping.depositButton;
  }

  public static get depositInput(): string {
    return this.locatorsMapping.depositInput;
  }

  public static get getMoreTokens(): string {
    return this.locatorsMapping.getMoreTokens;
  }
}
