import StringDictReaderReadOnly from "./StringDictionaryReader/ReadOnly";

enum EnvironmentName {
  Development = "development",
  Production = "production",
  Test = "test",
}

class Environment extends StringDictReaderReadOnly {
  private static readonly CURRENT_ENVIRONMENT_KEY = "NODE_ENV";

  private defaultEnvironmentValues: Record<string, string> = {};

  public constructor() {
    super(process.env as Record<string, string>);
  }

  public get content(): Record<string, string> {
    return {
      ...this.defaultEnvironmentValues,
      ...this.dict
    };
  }

  /**
   * Returns true if the current environment is production.
   * Based on the NODE_ENV environment variable, if it is set to "production".
   * If the NODE_ENV environment variable is not set,
   * it will consider the current environment as development.
   *
   * @returns {boolean}
   */
  public isProduction(): boolean {
    return this.getEnvName() === EnvironmentName.Production;
  }

  /**
   * Returns the current environment name.
   * Based on the NODE_ENV environment variable. If the NODE_ENV environment variable is not set,
   * it will consider the current environment as development.
   *
   * @returns {EnvironmentName | string}
   */
  public getEnvName<T = string>(): EnvironmentName | T {
    return this.get(
      Environment.CURRENT_ENVIRONMENT_KEY,
      EnvironmentName.Development
    ) as EnvironmentName | T;
  }

  /**
   * Sets default environment variables values.
   * These values will be used if the environment variable is not set.
   *
   * @param {Record<string, string>} values
   * @returns {this}
   */
  public setDefault(defaultEnvironmentValues: Record<string, string>): this {
    this.defaultEnvironmentValues = defaultEnvironmentValues;
    return this;
  }

  /**
   * Reloads the environment variables from the process.env object.
   * This method is useful if you want to reload the environment variables after changing them.
   *
   */
  public reload(): this {
    this.dict = process.env as Record<string, string>;
    return this;
  }
}

const environmentInstance = new Environment();

export default environmentInstance;
