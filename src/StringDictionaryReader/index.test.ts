import StringDictionaryReader from "./index";

describe('StringDictionaryReader ReadOnly', () => {
  describe('set method', () => {
    const dict = new StringDictionaryReader();

    it('should be able to set value of an existing key', () => {
      dict.set('FOO', 'bar');
      expect(dict.get('FOO')).toBe('bar');
    });

    it('should be able to set JSON value of an existing key', () => {
      dict.set('TOTO', { foo: 'bar' });
      expect(dict.get('TOTO')).toBe("{\"foo\":\"bar\"}");
      expect(dict.getJSON('TOTO')).toEqual({ foo: 'bar' });
    });
  });

  describe('unset method', () => {
    const dict = new StringDictionaryReader({
      'FOO': 'bar',
    });

    it('should be able to unset value of an existing key', () => {
      dict.unset('FOO');
      expect(dict.has('FOO')).toBe(false);
      expect(dict.content).toEqual({});
    });
  });

  describe('content property can be modified', () => {
    const dict = new StringDictionaryReader({
      'FOO': 'bar',
    });

    it('should be able to modify content', () => {
      dict.content['FOO'] = 'baz';
      expect(dict.get('FOO')).toBe('baz');
    });
  });

  describe('content property cannot be replaced', () => {
    const dict = new StringDictionaryReader({
      'FOO': 'bar',
    });

    it('should not be able to replace content', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dict.content = {'BAR': 'baz'}
      }).toThrow(new Error('Cannot set property content of #<StringDictionaryReader> which has only a getter'));
    });
  });
});
