import Environment from "./Environment";
import StringDictionaryReaderReadOnly from "./StringDictionaryReader/ReadOnly";

let initialProcessEnv = {...process.env};
describe('environment', () => {
  beforeEach(() => {
    process.env = {};
    Environment.reload();
  });

  afterAll(() => {
    process.env = initialProcessEnv;
  });

  it('should be able to get value of an existing key', () => {
    expect(Environment).toBeInstanceOf(StringDictionaryReaderReadOnly)
  });

  it('should be able to check if current environment is production', () => {
    expect(Environment.isProduction()).toBe(false);
    process.env.NODE_ENV = 'production';
    Environment.reload();
    expect(Environment.isProduction()).toBe(true);
  });

  it('Should be able to reload environment variable', () => {
    process.env.TEST = 'test';
    Environment.reload();
    expect(Environment.get('TEST')).toBe('test');
    process.env.TEST = 'test2';
    Environment.reload();
    expect(Environment.get('TEST')).toBe('test2');
  });

  it('should be able to load default environment variables', () => {
    expect(Environment.has('TEST')).toBeFalsy();

    Environment.setDefault({
      TEST: 'test',
    });
    expect(Environment.has('TEST')).toBeTruthy();
    expect(Environment.get('TEST')).toBe('test');

  });
});
