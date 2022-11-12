import { ReadStream } from "fs";
import EnvironmentVariableParseError from "../Error/EnvironmentVariableParseError";
import UndefinedEnvironmentVariableError from "../Error/UndefinedEnvironmentVariableError";
import StringDictionaryReaderReadOnly from "./ReadOnly";

describe('StringDictionaryReader ReadOnly', () => {
  describe('get method', () => {
    const dict = new StringDictionaryReaderReadOnly({
      'FOO': 'bar',
    });

    it('should be able to get value of an existing key', () => {
      expect(dict.get('FOO')).toBe('bar');
    });

    it('should be able to get value of an none existing key with fallback', () => {
      expect(dict.get('BAR', 'baz')).toBe('baz');
    });

    it('should throw an error when getting value of an none existing key without fallback', () => {
      const expected = expect(() => dict.get('BAR'));

      expected.toThrowErrorMatchingSnapshot();
      expected.toThrow(UndefinedEnvironmentVariableError);
    });
  });

  describe('getOneOf method', () => {
    const dict = new StringDictionaryReaderReadOnly({
      'FOO': 'bar',
    });

    it('should be able to get value of an existing key', () => {
      expect(dict.getOneOf('BAR', 'FOO')).toBe('bar');
    });

    it('should throw an error when getting value of an none existing key', () => {
      expect(() => dict.getOneOf('BAR', 'BAZ')).toThrow(new Error('None of the following attributes are defined: BAR, BAZ'));
    });
  });

  describe('getBool method', () => {
    const dict = new StringDictionaryReaderReadOnly({
      'FOO': 'bar',
      'BAR': 'true',
      'BAZ': 'false',
      'QUX': '1',
      'QUUX': '0',
    });

    it('should be able to get value of an existing key', () => {
      expect(dict.getBool('BAR')).toBe(true);
    });

    it('should be able to get value of an none existing key with fallback', () => {
      expect(dict.getBool('NON_EXISTING', false)).toBe(false);
    });

    it('should throw an error when getting value which is not a boolean', () => {
      const expected = expect(() => dict.getBool('FOO'));

      expected.toThrowErrorMatchingSnapshot();
      expected.toThrow(EnvironmentVariableParseError);
    });

    it('should throw an error when getting value of an none existing key without fallback', () => {
      const expected = expect(() => dict.getBool('NON_EXISTING'));

      expected.toThrowErrorMatchingSnapshot();
      expected.toThrow(UndefinedEnvironmentVariableError);
    });

    it.each(['true', 'True', '  true ', '1', '1        '])('should be able to parse "%s" as positive boolean', (value) => {
      const dict = new StringDictionaryReaderReadOnly({
        'FOO': value,
      });
      expect(dict.getBool('FOO')).toBe(true);
    });
    it.each(['false', 'False', '  false ', '0', '0        '])('should be able to parse "%s" as negative boolean', (value) => {
      const dict = new StringDictionaryReaderReadOnly({
        'FOO': value,
      });
      expect(dict.getBool('FOO')).toBe(false);
    });
  });

  describe('getInt method', () => {
    const dict = new StringDictionaryReaderReadOnly({
      'FOO': 'bar',
      'BAR': '123',
      'BAZ': '0',
      'QUX': '-123',
      'QUUX': '123.456',
    });

    it('should be able to get value of an existing key', () => {
      expect(dict.getInt('BAR')).toBe(123);
    });

    it('should be able to get value of an none existing key with fallback', () => {
      expect(dict.getInt('NON_EXISTING', 456)).toBe(456);
    });

    it('should throw an error when getting value which is not an integer', () => {
      const expected = expect(() => dict.getInt('FOO'));

      expected.toThrowErrorMatchingSnapshot();
      expected.toThrow(EnvironmentVariableParseError);
    });

    it('should throw an error when getting value of an none existing key without fallback', () => {
      const expected = expect(() => dict.getInt('NON_EXISTING'));

      expected.toThrowErrorMatchingSnapshot();
      expected.toThrow(UndefinedEnvironmentVariableError);
    });

    it('should be able to parse negative integer', () => {
      expect(dict.getInt('QUX')).toBe(-123);
    });

    it('should be able to parse float as integer', () => {
      expect(dict.getInt('QUUX')).toBe(123);
    });

    it('should be able to parse 0 as integer', () => {
      expect(dict.getInt('BAZ')).toBe(0);
    });
  });

  describe('getFloat method', () => {
    const dict = new StringDictionaryReaderReadOnly({
      'FOO': 'bar',
      'BAR': '123',
      'BAZ': '0',
      'QUX': '-123',
      'QUUX': '123.456',
    });

    it('should be able to get value of an existing key', () => {
      expect(dict.getFloat('QUUX')).toBe(123.456);
    });

    it('should be able to get value of an none existing key with fallback', () => {
      expect(dict.getFloat('NON_EXISTING', 456.789)).toBe(456.789);
    });

    it('should throw an error when getting value which is not a float', () => {
      const expected = expect(() => dict.getFloat('FOO'));

      expected.toThrowErrorMatchingSnapshot();
      expected.toThrow(EnvironmentVariableParseError);
    });

    it('should throw an error when getting value of an none existing key without fallback', () => {
      const expected = expect(() => dict.getFloat('NON_EXISTING'));

      expected.toThrowErrorMatchingSnapshot();
      expected.toThrow(UndefinedEnvironmentVariableError);
    });

    it('should be able to parse negative float', () => {
      expect(dict.getFloat('QUX')).toBe(-123);
    });

    it('should be able to parse integer as float', () => {
      expect(dict.getFloat('BAR')).toBe(123);
    });

    it('should be able to parse 0 as float', () => {
      expect(dict.getFloat('BAZ')).toBe(0);
    });
  });

  describe('getJSON method', () => {
    const dict = new StringDictionaryReaderReadOnly({
      'FOO': 'bar',
      'BAR': '{"foo": "bar"}',
      'BAZ': 'true',
      'QUX': '123',
      'QUUX': '123.456',
    });

    it('should be able to get value of an existing key', () => {
      expect(dict.getJSON('BAR')).toEqual({foo: 'bar'});
    });

    it('should be able to get value of an none existing key with fallback', () => {
      expect(dict.getJSON('NON_EXISTING', {foo: 'bar'})).toEqual({foo: 'bar'});
    });

    it('should throw an error when getting value which is not a json', () => {
      expect(() => dict.getJSON('FOO')).toThrow(new Error('Environment variable FOO is not a JSON string'));
    });

    it('should throw an error when getting value of an none existing key without fallback', () => {
      const expected = expect(() => dict.getJSON('NON_EXISTING'));

      expected.toThrowErrorMatchingSnapshot();
      expected.toThrow(UndefinedEnvironmentVariableError);
    });

    it('should be able to parse boolean as json', () => {
      expect(dict.getJSON('BAZ')).toBe(true);
    });

    it('should be able to parse integer as json', () => {
      expect(dict.getJSON('QUX')).toBe(123);
    });

    it('should be able to parse float as json', () => {
      expect(dict.getJSON('QUUX')).toBe(123.456);
    });
  });

  describe('getFile method', () => {
    const dict = new StringDictionaryReaderReadOnly({
      'NON_EXIST': '/non/exist',
      'FILE_PATH': __dirname + '/__tests__/file.txt',
    });

    it('should throw an error when getting value of an none existing key without fallback', () => {
      const expected = expect(() => dict.getFile('NON_EXISTING'));

      expected.toThrowErrorMatchingSnapshot();
      expected.toThrow(UndefinedEnvironmentVariableError);
    });

    it('should throw an error if file does not exist', () => {
      const expected = expect(() => dict.getFile('NON_EXIST'));

      expected.toThrowErrorMatchingSnapshot();
      expected.toThrow(Error);
    });

    it('should return readable stream of file', async () => {
      const stream = await dict.getFile('FILE_PATH');

      expect(stream).toBeInstanceOf(ReadStream);
      const chunks: Buffer[] = [];
      await new Promise((resolve) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('end', resolve);
      });

      expect(Buffer.concat(chunks as Buffer[]).toString()).toBe('Hello World!\n');
    });

    it('should getFileContent', () => {
      expect(dict.getFileContent('FILE_PATH', 'utf-8')).toBe('Hello World!\n');
      expect(dict.getFileContent('FILE_PATH').toString('utf-8')).toBe('Hello World!\n');
    })

    it('shoudl return null', () => {
      expect(dict.getFilePath('NON_EXISTING', null)).toBe(null);
    })
  });

  describe('has method', () => {
    const dict = new StringDictionaryReaderReadOnly({
      'FOO': 'bar',
    });

    it('should be able to check if key exists', () => {
      expect(dict.has('FOO')).toBe(true);
    });

    it('should be able to check if key does not exist', () => {
      expect(dict.has('BAR')).toBe(false);
    });
  });

  describe('content readonly property', () => {
    const dict = new StringDictionaryReaderReadOnly({
      'FOO': 'bar',
    });

    it('should be able to get content', () => {
      expect(dict.content).toEqual({'FOO': 'bar'});
    });

    it('should not be able to set content', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dict.content = {'BAR': 'baz'}
      }).toThrow(new Error('Cannot set property content of #<StringDictionaryReaderReadOnly> which has only a getter'));
    });

    it('should not be modified content property', () => {
      expect(dict.content).toEqual({'FOO': 'bar'});
      dict.content.FOO = 'baz';
      expect(dict.content).toEqual({'FOO': 'bar'});
      dict.content.BAR = 'baz';
      expect(dict.content).toEqual({'FOO': 'bar'});
      delete dict.content.FOO;
      expect(dict.content).toEqual({'FOO': 'bar'});
    });
  });
});
