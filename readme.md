# @matguig/environment
[![npm version](https://badge.fury.io/js/@matguig%2Fenvironment.svg)](https://badge.fury.io/js/@matguig%2Fenvironment)
[![Test Coverage](https://api.codeclimate.com/v1/badges/3f6d003ba46d94c32728/test_coverage)](https://codeclimate.com/github/matguig/environment/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/3f6d003ba46d94c32728/maintainability)](https://codeclimate.com/github/matguig/environment/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/matguig/environment/badge.svg)](https://snyk.io/test/github/matguig/environment)

This package allows you to easily and safely access to you environment variables

## Installation
```shell
yarn add @matguig/environment
# -- or
npm install @matguig/environment
```

## Usaga
```typescript
/* Application loaded with following environment variables:
 * - RANDOM_FLOAT_NUMBER = '42.21'
 * - RANDOM_STRING = 'hello world'
 * - RANDOM_BOOLEAN = 'true'
 * - RANDOM_JSON_STRING = '{"lorem": true, "ipsum": 402.2, "FOO": "BAR"}'
 */
...
import  Environment  from  "@matguig/environment";
...
Environment.get('RANDOM_FLOAT_NUMBER'); // "42.21"
Environment.get('RANDOM_STRING'); // "hello world"
Environment.get('RANDOM_BOOLEAN'); // "true"
Environment.get('RANDOM_JSON_STRING'); // "{"lorem": true, "ipsum": 402.2, "FOO": "BAR"}"
Environment.get('DOES_NOT_EXIST'); // throw Error('Environment variable DOES_NOT_EXIST is not defined')
Environment.get('DOES_NOT_EXIST', 'default_val'); // "default_val"
Environment.get('DOES_NOT_EXIST', null); // null

Environment.getInt('RANDOM_FLOAT_NUMBER'); // 42
Environment.getInt('RANDOM_BOOLEAN'); // throw Error('Environment variable RANDOM_BOOLEAN is not an integer')
Environment.getInt('RANDOM_STRING'); // throw Error('Environment variable RANDOM_STRING is not an integer')
Environment.getInt('RANDOM_JSON_STRING');  // throw Error('Environment variable RANDOM_STRING is not an integer')
Environment.getInt('DOES_NOT_EXIST'); // throw Error('Environment variable DOES_NOT_EXIST is not defined')
Environment.getInt('DOES_NOT_EXIST', 42); // 42
Environment.getInt('DOES_NOT_EXIST', null); // null

Environment.getFloat('RANDOM_FLOAT_NUMBER'); // 42.21
Environment.getFloat('RANDOM_BOOLEAN'); // throw Error('Environment variable RANDOM_BOOLEAN is not a float')
Environment.getFloat('RANDOM_STRING'); // throw Error('Environment variable RANDOM_STRING is not a float')
Environment.getFloat('RANDOM_JSON_STRING');  // throw Error('Environment variable RANDOM_STRING is not a float')
Environment.getFloat('DOES_NOT_EXIST'); // throw Error('Environment variable DOES_NOT_EXIST is not defined')
Environment.getFloat('DOES_NOT_EXIST', 42.21); // 42.21
Environment.getFloat('DOES_NOT_EXIST', null); // null

Environment.getBool('RANDOM_FLOAT_NUMBER'); // throw Error('Environment variable RANDOM_FLOAT_NUMBER is not a boolean')
Environment.getBool('RANDOM_BOOLEAN'); // true
Environment.getBool('RANDOM_STRING'); // throw Error('Environment variable RANDOM_STRING is not a boolean')
Environment.getBool('RANDOM_JSON_STRING');  // throw Error('Environment variable RANDOM_STRING is not a boolean')
Environment.getBool('DOES_NOT_EXIST'); // throw Error('Environment variable DOES_NOT_EXIST is not defined')
Environment.getBool('DOES_NOT_EXIST', false); // false
Environment.getBool('DOES_NOT_EXIST', null); // null

Environment.getJSON('RANDOM_FLOAT_NUMBER'); // 42.21
Environment.getJSON('RANDOM_BOOLEAN'); // true
Environment.getJSON('RANDOM_STRING'); // Environment variable RANDOM_STRING is not a JSON string
Environment.getJSON('RANDOM_JSON_STRING');  // { lorem: true, ipsum: 402.2, FOO: 'BAR' }
Environment.getJSON('DOES_NOT_EXIST'); // throw Error('Environment variable DOES_NOT_EXIST is not defined')
Environment.getJSON('DOES_NOT_EXIST', {"hello": "world"}); // {"hello": "world"}
Environment.getJSON('DOES_NOT_EXIST', null); // null

Environment.getOneOf('DOES_NOT_EXIST', 'RANDOM_STRING') // "hello world"
Environment.has('DOES_NOT_EXIST') // false
Environment.has('RANDOM_STRING') // true
```

## to-do
 - improve the documentation/readme
 - Create a node js package for the string dictionary reader
 - implement an optional validator for JSON
