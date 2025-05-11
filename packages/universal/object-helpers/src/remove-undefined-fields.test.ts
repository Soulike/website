import {describe, expect, it} from 'vitest';

import {removeUndefinedFieldsShallow} from './remove-undefined-fields.js';

describe('removeUndefinedFieldsShallow', () => {
  it('should remove undefined fields from an object', () => {
    const input = {
      a: 1,
      b: undefined,
      c: 'hello',
      d: undefined,
    };

    const expected = {
      a: 1,
      c: 'hello',
    };

    expect(removeUndefinedFieldsShallow(input)).toEqual(expected);
  });

  it('should return an empty object when all fields are undefined', () => {
    const input = {
      a: undefined,
      b: undefined,
    };

    expect(removeUndefinedFieldsShallow(input)).toEqual({});
  });

  it('should return the same object when no fields are undefined', () => {
    const input = {
      a: 1,
      b: 'hello',
      c: null,
      d: false,
      e: 0,
    };

    expect(removeUndefinedFieldsShallow(input)).toEqual(input);
  });

  it('should handle empty object', () => {
    expect(removeUndefinedFieldsShallow({})).toEqual({});
  });

  it('should keep null values (only removes undefined)', () => {
    const input = {
      a: null,
      b: undefined,
    };

    const expected = {
      a: null,
    };

    expect(removeUndefinedFieldsShallow(input)).toEqual(expected);
  });

  it('should only remove shallow undefined fields (not in nested objects)', () => {
    const input = {
      a: 1,
      b: undefined,
      c: {
        d: 2,
        e: undefined,
      },
    };

    const expected = {
      a: 1,
      c: {
        d: 2,
        e: undefined,
      },
    };

    expect(removeUndefinedFieldsShallow(input)).toEqual(expected);
  });

  it('should handle objects with various data types', () => {
    const date = new Date();
    const func = () => {
      return 0;
    };
    const array = [1, 2, 3];

    const input = {
      a: 1,
      b: 'string',
      c: date,
      d: func,
      e: array,
      f: undefined,
      g: true,
      h: false,
      i: 0,
    };

    const expected = {
      a: 1,
      b: 'string',
      c: date,
      d: func,
      e: array,
      g: true,
      h: false,
      i: 0,
    };

    expect(removeUndefinedFieldsShallow(input)).toEqual(expected);
  });
});
