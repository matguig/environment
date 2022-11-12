import EnvironmentVariableParseError, { TargetedType } from "../Error/EnvironmentVariableParseError";
import UndefinedEnvironmentVariableError from "../Error/UndefinedEnvironmentVariableError";

class StringDictionaryReaderReadOnly {
  constructor(protected dict: Record<string, string>) {}

  public get content(): Record<string, string> {
    return {...this.dict};
  }

  public getJSON<T>(name: string): T
  public getJSON<T>(name: string, fallback: null): T | null
  public getJSON<T>(name: string, fallback: T): T
  public getJSON<T>(key: string, fallback?: T | null): T | null {
    const value = this.get(key, null);
    if (value === null) {
      return this.returnFallbackOrThrowError<T>(fallback, key);
    }
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      throw new Error(`Environment variable ${key} is not a JSON string`);
    }
  }

  public getInt(name: string): number
  public getInt(name: string, fallback: null): number | null
  public getInt(name: string, fallback: number): number
  public getInt(name: string, fallback?: number | null): number | null {
    const value = this.get(name, null);
    if (value === null) {
      return this.returnFallbackOrThrowError<number>(fallback, name);
    }
    const intValue = parseInt(value, 10);
    if (isNaN(intValue)) {
      throw new EnvironmentVariableParseError(name, TargetedType.Integer, value);
    }
    return intValue;
  }

  public getFloat(name: string): number
  public getFloat(name: string, fallback: null): number | null
  public getFloat(name: string, fallback: number): number
  public getFloat(name: string, fallback?: number | null): number | null {
    const value = this.get(name, null);
    if (value === null) {
      return this.returnFallbackOrThrowError<number>(fallback, name);
    }
    const floatValue = parseFloat(value);
    if (isNaN(floatValue)) {
      throw new EnvironmentVariableParseError(name, TargetedType.Float, value);
    }
    return floatValue;
  }

  public getBool(name: string): boolean
  public getBool(name: string, fallback: null): boolean | null
  public getBool(name: string, fallback: boolean): boolean
  public getBool(name: string, fallback?: boolean | null): boolean | null {
    const value = this.get(name, null);
    if (value === null) {
      return this.returnFallbackOrThrowError<boolean>(fallback, name);
    }
    const sanitizedValue = value.toLowerCase().trim();
    if (sanitizedValue === 'true' || sanitizedValue === '1') {
      return true;
    }
    if (sanitizedValue === 'false' || sanitizedValue === '0') {
      return false;
    }
    throw new EnvironmentVariableParseError(name, TargetedType.Boolean, value);
  }

  public get(name: string): string
  public get(name: string, fallback: null): string | null
  public get(name: string, fallback: string): string
  public get(name: string, fallback?: string | null): string | null {
    if (name in this.content === false) {
      return this.returnFallbackOrThrowError<string>(fallback, name);
    }
    return this.content[name];
  }

  public getOneOf(...names: string[]): string {
    for (const name of names) {
      const environmentValue = this.get(name, null);
      if (environmentValue !== null) {
        return environmentValue;
      }
    }
    throw new Error(`None of the following attributes are defined: ${names.join(', ')}`);
  }

  public has(name: string): boolean {
    return name in this.content;
  }

  private returnFallbackOrThrowError<T>(fallback: T | null | undefined, name: string): T | null {
    if (typeof fallback !== 'undefined') {
      return fallback;
    }
    throw new UndefinedEnvironmentVariableError(name);
  }
}

export default StringDictionaryReaderReadOnly;
