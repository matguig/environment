enum TargetedType {
  Float = 'float',
  Integer = 'integer',
  Boolean = 'boolean',
  JSON = 'JSON',
}

class EnvironmentVariableParseError extends Error {
  constructor(
    public readonly variableName: string,
    public readonly targetedType: TargetedType,
    public readonly input: unknown,
  ) {
    super(`Could not parse environment variable "${variableName}" as ${targetedType}. Input was "${input}".`);
  }
}

export default EnvironmentVariableParseError;
export { TargetedType };
