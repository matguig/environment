# @matguig/environment
[![npm version](https://badge.fury.io/js/@matguig%2Fenvironment.svg)](https://badge.fury.io/js/@matguig%2Fenvironment)
[![Test Coverage](https://api.codeclimate.com/v1/badges/3f6d003ba46d94c32728/test_coverage)](https://codeclimate.com/github/matguig/environment/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/3f6d003ba46d94c32728/maintainability)](https://codeclimate.com/github/matguig/environment/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/matguig/environment/badge.svg)](https://snyk.io/test/github/matguig/environment)

This package allows you to easily and safely access your environment variables.

## Installation
```shell
yarn add @matguig/environment
# -- or
npm install @matguig/environment
```

## Usage
### Start a new project with it

```typescript
import Environment from '@matguig/environment';

// Optionally, you can set default environment values globally.
// They will be used if they are not defined in your environment variables.
Environment.setDefaults({
  PORT: '3000',
  API_URL: 'https://api.matguig.dev/'
});
```

### Check your current environment
Often it can be useful to check if your application is working in production or not. In a NodeJS application by convention we use the environment variable `NODE_ENV`.

This library allows you to simply check if your script is running in a production context.
```typescript
import Environment from '@matguig/environment';

if (Environment.isProduction()) {
  console.log(`This application is running in a production environment.`);
} else {
  console.log(`This application is not run in a production environment.`);
  console.log(`Your current environment is ${Environment.getEnvName()}`);
}
```

### Introduction: Using environment variables
Let's say you want to check for the existence of an environment variable.

```typescript
import Environment from '@matguig/environment';

if (Environment.has('APPDATA')) {
  console.log('It seems you are using a Microsoft operating system...');
}
```

Now let's say you just want to retrieve the raw value of an environment variable.

```typescript
import Environment from '@matguig/environment';

const apiHostname = Environment.get('API_HOSTNAME');
const applicationPort = Environment.get('PORT');
```
However, if the variable in question does not exist, the library will throw an `UndefinedEnvironmentVariableError` error. To avoid this you can use a default value which will be returned.

```typescript
import Environment from '@matguig/environment';

const apiHostname = Environment.get('API_HOSTNAME', 'localhost');
const applicationPort = Environment.get('PORT', '3000');
```

Okay, but in the following example your application port must be an integer. To avoid any problems you can use the parsing feature.
```typescript
import Environment from '@matguig/environment';

const apiHostname = Environment.get('API_HOSTNAME', 'localhost');
const applicationPort = Environment.getInt('PORT', 3000);
```
Warning, if the environment variable cannot be parsed correctly, then the library will throw an `EnvironmentVariableParseError`.

### Parsing numbers (integer or float)
To parse numbers two methods are available, `getInt` and `getFloat`.

```typescript
// Application loaded with following environment variables:
//  - RANDOM_FLOAT_NUMBER = '42.21'
//  - RANDOM_INTEGER_NUMBER = '42'
//  - INVALID_NUMBER = 'lorem ipsum'
import Environment from '@matguig/environment';

// Classic
Environment.getInt('RANDOM_FLOAT_NUMBER'); // 42
Environment.getInt('RANDOM_INTEGER_NUMBER'); // 42
Environment.getFloat('RANDOM_FLOAT_NUMBER'); // 42.21
Environment.getFloat('RANDOM_INTEGER_NUMBER'); // 42

// Fallbacks
Environment.getInt('DOES_NOT_EXIST', 24.42); // 24
Environment.getFloat('DOES_NOT_EXIST', 24.42); // 24.42

// Errors
Environment.getInt('DOES_NOT_EXIST'); // throw UndefinedEnvironmentVariableError
Environment.getFloat('DOES_NOT_EXIST'); // throw UndefinedEnvironmentVariableError
Environment.getInt('INVALID_NUMBER'); // throw EnvironmentVariableParseError
Environment.getFloat('INVALID_NUMBER'); // throw EnvironmentVariableParseError
```

### Parsing booleans
The environment variable is considered a boolean if it is equal to "true", "false", "1" or "0". It is important to note that for this particular case the library will be case insensitive and will perform a trim.

```typescript
// Application loaded with following environment variables:
//  - TRUE_STRING = 'true'
//  - FALSE_STRING = 'False'
//  - TRUE_INT = '1'
//  - FALSE_INT = '0'
//  - INVALID_BOOL = 'Falsy'
import Environment from '@matguig/environment';

// Classic
Environment.getBool('TRUE_STRING'); // true
Environment.getBool('FALSE_STRING'); // false
Environment.getBool('TRUE_INT'); // true
Environment.getBool('FALSE_INT'); // false

// Fallbacks
Environment.getBool('DOES_NOT_EXIST', true); // true
Environment.getBool('DOES_NOT_EXIST', false); // false

// Errors
Environment.getBool('DOES_NOT_EXIST'); // throw UndefinedEnvironmentVariableError
Environment.getBool('INVALID_BOOL'); // throw EnvironmentVariableParseError
```

### Parsing JSON
here the library will parse the environment variable as JSON.

```typescript
// Application loaded with following environment variables:
//  - FLOAT_NUMBER = '42.21'
//  - BOOL_STRING = 'true'
//  - JSON_OBJECT = '{"FOO": "BAR"}'
//  - JSON_ARRAY = '[1, 2, 3]'
//  - INVALID_JSON = '{...]'
import Environment from '@matguig/environment';

type MySillyObject {
  FOO: 'BAR' | 'BAZ'
}

// Classic
Environment.getJSON<MySillyObject>('JSON_OBJECT'); // {"FOO": "BAR"}
Environment.getJSON<number[]>('JSON_ARRAY'); // [1, 2, 3]
Environment.getJSON('BOOL_STRING'); // true
Environment.getJSON('FLOAT_NUMBER'); // 42.21

// Fallback
Environment.getJSON('DOES_NOT_EXIST', {"hello": "world"}); // {"hello": "world"}

// Errors
Environment.getBool('DOES_NOT_EXIST'); // throw UndefinedEnvironmentVariableError
Environment.getBool('INVALID_JSON'); // throw EnvironmentVariableParseError
```

## to-do
 - Create a node js package for the string dictionary reader
 - implement an optional validator for JSON
