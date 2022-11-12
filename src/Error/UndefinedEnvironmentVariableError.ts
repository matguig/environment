class UndefinedEnvironmentVariableError extends Error {
  constructor(public readonly variableName: string) {
    super(`Environment variable "${variableName}" is not defined.`);
    this.name = 'UndefinedEnvironmentVariableError';
  }
}

export default UndefinedEnvironmentVariableError;
