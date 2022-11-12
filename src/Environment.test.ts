import Environment from "./Environment";
import StringDictionaryReaderReadOnly from "./StringDictionaryReader/ReadOnly";

describe('environment', () => {
  it('should be able to get value of an existing key', () => {
    expect(Environment).toBeInstanceOf(StringDictionaryReaderReadOnly)
  });
});
