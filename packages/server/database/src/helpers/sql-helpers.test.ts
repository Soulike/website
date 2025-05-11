import {describe, expect, it} from 'vitest';

import {generateSqlParameters} from './sql-helpers.js';

describe('generateSqlParameters', () => {
  // Basic functionality tests
  it('should generate SQL parameters with AND connector', () => {
    const result = generateSqlParameters({id: 1, active: true}, 'AND');

    expect(result.parameters).toEqual([1, true]);
    expect(result.parameterizedStatement).toBe('"id"=$1 AND "active"=$2');
  });

  it('should generate SQL parameters with comma connector', () => {
    const result = generateSqlParameters({name: 'John', age: 30}, ',');

    expect(result.parameters).toEqual(['John', 30]);
    expect(result.parameterizedStatement).toBe('"name"=$1 , "age"=$2');
  });

  // Edge cases
  it('should handle empty objects', () => {
    const result = generateSqlParameters({}, 'AND');

    expect(result.parameters).toEqual([]);
    expect(result.parameterizedStatement).toBe('');
  });

  it('should skip undefined values', () => {
    const result = generateSqlParameters(
      {id: 1, name: undefined, age: 30},
      'AND',
    );

    expect(result.parameters).toEqual([1, 30]);
    expect(result.parameterizedStatement).toBe('"id"=$1 AND "age"=$2');
  });

  it('should include null values', () => {
    const result = generateSqlParameters({id: 1, name: null}, 'AND');

    expect(result.parameters).toEqual([1, null]);
    expect(result.parameterizedStatement).toBe('"id"=$1 AND "name"=$2');
  });

  it('should handle various data types', () => {
    const date = new Date();
    const array = [1, 2, 3];
    const obj = {key: 'value'};

    const result = generateSqlParameters(
      {
        string: 'text',
        number: 42,
        boolean: false,
        date: date,
        array: array,
        object: obj,
        null: null,
      },
      ',',
    );

    expect(result.parameters).toEqual([
      'text',
      42,
      false,
      date,
      array,
      obj,
      null,
    ]);

    expect(result.parameterizedStatement).toBe(
      '"string"=$1 , "number"=$2 , "boolean"=$3 , "date"=$4 , "array"=$5 , "object"=$6 , "null"=$7',
    );
  });

  it('should handle single property objects', () => {
    const result = generateSqlParameters({singleProp: 'value'}, 'AND');

    expect(result.parameters).toEqual(['value']);
    expect(result.parameterizedStatement).toBe('"singleProp"=$1');
  });

  it('should handle property names with special characters', () => {
    const result = generateSqlParameters(
      {'prop-name': 'value', 'prop.name': 123},
      ',',
    );

    expect(result.parameters).toEqual(['value', 123]);
    expect(result.parameterizedStatement).toBe(
      '"prop-name"=$1 , "prop.name"=$2',
    );
  });
});
