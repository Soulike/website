import {randomString} from '../Util.js';

describe('randomString', () => {
  it('should always return string whose length is decided by the first parameter', () => {
    const {random, round} = Math;
    for (let i = 0; i < 10e3; i++) {
      const randomNumber = round(random() * 99 + 1);
      expect(randomString(randomNumber).length).toBe(randomNumber);
    }
  });

  it('should throw when parameter is negative or zero', () => {
    expect(() => randomString(-1)).toThrow(
      new Error('The length of the string must be positive'),
    );
  });

  it('should not repeat in 10000 times', () => {
    const stringSet = new Set();
    for (let i = 0; i < 10e4; i++) {
      stringSet.add(randomString(10));
    }
    expect(stringSet.size).toBe(10e4);
  });
});
