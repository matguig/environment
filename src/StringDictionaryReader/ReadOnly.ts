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
      if (typeof fallback !== 'undefined') {
        return fallback;
      }
      throw new Error(`Environment variable ${key} is not defined`);
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
      if (typeof fallback !== 'undefined') {
        return fallback;
      }
      throw new Error(`Environment variable ${name} is not defined`);
    }
    const intValue = parseInt(value, 10);
    if (isNaN(intValue)) {
      throw new Error(`Environment variable ${name} is not an integer`);
    }
    return intValue;
  }
  
  public getFloat(name: string): number
  public getFloat(name: string, fallback: null): number | null
  public getFloat(name: string, fallback: number): number
  public getFloat(name: string, fallback?: number | null): number | null {
    const value = this.get(name, null);
    if (value === null) {
      if (typeof fallback !== 'undefined') {
        return fallback;
      }
      throw new Error(`Environment variable ${name} is not defined`);
    }
    const floatValue = parseFloat(value);
    if (isNaN(floatValue)) {
      throw new Error(`Environment variable ${name} is not a float`);
    }
    return floatValue;
  }
  
  public getBool(name: string): boolean
  public getBool(name: string, fallback: null): boolean | null
  public getBool(name: string, fallback: boolean): boolean
  public getBool(name: string, fallback?: boolean | null): boolean | null {
    const value = this.get(name, null);
    if (value === null) {
      if (typeof fallback !== 'undefined') {
        return fallback;
      }
      throw new Error(`Environment variable ${name} is not defined`);
    }
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    throw new Error(`Environment variable ${name} is not a boolean`);
  }
  
  public get(name: string): string
  public get(name: string, fallback: null): string | null
  public get(name: string, fallback: string): string
  public get(name: string, fallback?: string | null): string | null {
    if (name in this.content === false) {
      if (typeof fallback !== 'undefined') {
        return fallback;
      }
      throw new Error(`Environment variable ${name} is not defined`);
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
}
  
export default StringDictionaryReaderReadOnly;
  