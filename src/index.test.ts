import Environment, {StringDictionaryReader, StringDictionaryReaderReadOnly} from "./index";

describe('environment', () => {
  it('should be able to get value of an existing key', () => {
    expect(Environment).toBeInstanceOf(StringDictionaryReaderReadOnly)
    expect(StringDictionaryReader).toBeInstanceOf(Function)
    expect(StringDictionaryReaderReadOnly).toBeInstanceOf(Function)
  });
});
