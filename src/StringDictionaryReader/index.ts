import StringDictionaryReaderReadOnly from './ReadOnly';

class StringDictionaryReader extends StringDictionaryReaderReadOnly {
  public constructor(dict: Record<string, string> = {}) {
    super(dict);
  }

  public get content(): Record<string, string> {
    return this.dict;
  }

  public set(name: string, value: unknown): void {
    if (typeof value === 'object') {
      this.dict[name] = JSON.stringify(value);
    } else {
      this.dict[name] = String(value);
    }
  }

  public unset(name: string): void {
    delete this.dict[name];
  }
}

export default StringDictionaryReader;
