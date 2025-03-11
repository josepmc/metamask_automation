import { getEnv } from '@josepmc/shared/helpers/config';

interface LocatorMap {
  [locatorName: string]: string;
}

export abstract class BaseLocators {
  /**
   * Locator mappings specific to the derived locator classes.
   * Should be overridden by subclasses.
   */
  protected static locatorsMapping: LocatorMap = {};
}
