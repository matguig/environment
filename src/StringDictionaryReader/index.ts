import StringDictionaryReaderReadOnly from "./ReadOnly";

class StringDictionaryReader extends StringDictionaryReaderReadOnly {
  public get content(): Record<string, string> {
    return this.dict;
  }

  public set(name: string, value: unknown): void {
    if (typeof value === 'object') {
      this.dict[name] = JSON.stringify(value);
    } else if (typeof value?.toString === 'function') {
      this.dict[name] = value.toString();
    } else {
      this.dict[name] = String(value);
    }
  }

  public unset(name: string): void {
    delete this.dict[name];
  }
}

export default StringDictionaryReader;
