import { type ReadStream, createReadStream, existsSync, readFileSync } from 'fs';
import EnvironmentVariableParseError, { TargetedType } from '../Error/EnvironmentVariableParseError';
import UndefinedEnvironmentVariableError from '../Error/UndefinedEnvironmentVariableError';

type ReadFileOptions = {
  flags?: string | undefined;
  encoding?: BufferEncoding | undefined;
  mode?: number | undefined;
  start?: number | undefined;
  end?: number | undefined;
  highWaterMark?: number | undefined;
}

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

  public getFilePath(name: string): string
  public getFilePath(name: string, fallback: null): string | null
  public getFilePath(name: string, fallback: string): string
  public getFilePath(name: string, fallback?: string | null): string | null {
    const value = this.get(name, null) || this.returnFallbackOrThrowError<string>(fallback, name);
    if (value === null) {
      return null;
    }
    if (existsSync(value) === false) {
      throw new Error(`File ${value} does not exist`);
    }
    return value;
  }

  public getFile(name: string, options: ReadFileOptions = {}): Promise<ReadStream> {
    const stream = createReadStream(
      this.getFilePath(name),
      {
        encoding: 'utf8',
        autoClose: true,
        emitClose: true,
        ...options,
      },
    );

    return new Promise((resolve, reject) => {
      stream.on('error', reject);
      stream.on('open', () => resolve(stream));
    });
  }

  public getFileContent(name: string): Buffer
  public getFileContent(name: string, encoding: BufferEncoding): string
  public getFileContent(name: string, encoding?: BufferEncoding): Buffer|string {
    return readFileSync(this.getFilePath(name), encoding);
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
