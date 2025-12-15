import {
  generateRandomString,
  recoverBuffersTransformedByJSONInObject,
  removeUndefinedValuesFromObject,
} from '../Util.js';

describe('generateRandomString', () => {
  it('should always return string whose length is decided by the first parameter', () => {
    const {random, round} = Math;
    for (let i = 0; i < 10e3; i++) {
      const randomNumber = round(random() * 99 + 1);
      expect(generateRandomString(randomNumber).length).toBe(randomNumber);
    }
  });

  it('should throw when parameter is negative or zero', () => {
    expect(() => generateRandomString(-1)).toThrow(
      new Error('The length of the string must be positive'),
    );
  });

  it('should not repeat in 10000 times', () => {
    const stringSet = new Set();
    for (let i = 0; i < 10e4; i++) {
      stringSet.add(generateRandomString(10));
    }
    expect(stringSet.size).toBe(10e4);
  });
});

describe('removeUndefinedValuesFromObject', () => {
  it('should be able to remove undefined value', () => {
    const removedObject = removeUndefinedValuesFromObject({
      a: 1,
      b: '2',
      c: undefined,
      d: null,
      e: {},
    });
    expect(removedObject).toEqual({
      a: 1,
      b: '2',
      d: null,
      e: {},
    });
  });
});

describe('recoverBuffersTransformedByJSONInObject', () => {
  it('should transform buffer', () => {
    const object = {
      a: 1,
      b: 'string',
      c: {
        buffer: Buffer.from(generateRandomString(100)),
        d: {
          buffer: Buffer.from(generateRandomString(100)),
        },
      },
      d: Buffer.from(generateRandomString(100)),
      e: {
        hello: 'world',
      },
    };
    const transformed = recoverBuffersTransformedByJSONInObject(
      JSON.parse(JSON.stringify(object)),
    );
    expect(transformed).toEqual(object);
  });
});
